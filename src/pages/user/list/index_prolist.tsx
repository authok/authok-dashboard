import { PlusOutlined } from '@ant-design/icons';
import { Checkbox, Button, message, Modal, Menu, Row, Col, Space, Badge, Typography, Divider } from 'antd';
import React, { useRef, useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ActionType } from '@ant-design/pro-table';
import moment from 'moment';
import { useUserBatchDelete } from '@/hooks/user';
import Avatar from 'antd/lib/avatar/avatar';
import CreateUserModal from '../components/CreateUserModal';
import ProList from '@ant-design/pro-list';
import { useSelections } from '@umijs/hooks';
import { Link } from 'umi';
import { formatPageQuery } from '@/utils/utils';
import { useResourcePagination, useResourceCreate, useResourceDelete } from '@/hooks/useResource';
import { UserEntity } from '@/api/entities/user.entity';
import { formatProTablePagination } from '@/utils/formatter';
import { formatPath } from '@/utils/link.utils';
const { Text } = Typography;

const UserListPage: React.FC = () => {
  const { run: paginate, data, loading } = useResourcePagination(UserEntity, { 
    manual: true,
    formatResult: formatProTablePagination,
  });
  const { run: create } = useResourceCreate(UserEntity);
  const { run: deleteUser } = useResourceDelete(UserEntity);
  const { run: batchDelete } = useUserBatchDelete();

  const ids = useMemo<string[]>(() => data?.data?.map((it) => it.id) || [], [data]);

  const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected } = useSelections(ids);

  const actionRef = useRef<ActionType>();
  
  const handleBatchDelete = async () => {
    if (!selected || selected.length === 0) {
      message.warning('请选择至少一条记录');
      return false;
    }

    const contentMsg = <p>您已选择{selected.length}条记录，是否确定删除?</p>;
    Modal.confirm({
      title: null,
      content: contentMsg,
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        await batchDelete(selected);
        actionRef.current?.reloadAndRest?.();

        message.success('删除成功，即将刷新');
        return true;
      },
    });
    return false;
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: `确定删除该用户？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteUser(id);
        message.success('删除成功！');

        actionRef.current?.reloadAndRest?.();
      },
    });
  };

  const handleCreate = async (values: { [key: string]: any }) => {
    await create(values);
    
    message.success('用户创建成功');
    actionRef.current?.reloadAndRest?.();
    return true;
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
      <ProList<API.User>
        style={{ minWidth: '1024px' }}
        actionRef={actionRef}
        request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
        grid={{ gutter: 16, column: 1 }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        toolBarRender={() => [
          <Space size={0} style={{ height: '100%' }}>
            {
              selected.length > 0 && (<><a onClick={handleBatchDelete}>删除</a><Divider type="vertical"/></>)
            }
            <Checkbox checked={allSelected} indeterminate={partiallySelected} onClick={toggleAll}>全选</Checkbox>
          </Space>
          ,
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
        metas={{
          type: {},
          content: {
            render: (_, row) => (
              <Row gutter={4} style={{ width: '100%', height: '72px' }}>
                <Col span={1}>
                  <Row align="middle" style={{ height: '100%'}}>
                    <Checkbox checked={isSelected(row.id)} onClick={() => toggle(row.id)} />
                  </Row>
                </Col>
                <Col span={4}>
                  <Link to={formatPath(`/user_mgmt/users/${row.user_id}`)}>
                    <Space style={{ height: '100%' }}>
                      <Avatar size={36} src={row.picture} />
                      <h3>{row.nickname || row.username}</h3>
                    </Space>
                  </Link>
                </Col>
                <Col span={4}>
                  <Space direction="vertical">
                    <span style={{
                      fontSize:'12px',
                      fontWeight: 400,
                      color: '#a1abc8',
                    }}>
                      手机号
                    </span>
                    <span>
                      {row.phone_number? (
                        <Space size={0} direction="vertical">
                          {row.phone_number}
                          {
                            row.phone_number_verified ? 
                            <Badge status="success" text={<span style={{
                              fontSize:'12px',
                              fontWeight: 400,
                              color: '#a1abc8',
                            }}>已验证</span>} />: 
                            <Badge status="warning" text={<span style={{
                              fontSize:'12px',
                              fontWeight: 400,
                              color: '#a1abc8',
                            }}>未验证</span>}/>
                          }
                        </Space>
                      ) : '-'}
                    </span>
                  </Space>
                </Col>
                <Col span={4}>
                  <Space direction="vertical" style={{ height: '100%' }}>
                    <span style={{
                      fontSize:'12px',
                      fontWeight: 400,
                      color: '#a1abc8',
                    }}>
                      邮箱
                    </span>
                    <span>
                      {row.email ? (
                        <Space size={0} direction="vertical">
                          {row.email}
                          {
                            row.email_verified ? 
                            <Badge status="success" text={<span style={{
                              fontSize:'12px',
                              fontWeight: 400,
                              color: '#a1abc8',
                            }}>已验证</span>} />: 
                            <Badge status="warning" text={<span style={{
                              fontSize:'12px',
                              fontWeight: 400,
                              color: '#a1abc8',
                            }}>未验证</span>}/>
                          }
                        </Space>
                      ) : '-' }
                    </span>
                  </Space>
                </Col>
                <Col span={4}>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <span style={{
                      fontSize:'12px',
                      fontWeight: 400,
                      color: '#a1abc8',
                    }}>
                      连接
                    </span>
                    <span>
                      <Text ellipsis={true}>{row.connection}</Text>
                    </span>
                  </Space>
                </Col>
                <Col span={3}>
                  <Space direction="vertical">
                    <span style={{
                      fontSize:'12px',
                      fontWeight: 400,
                      color: '#a1abc8',
                    }}>
                      最后登录时间
                    </span>
                    <span>
                      {row.lastLogin ? moment(row.lastLogin).format('YYYY-MM-DD hh:mm:ss') : '-'}
                    </span>
                  </Space>
                </Col>
                <Col span={2}>
                  <Space direction="vertical">
                    <span style={{
                      fontSize:'12px',
                      fontWeight: 400,
                      color: '#a1abc8',
                    }}>
                      登录次数
                    </span>
                    <span>
                      {row.loginsCount || 0}
                    </span>
                  </Space>
                </Col>
                <Col span={2}>
                  <Button type="link" onClick={() => handleDelete(row.id)}>删除</Button>
                </Col>
              </Row>
            )
          },
        }}
      />
    </PageContainer>
  );
};

export default UserListPage;
