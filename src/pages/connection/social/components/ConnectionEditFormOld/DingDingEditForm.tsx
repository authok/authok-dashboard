import React from 'react';
import { Alert, Form, Input } from 'antd';
import { ConnectionEditFormProps } from './types';

export const DingDingEditForm: React.FC<ConnectionEditFormProps> = ({ connection, form }) => {
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>钉钉 配置说明</h4>
            <p>请先创建一个 钉钉登录应用再将相关信息填到此处，以下可能是你需要的链接：</p>
            <ol>
              <li>
                1.{' '}
                <a href="https://open-dev.dingtalk.com/#/loginMan">
                  在 钉钉开放平台 中创建 登录 应用
                </a>
              </li>
              <li>
                2. 创建 钉钉登录 应用时填写的 Callback URL 请填写为：
                <br />
                <b>https://core.xauth.lucfish.com/connection/social/dingtalk/用户池 id/callback</b>
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
        <Form.Item name="id" initialValue={connection.provider} hidden />
        <Form.Item name="appID" required label="AppID" rules={[{ required: true }]}>
          <Input placeholder="请填入 钉钉 Connect 提供的 AppID" />
        </Form.Item>
        <Form.Item name="secret" required label="Secret" rules={[{ required: true }]}>
          <Input placeholder="请填入 钉钉 Connect 提供的 Secret" />
        </Form.Item>
        <Form.Item name="callbackURL" required label="callbackURL" rules={[{ required: true }]}>
          <Input placeholder="请填入业务回调链接" />
        </Form.Item>
      </Form>
    </>
  );
};
