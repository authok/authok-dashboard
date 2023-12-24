import React, { useCallback } from 'react';
import ProSkeleton from '@ant-design/pro-skeleton';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import Meta from 'antd/lib/card/Meta';
import { message, Avatar, Space, Empty, Button, Typography, Card } from 'antd';
const { Text } = Typography;
import { history, Link } from 'umi';
import OrganizationSettings from './components/OrganizationSettings';
import OrganizationMemberSettings from './components/OrganizationMemberSettings';
import InvitationList from './components/InvitationList';
import { useResourceUpdate, useResourceDelete, useResourceDetails } from '@/hooks/useResource';
import { OrganizationEntity } from '@/api/entities/organization.entity';
import { formatPath } from '@/utils/link.utils';
import ConnectionSettings from './components/ConnectionSettings';

const OrganizationDetailsPage: React.FC<any> = ({ match }) => {
  const { org_id, tab = 'settings' } = match.params;

  const { error, data: organization, loading, refresh } = useResourceDetails(OrganizationEntity, org_id);
  const { run: updateOrganization } = useResourceUpdate(OrganizationEntity);
  const { run: deleteOrganization, loading: loadingDelete } = useResourceDelete(OrganizationEntity);


  const handleUpdateOrganization = useCallback(async (values: Partial<API.Organization>): Promise<boolean> => {
    await updateOrganization(org_id, values);
    message.success('更新成功');

    refresh();

    return true;
  }, [org_id, organization]);

  const handleDeleteOrganization = useCallback(async (id: string) => {
    await deleteOrganization(id);
  
    history.push(formatPath('/organizations'));
  }, [org_id, organization]);

  if (loading && !organization) {
    return <PageContainer className="page-middle"><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!organization) {
    return <PageContainer className="page-middle">
      <Empty 
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>记录不存在</span>
        }
      >
        <Link to={formatPath('/organization')}><Button type="primary">返回</Button></Link>
      </Empty>
    </PageContainer>
  }

return <PageContainer className="page-middle">
    <Card bordered={false}>
      <Meta
        avatar={<Avatar shape="square" src={organization.logo_uri} size={64}/>}
        title={organization.name}
        description={
          <Space>
            <Text>组织ID</Text> 
            <Text keyboard>
              {organization.id}
            </Text>
          </Space>
        }
      />
    </Card>
    <ProCard
      tabs={{
        // destroyInactiveTabPane: true,
        tabPosition: 'top',
        activeKey: tab,
        onChange: (key: string) => {
          history.push(formatPath(`/organizations/${org_id}/${key}`));
        },
        tabBarGutter: 64,
        size: 'large',
      }}  
    >
      <ProCard.TabPane key="settings" tab="设置">
        <OrganizationSettings organization={organization} onUpdate={handleUpdateOrganization} onDelete={handleDeleteOrganization}/>
      </ProCard.TabPane>
      <ProCard.TabPane key="members" tab="成员">
        <OrganizationMemberSettings organization={organization} />
      </ProCard.TabPane>
      <ProCard.TabPane key="invitations" tab="邀请">
        <InvitationList organization={organization} />
      </ProCard.TabPane>
      <ProCard.TabPane key="connections" tab="身份源">
        <ConnectionSettings organization={organization} />
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>;
}

export default OrganizationDetailsPage;