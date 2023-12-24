import React, { useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import GeneralSettings from './components/GeneralSettings';
import { message, Empty, Card } from 'antd';
import { useTenantUpdate, useTenantDetails } from '@/hooks/tenant';
import Subscription from './components/Subscription';
import TenantMembers from './components/TenantMembers';
import { history } from 'umi';
import { formatPath } from '@/utils/link.utils';
import SigningKeys from './components/SigningKeys';
import ProSkeleton from '@ant-design/pro-skeleton';

const Settings: React.FC<any> = ({ match }) => {
  const { tab = 'general' } = match.params;

  const { data: tenant, loading } = useTenantDetails();

  const { run: updateTenant } = useTenantUpdate();

  const handleUpdate = useCallback(async (data: Partial<API.Tenant>): Promise<boolean> => {
    await updateTenant(data);

    message.success('更新成功');

    return true;
  }, []);

  if (loading && !tenant) {
    return <PageContainer className="page-middle">
      <ProSkeleton />
    </PageContainer>;
  }

  if (!tenant) {
    return <PageContainer className="page-middle"><Empty/></PageContainer>;
  }

  const renderTab = (key: string) => {
    switch(key) {
      case 'general':
        return <GeneralSettings tenant={tenant} onUpdate={handleUpdate}/>;
      case 'subscription':
        return <Subscription tenant={tenant} />;
      case 'admins':
        return <TenantMembers tenant={tenant} />;
      case 'signing_keys':
        return <SigningKeys tenant={tenant} />
    }
    return <></>;
  }

  return <PageContainer
    title="租户设置"
    className="page-middle"
    tabActiveKey={tab}
    tabList={[
      {
        key: 'general',
        tab: '基础设置'
      },
      {
        key: 'subscription',
        tab: '订购'
      },
      {
        key: 'admins',
        tab: '租户成员管理',
      },
      {
        key: 'signing_keys',
        tab: '签名密钥',
      }
    ]}
    onTabChange={(key) => {
      history.push(formatPath(`/settings/${key}`));
    }}
  >
    {renderTab(tab)}
  </PageContainer>;
};

export default Settings;