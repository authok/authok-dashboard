import React from 'react';
import { Tabs } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';

import libraries from './libraries';
import { useTenantDetails } from '@/hooks/tenant';

interface ResourceServerQuickStartProps {
  resourceServer: API.ResourceServer;
}

const ResourceServerQuickStart: React.FC<ResourceServerQuickStartProps> = ({ resourceServer }) => {
  const { data: tenant } = useTenantDetails();

  return <Tabs>
    {tenant && libraries.map(library => (
      <Tabs.TabPane key={library.language} tab={library.name}>
        <SyntaxHighlighter
          language={library.language}
          style={darcula}
          wrapLongLines={false}
          wrapLines={true}
        >
          {library.code({ resourceServer, tenant })}
        </SyntaxHighlighter>
      </Tabs.TabPane>
    ))}
  </Tabs>;
};

export default ResourceServerQuickStart;
