import { Button, Col, Drawer, Form, Input, Row } from 'antd';
import React, { useEffect } from 'react';

interface CreateEnterpriseProps {
  visable: boolean;
  initvalues: Partial<API.Connection>;
  onClose?: () => void;
  onOk?: (data: any) => void;
}

const CreateEnterprise: React.FC<CreateEnterpriseProps> = (props) => {
  const [form] = Form.useForm();
  useEffect(() => {
    form.resetFields();
    if (props.initvalues) {
      console.log('props.initvalues', props.initvalues);
      form.setFieldsValue(props.initvalues);
    }
  }, [props.visable]);
  // 提交表单
  const handleSubmit = async () => {
    await form.validateFields();
    const formData = form.getFieldsValue();
    if (props.onOk) props.onOk(formData);
    if (props.onClose) props.onClose();
  };
  return (
    <Drawer
      title="连接 OIDC 身份源"
      visible={props.visable}
      placement="right"
      closable={false}
      width={720}
      destroyOnClose
      onClose={props.onClose}
      footer={
        <div
          style={{
            textAlign: 'right',
          }}
        >
          <Button onClick={props.onClose} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button onClick={handleSubmit} type="primary">
            保存
          </Button>
        </div>
      }
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={24}>
            {/* <Form.Item hidden name='action'><Input /></Form.Item> */}
            <Form.Item
              required
              rules={[{ required: true, message: '请输入连接标志符' }]}
              extra="这是此连接的唯一标志符，设置之后不能修改。"
              name="identifier"
              label="连接标志符"
            >
              <Input disabled={!!props.initvalues.identifier} placeholder="请输入应用名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              required
              rules={[{ required: true, message: '请输入显示名称' }]}
              name="displayName"
              label="显示名称"
              extra='如果设置，Authing 登录表单将会显示一个 "使用 {Display Name} 登录" 的按钮'
            >
              <Input />
            </Form.Item>
          </Col>
        </Row>
        {/* <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item
                            name="logo"
                            label="应用 Logo"
                        >
                            <Input placeholder="请输入以 http:// 或 https:// 开头的合法回调链接，如果有多个用 ',' 分开" />
                        </Form.Item>
                    </Col>
                </Row> */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              required
              extra="你想要连接的 OpenID Connect provider 的 Issuer URL"
              rules={[
                {
                  required: true,
                  message: '请输入你想要连接的 OpenID Connect provider 的 Issuer URL',
                },
                { type: 'url', message: '请输入合法的 Issuer URL' },
              ]}
              name="config_issuerUrl"
              label="Issuer URL"
            >
              <Input placeholder="id.mydomain.com/.well-known/openid-configuration" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              required
              extra="OpenID Connect provider 的 Client ID"
              rules={[{ required: true, message: '请输入 Client ID' }]}
              name="config_clientId"
              label="Client ID"
            >
              <Input placeholder="id.mydomain.com/.well-known/openid-configuration" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item
              extra="你需要将此 OIDC 身份源 的回调链接设置为 https://core.xauth.cn/connections/oidc/callback ，请查看你的 OIDC 身份源 的文档说明。"
              name="callback"
              label="Callback URL"
            >
              <Input disabled placeholder="https://core.xauth.cn/connection/oidc/callback" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
export default CreateEnterprise;
