import React, { useCallback, useRef, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { useRoleUserPagination, useAssignUsersToRole, useRemoveUsersToRole } from '@/hooks/role';
import { formatProTablePagination } from '@/utils/formatter';
import { Space, Button, Avatar, Tooltip, Popconfirm } from 'antd';
import AssignUsersModal from '@/components/AssignUsersModel';
import { PlusOutlined, CloseOutlined } from '@ant-design/icons';
import moment from 'moment';

interface UserSettingsProps {
  role: API.Role;
}

const UserSettings: React.FC<UserSettingsProps> = ({ role }) => {
  const actionRef = useRef<ActionType>();

  const { run: paginate } = useRoleUserPagination(role.id, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { run: assignUsersToRole } = useAssignUsersToRole();
  const { run: removeUsersToRole } = useRemoveUsersToRole();

  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleAssignUsers = useCallback(async (values: { nodes: API.Node<any>[]}) => {
    const nodes = values.nodes;
    if (nodes.length === 0) return true;

    const userToAssign = nodes.filter(it => it.type === 'user').map(it => it.data.user_id);

    await assignUsersToRole(role.id, userToAssign);

    actionRef.current?.reloadAndRest();
    return true;
  }, [role]);

  const handleRemoveUsersToRole = useCallback(async (users: string[]) => {
    console.log('removeUsersToRole: ', users);
    await removeUsersToRole(role.id, users);
    actionRef.current?.reloadAndRest();
  }, [role]);
  
  const columns: ProColumns<API.User> = [
    {
      title: '昵称',
      dataIndex: 'nickname',
      render: (_, record) => {
        return <Space>
          <Avatar src={record.picture} />
          {record.nickname}
        </Space>;
      },
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'phone_number',
    },
    {
      title: '最后登录时间',
      search: false,
      render: (_, record) => record.last_login ? moment(record.last_login).format('YYYY-MM-DD hh:mm:ss') : '-',
    },
    {
      title: '登录次数',
      search: false,
      dataIndex: 'loginsCount',
    },
    {
      title: '操作',
      search: false,
      render: (_, record) => {
        return <Tooltip title="取消授权">
          <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleRemoveUsersToRole([record.user_id])}>
            <CloseOutlined />
          </Popconfirm>
        </Tooltip>;
      }   
    }
  ];

  return <ProTable<API.User> 
    rowKey="user_id"
    actionRef={actionRef}
    headerTitle="已授权用户"
    toolBarRender={() => [
      <>{selectedRows?.length > 0 && (
        <Popconfirm title="确定要取消授权" okText="是" cancelText="否" onConfirm={() => handleRemoveUsersToRole(selectedRows)}>
          <Button
            type="link"
            danger
          >
            取消授权
          </Button>
        </Popconfirm>
      )}</>,
      <AssignUsersModal role={role} onFinish={handleAssignUsers} trigger={<Button size="large" type="primary" icon={<PlusOutlined/>}>添加用户</Button>}/>
    ]}
    columns={columns}
    request={paginate}
    rowSelection={{
      onChange: (keys: string[]) => {
        setSelectedRows(keys);
      }
    }}
    options={false}
  />;
}

export default UserSettings;