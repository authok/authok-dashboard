import React, { useEffect, useMemo, useState } from 'react';
import { IRouteComponentProps, useParams, useModel, useIntl } from 'umi'
import * as _ from 'lodash';
import { useTenants } from '@/hooks/tenant';
import useTenantContext from '@/providers/tenant/useTenantContext';
import ProLayout, { BasicLayoutProps } from '@ant-design/pro-layout';
import { Link, history } from 'umi'; 
import { WithExceptionOpChildren } from './components/Exception';
import { getMatchMenu, MenuDataItem, transformRoute } from '@umijs/route-utils';
import getLayoutRenderConfig from './getLayoutRenderConfig';
import HeaderContent from '@/components/HeaderContent';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import './style.less';

const TenantLayout: React.FC<IRouteComponentProps> = (props: any/*IRouteComponentProps*/) => {
  const { tenant, switchTenant } = useTenantContext();
  const { tenant: tenantFromPath, region: regionFromPath } = useParams();

  const { formatMessage } = useIntl();

  const { data: tenants, loading: loadingTenant } = useTenants();

  useEffect(() => {
    if (loadingTenant) return;

    if (!tenants || tenants.length === 0) {
      history.push('/');
      return;
    }

    // 之前没有设置, 尝试用路径参数的
    const tenantForPath = tenants.find(it => it.name === tenantFromPath && it.region === regionFromPath);
    // 路径设置的不存在，直接用第一个
    if (!tenantForPath) {
      switchTenant(tenants[0]);
    } else {
      // 路径设置的租户存在
      
      // 本地缓存设置的租户id不存在
      if (!tenant) {
        switchTenant(tenantForPath)
      } else {
        // 本地缓存设置的租户id存在, 查询对象是否存在
        const currentTenant = tenants.find(it => it.id === tenant);
        // 如果对象存在
        if (!currentTenant || !(currentTenant.name === tenantFromPath && currentTenant.region === regionFromPath)) {
          switchTenant(tenantForPath)
        }
      }
    }
  }, [tenants, tenantFromPath, regionFromPath]);

  const { children, location, route, routes, ...restProps } = props;

  const initialInfo = (useModel && useModel('@@initialState')) || {
    initialState: undefined,
    loading: false,
    setInitialState: null,
  };

  // plugin-initial-state 未开启
  const { initialState, loading, setInitialState } = initialInfo;

  const currentPathConfig = useMemo(() => {
    const { menuData } = transformRoute(
      props?.route?.routes || [],
      undefined,
      undefined,
      true,
    );
    // 动态路由匹配
    const currentPathConfig = getMatchMenu(location.pathname, menuData).pop();
   return currentPathConfig || {};
  },[location?.pathname, props?.route?.routes]);

  const layoutRestProps: BasicLayoutProps & {
    rightContentRender?:
      | false
      | ((
          props: BasicLayoutProps,
          dom: React.ReactNode,
          config: any,
        ) => React.ReactNode);
  } = {
    itemRender: (route) => <Link to={route.path}>{route.breadcrumbName}</Link>,
    ...restProps,
    ...getLayoutRenderConfig(currentPathConfig as any ||{}),
  };

  return <ProLayout
    loading={loading}
    route={route}
    location={location}
    logo={'/logo.png'}
    siderWidth={256}
    onMenuHeaderClick={(e) => {
      e.stopPropagation();
      e.preventDefault();
      history.push('/');
    }}
    formatMessage={formatMessage}
    menuItemRender={(menuItemProps, defaultDom) => {
      if (menuItemProps.isUrl) {
        return defaultDom;
      }
      if (menuItemProps.path && location.pathname !== menuItemProps.path) {        
        const path =menuItemProps.path.replace(':region', regionFromPath).replace(':tenant', tenantFromPath);

        return (
          <Link to={path} target={menuItemProps.target}>
            {defaultDom}
          </Link>
        );
      }
      return defaultDom;
    }}
    disableContentMargin
    fixSiderbar
    fixedHeader
    {...layoutRestProps}
    footerRender={() => <Footer />}
    onPageChange={() => {
    }}
    headerContentRender={() => <HeaderContent />}
    menuHeaderRender={undefined}
    {...initialState?.settings}
    rightContentRender={() => <RightContent />}
  >
    <WithExceptionOpChildren
      noFound={undefined}
      unAccessible={undefined}
      currentPathConfig={currentPathConfig}
    >
      {children}
    </WithExceptionOpChildren>
  </ProLayout>;
}

export default TenantLayout;