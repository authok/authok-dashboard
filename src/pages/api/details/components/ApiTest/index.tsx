import React, { useEffect, useMemo, useState } from 'react';
import { Select, Tabs, Space, Typography, Spin, Alert, Button } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import tokenCodeTemplates from './token-code-templates';
import accessApiCodeTemplates from './access-api-code-templates';
import { useToken } from '@/hooks/resource-server';
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity, ClientGrantEntity } from '@/api';
import { useTenantDetails } from '@/hooks/tenant';
import { Link, history } from 'umi';
import { formatPath } from '@/utils/link.utils';
const { Paragraph } = Typography;

interface ApiTestProps {
  resourceServer: API.ResourceServer;
}

const ApiTest: React.FC<ApiTestProps> = ({ resourceServer }) => {
  const { data: tenantSettings } = useTenantDetails();

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

  return <Space direction="vertical" style={{ width: '100%' }}>
    { !loadingClientGrants && !(!!clientGrants && clientGrants.length > 0) && 
      <Alert type="warning" showIcon message={<>还没有应用被授权，您可以<Link to={formatPath(`/app/apis/${resourceServer.id}/non_interactive`)}>去添加应用授权</Link></>} />
    }
    <Select loading={loadingApplications} style={{ width: '400px' }} value={application?.client_id} options={applicationOptions} onChange={(e, { obj }) => setApplication(obj)}/>
    <Paragraph>你可以向所有已授权的应用请求令牌:</Paragraph>
    <Tabs>
      {tenantSettings && application && tokenCodeTemplates.map(it => <Tabs.TabPane key={it.title} tab={it.title}>
        <SyntaxHighlighter
          language={it.language}
          style={darcula}
          wrapLongLines={false}
          wrapLines={true}
        >
          {it.code({ tenant: tenantSettings, application, resourceServer })}
        </SyntaxHighlighter>
      </Tabs.TabPane>)}
    </Tabs>

    <h3>响应</h3>
    <Spin spinning={loadingToken} delay={500}>
      <SyntaxHighlighter
        language='javascript'
        style={darcula}
        wrapLongLines={false}
        wrapLines={true}
      >
        {JSON.stringify(token || {}, null, 2)}
      </SyntaxHighlighter>
    </Spin>
    <h3>传递token给API</h3>
    <Spin spinning={loadingToken} delay={500}>
      <Tabs>
        {accessApiCodeTemplates.map(it => <Tabs.TabPane key={it.title} tab={it.title}>
          <SyntaxHighlighter
            language={it.language}
            style={darcula}
            wrapLongLines={false}
            wrapLines={true}
          >
            {it.code({ token })}
          </SyntaxHighlighter>
        </Tabs.TabPane>)}
      </Tabs>
    </Spin>
  </Space>
};

export default ApiTest;