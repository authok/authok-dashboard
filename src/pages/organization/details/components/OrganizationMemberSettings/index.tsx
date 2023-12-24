import React, { useCallback, useRef, useState, useMemo, useEffect } from 'react';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { Popconfirm, Avatar, Button, Typography, Menu, Dropdown, message } from 'antd';
import { useOrganizationMembersPaginate, useOrganizationAddMembers, useOrganizationMemberAddRoles, useOrganizationMemberRolesPaginate, useOrganizationRemoveMembers } from '@/hooks/organization';
import { formatProTablePagination } from '@/utils/formatter';
import AssignUsersModal from '@/components/AssignUsersModel';
import { Link } from 'umi'
import AddRolesModal from '@/components/RoleList/AddRoleModel';
const { Text } = Typography;
import * as _ from 'lodash';
import { useResourcePagination } from '@/hooks/useResource';
import { RoleEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';

interface OrganizationMemberSettingsProps {
  organization: API.Organization;
}

const OrganizationMemberSettings: React.FC<OrganizationMemberSettingsProps> = ({ organization }) => {
  const { run: paginate, data: memberPage, refresh } = useOrganizationMembersPaginate(organization.id, {
    manual: false,
    formatResult: formatProTablePagination,
  });
  const { run: addMembers } = useOrganizationAddMembers();
  const { run: removeMembers } = useOrganizationRemoveMembers();

  const { data: roles, loading: loadingRoles } = useResourcePagination<RoleEntity, API.Role, API.Role[]>(RoleEntity, {
    manual: false,
    defaultParams: [{
      page_size: 1000,
    }],
    formatResult: (page: API.Page<API.Role>) => page.items,
  });

  const [memberId, setMemberId] = useState<string>('');

  const { data: memberRoles, loading: loadingMemberRoles, run: listMemberRoles } = useOrganizationMemberRolesPaginate(organization.id, memberId, {
    manual: true,
    defaultParams: [{
      page_size: 1000,
    }],
    formatResult: (page: API.Page<API.OrganizationMemberRole>) => page.items,
  });

  useEffect(() => {
    memberId && memberId.length > 0 && listMemberRoles()
  }, [memberId, memberPage]);

  const filteredRoles = useMemo(() => {
    const roleId2memberRole = _.keyBy(memberRoles || [], 'role.id');
    return roles?.filter(role => !roleId2memberRole[role.id]);
  }, [memberRoles, roles]);

  const { run: addRolesToMember } = useOrganizationMemberAddRoles();

  const handleAddRoles = useCallback(async (member_id, values): Promise<boolean> => {
    await addRolesToMember(organization.id, member_id, values.roles);

    refresh();

    message.success('角色分配成功');

    return true;
  }, [organization, memberPage]);

  const actionRef = useRef();

  const handleAddMembers = useCallback(async (values: API.Node<API.User | API.Group>[]): Promise<boolean> => {
    console.log('handleAddMembers: ', values);
    const user_ids = values.filter(it => it.type === 'user').map(it => it.data.user_id);

    await addMembers(organization.id, user_ids);

    actionRef.current?.reloadAndRest();

    return true;
  }, [organization]);

  const handleRemoveMembers = useCallback(async(user_ids: string[]) => {
    await removeMembers(organization.id, user_ids);

    actionRef.current?.reloadAndRest();
    
  }, [organization]);

  const metas: ProListMetas<API.OrganizationMember> = {
    avatar: {
      render: (_, record) => <Avatar src={record.user.picture}/>,
    },
    title: {
      render: (_, record) => <Link to={formatPath(`/organizations/${organization.id}/members/${record.id}`)}>{record.user.nickname || record.user.phone_number || record.user.email || record.user.username}</Link>,
    },
    description: {
      render: (_, record) => <>{record.user.phone_number || record.user.email || record.user.username}</>,
    },
    content: {
      render: (_, record) => <Text copyable={record.user.user_id}>用户ID: <Text code>{record.user.user_id}</Text></Text>,
    },
    actions: {
      render: (_, record) => {        
        const overlay = <Menu>
          <Menu.Item key="details">
            <Link to={formatPath(`/organizations/${organization.id}/members/${record.id}`)}>成员详情</Link>
          </Menu.Item>
          <AddRolesModal 
            loading={loadingMemberRoles || loadingRoles}
            roles={filteredRoles} 
            trigger={<Menu.Item key="assign_roles" onClick={() => setMemberId(record.id)}>分配角色</Menu.Item>} 
            onFinish={(values) => handleAddRoles(record.id, values)}
          />
          <Menu.Divider />
          <Menu.Item key="delete">
            <Popconfirm title="确定要删除" okText="确定" cancelText="取消" onConfirm={() => handleRemoveMembers([record.user.user_id])}>删除成员</Popconfirm>
          </Menu.Item>
        </Menu>

        return <Dropdown.Button overlay={overlay} />
      },
    }
  };

  return <ProList<API.OrganizationMember>
    rowKey="user_user_id"
    actionRef={actionRef}
    metas={metas}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
    toolBarRender={()=>[
      <AssignUsersModal organization={organization} onFinish={(values: { nodes: API.Node<API.User | API.Group>[]}) => handleAddMembers(values.nodes)} trigger={<Button size="large" type="primary">添加成员</Button>}/>
    ]}
  />;
}

export default OrganizationMemberSettings;