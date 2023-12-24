import React, { forwardRef, useImperativeHandle } from 'react';
import { Input, Alert, Form } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ConnectionEditFormProps } from './types';

// 企业微信 扫码登录
export const WorkWechatQrEditForm: React.FC<ConnectionEditFormProps> = forwardRef(
  ({ connection, onSubmit }, ref) => {
    const [form] = useForm();

    useImperativeHandle(ref, () => ({
      submit() {
        return form.submit();
      },
    }));

    return (
      <>
        <Alert
          style={{ marginBottom: '12px' }}
          type="info"
          message={
            <>
              <h4>企业微信（企业内部）扫码登录 配置说明</h4>
              <p>
                请按照以下指引接入企业微信（企业内部）扫码登录，详细文档请见
                <a
                  href="https://docs.authing.cn/social-login/web/wechatwork-corp-
          .html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  企业微信（企业内部）扫码登录
                </a>
                。
              </p>
              <ol>
                <li>1. 注册 Authing 开发者账</li>
                <li>2. 注册一个企业微信帐号</li>
                <li>3. 注册一个企业微信帐号</li>
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
        <Form form={form} layout="vertical" onFinish={onSubmit} initialValues={connection.config}>
          <Form.Item name="corpID" required label="CorpID" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的CorpID" />
          </Form.Item>
          <Form.Item name="agentID" required label="AgentID" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的AgentID" />
          </Form.Item>
          <Form.Item name="secret" required label="Secret" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的Secret" />
          </Form.Item>
          <Form.Item name="redirectURL" required label="Redirect URL" rules={[{ required: true }]}>
            <Input placeholder="回调链路" />
          </Form.Item>
        </Form>
      </>
    );
  },
);
