import React from 'react';
import { Alert, Input, Checkbox, Row, Form } from 'antd';

export const QQEditForm = (props) => {
  const { app, form } = props;
  const optionsList = [
    { label: 'get_user_info', value: 'get_user_info' },
    { label: 'list_photo', value: 'list_photo' },
    { label: 'add_album', value: 'add_album' },
    { label: 'list_album', value: 'list_album' },
    { label: 'upload_pic', value: 'upload_pic' },
    { label: 'get_vip_rich_info', value: 'get_vip_rich_info' },
    { label: 'get_vip_info', value: 'get_vip_info' },
  ];
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>QQ 配置说明</h4>
            <p>请先创建一个 QQ 互联应用再将相关信息填到此处，以下可能是你需要的链接：</p>
            <ol>
              <li>
                1.{' '}
                <a
                  href="https://connect.qq.com/index.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  在 QQ 互联 中创建应用
                </a>
              </li>
              <li>
                2. 创建 QQ 互联 应用时填写的 Callback URL 请填写为：
                <br />
                <b>https://core.xauth.lucfish.com/connection/social/qq/用户池 id/callback</b>
              </li>
              <li>3. 本窗口中的 Redirect 请填写你的实际业务地址</li>
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
        <Form.Item name="APPID" required label="APP ID" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的AppID" />
        </Form.Item>
        <Form.Item name="APP Key" required label="APP Key" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的AppSecret" />
        </Form.Item>
        <Form.Item name="callbackURL" required label="callbackURL" rules={[{ required: true }]}>
          <Input placeholder="请输入企业微信应用的callbackURL" />
        </Form.Item>
        <Form.Item name="Scopes" required label="Scopes">
          <Checkbox.Group>
            <Row>
              {optionsList.map((o) => (
                <Col span={8}>
                  <Checkbox value={o.value}>{o.label}</Checkbox>
                </Col>
              ))}
            </Row>
          </Checkbox.Group>
        </Form.Item>
      </Form>
    </>
  );
};
