import React, { useEffect } from 'react';
import { IRouteComponentProps, useParams } from 'umi'
import * as _ from 'lodash';
import { useTenants } from '@/hooks/tenant';
import useTenantContext from '@/providers/tenant/useTenantContext';

const TenantLayout: React.FC<IRouteComponentProps> = ({ children }: IRouteComponentProps) => {
  const { tenant, switchTenant } = useTenantContext();
  const { tenant: tenantFromPath } = useParams();

  const { data: tenants } = useTenants({
    cacheKey: 'tenants',
    cacheTime: 3000,
  });

  useEffect(() => {
    if (!tenants || tenants.length === 0) {
      // TODO 弹出框创建租户
      return;
    }

    // 当前租户为空，或者在列表中找不到当前租户，就跳转到用户的第一个租户
    if (!tenantFromPath || tenantFromPath != tenant || tenants.filter(it => it.name === tenantFromPath).length === 0) {
      const current = tenants[0];
      switchTenant(current);
    }
  }, [tenants]);

  return <>{children}</>;
}

export default TenantLayout;