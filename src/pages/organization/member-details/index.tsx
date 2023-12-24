import React, { useMemo, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useOrganizationMemberDetails, useOrganizationMemberRolesPaginate, useOrganizationMemberAddRoles, useOrganizationMemberRemoveRoles } from '@/hooks/organization';
import ProSkeleton from '@ant-design/pro-skeleton';
import { Avatar, Empty, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ProCard from '@ant-design/pro-card';
import RoleList from '@/components/RoleList';
const { Text } = Typography;
import * as _ from 'lodash';
import { useResourcePagination } from '@/hooks/useResource';
import { RoleEntity } from '@/api';

const OrganizationMemberDetails: React.FC<any> = ({ match }) => {
  const { org_id, member_id } = match.params;

  const { data: organizationMember, loading } = useOrganizationMemberDetails(org_id, member_id);
  const { data: memberRoles, refresh } = useOrganizationMemberRolesPaginate(org_id, member_id, {
    manual: false,
    defaultParams: [{
      page_size: 1000,
    }],
    formatResult: (page: API.Page<API.OrganizationMemberRole>) => page.items,
  });

  const { run: addRolesToMember } = useOrganizationMemberAddRoles();
  const { run: removeRolesToMember } = useOrganizationMemberRemoveRoles();

  const { data: roles } = useResourcePagination(RoleEntity, {
    manual: false,
    defaultParams: [{
      page_size: 1000,
    }],
    formatResult: (page: API.Page<API.Role>) => page.items,
  });

  const filterdRoles = useMemo(() => {
    const roleId2memberRole = _.keyBy(memberRoles, 'role.id');

    return roles?.filter(role => !roleId2memberRole[role.id]);
  }, [memberRoles, roles]);

  const handleAddRoles = useCallback(async (values: any) => {
    await addRolesToMember(org_id, member_id, values.roles);

    refresh();
  }, [org_id, member_id, memberRoles]);
  
  const handleRemoveRoles = useCallback(async (values: any) => {
    await removeRolesToMember(org_id, member_id, values.roles);

    refresh();
  }, [org_id, member_id, memberRoles]);

  if (loading && !organizationMember) {
    return  <PageContainer><ProSkeleton /></PageContainer>;
  }

  if (!organizationMember) {
    return  <PageContainer><Empty /></PageContainer>;
  }

  return (
    <PageContainer>
      <ProCard>
        <Meta
          avatar={<Avatar shape="square" src={organizationMember.user.picture} size={64}/>}
          title={organizationMember.user.nickname || organizationMember.user.username || organizationMember.user.phone_number || organizationMember.user.email }
          description={
            <Space>
              <Text>用户ID</Text> 
              <Text keyboard>
                {organizationMember.user.user_id}
              </Text>
            </Space>
          }
        />
      </ProCard>
      <RoleList 
        dataSource={memberRoles}
        onAddRoles={handleAddRoles}
        onRemoveRoles={handleRemoveRoles}
        roles={filterdRoles}
      />
    </PageContainer>
  );
};

export default OrganizationMemberDetails;