import React from 'react';
import { Space, Typography } from 'antd';
const { Paragraph } = Typography;
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useTenantDetails } from '@/hooks/tenant';

interface SAMLSetupProps {
  connection: API.Connection;
}

const SAMLSetup: React.FC<SAMLSetupProps> = ({ connection }) => {
  const { data: tenant } = useTenantDetails(); 
  
  return <Space direction="vertical" style={{ width: '100%' }}>
    <Paragraph>
      如果您是域名管理员, 点此<a target="_blank" href="https://docs.authok.cn/docs/authenticate/protocols/saml/saml-identity-provider-configuration-settings?a=P6HKg3FHjW1WdIRXSlHd2DTRXy01vQNp&conn=samlp1">继续</a>.
    </Paragraph>
    <Paragraph>
      如果不是，请把以下链接发给管理员
    </Paragraph>

    <SyntaxHighlighter
      language='plaintext'
      style={darcula}
      wrapLongLines={false}
      wrapLines={true}
    >
      { `https://${tenant?.domain}/p/samlp/rtMFqEbI`}
    </SyntaxHighlighter>
  </Space>
};

export default SAMLSetup;