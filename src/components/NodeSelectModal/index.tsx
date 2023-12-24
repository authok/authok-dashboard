import React, { useState, useMemo, useEffect } from 'react';
import { ModalForm } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Form, List, Checkbox, Input, Space, Row, Col } from 'antd';
import { SearchOutlined, CloseOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { useSelections, useDebounceFn } from '@umijs/hooks';
import styles from './index.less';
import * as _ from 'lodash';
import useFormList from '@/hooks/useFormList';
import { formatPageQuery } from '@/utils/utils';
import { PaginatedParams } from "@ahooksjs/use-request/lib/types";
import { formatFormTablePagination } from '@/utils/formatter';

interface NodeSelectModalProps {
  title: string;
  onFinish: (nodes: API.Node<any>) => Promise<boolean>;
  trigger: JSX.Element;
  request: (query: API.PageQuery) => Promise<API.Page<API.Node<any>>>,
}

const NodeSelectModal: React.FC<NodeSelectModalProps> = ({ title, trigger, request, onFinish }) => {  
  return  <ModalForm
    modalProps={{
      centered: true,
      destroyOnClose: true,
    }}
    title={title}
    trigger={trigger}
    onFinish={(values: { nodes: API.Node<any>; }) => onFinish?.(values.nodes)}
  >
    <Form.Item name="nodes" noStyle>
      <NodeSelectModalContent request={request} />
    </Form.Item>
  </ModalForm>;
}

const NodeSelectModalContent: React.FC<any> = ({ request, onChange }) => {
  const _request = async (params: PaginatedParams[0], formData: Object): Promise<API.Page<API.Node<any>>> => {
    Object.entries(formData).forEach(([key, value]) => {
      params[key] = value;
    });
    const query = formatPageQuery(params);
    return await request(query);
  }

  const [form] = Form.useForm();
  const { listProps, search } = useFormList(_request, {
    form,
    formatResult: formatFormTablePagination,
  });

  const dataSource = useMemo(() => listProps.dataSource || [], [listProps]);

  const { type, changeType, submit, reset } = search;
  const pagination = useMemo(() =>({ size: 'small', showTotal: true, showQuickJumper: false, showSizeChanger: false, ...listProps.pagination}), [listProps]);

  const [selectedNodes, setSelectedNodes] = useState<API.Node<any>[]>([]);

  const nodeIds = useMemo<string[]>(() => dataSource.map((it: API.Node<any>) => it.id) || [], [dataSource]);
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

  useEffect(() => {
    const idSet = new Set(selectedNodes.map(it => it.id))
    const nodeToSelect = dataSource.filter(it => idSet.has(it.id)) || [];

    nodeToSelect.forEach(it => select(it.id));

    onChange?.(selectedNodes);
  }, [selectedNodes]);

  useEffect(() => {
    // 当前页面未选中的，要从 selectedItems 中剔除
    const unSelectedNodes = dataSource.filter(it => selected.indexOf(it.id) < 0);

    let _selectedNodes = selectedNodes.filter(it => unSelectedNodes.findIndex((value, index) => value.id === it.id) < 0);

    // 排重
    const idSet = new Set(_selectedNodes.map(it => it.id));

    const idToAdd = selected.filter(it => !idSet.has(it));

    const id2node = _.keyBy(dataSource, 'id');
    const valideIdToAdd = idToAdd.filter(it => !!id2node[it]);
    const nodes = valideIdToAdd.map(it => id2node[it]);

    if (_selectedNodes.length != selectedNodes.length || nodes.length > 0) {
      const newSelectedNodes = _.concat(_selectedNodes, nodes);
      setSelectedNodes(newSelectedNodes);
    }
  }, [selected]);

  const { run: searchNodes } = useDebounceFn((e) => {
    submit();
  }, 500);

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
                      <Checkbox checked={isSelected(user.user_id)} value={user.user_id} onChange={(e) => {
                        e.stopPropagation();
                        toggle(user.user_id);
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
      <ProCard title={<>共选择{selectedNodes.length}个</>} headerBordered>
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
                          const newSelectedNodes = [...selectedNodes];
                          const index = newSelectedNodes.findIndex(it => it.id === data.id);
                          if (index >= 0) {
                            newSelectedNodes.splice(index, 1);
                            setSelectedNodes(newSelectedNodes);
                          }

                          unSelect(data.id);
                        }}/>
                      </Row>
                    </Col>
                  </Row>
                </div>;
              };
            }}
            dataSource={selectedNodes}
          />
        </div>
      </ProCard>
    </ProCard>
  </>
};

export default NodeSelectModal;