import React, { useCallback, useRef, useMemo } from 'react';
import { useUserPermissionPagination, useAddPermissionsToUser, useRemovePermissionsToUser } from '@/hooks/user';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { message, Button, Space, Popconfirm } from 'antd';
import { formatProTablePagination } from '@/utils/formatter';
import { DeleteOutlined } from '@ant-design/icons';
import AssignPermissionsModal from '@/components/AssignPermissionsModal';
import { formatPageQuery } from '@/utils/utils';

interface UserPermissionsProps {
  user: API.User;
}

const UserPermissions: React.FC<UserPermissionsProps> = ({ user }) => {
  const { run: paginate } = useUserPermissionPagination(user.user_id, { 
    manual: true,
    formatResult: formatProTablePagination,
  });
  const { run: assignPermissions } = useAddPermissionsToUser();

  const { run: removePermissions, loading: loadingRemovePermissions } = useRemovePermissionsToUser();

  const { run: paginateAllPermissions } = useUserPermissionPagination(user.user_id, { 
    manual: true,
    formatResult: (page: API.Page<API.Permission>) => page.items,
  } as any);

  const actionRef = useRef<ActionType>();

  const handleAssignPermissions = useCallback(async (values: any) => {
    console.log('assign permissions: ', values);

    await assignPermissions(user.user_id, values.permissions);

    message.success('权限分配成功');

    actionRef?.current?.reloadAndRest?.();

    return true;
  }, [user]);

  const handleRemovePermissions = useCallback(async (permission: API.Permission)=> {
    await removePermissions(
      user.user_id,
      [{
        permission_name: permission.permission_name,
        resource_server_identifier: permission.resource_server_identifier,
      }]
    );

    message.success('权限删除成功');

    actionRef?.current?.reloadAndRest?.();

    return true;
  }, [user]);

  const sourceTypeRenders = useMemo(() => ({
    'DIRECT': (source) => <span>直接分配</span>,
    'ROLE': (source) => <span>由角色{source.source_name}分配</span>,
  }), []);

  const columns: ProColumns<API.Permission>[] = [
    {
      title: '名称',
      dataIndex: 'permission_name',
    }, 
    {
      title: '描述',
      dataIndex: 'description',
    },
    {
      title: 'API',
      dataIndex: 'resource_server_name',
    },
    {
      title: '分配来源',
      render: (_, record) => {
        return <>
          {record.sources.map((source: API.PermissionSource) => (
            <Space direction="vertical">
              {sourceTypeRenders[source.source_type]?.(source)}
            </Space>
          ))}
        </>;
      },
    },
    {
      render: (_, record) => {
        const disabled = !(record.sources && record.sources.length === 1 && record.sources[0].source_type === 'DIRECT');

        return <Space direction="vertical" align="center" style={{ width: '100%' }}>
          <Popconfirm disabled={disabled} title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleRemovePermissions(record)}>
            <Button loading={loadingRemovePermissions} disabled={disabled} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <ProTable<API.Permission>
    rowKey='id'
    actionRef={actionRef}
    options={false}
    toolBarRender={() => [
      <AssignPermissionsModal 
        trigger={<Button size="large" type="primary">分配权限</Button>}
        onFinish={handleAssignPermissions}
        exclude={async () => {
          return await paginateAllPermissions({
            page_size: 1000,
          });
        }}
      />
    ]}
    search={false}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
    columns={columns}
  />;
}

export default UserPermissions;