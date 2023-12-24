import React from 'react';

export const WeiboEditForm = (props) => {
  const { app, form } = props;
  const optionsList = [
    { label: 'follow_app_official_microblog', value: 'follow_app_official_microblog' },
    { label: 'statuses_to_me_read', value: 'statuses_to_me_read' },
    { label: 'friendships_groups_write', value: 'friendships_groups_write' },
    { label: 'friendships_groups_read', value: 'friendships_groups_read' },
    { label: 'invitation_write', value: 'invitation_write' },
    { label: 'direct_messages_read', value: 'direct_messages_read' },
    { label: 'direct_messages_write', value: 'direct_messages_write' },
    { label: 'email', value: 'email' },
  ];
  return (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>新浪微博 配置说明</h4>
            <p>请先创建一个 新浪微博 应用再将相关信息填到此处，以下可能是你需要的链接：</p>
            <ol>
              <li>
                1. <a href="https://open.weibo.com/developers">在 新浪微博 中创建应用</a>
              </li>
              <li>
                2. 创建 新浪微博 应用时填写的 Callback URL 请填写为：
                <br />
                <b>https://core.xauth.lucfish.com/connection/social/weibo/用户池 id/callback</b>
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
        <Form.Item name="appID" required label="AppID" rules={[{ required: true }]}>
          <Input placeholder="请填入 新浪微博 提供的 AppID" />
        </Form.Item>
        <Form.Item name="secret" required label="Secret" rules={[{ required: true }]}>
          <Input placeholder="请填入 新浪微博 提供的 Secret" />
        </Form.Item>
        <Form.Item name="callbackURL" rules={[{ required: true }]}>
          <Input placeholder="请填入业务回调链接" />
        </Form.Item>
        <Form.Item name="scopes" required label="Scopes">
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
