import React from 'react';

import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';

export interface CreateOrganizationModalProps {
  title: string;
  trigger?: JSX.Element;
  onFinish: (formData: Partial<API.Organization>) => Promise<boolean | void>
}

const CreateOrganizationModal: React.FC<CreateOrganizationModalProps> = ({
  title,
  trigger,
  onFinish,
}) => {
  return (
    <ModalForm 
      title={title}
      size="large"
      trigger={trigger}
      autoFocusFirstInput
      initialValues={{
      }}
      modalProps={{
        centered: true,
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={onFinish}
    >
      <ProFormText 
        name="name" label="标识符" placeholder="请输入标识符" 
        rules={[{ required: true, message: '请输入组织标识符!' }]}
      />
      <ProFormText 
        name="display_name" label="名称" placeholder="请输入组织名称" 
        rules={[{ required: true, message: '请输入组织名称!' }]}
      />
    </ModalForm>
  );
};

export default CreateOrganizationModal;