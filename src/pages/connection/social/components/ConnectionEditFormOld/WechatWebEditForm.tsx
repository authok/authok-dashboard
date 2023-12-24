import React from 'react';

// 移动微信 网页授权登录
export const WechatWebEditForm = (props) => {
  const { app, form } = props;
  const optionsWithDisabled = [
    { label: 'snsapi_base', value: 'snsapi_base' },
    { label: 'snsapi_userinfo', value: 'snsapi_userinfo' },
  ];
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>移动微信网页授权登录 配置说明</h4>
            <p>
              一、请先注册微信公众号（必须为服务号）再将相关信息填到此处，以下可能是你需要的链接：
            </p>
            <ol>
              <li>
                <a href="https://mp.weixin.qq.com/">1. 注册微信公众平台</a>
              </li>
              <li>
                2. 在微信公众平台后台的设置 -&gt; 公众号设置 -&gt; 功能设置 页面添加网页授权域名：
                <br />
                <b>core.xauth.lucfish.com</b>
              </li>
              <li>3. 本窗口中的 Redirect 请填写你的实际业务地址</li>
            </ol>
            <p>二、第一次添加授权域名时需要进行检验</p>
            <ol>
              <li>
                1. 微信公众平台后台 设置 -&gt; 公众号设置 -&gt; 功能设置页面点击设置 网页授权域名
                ，下载 txt 文件
              </li>
              <li>2. 此处的 Txt Filename 请填写 txt 文件名，格式为 MP_verify_xxxx.txt。</li>
              <li>3. 此处的 Txt Content 请填写 txt 文件的内容，一般为 10-20 个随机字符串。</li>
            </ol>
            <p>三、使用代码接入</p>
            <ol>
              <li>
                1.{' '}
                <a href="https://docs.authing.cn/social-login/web/wechatmp-login.html">
                  快速接入微信移动网页登录
                </a>
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
        <Form.Item name="callbackURL" required label="callbackURL" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的callbackURL" />
        </Form.Item>
        <Form.Item name="txtFilename" required label="Txt Filename" rules={[{ required: true }]}>
          <Input placeholder="域名所有权验证文件名" />
        </Form.Item>
        <Form.Item name="txtContent" required label="Txt Content" rules={[{ required: true }]}>
          <Input placeholder="域名所有权验证文件内容" />
        </Form.Item>
        <Form.Item name="scopes" required label="Scopes">
          <Checkbox.Group options={optionsWithDisabled} defaultValue={['Apple']} />
        </Form.Item>
      </Form>
    </>
  );
};
