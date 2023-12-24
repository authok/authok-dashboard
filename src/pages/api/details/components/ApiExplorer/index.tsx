import React, { useEffect, useMemo, useState } from 'react';
import { Select, Space, Typography, Spin, Alert, Card } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useToken } from '@/hooks/resource-server';
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity, ClientGrantEntity } from '@/api';
import { Link } from 'umi';
import { formatPath } from '@/utils/link.utils';
import { CopyFilled } from '@ant-design/icons';
import { useTenantDetails } from '@/hooks/tenant';
const { Paragraph, Text } = Typography;

interface ApiExplorerProps {
  resourceServer: API.ResourceServer;
}

const ApiExplorer: React.FC<ApiExplorerProps> = ({ resourceServer }) => {
  const { data: tenantSettings, loading: loadingTenant } = useTenantDetails();

  const { data: clientGrants, loading: loadingClientGrants } = useResourcePagination(ClientGrantEntity, {
    manual: false,
    formatResult: (page: API.Page<API.ClientGrant>) => page.items,
    defaultParams: [{
      audience: resourceServer.identifier,
      page_size: 1000,
    }],
    refreshDeps: [resourceServer],
  });

  const { data: applications, run: paginateApplication, loading: loadingApplications } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
    refreshDeps: [resourceServer],
  });

  const { data: token, run: fetchToken, loading: loadingToken } = useToken();

  useEffect(() => {
    if (clientGrants && clientGrants.length > 0) {
      paginateApplication({
        client_id: clientGrants.map(it => it.client_id),
        page_size: 1000,
      });
    }
  }, [clientGrants]);
  
  const applicationOptions = useMemo(() => applications?.map((it) => ({ label: it.name, value: it.client_id, obj: it })), [applications]);

  const [application, setApplication] = useState<API.Application>();

  useEffect(() => {
    if (applications) {
      setApplication(applications[0]);
    }
  }, [applications]);

  useEffect(() => {
    if (!application) return;

    const req = {
      audience: resourceServer.identifier,
      client_id: application.client_id,
      client_secret: application.client_secret,
    };
    fetchToken(req);
  }, [application]);

  return (
    <Spin spinning={loadingApplications || loadingToken || loadingTenant} delay={500}>
      <Space direction="vertical" style={{ width: '100%' }}>
        { !loadingClientGrants && !(!!clientGrants && clientGrants.length > 0) && 
          <Alert type="warning" showIcon message={<>还没有应用被授权，您可以<Link to={formatPath(`/app/apis/${resourceServer.id}/non_interactive`)}>去添加应用授权</Link></>} />
        }
        <Select style={{ width: '400px' }} value={application?.client_id} options={applicationOptions} onChange={(e, { obj }) => setApplication(obj)}/>
        <h3>Token</h3>
        { token && (
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            <SyntaxHighlighter
              language='plaintext'
              style={darcula}
              wrapLongLines={false}
              wrapLines={true}
            >
              {token?.access_token || ''}
            </SyntaxHighlighter>
            <Text style={{ position: 'absolute', top: 8, right: 8 }} copyable={{ text: token?.access_token, icon: <CopyFilled /> }} />
          </div>
        )}
        <h3>当前token拥有的权限(scope) 共{ (token && token.scope && token.scope.split(' ').length) || 0}个: </h3>
        <Card>
          {
            token && token.scope && token.scope.split(' ').map((scope, i) => (
              <div style={{ display: 'inline-block', margin: 8 }}><Text key={i} code>{scope}</Text></div>
            ))
          }
        </Card>

        <h3>在API浏览器中使用Token</h3>
        {tenantSettings && (
          <Paragraph>
            1. 跳转到 <a href={`https://${tenantSettings.domain}/docs/management`} target="_blank">API浏览器</a><br/>
            2. 点击右边的 <b>Authorize</b>按钮.<br/>
            3. 把上面的 token 拷贝到 <b>Value</b>输入框，保存即可.
          </Paragraph>
        )}
    </Space>
    </Spin>
  );
};

export default ApiExplorer;