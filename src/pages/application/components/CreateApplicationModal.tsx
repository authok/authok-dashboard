import React, { useRef } from 'react';

import { CheckCard } from '@ant-design/pro-card';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormInstance,
} from '@ant-design/pro-form';
import Avatar from 'antd/lib/avatar/avatar';

export interface CreateApplicationModalProps {
  title: string;
  trigger?: JSX.Element;
  onFinish: (formData: Partial<API.Application>) => Promise<boolean | void>
  loading: boolean;
}

const app_type_2_method = {
  native: 'none',
  spa: 'none',
  non_interactive: 'client_secret_post',
  web: 'client_secret_post',
};

const CreateApplicationModal: React.FC<CreateApplicationModalProps> = ({
  title,
  trigger,
  onFinish,
  loading,
}) => {
  const formRef = useRef<ProFormInstance>();
  return (
    <ModalForm 
      formRef={formRef}  
      title={title}
      trigger={trigger}
      autoFocusFirstInput
      loading={loading}
      initialValues={{
        app_type: 'native',
      }}
      modalProps={{
        destroyOnClose: true,
        onCancel: () => console.log('run'),
      }}
      onFinish={onFinish}
    >
      <ProFormText 
        name="name" label="名称" placeholder="请输入名称" 
        rules={[{ required: true, message: '请输入应用名称!' }]}
        extra="稍后可以在应用设置中修改应用名称."
      />
      <ProForm.Item name="app_type" label="应用类型">
        <CheckCard.Group style={{ width: '100%' }} onChange={(v) => formRef.current?.setFieldsValue({ token_endpoint_auth_method: app_type_2_method[v]})}>
          <CheckCard
            style={{ width: 172, height: 320 }}
            title="原生应用" 
            avatar={
              <Avatar
                src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                size="default"
              />
            }
            description={<>
              <p>运行在 手机, 客户端, 命令行, 小型设备 的原生应用</p>
            </>} 
            value="native" 
          />
          <CheckCard
            style={{ width: 172, height: 320 }}
            title="单页应用" 
            avatar={
              <Avatar
                src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                size="default"
              />
            }
            description="用 React, Vue, Angular等技术构建的WEB单页应用"
            value="spa" 
          />
          <CheckCard 
            style={{ width: 172, height: 320 }} 
            avatar={
              <Avatar
                src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                size="default"
              />
            }
            title="常规WEB应用" 
            description="用 Node.JS Express/Koa/Nest.js, Java Spring MVC 等构建的WEB应用" 
            value="web" 
          />
          <CheckCard 
            style={{ width: 172, height: 320 }} 
            title="M2M应用" 
            avatar={
              <Avatar
                src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg"
                size="default"
              />
            }
            description="应用API调用" 
            value="non_interactive" />
        </CheckCard.Group>
      </ProForm.Item>
      <ProFormText name="token_endpoint_auth_method" hidden={true}/>
    </ModalForm>
  );
};

export default CreateApplicationModal;