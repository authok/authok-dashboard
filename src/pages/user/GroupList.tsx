import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal } from 'antd';
import React, { useEffect, useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Link, connect, ConnectProps, GroupModelState } from 'umi';
import { formatPath } from '@/utils/link.utils';
// import styles from './GroupList.less';

interface TableProps extends ConnectProps {
  groupPage?: API.Page<API.Group>[];
}

const TableList: React.FC<TableProps> = (props) => {
  const { dispatch, groupPage } = props;

  const [page] = useState<number>(0);
  useEffect(() => {
    dispatch({
      type: 'group/list',
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
          message.success('删除成功，即将刷新');
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

  // const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  // const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  // const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  // const [row, setRow] = useState<API.Group>();
  const [selectedRowsState, setSelectedRows] = useState<API.Group[]>([]);
  const columns: ProColumns<API.Group>[] = [
    {
      title: '分组唯一标识',
      dataIndex: 'code',
      render: (dom, entity) => {
        return <Link to={formatPath(`/user/group/detail/${entity.id}`)}>{dom}</Link>;
      },
    },
    {
      title: '分组名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '分组描述',
      dataIndex: 'description',
      valueType: 'textarea',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updatedAt',
      valueType: 'dateTime',
    },
  ];

  return (
    <PageContainer>
      <ProTable<API.Group>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        options={false}
        toolBarRender={() => [
          <Button type="primary">
            <PlusOutlined /> 新建分组
          </Button>,
        ]}
        dataSource={groupPage.items}
        columns={columns}
        // rowSelection={{
        //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        // }}
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
    </PageContainer>
  );
};

export default connect(
  ({
    group: { groupPage },
  }: {
    group: GroupModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    groupPage,
  }),
)(TableList);
