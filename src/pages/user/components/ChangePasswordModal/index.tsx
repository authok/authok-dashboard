import React from 'react';

import {
  ModalForm,
  ProFormText,
  ProFormDependency,
} from '@ant-design/pro-form';
import { useIntl } from 'umi';
import * as _ from 'lodash';

export interface ChangePasswordModalProps {
  trigger?: JSX.Element;
  onFinish: (data: { password: string; }) => Promise<boolean>
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  trigger,
  onFinish,
}) => {
  const { formatMessage } = useIntl();

  const handleFinish = async (_values: Record<string, any>): Promise<boolean> => {
    const values = _.pick(_values, 'password');
    return await onFinish?.(values);
  };

  return (
    <ModalForm 
      title={"修改密码"}
      trigger={trigger}
      autoFocusFirstInput
      size="large"
      modalProps={{
        destroyOnClose: true,
        centered: true,
      }}
      onFinish={handleFinish}
    >
      <ProFormText.Password
        name="password" 
        label="新密码" 
        placeholder="请输入密码" 
        rules={[{ required: true, message: '不能为空!' }]}
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
    </ModalForm>
  );
};

export default ChangePasswordModal;