import React from 'react';
import { Row, Col, Divider, Card } from 'antd';
import { ProFormText } from '@ant-design/pro-form';
import { request, useRequest } from 'umi';
import ClipboardButton from '@/components/ClipboardButton';
import useClipboard from '@/hooks/useClipboard';
import { useTenantDetails } from '@/hooks/tenant';

const Endpoints: React.FC = () => {
  const { data: tenantSettings } = useTenantDetails();

  const discoverURL = `https://${tenantSettings.domain}/.well-known/openid-configuration`;

  const { data, loading } = useRequest(() => request(discoverURL), {
    formatResult: (data) => data,
  });

  const { ref: authorizeURLRef, copy: copyAuthorizeURL } = useClipboard();
  const { ref: deviceAuthorizeURLRef, copy: copyDeviceAuthorizeURL } = useClipboard();
  const { ref: tokenURLRef, copy: copyTokenURL } = useClipboard();
  const { ref: userinfoURLRef, copy: copyUserinfoURL } = useClipboard();
  const { ref: openidConfigurationURLRef, copy: copyOpenidConfigurationURL } = useClipboard();
  const { ref: jwksURLRef, copy: copyJwksURL } = useClipboard();

  const { ref: samlProtocolURLRef, copy: copySamlProtocolURL } = useClipboard();
  const { ref: samlMetadataURLRef, copy: copySamlMetadataURL } = useClipboard();
  const { ref: wsfedMetadataURLRef, copy: copyWsfedMetadataURL } = useClipboard();
  const { ref: wsfedSignInURLRef, copy: copyWsfedSignInURL } = useClipboard();


  return (
    <Card bordered={false} style={{ width: '100%', marginTop: '16px' }} loading={loading}>
      <Row gutter={[8, 8]} justify="center">
        <Col span={8}><h3>{'OAuth'}</h3></Col>
        <Col span={16}>
          <ProFormText
            width="xl"
            label="OAuth授权URL"
            disabled
            value={data?.authorization_endpoint}
            fieldProps={{
              ref: authorizeURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyAuthorizeURL(authorizeURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="Device授权URL"
            disabled
            value={data?.device_authorization_endpoint}
            fieldProps={{
              ref: deviceAuthorizeURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyDeviceAuthorizeURL(deviceAuthorizeURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="OAuth令牌URL"
            disabled
            value={data?.token_endpoint}
            fieldProps={{
              ref: tokenURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyTokenURL(tokenURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="OAuth userinfo URL"
            disabled
            value={data?.userinfo_endpoint}
            fieldProps={{
              ref: userinfoURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyUserinfoURL(userinfoURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="OpenID 配置"
            disabled
            value={discoverURL}
            fieldProps={{
              ref: openidConfigurationURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyOpenidConfigurationURL(openidConfigurationURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="JSON Web Key Set"
            disabled
            value={data?.jwks_uri}
            fieldProps={{
              ref: jwksURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyJwksURL(jwksURLRef.current?.input?.value)} />),
            }}
          />
        </Col>
      </Row>
      <Divider/>
      <Row gutter={[8, 8]} justify="center">
        <Col span={8}><h3>{'SAML'}</h3></Col>
        <Col span={16}>
          <ProFormText
            width="xl"
            label="SAML Protocol URL"
            placeholder=""
            disabled
            value={''}
            fieldProps={{
              ref: samlProtocolURLRef,
              suffix: (<ClipboardButton onCopy={()=> copySamlProtocolURL(samlProtocolURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="SAML Metadata URL"
            placeholder=""
            disabled
            value={''}
            fieldProps={{
              ref: samlMetadataURLRef,
              suffix: (<ClipboardButton onCopy={()=> copySamlMetadataURL(samlMetadataURLRef.current?.input?.value)} />),
            }}
          />
        </Col>
      </Row>
      <Divider/>
      <Row gutter={[8, 8]} justify="center">
        <Col span={8}><h3>{'WS-Federation'}</h3></Col>
        <Col span={16}>
          <ProFormText
            width="xl"
            label="WsFederation Metadata URL"
            placeholder=""
            disabled
            value={''}
            fieldProps={{
              ref: wsfedMetadataURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyWsfedMetadataURL(wsfedMetadataURLRef.current?.input?.value)} />),
            }}
          />
          <ProFormText
            width="xl"
            label="WsFederation Sign-in URL"
            placeholder=""
            disabled
            value={''}
            fieldProps={{
              ref: wsfedSignInURLRef,
              suffix: (<ClipboardButton onCopy={()=> copyWsfedSignInURL(wsfedSignInURLRef.current?.input?.value)} />),
            }}
          />
        </Col>
      </Row>
    </Card>
  );
};

export default Endpoints;