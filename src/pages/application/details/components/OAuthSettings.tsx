import React from 'react';
import ProForm, { ProFormSwitch, ProFormList, ProFormText, ProFormSelect } from '@ant-design/pro-form';

const OAuthSettings: React.FC = () => {
  return (
    <ProForm.Group style={{marginTop: '16px'}} direction="vertical">
      <ProFormList 
        name="allowed_clients"
        label={"允许的 APP"}
        creatorButtonProps={{
         position: 'bottom',
         creatorButtonText: '添加',
        }}
        copyIconProps={false}
        extra="允许转发代理请求的应用程序/API。默认所有应用程序都被允许。"
      >
        <ProFormText name="client_id" width="xl" placeholder="应用的client_id" rules={[{ required: true, message: '不能为空' }]}/>
      </ProFormList>
      <ProFormSelect
        label="JSON Web Token (JWT) 签名算法"
        width="xl"
        options={[
          {
            label: 'RS256',
            value: 'RS256',
          },
          {
            label: 'HS256',
            value: 'HS256',
          }
        ]}
        extra={"指定JSON Web Token的签名算法: HS256: JWT 将会用 client secret 进行签名. RS256: JWT 将会用私钥进行签名，用公钥进行验证(参考 证书 - 签名证书)."}
      />
      <ProFormSwitch
        label="信任令牌端点 IP Header"
        extra="信任在 `authok-forwarded-for` header中指定的IP为终端用户IP, 用于保护令牌端点的暴力访问."
      />
      <ProFormText 
        label="跨域验证 Fallback"
        width="xl" placeholder="https://domain.tld/path"
        extra={"当浏览器未启用第三方cookie时，会在iframe中加载执行令牌验证的URL。必须和嵌入的登录表单是相同的域，并且必须采用https."}
      />
    </ProForm.Group>
  );
};

export default OAuthSettings;