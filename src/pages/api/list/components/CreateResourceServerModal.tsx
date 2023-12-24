import React from 'react';

import {
  ModalForm,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';

export interface CreateResourceServerModalProps {
  title: string;
  trigger?: JSX.Element;
  onFinish: (formData: Partial<API.ResourceServer>) => Promise<boolean | void>
  loading: boolean;
}

const signingAlgOptions = [
  {
    label: 'RS256',
    value: 'RS256',
  },
  {
    label: 'HS256',
    value: 'HS256',
  }
];

const CreateResourceServerModal: React.FC<CreateResourceServerModalProps> = ({
  title,
  trigger,
  onFinish,
  loading,
}) => {
  return (
    <ModalForm 
      title={title}
      size="large"
      trigger={trigger}
      autoFocusFirstInput
      loading={loading}
      initialValues={{
        signing_alg: 'RS256',
        skip_consent_for_verifiable_first_party_clients: true,
      }}
      modalProps={{
        centered: true,
        destroyOnClose: true,
      }}
      submitter={{
        searchConfig: {
          submitText: '创建',
        },
      }}
      onFinish={onFinish}
    >
      <ProFormText 
        name="name" label="名称" placeholder="请输入名称" 
        rules={[{ required: true, message: '请输入API名称!' }]}
        extra="稍后可以在API设置中修改名称."
      />
      <ProFormText 
        name="identifier" label="Identifier" placeholder="https://your-api-endpoint/" 
        rules={[{ required: true, message: '不能为空!' }]}
        extra="API的逻辑标识符. 推荐使用URL, 此URL不需要公开可访问. 设置后不可修改."
      />
      <ProFormSelect 
        name="signing_alg" label="签名算法"
        options={signingAlgOptions}
        rules={[{ required: true, message: '不能为空!' }]}
        extra="令牌签名算法. RS256 将会采用 Authok 的私钥进行签名."
      />
      
    </ModalForm>
  );
};

export default CreateResourceServerModal;