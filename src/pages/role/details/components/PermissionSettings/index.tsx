import React, { useRef, useCallback, useEffect, useMemo } from 'react';
import ProTable from '@ant-design/pro-table';
import { useRolePermissionPagination, useRemovePermissionsToRole, useAddPermissionsToRole } from '@/hooks/role';
import { formatProTablePagination } from '@/utils/formatter';
import { Popconfirm, Space, Button, message, Alert } from 'antd';
import { ActionType, ProColumns } from '@ant-design/pro-table';
import { DeleteOutlined } from '@ant-design/icons';
import AssignPermissionsModal from '@/components/AssignPermissionsModal';
import { Link } from 'umi';
import { useResourcePagination } from '@/hooks/useResource';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';
import { formatPath } from '@/utils/link.utils';
import { formatPageQuery } from '@/utils/utils';

interface PermissionSettingsProps {
  role: API.Role;
}

const PermissionSettings: React.FC<PermissionSettingsProps> = ({ role }) => {
  const { data: permissionPage, run: paginate } = useRolePermissionPagination(role.id, {
    manual: true,
    formatResult: formatProTablePagination,
  });
  const { run: paginateAllPermissions } = useRolePermissionPagination(role.id, {
    manual: true,
    formatResult: (page: API.Page<API.Permission>) => page.items,
  });

  const { run: addPermissions } = useAddPermissionsToRole();
  const { run: removePermissions } = useRemovePermissionsToRole();

  const { data: _resourceServers, run: fetchResourceServers } = useResourcePagination(ResourceServerEntity, {
    manual: true,
    formatResult: (page: API.Page<API.ResourceServer>) => page.items,
  });

  const resourceServers = useMemo(() => {
    if (_resourceServers) {
      const permissions = permissionPage?.data || [];
      const r2p = _.groupBy(permissions, 'resource_server_identifier');
      return _resourceServers.filter(it => !!r2p[it.identifier]);
    }
  }, [_resourceServers, permissionPage]);

  useEffect(() => {
    if (permissionPage) {
      const _identifiers = permissionPage.data.map((it) => it.resource_server_identifier);
      const identifiers = Array.from(new Set(_identifiers));
      if (identifiers.length > 0) {
        fetchResourceServers({
          identifier: identifiers,
          enforce_policies: false,
        });
      }      
    }
  }, [permissionPage]);


  const handleAssignPermissions = useCallback(async (values: any) => {
    console.log('assign permissions: ', values);

    await addPermissions(role.id, values.permissions);

    message.success('权限分配成功');

    actionRef?.current?.reloadAndRest?.();

    return true;
  }, [role]);

  const actionRef = useRef<ActionType>();

  const handleRemovePermissions = useCallback(async (values) => {
    await removePermissions(role.id, values.permissions);

    actionRef.current?.reloadAndRest();
  }, [role])


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
      render: (_, record) => {
        return <Space direction="vertical" align="end" style={{ width: '100%' }}>
          <Popconfirm 
            title="确定要删除" okText="是" cancelText="否" 
            destroyTooltipOnHide
            onConfirm={() => handleRemovePermissions({
              permissions: [
                {
                  permission_name: record.permission_name,
                  resource_server_identifier: record.resource_server_identifier,
                }
              ]
            })}
          >
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {(resourceServers && resourceServers.length > 0) && 
        <Alert type="warning" message={
          <>
            以下API没有开启RBAC: <Space direction="horizontal">{resourceServers.map(it => <Link key={it.id} to={formatPath(`/app_mgmt/apis/${it.id}`)}>{it.name}</Link>)}</Space>
          </>
        }/>
      }
      <ProTable<API.Permission>
        rowKey='id'
        headerTitle="添加权限到角色. 拥有此角色的用户在授权成功后会获取角色下的所有权限."
        actionRef={actionRef}
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
        options={false}
        search={false}
        request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
        columns={columns}
      />
    </Space>
  );
};

export default PermissionSettings;