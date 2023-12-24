import React, { useState, useCallback } from 'react';
import { notification, Button, Space, Card } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import InviteTenantMemberModal from './components/InviteTenantMemberModal';
import { useTenantSendInvitation } from '@/hooks/tenant';
import TenantMemberList from './components/TenantMemberList';
import TenantMemberInvitationList from './components/TenantMemberInvitationList';
import { useEventEmitter } from '@umijs/hooks';

interface TenantMembersProps {
  tenant: API.Tenant;
}

const TenantMembers: React.FC<TenantMembersProps> = ({ tenant }) => {
  const { run: sendInvitation } = useTenantSendInvitation();

  const newInvitationEvent$ = useEventEmitter<API.Invitation>();

  const handleInvite = useCallback(async (invitation: API.Invitation): Promise<boolean> => {
    console.log(invitation);

    await sendInvitation(invitation);

    newInvitationEvent$.emit(invitation);

    notification.success({
      key: 'tenant.invitation.create',
      message: '发送邀请成功',
    });

    return true;
  }, []);

  const [tab, setTab] = useState('members');

  const renderTab = (key: string) => {
    if (key === 'members') {
      return <TenantMemberList />;
    } else if (key === 'invitations') {
      return <TenantMemberInvitationList newInvitationEvent$={newInvitationEvent$}/>;
    }
  }

  return <Card 
    tabList={[
      {
        tab: '成员',
        key: 'members',
      },
      {
        tab: '邀请',
        key: 'invitations',
      }
    ]}
    onTabChange={(key) => setTab(key)}
    bordered={false} 
    extra={
      <Space>
        <InviteTenantMemberModal 
          trigger={<Button icon={<UserAddOutlined />} size="large" type="primary">邀请成员</Button>}
          onFinish={handleInvite}
        />
      </Space>
  }>
   {renderTab(tab)}
  </Card>;
};

export default TenantMembers;