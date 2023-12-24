import React, { useCallback, useEffect } from 'react';
import { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { useFactorProvider } from '@/hooks/factor';
import { request } from 'umi';
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity } from '@/api';
import { useTenantDetails } from '@/hooks/tenant';

interface TrySendEmailModalProps {
  connection: API.Connection;
  trigger: JSX.Element; 
}

const TrySendEmailModal: React.FC<TrySendEmailModalProps> = ({ connection, trigger }) => {
  const { run: fetchApplications, data: applications } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  });

  const { data: provider, run: fetchProvider } = useFactorProvider('email', connection.options?.provider, {
    manual: true,
  });

  useEffect(() => {
    if (connection.options?.provider) {
      fetchProvider('email', connection.options?.provider);
    }
  }, [connection]);

  const { data: settings } = useTenantDetails();

  const handleTry = useCallback(async (values: Record<string, any>) => {
    const url = `https://${settings?.domain}/passwordless/start`; 
    const r = await request(url, {
      method: 'POST',
      data: {
        ...values,
        connection: connection.name,
      }
    });
    console.log('r: ', r);

    return true;
  }, [connection]);
  
  return (
    <ModalForm 
      disabled={!applications}
      title={provider ? `通过${provider.title}发送测试登录邮件`: '发送测试登录邮件'}
      size="large"
      trigger={trigger}
      modalProps={{
        centered: true,
      }}
      submitter={{
        searchConfig: {
          submitText: '测试',
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
      initialValues={{
        send: 'code',
      }}
      onFinish={handleTry}
    >
      <ProFormSelect 
        label={<b>应用</b>} 
        name="client_id"
        rules={[{ required: true, message: '请选择应用' }]}
        request={async () => {
          const applications = await fetchApplications({
            client_id: connection.enabled_clients
          });

          return applications.map(it => ({
            label: it.name,
            value: it.client_id,
          }));
        }}
      />
      <ProFormText
        rules={[{ required: true, message: '请输入收件人地址' }]}
        label={<b>收件人地址</b>}
        name="email"
        required
      />
      <ProFormSelect 
        label={<b>模式</b>} 
        name="send"
        options={[
          {
            label: '验证码',
            value: 'code',
          },{
            label: '链接',
            value: 'link',
          }
        ]}
      />
    </ModalForm>
  );
};

export default TrySendEmailModal;