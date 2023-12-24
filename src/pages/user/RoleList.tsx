import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Drawer, Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { history, connect, GlobalModelState, RoleModelState, ConnectProps } from 'umi';
import { API } from '@/services/API';
import { formatPath } from '@/utils/link.utils';
// import styles from './RoleList.less';

interface TableProps extends ConnectProps {
  rolePage?: API.Page<API.Role>[];
}

const TableList: React.FC<TableProps> = (props) => {
  const { dispatch, createModalVisible, rolePage } = props;

  const [page] = useState<number>(0);
  useEffect(() => {
    dispatch({
      type: 'role/list',
      payload: {
        page,
      },
    });
  }, []);

  /**
   *  删除节点
   * @param selectedRows
   */
  const handleDelete = async (selectedRows: API.Role[]) => {
    const hide = message.loading('正在删除');

    if (!selectedRows) {
      message.warning('请选择至少一条记录');
      return false;
    }

    const contentMsg = <p>您已选择{selectedRows.length}条记录，是否确定删除?</p>;
    Modal.confirm({
      title: null,
      content: contentMsg,
      okText: '删除',
      cancelText: '取消',
      onOk: () => {
        try {
          dispatch({ type: 'role/delete', payload: selectedRows.map((row) => row.key) });

          hide();
          return true;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return false;
        }
      },
    });

    return true;
  };

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.Role[]>([]);
  const columns: ProColumns<API.Role>[] = [
    {
      title: '角色代码',
      dataIndex: 'code',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              history.push(formatPath(`/user/role-list/${entity.id}`));
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '角色描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '是否系统内置角色',
      dataIndex: 'isSystem',
      valueEnum: {
        true: { text: '是' },
        false: { text: '否' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: () => (
        <>
          <a onClick={() => {}}>删除</a>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Role>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              dispatch({
                type: 'global/changeCreateModalVisible',
                payload: true,
              });
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        dataSource={rolePage.items}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项&nbsp;&nbsp;
              <span>
                服务调用次数总计 {selectedRowsState.reduce((pre, item) => pre + item.callNo, 0)} 万
              </span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleDelete(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}

      <Drawer
        width={600}
        title="创建角色"
        visible={!!createModalVisible}
        onClose={() => {
          dispatch({
            type: 'global/changeCreateModalVisible',
            payload: undefined,
          });
        }}
        closable
      >
        <ProTable<API.Role, API.Role>
          onSubmit={async (value) => {
            dispatch({
              type: 'role/create',
              payload: value,
            });

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }}
          rowKey="key"
          type="form"
          columns={columns}
        />
      </Drawer>
    </PageContainer>
  );
};

export default connect(
  ({
    role,
    global,
  }: {
    role: RoleModelState;
    global: GlobalModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    rolePage: role.rolePage,
    createModalVisible: global.createModalVisible,
  }),
)(TableList);
