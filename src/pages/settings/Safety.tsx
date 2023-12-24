import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Input, InputNumber, message } from 'antd';
import './Safety.less';
import { connect, ConnectProps, useRequest } from 'umi';
import { update } from '../../services/tenant';

interface UserpoolsSafetyProps extends ConnectProps {
  tenant?: API.Tenant
}

const Safety: React.FC<UserpoolsSafetyProps> = (props: UserpoolsSafetyProps) => {
  const [safetyForm] = Form.useForm();
  useEffect(() => {
    // console.log('props', props.userpool)
  }, [])

  const { run: userpoolSafetyRun, loading: userpoolSafetyLoading } = useRequest(update, { manual: true })
  const updateSafetyHandler = async () => {
    const input = safetyForm.getFieldsValue()
    await userpoolSafetyRun(input);
    message.success('更新成功')
  }

  return (
    <PageContainer style={{ backgroundColor: '#fff' }}>
      <div className='content'>
        <Form form={safetyForm} labelCol={{ span: 8 }} labelAlign="left"
          onFinish={updateSafetyHandler}
          initialValues={props.tenant}
        >
          <Form.Item extra="安全域（Allowed Origins） 是允许从 JavaScript 向 Authing API 发出请求的 URL（通常与 CORS 一起使用）。 默认情况下，系统会允许你使用所有网址。 如果需要，此字段允许你输入其他来源。 你可以通过逐行分隔多个有效 URL，并在子域级别使用通配符（例如：https://*.sample.com）。 验证这些 URL 时不考虑查询字符串和哈希信息，如果带上了查询字符串和哈希信息系统会自动忽略整个域名。"
            label="安全域（CORS）"
            name='allowedOrigins'
          >
            <Input.TextArea autoSize={{ minRows: 4 }} placeholder='(CORS)，多个请用换行符分割，如：
https://authing.cn
https://*.authing.cn' />
          </Form.Item>
          <Form.Item label="JWT 有效时间（秒)" name='tokenExpiresAfter'>
            <InputNumber />
          </Form.Item>
          <Form.Item label="禁止注册" name='registerDisabled'>
            {/* <Switch onChange={updateSafetyHandler} /> */}
          </Form.Item>
          <Form.Item style={{ marginTop: '60px' }}>
            <Button type="primary" onClick={() => { safetyForm.submit() }}>
              保存
          </Button>
          </Form.Item>
        </Form>
      </div>

    </PageContainer >
  );
};



export default connect(({ userpool }: { userpool: UserPoolModelState }) =>
  userpool ? {
    userpool: userpool.current,
  } : {}
)(Safety);