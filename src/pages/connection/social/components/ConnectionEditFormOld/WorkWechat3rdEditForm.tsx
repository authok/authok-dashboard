import React, { forwardRef, useImperativeHandle } from 'react';
import { Alert, Form, Input } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { ConnectionEditFormProps } from './types';

// 企业微信 第三方应用
export const WorkWechat3rdEditForm: React.FC<ConnectionEditFormProps> = forwardRef(
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
              <h4>企业微信（第三方应用）网页授权登录 配置说明</h4>
              <p>
                请按照以下指引接入企业微信（第三方应用）网页授权登录，详细文档请见
                <a
                  href="https://docs.authing.cn/social-login/web/wechatwork-corp-qrconnect.html"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  企业微信（第三方应用）网页授权登录
                </a>
                。
              </p>
              <ol>
                <li>1. 注册 Authing 开发者账</li>
                <li>2. 注册一个企业微信帐号</li>
                <li>3. 在 Authing 控制台填入企业微信相关信息</li>
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
        <Form layout="vertical" form={form} initialValues={connection.config} onFinish={onSubmit}>
          <Form.Item name="corpID" required label="CorpID" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的CorpID" />
          </Form.Item>
          <Form.Item name="suiteID" required label="SuiteID" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的SuiteID" />
          </Form.Item>
          <Form.Item name="suiteSecret" required label="SuiteSecret" rules={[{ required: true }]}>
            <Input placeholder="请输入企业微信应用的SuiteSecret" />
          </Form.Item>
          <Form.Item name="token" required label="Token" rules={[{ required: true }]}>
            <Input placeholder="请输入回调配置的Token" />
          </Form.Item>
          <Form.Item
            name="encodingAESKey"
            required
            label="EncodingAESKey"
            rules={[{ required: true }]}
          >
            <Input placeholder="请输入回调配置的EncodingAESKey" />
          </Form.Item>
          <Form.Item name="txtFilename" required label="Txt Filename" rules={[{ required: true }]}>
            <Input placeholder="域名所有权验证文件名" />
          </Form.Item>
          <Form.Item name="txtContent" required label="Txt Content" rules={[{ required: true }]}>
            <Input placeholder="域名所有权验证文件内容" />
          </Form.Item>
          <Form.Item name="redirectURL" required label="Redirect URL" rules={[{ required: true }]}>
            <Input placeholder="业务回调链路" />
          </Form.Item>
        </Form>
      </>
    );
  },
);
