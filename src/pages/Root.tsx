import React, { useEffect } from 'react';
import { AuthokProvider, useAuthok } from '@authok/authok-react';
import { history } from 'umi';
import TenantProvider from '@/providers/tenant/tenant.provider';
import { notification } from 'antd';
import useTenantContext from '@/providers/tenant/useTenantContext';
import { PageLoading } from '@ant-design/pro-layout';
import BackendAPIProvider from '@/providers/backend-api/backend-api.provider';
import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

const AuthContent: React.FC = ({ children }) => {
  const { isAuthenticated, isLoading, user, error } = useAuthok();
  const { switchTenant } = useTenantContext();

  console.debug('auth.isAuthenticated', isAuthenticated, user);
  console.debug('auth.isLoading', isLoading);
  console.debug('auth.error', error);

  useEffect(() => {
    if (error) {
      notification.error({
        key: 'authok',
        message: error.message,
      })
      switchTenant(undefined);
    }
  }, [error]);

  // 验证失败后进行登录跳转
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated && history.location.pathname !== '/login') {
      history.push('/login');
      // window.location.pathname = '/login';
    }
  }, [isAuthenticated, isLoading, history]);

  if (history.location.pathname === '/login') {
    return <ErrorBoundary>{children}</ErrorBoundary>;
  }

  if (isLoading) {
    return <PageLoading tip="正在加载用户信息"/>;
  }

  return children;
}

const AuthContainer: React.FC = ({ children }) => {
  const { tenant, setTenant } = useTenantContext();

  const url = window.location.href;
  let invitation = undefined;
  let organization = tenant;
  const inviteMatches = url.match(/invitation=([^&]+)/);
  const orgMatches = url.match(/organization=([^&]+)/);
  if (inviteMatches && orgMatches) {
    invitation = inviteMatches[1];
    organization = orgMatches[1];
  }

  console.log(`当前tenant: ${organization}, invitation: ${invitation}`);

  useEffect(() => {
    if (organization) {
      setTenant(organization);
    }
  }, [organization])

  return <AuthokProvider 
      domain={AUTHOK_DOMAIN}
      clientId={AUTHOK_CLIENT_ID}
      audience={AUTHOK_MGMT_AUDIENCE}
      scope={AUTHOK_SCOPE}
      {...(organization && { organization })}
      {...(invitation && { invitation })}
      redirectUri={window.location.origin + '/login'}
      onRedirectCallback={(appState) => {
        history.replace(appState);
      }}
    >
      <BackendAPIProvider host={MGMT_API_HOST}>
        <AuthContent>{children}</AuthContent>
      </BackendAPIProvider>
    </AuthokProvider>
};

const Root: React.FC = ({ children }) => {
  if (history.location.pathname === '/connections/tester/callback') {
    return <>{children}</>;
  }

  return (<TenantProvider>
    <AuthContainer>{children}</AuthContainer>
  </TenantProvider>);
}

export default Root;