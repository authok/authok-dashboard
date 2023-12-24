import React from 'react';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

interface CreateRoleModalProps {
  loading: boolean;
  onFinish: (role: Partial<API.Role>) => void;
  trigger: JSX.Element;
}

const CreateRoleModal: React.FC<CreateRoleModalProps> = ({ trigger, loading, onFinish }) => {
  return <ModalForm
    title="创建角色"  
    loading={loading}    
    onFinish={onFinish}
    trigger={trigger}
    size="large"
    modalProps={{
      centered: true,
      destroyOnClose: true,
    }}
    submitter={{
      searchConfig: {
        submitText: '创建',
      },
    }}
  >
    <ProFormText 
      name="name" 
      label="角色名称" 
      placeholder="角色名称" 
      rules={[{ required: true, message: '角色名称不允许为空' }]}
    />
    <ProFormText name="description" label="角色描述" placeholder="角色描述" rules={[{ required: true, message: '角色描述不允许为空' }]}/>
  </ModalForm>
};

export default CreateRoleModal;