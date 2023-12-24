import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Modal, Menu, Row, Col, Space, Badge, Typography } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Link } from 'umi';
import moment from 'moment';
import Avatar from 'antd/lib/avatar/avatar';
import CreateUserModal from '../components/CreateUserModal';
import { formatPageQuery } from '@/utils/utils';
import { useResourcePagination, useResourceCreate } from '@/hooks/useResource';
import { UserEntity } from '@/api/entities/user.entity';
import { formatProTablePagination } from '@/utils/formatter';
import { formatPath } from '@/utils/link.utils';

const UserListPage: React.FC = () => {
  const { run: paginate, loading } = useResourcePagination(UserEntity, { 
    manual: true,
    formatResult: formatProTablePagination,
  });
  const { run: create } = useResourceCreate(UserEntity);

  const actionRef = useRef<ActionType>();
  const [selectedRowsState, setSelectedRows] = useState<API.User[]>([]);
  
  const handleBatchDelete = async (selectedRows: API.User[]) => {
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
          // dispatch({ type: 'user/delete', payload: selectedRows.map((row) => row.key) });

          hide();
          message.success('删除成功，即将刷新');
          return false;
        } catch (error) {
          hide();
          message.error('删除失败，请重试');
          return true;
        }
      },
    });
    return false;
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: `确定删除该用户？`,
      okText: '确认',
      cancelText: '取消',
      onOk: () => {
        dispatch({
          type: 'user/deleteUser',
          payload: id,
          callback: (resp) => {
            if (resp) {
              message.info('删除成功！');
              actionRef.current?.reloadAndRest?.();
              // console.log('selectedRowsState', selectedRowsState)
            } else {
              message.error('删除失败');
            }
          },
        });
      },
    });
  };

  const columns: ProColumns<API.User>[] = [
    {
      dataIndex: 'avatar',
      hideInSearch: true,
      search: false,
      render: (_, row) => {
        return (
          <Link to={formatPath(`/user-mgmt/users/${row.id}`)}>
            <Avatar src={row.picture} size={32} />
          </Link>
        );
      },
      width: '48px',
    },
    {
      title: '用户信息',
      // dataIndex: 'userInfo',
      width: '240px',
      search: false,
      render: (_, row) => {
        return (
          <>
            <Row>
              <Col span={6}>手机号：</Col>
              <Col span={18}>{row.phone}</Col>
            </Row>
            <Row>
              <Col span={6}>用户名：</Col>
              <Col span={18}>{row.username}</Col>
            </Row>
            <Row>
              <Col span={6}>昵称：</Col>
              <Col span={18}>{row.nickname}</Col>
            </Row>
            <Row>
              <Col span={6}>邮箱：</Col>
              <Col span={18}>{row.email && (
                <Space>
                  {row.email}
                  {
                    row.email_verified ? <Badge status="success" text="已验证" />: <Badge status="warning" text="未验证" />
                  }
                </Space>
              )}</Col>
            </Row>
          </>
        );
      },
      // renderFormItem: (info, { type, defaultRender, ...rest }, form) => {
      //   if (type === 'form') {
      //     return null;
      //   }
      //   console.log('---', info);
      //   const status = form.getFieldValue('state');
      //   if (status !== 'open') {
      //     console.log('rest', rest)
      //     // return <Input   placeholder="手机号查询" />;
      //   }
      //   return defaultRender({dataIndex:'',title:'手机号'});
      // },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      width: '240px',
      hideInTable: true,
    },
    {
      title: '最后登录时间',
      dataIndex: 'lastLogin',
      // hideInSearch: true,
      search: false,
      render: (_, row) => {
        return (
          <div>
            {row.lastLogin ? moment(row.lastLogin).format('YYYY-MM-DD hh:mm:ss') : '-'}
          </div>
        );
      },
    },
    {
      title: '登录次数',
      dataIndex: 'loginsCount',
      // hideInSearch: true,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'options',
      // hideInSearch: true,
      search: false,
      render: (_, row) => {
        return (
          <div>
            <div>
              <Link to={formatPath(`/user-mgmt/users/${row.id}`)}>
                <Button type="link">查看详情</Button>
              </Link>
            </div>
            <div>
              <Button type="link" onClick={() => handleDelete(row.id)} danger>删除</Button>
            </div>
          </div>
        );
      },
    },
  ];

  const handleCreate = async (values: { [key: string]: any }) => {
    await create(values);

    actionRef.current?.reloadAndRest?.();
  };

  const importMenu = (
    <Menu>
      <Menu.Item key="importExcel">通过Excel导入</Menu.Item>
      <Menu.Item key="importScript">通过脚本导入</Menu.Item>
    </Menu>
  );
  const exportMenu = (
    <Menu>
      <Menu.Item key="exportUser">导出选中用户</Menu.Item>
      <Menu.Item key="exportAllUser">导出全部用户</Menu.Item>
      <Menu.Item key="exportHistory">查看导出历史</Menu.Item>
    </Menu>
  );

  return (
    <PageContainer>
      <ProTable<API.User>
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        options={false}
        toolBarRender={() => [
          <CreateUserModal 
            title="新建用户"
            trigger={<Button icon={<PlusOutlined/>} type="primary" size="large">新建用户</Button>} 
            onFinish={handleCreate}
          />        
          // <Dropdown key='import' overlay={importMenu}>
          //   <Button>导入</Button>
          // </Dropdown>,
          // <Dropdown key='export' overlay={exportMenu}>
          //   <Button>导出</Button>
          // </Dropdown>,
        ]}
        request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
        loading={loading}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择 <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a> 项
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleBatchDelete(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
    </PageContainer>
  );
};

export default UserListPage;
