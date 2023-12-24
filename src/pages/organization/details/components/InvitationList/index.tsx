import React, { useCallback, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { ProColumns } from '@ant-design/pro-table/lib/typing';
import { formatProTablePagination } from '@/utils/formatter';
import { useOrganizationSendInvitation, useOrganizationInvitationPaginate } from '@/hooks/organization';
import { Space, Button } from 'antd';
import InviteMembersModal from '@/pages/organization/components/InviteMembersModal';
import { UserAddOutlined } from '@ant-design/icons';
import { formatPageQuery } from '@/utils/utils';

interface InvitationListProps {
  organization: API.Organization;
}

const InvitationList: React.FC<InvitationListProps> = ({ organization }) => {
  const actionRef = useRef();

  const { run: paginateInvitations } = useOrganizationInvitationPaginate(organization.id, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const { run: sendInvitation } = useOrganizationSendInvitation();
  
  const handleInviteMembers = useCallback(async (invitations: Partial<API.Invitation>[]) => {
    console.log('handleInviteMembers: ', invitations);
    for (const invitation of invitations) {
      await sendInvitation(organization.id, invitation);
    }

    actionRef.current?.reloadAndRest();

    return true;
  }, [organization]);

  const columns: ProColumns<API.Invitation> = [
    {
      title: '邮箱',
      dataIndex: ['invitee', 'email'],
    },
    {
      title: '手机',
      dataIndex: ['invitee', 'phone_number'],
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      title: '过期时间',
      valueType: 'dateTime',
      dataIndex: 'expires_at',
    },
    {
      title: '创建人',
      render: (_, record) => {
        return <>{record.inviter.username || record.inviter.name || record.inviter.nickname || record.inviter.email || record.inviter.phone_number }</>;
      }
    }
  ];

  return <ProTable<API.Invitation>
    rowKey="id"
    actionRef={actionRef}
    headerTitle={
      <Space size={0} direction="vertical">
        <h3>邀请</h3>
        <span style={{ fontSize: 14 }}>邀请用户加入组织 <a href="#">了解更多</a></span>
      </Space>
    }
    columns={columns}
    request={(params, sorter, filter) => paginateInvitations(formatPageQuery(params, sorter, filter))}
    options={false}
    search={false}
    toolBarRender={() => [
      <InviteMembersModal
        organization={organization} 
        onFinish={handleInviteMembers}
        trigger={<Button icon={<UserAddOutlined />} type="primary" size="large">邀请成员</Button>}
      />
    ]}
  />;
};

export default InvitationList;

