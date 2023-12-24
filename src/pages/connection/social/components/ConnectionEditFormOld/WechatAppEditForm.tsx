import React from 'react';

export const WechatAppEditForm = (props) => {
  const { app, form } = props;
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>小程序登录 配置说明</h4>
            <p>
              请先前往
              <a
                href="https://docs.authing.cn/social-login/web/wechatwork-corp-qrconnect.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                微信公众平台
              </a>
              注册小程序账号。。
            </p>
            <ol>
              <li>
                1. 在 <b>开发</b> - <b>开发设置</b> 页面获取 AppId 和 AppSecret ，并填入下方的表单
              </li>
              <li>
                2. 如果你的应用需要获取用户手机号，请先进行微信认证。（ <b>设置</b> -{' '}
                <b>基本设置</b> ）
              </li>
            </ol>
          </>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        {' '}
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
      <Form layout="vertical" form={form}>
        <Form.Item name="id" initialValue={app.provider} hidden />
        <Form.Item name="appID" required label="AppID" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的AppID" />
        </Form.Item>
        <Form.Item name="appSecret" required label="AppSecret" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的AppSecret" />
        </Form.Item>
      </Form>
    </>
  );
};
