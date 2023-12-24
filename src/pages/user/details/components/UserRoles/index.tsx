import React, { useCallback, useRef } from 'react';
import { useUserRolePagination, useAddRolesToUser, useRemoveRolesToUser } from '@/hooks/user';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Button, Space, Popconfirm } from 'antd';
import { formatProTablePagination } from '@/utils/formatter';
import { DeleteOutlined } from '@ant-design/icons';
import AddRolesModal from './AddRolesModal';
import { formatPageQuery } from '@/utils/utils';

interface UserRolesProps {
  user: API.User;
}

const UserRoles: React.FC<UserRolesProps> = ({ user }) => {
  const { run: paginate } = useUserRolePagination(user.user_id, { 
    manual: true,
    formatResult: formatProTablePagination,
  });
  const { run: addRoles, loading: loadingAddRoles } = useAddRolesToUser();

  const { run: removeRoles, loading: loadingRemoveRoles } = useRemoveRolesToUser();

  const actionRef = useRef<ActionType>();

  const handleAddRoles = useCallback(async (data: any) => {
    await addRoles(user.user_id, data.roles);

    message.success('权限分配成功');

    actionRef?.current?.reloadAndRest?.();

    return true;
  }, [user]);

  const handleRemoveRoles = useCallback(async (data: any)=> {
    await removeRoles(user.user_id, data.roles);

    message.success('权限删除成功');

    actionRef?.current?.reloadAndRest?.();

    return true;
  }, [user]);

  const columns: ProColumns<API.UserRole>[] = [
    {
      title: '名称',
      dataIndex: ['role', 'name'],
    }, 
    {
      title: '描述',
      dataIndex: ['role', 'description'],
    },
    {
      title: '分配时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
    {
      title: '分配来源',
      render: (_, record) => {
        return <></>;
      }
    },
    {
      render: (_, record) => {
        return <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleRemoveRoles({ roles: [record.id] })}>
            <Button loading={loadingRemoveRoles} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <ProTable<API.Role>
    rowKey='id'
    actionRef={actionRef}
    options={false}
    toolBarRender={() => [<AddRolesModal user={user} loading={loadingAddRoles} trigger={<Button size="large" type="primary">分配角色</Button>} onFinish={handleAddRoles}/>]}
    search={false}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
    columns={columns}
  />;
}

export default UserRoles;