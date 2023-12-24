import { Alert, Button, Form, Input, InputNumber, message, Radio, Spin } from 'antd';
import {
  update as updateChannel,
  getConfig as getSmsConfig,
  updateConfig as updateSmsConfig,
} from '@/services/sms';
import React, { useState } from 'react';
import { useRequest } from 'umi';

interface SMSVerificationServiceProps {}

// 短信验证服务
const SMSVerificationService: React.FC<SMSVerificationServiceProps> = (
  props: SMSVerificationServiceProps,
) => {
  const [smsSelect, setSmsSelect] = useState<string>('');
  // const { data: getSmsChannelData } = useRequest(getSms,);
  const { data: getSmsConfigData, refresh: smsConfigRefresh } = useRequest(getSmsConfig, {
    onError: (e) => {
      console.log('fail', e);
      message.error('服务器错误');
    },
    onSuccess: (data) => {
      console.log('success', data);
    },
  });
  const { data: changeChannelData, run: changeSmsChannelRun } = useRequest(updateChannel, {
    manual: true,
  });
  const { run: updateSmsConfigRun, loading } = useRequest(updateSmsConfig, { manual: true });
  const [form] = Form.useForm();
  const onFinish = async () => {
    console.log('点击保存', form.getFieldsValue());
    const updateSmsConfigData = await updateSmsConfigRun(form.getFieldsValue());
    console.log('保存后返回的数据', updateSmsConfigData);
    if (updateSmsConfigData) {
      message.success('保存成功');
      smsConfigRefresh();
    }
  };

  // 内置短信服务
  const AuthingSms = (
    <>
      <Form.Item label="消息模版">
        <p>{`消息模版{S8} 是你的验证码，有效时间为 {S2} 分钟。如非本人操作请忽略。`}</p>
      </Form.Item>
      <Form.Item label="收费模式">
        <p>
          1. 发送量大于 1000 条请联系客服（微信：xu_zi_qiang）主动充值，否则我们会暂停短信发送权限。
        </p>
        <p>
          2. Authing 的短信供应商为创蓝 253，每条短信价格约 0.03 ~ 0.05 元，
          <a href="https://www.253.com/" target="_blank" rel="noopener noreferrer">
            点击查看创蓝短信官网。
          </a>
        </p>
      </Form.Item>
      <Form.Item label="其他">
        <p>1. 短信接口 QPS 为 100。</p>
        <p>
          2. 网页端建议使用
          <a href="https://haoma.authing.cn" target="_blank" rel="noopener noreferrer">
            小登录
          </a>
          免费获取手机号。
        </p>
      </Form.Item>
    </>
  );

  // 腾讯云短信服务
  const TelSms = (
    <>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '请输入APP ID',
          },
        ]}
        label="APP ID"
        name="smsSdkAppid"
      >
        <Input placeholder="请输入APP ID" />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '请输入秘钥ID',
          },
        ]}
        label="秘钥ID"
        name="secretId"
      >
        <Input placeholder="请输入秘钥ID" />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '请输入秘钥ID',
          },
        ]}
        label="秘钥key"
        name="secretKey"
      >
        <Input placeholder="请输入秘钥key" />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '请输入秘钥key',
          },
        ]}
        label="登录短信签名"
        name="loginSignature"
      >
        <Input placeholder="请输入秘钥key" />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '请输入登录短信模版',
          },
        ]}
        name="loginTemplate"
        label="登录短信模版"
      >
        <Input placeholder="请输入登录短信模版" />
      </Form.Item>
      <Form.Item
        label="登录验证码有效时间"
        rules={[
          {
            required: true,
            message: '登录验证码有效时间',
          },
        ]}
        name="loginExpiresIn"
      >
        <InputNumber defaultValue={60} />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '重置密码短信签名',
          },
        ]}
        label="重置密码短信签名"
        name="resetPasswordSignature"
      >
        <Input placeholder="重置密码短信签名" />
      </Form.Item>
      <Form.Item
        required
        rules={[
          {
            required: true,
            message: '重置密码短信模版',
          },
        ]}
        label="重置密码短信模版"
        name="resetPasswordTemplate"
      >
        <Input placeholder="重置密码短信模版" />
      </Form.Item>
      <Form.Item
        rules={[
          {
            required: true,
            message: '重置密码验证码有效时间',
          },
        ]}
        label="重置密码验证码有效时间
"
        name="resetPasswordExpiresIn"
      >
        <InputNumber defaultValue={60} />
      </Form.Item>
      <Form.Item style={{ marginTop: '60px' }}>
        <Button
          type="primary"
          onClick={() => {
            form.submit();
          }}
        >
          保存
        </Button>
      </Form.Item>
    </>
  );

  const renderForm = (type: string) => {
    switch (type) {
      case 'authing':
        return AuthingSms;
      case 'qcloud':
        return TelSms;
      default:
        break;
    }
    return <></>;
  };

  if (getSmsConfigData) {
    console.log('gg', getSmsConfigData);
    form.setFieldsValue(getSmsConfigData);
  }
  return (
    <Spin spinning={loading}>
      <Alert message="让用户能够使用以短信形式发送到其手机上的一次性密码登录" type="info" />
      <div style={{ height: '24px' }} />
      <Form
        form={form}
        labelCol={{ span: 4 }}
        onFinish={onFinish}
        labelAlign="left"
        initialValues={getSmsConfigData}
      >
        <Form.Item label="当前服务类型">
          <Radio.Group
            defaultValue="qcloud"
            value={smsSelect}
            onChange={async (e) => {
              console.log('切换渠道');
              await changeSmsChannelRun(e.target.value);
              console.log('data', changeChannelData);
              setSmsSelect(e.target.value);
            }}
          >
            <Radio.Button value="qcloud">腾讯云短信服务</Radio.Button>
          </Radio.Group>
        </Form.Item>
        {renderForm(smsSelect)}
      </Form>
    </Spin>
  );
};

export default SMSVerificationService;
