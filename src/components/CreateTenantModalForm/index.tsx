import React, { useState } from 'react';
import ProForm, {
  ModalForm,
  ProFormGroup,
  ProFormText,
} from '@ant-design/pro-form';
import RegionSelect from '../RegionSelect';
import EnvironmentSelect from '../EnvironmentSelect';
import { COMMMASSEPARATE } from '@/../config/regexp.config';

interface CreateTenantModalFormProps {
  trigger?: JSX.Element;
  visible?: boolean;
  onVisibleChange?: (val: boolean) => void;
  onFinish: (tenant: Partial<API.Tenant>) => Promise<boolean>;
  regions: API.Region[];
}

const CreateTenantModalForm: React.FC<CreateTenantModalFormProps> = ({ visible, onVisibleChange, trigger, onFinish, regions }) => {  
  const baseDomain = '.authok.cn';
  const defaultRegion = 'cn';
  const [domain, setDomain] = useState<string>('.' + defaultRegion + baseDomain);

  return (
    <ModalForm
      title="新建租户"
      trigger={trigger}
      onFinish={onFinish}
      initialValues={{
        region: defaultRegion,
        environment: 'development',
      }}
      visible={visible}
      size="large"
      onVisibleChange={onVisibleChange}
      modalProps={{
        destroyOnClose: true,
      }}
      submitter={{
        searchConfig: {
          submitText: '创建',
        },
      }}
    >
      <ProFormGroup direction="vertical">
        <ProFormText 
          name="name"
          label="租户域名" width="xl" 
          required
          placeholder="只允许英文字母, 数字和-, 且第一个字符不能是数字"
          rules={[
            { required: true, message: '这是必填项' },
            {
              validator: (rule: any, value: string, callback: any) => {
                if (value && !COMMMASSEPARATE.test(value)) {
                  callback('只允许英文字母, 数字和-, 且第一个字符不能是数字');
                  return;
                }
                callback();
              }
            }
          ]}
          fieldProps={{
            addonAfter: domain,
          }}
          extra={<>该域名将被您应用的 API 端点使用. 设置后不可修改.</>}
        />
        <ProFormText 
          name="display_name"
          label="显示名称" 
          width="xl" 
          placeholder="显示名称，32个字符内"
          rules={[
            { required: true, message: '这是必填项' },
          ]}
          extra="显示名称，32个字符内"
        />
        <ProForm.Item name="region" label="区域" required>
          <RegionSelect regions={regions} onChange={(v) => setDomain('.' + v + baseDomain)}/>
        </ProForm.Item>
        <ProForm.Item name="environment" label="环境" required>      
          <EnvironmentSelect />
        </ProForm.Item>
      </ProFormGroup>
    </ModalForm>
  );
}

export default CreateTenantModalForm;