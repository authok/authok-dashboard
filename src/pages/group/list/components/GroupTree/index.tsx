import React, { useCallback, useState, useRef, useEffect } from 'react';
import { Spin, Tree, Space, Button, message, Dropdown, Menu } from 'antd';
import { useMemo } from 'react';
import * as _ from 'lodash';
import CreateGroupModal from '@/pages/group/components/CreateGroupModal';
import { PlusOutlined, ApartmentOutlined, DeleteOutlined, EditOutlined, MoreOutlined } from '@ant-design/icons';
import { useResourcePagination, useResourceCreate } from '@/hooks/useResource';
import { GroupEntity } from '@/api/entities/group.entity';

interface GroupTreeProps {
  onSelect: (group: Partial<API.Group>) => void;
}

const GroupTree: React.FC<GroupTreeProps> = ({ onSelect }) => {
  const { data: groups, loading, refresh } = useResourcePagination(GroupEntity, {
    defaultParams: [
      {
        page_size: 2000
      }
    ],
    formatResult: (data: API.Page<API.Group>) => data.items,
  });

  const { run: createGroup } = useResourceCreate(GroupEntity);

  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const id2group = useMemo(() => _.keyBy(groups, 'id'), [groups]);

  useEffect(() => {
    if (selectedKeys.length > 0) {
      const group = id2group[selectedKeys[0]];
      onSelect(group);
    }
  }, [selectedKeys]);

  const handleCreateGroup = useCallback(async (group: Partial<API.Group>) => {
    const newGroup = await createGroup(group);
    message.success('创建成功');

    refresh();

    // 设置选中节点
    setSelectedKeys([newGroup.id]);

    const keys = [];
    let rootNode: API.Group = newGroup;
    keys.push(rootNode.id);
    do {
      rootNode = id2group[rootNode.parent_id];
      keys.push(rootNode.id);
    } while(rootNode.parent_id);

    setExpandedKeys(keys);

    return true;
  }, [groups]);

  console.log('selectedKeys: ', selectedKeys);
  console.log('expandedKeys: ', expandedKeys);

  const createBtnRef = useRef();

  const groupTreeData = useMemo(() => {
    if (!groups) return [];

    const nodes = groups.map(it => {
      const overlay = <Menu>
        <CreateGroupModal 
          value={{ parent_id: it.id }} 
          onFinish={handleCreateGroup}
          trigger={<Menu.Item icon={<PlusOutlined/>}>添加子分组</Menu.Item>}
        />
        <Menu.Item icon={<EditOutlined/>}>编辑分组</Menu.Item>
        <Menu.Item icon={<DeleteOutlined/>}>删除分组</Menu.Item>
      </Menu>

      return {
        key: it.id,
        title: <Space direction="horizontal">
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              lineHeight: '30px',
            }}>
              <div style={{
                maxWidth: '160px',
                minWidth: '20px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}>
                {it.name}
              </div>           
            </div>
            <div style={{ width: 30, height: 30, display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Dropdown trigger="click" overlay={overlay}><MoreOutlined/></Dropdown>
            </div>        
          </div>
        </Space>,
        icon: <ApartmentOutlined />,
        children: [],
        parent_id: it.parent_id,
      };
    }, [groups]);

    const key2node = _.keyBy(nodes, 'key');

    nodes.forEach(node => {
      const parent = key2node[node.parent_id];
      if (parent) {
        parent.children.push(node);
      }
    });

    return nodes.filter(it => !it.parent_id);
  }, [groups]);

  return <Spin spinning={loading} delay={500}>
    <Space direction="vertical" style={{ width: '100%' }}>
      <div style={{ overflowY: 'scroll', maxHeight: 720 }}>
        <Tree showIcon treeData={groupTreeData} style={{ width: '100%' }}
          expandedKeys={expandedKeys}
          onExpand={(expandedKeys) => setExpandedKeys(expandedKeys)}
          selectedKeys={selectedKeys}
          onSelect={(selectedKeys) => setSelectedKeys(selectedKeys)}
        />
      </div>
      <CreateGroupModal trigger={<Button icon={<PlusOutlined/>}>添加分组</Button>} onFinish={handleCreateGroup}/>
    </Space>
  </Spin>;
};

export default GroupTree;