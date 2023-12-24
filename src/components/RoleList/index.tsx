import React, { useCallback } from 'react';
import { ProColumns, ActionType, RequestData } from '@ant-design/pro-table/lib/typing';
import ProTable from '@ant-design/pro-table';
import { message, Button, Space, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import AddRolesModal from './AddRoleModel';

interface RoleListProps {
  request?: (params, sort, filter) => Promise<Partial<RequestData<API.UserRole | API.OrganizationMemberRole>>>,
  dataSource?: (API.OrganizationMemberRole | API.UserRole)[];
  onAddRoles: (values: any) => void;
  onRemoveRoles: (values: any) => void;
  loadingRemoveRoles?: boolean;
  roles: API.Role[];
  actionRef?: ActionType,
}

const RoleList: React.FC<RoleListProps> = ({ actionRef, dataSource, request, roles, onAddRoles, onRemoveRoles, loadingRemoveRoles = false }) => {
  const handleAddRoles = useCallback(async (values: any) => {
    await onAddRoles(values);

    message.success('角色分配成功');

    return true;
  }, [request, onAddRoles]);

  const handleRemoveRoles = useCallback(async (data)=> {
    await onRemoveRoles(data);

    message.success('角色删除成功');

    return true;
  }, [request, onRemoveRoles]);

  const columns: ProColumns<API.UserRole | API.OrganizationMemberRole>[] = [
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
      valueType: 'dateTime',
      dataIndex: 'created_at',
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
          <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleRemoveRoles({ roles: [record.role.id] })}>
            <Button loading={loadingRemoveRoles} icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>;
      }
    }
  ];

  return <ProTable<API.UserRole | API.OrganizationMemberRole>
    rowKey='role.id'
    actionRef={actionRef}
    options={false}
    toolBarRender={() => [<AddRolesModal roles={roles} trigger={<Button size="large" type="primary">分配角色</Button>} onFinish={handleAddRoles}/>]}
    search={false}
    {...( request && { request })}
    {...( dataSource && { dataSource })}
    columns={columns}
  />;
}

export default RoleList;