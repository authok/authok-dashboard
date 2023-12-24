import React, { useEffect, useCallback, useState } from 'react';
import { useTenants, useTenantCreate } from '@/hooks/tenant';
import useTenantContext from '@/providers/tenant/useTenantContext';
import CreateTenantModalForm from '@/components/CreateTenantModalForm';

const regions = [{
  display_name: '中国',
  name: 'cn',
}, {
  display_name: '日本',
  name: 'jp',
}, {
  display_name: '美国',
  name: 'us',
}];

const LayoutContainer: React.FC = () => {
  const { tenant, switchTenant } = useTenantContext();

  console.log('到默认主页');

  const { data: tenants, loading } = useTenants({
    cacheKey: 'tenants',
    cacheTime: 3000,
  });

  const { run: create } = useTenantCreate();
  const [visible, setVisible] = useState<boolean>(false);

  const handleCreateTenant = useCallback(async (values: Partial<API.Tenant>): Promise<boolean> => {
    console.log('创建租户: ', values);
    const newTenant = await create(values);

    // switch tenant
    console.error('TODO 切换到新租户');
    switchTenant(newTenant);
    return true;
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!tenants || tenants.length === 0) {
      setVisible(true);

      return;
    }

    const tenantFinded = tenants.find(it => it.name === tenant);
    if (tenant && tenantFinded) {
      // 找到
      switchTenant(tenantFinded);
      // window.location.pathname = `/${tenantFinded.region}/${tenantFinded.name}`;

      // history.push(`/${tenantFinded.region}/${tenantFinded.name}`);
    } else {
      // 没有设置当前租户
      switchTenant(tenants[0]);
    } 
  }, [loading, tenant, tenants]);

  return <>
    <CreateTenantModalForm 
      visible={visible} 
      onFinish={handleCreateTenant}
      regions={regions}
    />
  </>;
}

export default LayoutContainer;