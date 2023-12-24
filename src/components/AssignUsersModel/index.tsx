import React, { useState, useMemo, useEffect } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Form, List, Checkbox, Input, Space, Row, Col } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { formatFormTablePagination } from '@/utils/formatter';
import { useSelections, useDebounceFn } from '@umijs/hooks';
import styles from './index.less';
import * as _ from 'lodash';
import useFormList from '@/hooks/useFormList';
import { formatPageQuery } from '@/utils/utils';
import { useResourcePagination } from '@/hooks/useResource';
import { UserEntity } from '@/api/entities/user.entity';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable';

interface AssignUsersModalProps {
  onFinish: (values: { nodes: API.Node<any>[]; }) => Promise<boolean>;
  trigger: JSX.Element;
  role?: API.Role,
  organization?: API.Organization;
}

const AssignUsersModal: React.FC<AssignUsersModalProps> = ({ role, organization, trigger, onFinish }) => {  
  return  <ModalForm
    modalProps={{
      centered: true,
      destroyOnClose: true,
    }}
    title="添加用户/分组"
    trigger={trigger}
    onFinish={onFinish}
  >
    <Form.Item name="nodes" noStyle>
      <AssignUsersModalContent role={role} />
    </Form.Item>
  </ModalForm>;
}

const AssignUsersModalContent: React.FC<any> = ({ role, organization, onChange }) => {
  const { run: _paginateNodes } = useResourcePagination(UserEntity, {
    manual: true,
    formatResult: (_page: API.Page<API.User>): { list: API.Node<any>[]; total: number; } => {
      const page = {
        meta: _page.meta,
        items: _page.items.map(it => ({ type: 'user', id: it.id, data: it })),
      };
      return formatFormTablePagination(page);
    },
  });

  const paginateNodes = async (params: PaginatedParams[0], formData: Object): Promise<{ list: API.Node<any>[]; total: number; }> => {
    Object.entries(formData).forEach(([key, value]) => {
      params[key] = value;
    });

    const query = formatPageQuery(params);
    return await _paginateNodes(query);
  };

  const [form] = Form.useForm();
  const { listProps, search } = useFormList(paginateNodes, {
    form,
    // defaultPageSize: 30, 貌似没有生效
    defaultParams: [{
      page_size: 30,
      ...(role && { exclude_role_id: role.id}),
      ...(organization && { exclude_org_id: organization.id}),
    }],
  });

  const dataSource = useMemo(() => listProps.dataSource || [], [listProps]);

  const { type, changeType, submit, reset } = search;
  const pagination = useMemo(() =>({ size: 'small', showTotal: true, showQuickJumper: false, showSizeChanger: false, ...listProps.pagination}), [listProps]);

  const { run: searchNodes } = useDebounceFn((e) => {
    submit();
  }, 500);

  const [selectedItems, setSelectedItems] = useState<any[]>([]);

  const nodeIds = useMemo<string[]>(() => dataSource.map((it: API.Node<API.User | API.Group>) => it.id) || [], [dataSource]);
  const {
    select,
    unSelect,
    selected,
    allSelected, 
    isSelected, 
    toggle, 
    toggleAll, 
    partiallySelected,
  } = useSelections(nodeIds, []);

  const selectedUsers = useMemo(() => selectedItems.filter(it => it.type === 'user'), [selectedItems]);

  useEffect(() => {
    const idSet = new Set(selectedItems.map(it => it.id))
    const nodeToSelect = dataSource.filter(it => idSet.has(it.id)) || [];

    nodeToSelect.forEach(it => select(it.id));

    onChange?.(selectedItems);
  }, [selectedItems]);

  useEffect(() => {
    // 当前页面未选中的，要从 selectedItems 中剔除
    const unSelectedNodes = dataSource.filter(it => selected.indexOf(it.id) < 0);

    let _selectedItems = selectedItems.filter(it => unSelectedNodes.findIndex((value, index) => value.id === it.id) < 0);

    // 排重
    const idSet = new Set(_selectedItems.map(it => it.id));

    const idToAdd = selected.filter(it => !idSet.has(it));

    const id2node = _.keyBy(dataSource, 'id');
    const valideIdToAdd = idToAdd.filter(it => !!id2node[it]);
    const nodes = valideIdToAdd.map(it => id2node[it]);

    if (_selectedItems.length != selectedItems.length || nodes.length > 0) {
      const newSelectedItems = _.concat(_selectedItems, nodes);
      setSelectedItems(newSelectedItems);
    }
  }, [selected]);

  return <>
    <ProCard split="vertical" bordered>
      <ProCard colSpan="40%">
        <Space size="middle" direction="vertical" style={{ width: '100%'}}>
          <Input prefix={<SearchOutlined/>} placeholder="搜索昵称，邮箱或手机号" onChange={searchNodes} />
          <Checkbox checked={allSelected} onChange={toggleAll} indeterminate={partiallySelected}>全选</Checkbox>
          <Space direction="vertical" style={{ width: '100%', overflow: 'scroll', height: 600 }}>
            <List<API.Node<API.User | API.Group>>
              rowKey="id"
              showHeader={false}
              {...listProps}
              pagination={pagination}
              renderItem={(item, index) => {
                  const { type, data } = item; 
                  if (type === 'user') {
                    const user = data as API.User;
                    return <div className={styles['user-list-item']}>
                      <Checkbox checked={isSelected(user.id)} value={user.id} onChange={(e) => {
                        e.stopPropagation();
                        toggle(user.id);
                      }}>
                        <Space direction="horizontal" style={{ width: '100%' }}>        
                          <Avatar src={user.picture} />
                          {user.nickname || user.username || user.phone_number || user.email}
                        </Space>
                      </Checkbox>                
                    </div>;
                  } else if (type === 'group') {
                    return <div className={styles['user-list-item']}>分组</div>;
                  }
                }
              }
            />
          </Space>
        </Space>
      </ProCard>
      <ProCard title={<>共分配用户{selectedUsers.length}个, 组{0}个共包含{0}用户</>} headerBordered>
        <div style={{ overflow: 'scroll', height: 600 }}>
          <List
            rowKey="id"
            renderItem={(item, index) => {
              const { type, data } = item;
              if (type === 'user') {
                return <div className={styles['user-list-item']}>
                  <Row gutter={16} style={{ width: '100%' }}>        
                    <Col span={6}>
                      <Avatar src={data.picture} />
                    </Col>
                    <Col span={14}>
                      {data.nickname || data.username || data.phone_number || data.email}
                    </Col>
                    <Col span={4}>
                      <Row justify="end" align="middle" style={{ height: '100%' }}>
                        <CloseOutlined onClick={() => {
                          const newSelectedItems = [...selectedItems];
                          const index = newSelectedItems.findIndex(it => it.id === data.id);
                          if (index >= 0) {
                            newSelectedItems.splice(index, 1);
                            setSelectedItems(newSelectedItems);
                          }

                          unSelect(data.id)
                        }}/>
                      </Row>
                    </Col>
                  </Row>
                </div>;
              };
            }}
            dataSource={selectedItems}
          />
        </div>
      </ProCard>
    </ProCard>
  </>
};

export default AssignUsersModal;