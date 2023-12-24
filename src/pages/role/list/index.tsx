import React, { useRef, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useAssignUsersToRole } from '@/hooks/role';
import { formatProTablePagination } from '@/utils/formatter';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { Modal, Button, Menu, Dropdown, Row, message } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import CreateRoleModal from './components/CreateRoleModal';
import { Link, history } from 'umi';
import moment from 'moment';
import AssignUsersModal from '@/components/AssignUsersModel';
import { useResourcePagination, useResourceCreate, useResourceDelete } from '@/hooks/useResource';
import { RoleEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

const RoleListPage: React.FC = () => {
  const { run: paginate, data: rolePage } = useResourcePagination(RoleEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { loading: loadingCreate, run: create } = useResourceCreate(RoleEntity);

  const { run: deleteRole } = useResourceDelete(RoleEntity);

  const { run: assignUsersToRole } = useAssignUsersToRole();

  const actionRef = useRef<ActionType>();
  
  const handleCreate = useCallback(async (values: API.Role) => {
    const role = await create(values);

    history.push(formatPath(`/user_mgmt/roles/${role.id}`));
  }, []);

  const handleAssignUsers = useCallback(async (id: string, values: { nodes: API.Node<any>[]}) => {
    const nodes = values.nodes;
    if (nodes.length === 0) return true;

    const userToAssign = nodes.filter(it => it.type === 'user').map(it => it.data.user_id);

    await assignUsersToRole(id, userToAssign);

    message.success('权限分配成功');

    actionRef.current?.reloadAndRest();
    return true;
  }, [rolePage]);

  const columns: ProColumns<API.Role> = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (_, record) => <Link to={formatPath(`/user_mgmt/roles/${record.id}`)}>{record.name}</Link>
    },
    {
      title: '描述',
      dataIndex: 'description'
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      render: (_, record) => moment(record.created_at).format('YYYY-MM-DD hh:mm:ss')      
    },
    {
      valueType: 'option',
      render: (_, row) => {
        const actionMenu = (
          <Menu onClick={async ({ key }) => {
            switch(key) {
              case 'delete': {
                Modal.confirm({
                  title: '删除角色',
                  content: `确定要删除角色: ${row.name}`,
                  okText: '确认',
                  cancelText: '取消',
                  onOk: async () => {
                    await deleteRole(row.id);
                    message.success('删除成功');
                    actionRef.current?.reloadAndRest();        
                  },
                });
                break;
              }
            }
          }}>
            <AssignUsersModal role={row} onFinish={(values: { nodes: API.Node<any>[]}) => handleAssignUsers(row.id, values)} trigger={<Menu.Item>分配给用户</Menu.Item>}/>
            <Menu.Divider/>
            <Menu.Item key="delete" icon={<DeleteOutlined/>}>删除</Menu.Item>
          </Menu>
        );
        return <Row style={{ width: '100%' }} justify="end">
          <Dropdown.Button overlay={actionMenu} trigger="click" />
        </Row>;
      },
    }
  ];

  return <PageContainer>
    <ProTable<API.Role>
      rowKey="id"
      actionRef={actionRef}
      columns={columns}
      request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      toolBarRender={() => [
        <CreateRoleModal
          loading={loadingCreate}
          onFinish={handleCreate}
          trigger={<Button size="large" type="primary" icon={<PlusOutlined/>}>创建角色</Button>}
        />
      ]}
      options={false}
      pagination={{
        pageSize: 20,
      }}
    />
  </PageContainer>
};

export default RoleListPage;