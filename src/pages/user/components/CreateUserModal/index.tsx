import React, { useMemo, useCallback, useState } from 'react';
import { Radio, Row, Col } from 'antd';
import { formatMessage } from 'umi';
import { ModalForm, ProFormCheckbox, ProFormText, ProFormSelect, ProFormDependency } from '@ant-design/pro-form';
import * as _ from 'lodash';
import { nanoid } from 'nanoid';
import { useForm } from 'antd/lib/form/Form';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';

interface CreateUserModalProps {
  title: string;
  trigger?: JSX.Element;
  onFinish: (values: API.User) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ title, trigger, onFinish }) => {
  const { data: connections, loading: loadingConnections } = useResourcePagination(ConnectionEntity, {
    defaultParams: [{ strategy: 'authok', page_size: 100 }],
    formatResult: (page: API.Page<API.Connection>) => page.items,
  });

  const connectionOptions = useMemo(() => connections?.map((it) => ({ label: it.name, value: it.name })), [connections]);

  const [sendFirstLoginAddress, setSendFirstLoginAddress] = useState<boolean>(false);

  const usernamePane = <ProFormText
    label="用户名"
    name="username"
    required
    rules={[
      {
        required: true,
        message: '请输入用户名!'
      },
    ]}
  />;

  const phoneNumberPane = <ProFormText
    label="手机号"
    name="phone_number"
    rules={[
      {
        required: true,
        message: '请输入手机号!',
      },
      {
        message: '手机号码格式错误',
        validator(rule, value) {
          if (!value || (/^[1](([3][0-9])|([4][5-9])|([5][0-3,5-9])|([6][5,6])|([7][0-8])|([8][0-9])|([9][1,8,9]))[0-9]{8}$/
              .test(value))) {
            return Promise.resolve();
          }
          return Promise.reject(Error('手机号码格式错误'));
        }
      }
    ]}
  />;

  const emailPane = <ProFormText
    label="邮箱"
    name="email"
    rules={[
      {
        type: 'email',
        required: true,
        message: '请输入邮箱!',
      },
    ]}
  />;

  const modeOptions = [
    { label: '用户名', value: 'username' },
    { label: '手机号', value: 'phone_number' },
    { label: '邮箱', value: 'email' },
  ];

  const modeRender = {
    username: usernamePane,
    phone_number: phoneNumberPane,
    email: emailPane,
  };

  const defaultMode = 'username';
  const [mode, setMode] = useState<string>(defaultMode);

  const [form] = useForm();

  const handleFinish = (_values: Record<string, any>) => {
    const values = {..._values};
    delete values['confirm_password'];
    return onFinish?.(values);
  };

  const handleChangeMode = useCallback((v) => {
    setMode(v.target.value);
  }, []);

  const handleAutoGeneratePassword = () => {
    const randomPwd = nanoid(16);
    console.log('randomPwd: ', randomPwd);
    
    form.setFieldsValue({
      password: randomPwd,
      confirm_password: randomPwd,
    })
  };

  return (
    <ModalForm
      form={form}
      title={title}
      width={660}
      trigger={trigger}
      autoFocusFirstInput
      initialValues={{
        connection: _.first(connectionOptions)?.value,
      }}
      modalProps={{
        destroyOnClose: true,
      }}
      onFinish={handleFinish}
    >
      <Row style={{ marginBottom: '16px' }}>
        <Radio.Group defaultValue={defaultMode} optionType="button" buttonStyle="solid" options={modeOptions} onChange={handleChangeMode}/>
      </Row>
  
      {modeRender[mode]}

      <ProFormText.Password
        label="密码"
        name="password"
        rules={[
          {
            required: true,
            message: '请输入密码！',
          },
        ]}
        fieldProps={{    
          addonAfter: <a onClick={handleAutoGeneratePassword}>自动生成密码</a>,
        }}
      />
      <ProFormDependency name={['password']}>
      {({ password }) => {
        return <ProFormText.Password
          label="确认密码"
          name="confirm_password"
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
            {
              validator: (_: any, value: string) => {
                const promise = Promise;
                if (value && value !== password) {
                  return promise.reject(formatMessage({ id: 'app.settings.user.password.confirm' }));
                }
                return promise.resolve();
              }
            },
          ]}
        />;
      }}
      </ProFormDependency>
      <ProFormSelect 
        name="connection"
        label="连接"
        loading={loadingConnections}
        options={connectionOptions}
        rules={[{ required: true, message: '必须选择一个数据库身份源' }]}
      />
      <ProFormCheckbox defaultChecked={sendFirstLoginAddress} onChange={(e) => setSendFirstLoginAddress(e.target.checked)}>发送首次登录地址</ProFormCheckbox>
      {mode === 'username' && sendFirstLoginAddress && (
        <Row gutter={16}>
          <Col span={12}>
            {phoneNumberPane}
          </Col>
          <Col span={12}>
            {emailPane}
          </Col>
        </Row>
      )}
      <ProFormCheckbox name="force_reset_password">首次登录时强制修改密码</ProFormCheckbox>
    </ModalForm>
  );
};

export default CreateUserModal;
