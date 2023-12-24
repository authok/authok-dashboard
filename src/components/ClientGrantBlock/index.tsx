import React, { useCallback, useMemo } from 'react';
import { Card, Form, message } from 'antd';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PermissionSelectList } from '@/components/PermissionSelectList';
import { useResourceUpdate } from '@/hooks/useResource';
import { ClientGrantEntity } from '@/api';

interface ClientGrantBlockProps {
  clientGrant: API.ClientGrant;
  resourceServer: API.ResourceServer;
  refresh?: () => void;
}

const ClientGrantBlock: React.FC<ClientGrantBlockProps> = ({ clientGrant, resourceServer, refresh }) => {
  const { run: updateClientGrant } = useResourceUpdate(ClientGrantEntity);

  const handleUpdateClientGrant = useCallback(async (values: API.ClientGrant) => {
    await updateClientGrant(clientGrant.id, values);
    message.success('更新授权成功');
    refresh?.();
    return true;
  }, [clientGrant]);

  const permissions = useMemo<Partial<API.Permission>[]>(
    () => 
      resourceServer.scopes?.map(it => ({ 
        permission_name: it.value, 
        resource_server_identifier: resourceServer.identifier, 
        descirption: it.description,
      })) || [], 
    [resourceServer],
  );

  const [form] = Form.useForm();
  
  return <Card>
    <ProForm<API.ClientGrant> 
      size="large"
      form={form}
      onFinish={handleUpdateClientGrant}
      initialValues={clientGrant}
      submitter={{
        searchConfig: {
          submitText: '更新',
        },
        resetButtonProps: {
          style: {
            display: 'none',
          },
        },
      }}
    >
      <ProFormText disabled label="授权 ID" value={clientGrant.id} />

      <Form.Item name="scope" />

      <PermissionSelectList 
        rowKey="permission_name" 
        permissions={permissions} 
        rowSelection={{
          selectedRowKeys: clientGrant.scope,
          onChange: (keys: React.Key[]) => {
            form.setFieldsValue({
              "scope": keys,
            });
          },
        }}
      />
    </ProForm>
  </Card>;
};

export default ClientGrantBlock;