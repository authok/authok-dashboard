import React, { useCallback } from 'react';
import { ProFormDependency, ProFormSelect, ProFormText, ProFormList, ModalForm } from '@ant-design/pro-form';
import { Row, Col, Button } from 'antd';
import { useOrganizationEnabledConnections } from '@/hooks/organization';
import { PhoneOutlined, MailOutlined } from '@ant-design/icons';
import { useResourcePagination } from '@/hooks/useResource';
import { ClientEntity, RoleEntity } from '@/api/entities';

interface InviteMembersModalProps {
  trigger: JSX.Element;
  onFinish: (invitations: Partial<API.Invitation>[]) => Promise<boolean>;
  organization: API.Organization;
}

const InviteMembersModal: React.FC<InviteMembersModalProps> = ({ organization, trigger, onFinish }) => {
  const { run: paginateApplications } = useResourcePagination<ClientEntity, API.Application, API.Application[]>(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  });

  const { data: connections } = useOrganizationEnabledConnections(organization.id, {
    manual: false,
    refreshDeps: [organization],
    formatResult: (page: API.Page<API.OrganizationEnabledConnection>) => page.items.map(it => it.connection),
  } as any);

  const { data: roles } = useResourcePagination(RoleEntity, {
    manual: false,
    formatResult: (page: API.Page<API.Role>) => page.items.map(it => ({ label: it.name, value: it.id })),  
  });

  const handleFinish = useCallback((values: any) => {
    try {
      const invitations = [];
      for(const invitation of (values.email_invitations || [])) {
        invitations.push({
          client_id: values.client_id,
          invitee: {
            email: invitation.email as string,
          },
          connection: invitation.connection as string,
          roles: invitation.roles,
        });
      }
  
      for(const invitation of (values.sms_invitations || [])) {
        invitations.push({
          client_id: values.client_id,
          invitee: {
            phone_number: invitation.phone_number,
          },
          connection: invitation.connection,
          roles: invitation.roles,
        });
      }
  
      return onFinish(invitations);
    } catch(e) {
      console.error(e);
      throw e;
    }
  }, [onFinish]);

  return <ModalForm
    size="large"
    trigger={trigger}
    onFinish={handleFinish}
    modalProps={{
      destroyOnClose: true,
    }}
    initialValues={{
      email_invitations: [{}],
    }}
    submitter={{
      render: (props, doms) => {
        // doms[0] 也是取消按钮
        return [
          <Button {...props.resetButtonProps}>取消</Button>,
          <ProFormDependency name={['client_id', 'email_invitations', 'sms_invitations']}>
            {({ client_id, email_invitations, sms_invitations }) => 
              <Button 
                disabled={
                  !client_id || client_id.length === 0 
                  || 
                  ((!email_invitations || email_invitations.length === 0) && (!sms_invitations || sms_invitations.length === 0))
                }
                type="primary" 
                key="submit" 
                onClick={() => props.form?.submit?.()}
              >
                发送邀请
              </Button>
            }
          </ProFormDependency>
        ];
      }
    }}
  >
    <ProFormSelect 
      name="client_id" 
      label="应用"
      rules={[{ required: true, message: '请选择应用' }]}
      showSearch
      filterOption={(input, option) =>
        option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      placeholder="请选择应用"
      request={async () => {
        const applications = await paginateApplications({ page_size: 1000 });
        return applications.map(it => ({ label: it.name, value: it.client_id }));
      }} />
    <ProFormDependency name={['client_id']}>
      {({ client_id }) => 
        <>
          <ProFormList 
            label="通过邮件邀请成员"  
            name="email_invitations"
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '添加更多',
            }}
          >
            <Row style={{ width: 700 }}>
              <Col span={8}>
                <ProFormText 
                  disabled={!client_id || client_id.length === 0} 
                  size="xl" 
                  placeholder="Email" 
                  name="email" 
                  rules={[{ required: true, message: '不能为空' }]} 
                  fieldProps={{
                    prefix: <MailOutlined />,
                  }}
                />
              </Col>
              <Col span={8}>
                <ProFormSelect disabled={!client_id || client_id.length === 0} size="xl" placeholder="请选择连接" name="connection" options={connections?.map(it => ({ label: it.display_name || it.name, value: it.name }))}/>
              </Col>
              <Col span={8}>
                <ProFormSelect 
                  disabled={!client_id || client_id.length === 0} 
                  size="xl" 
                  placeholder="请选择角色" 
                  name="roles" 
                  mode="multiple" 
                  options={roles} 
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }/>
              </Col>
            </Row>          
          </ProFormList>
          <ProFormList 
            label="通过短信邀请成员"  
            name="sms_invitations"
            creatorButtonProps={{
              position: 'bottom',
              creatorButtonText: '添加更多',
            }}
          >
            <Row style={{ width: 700 }}>
              <Col span={8}>
                <ProFormText 
                  disabled={!client_id || client_id.length === 0} 
                  size="xl" 
                  placeholder="手机号" 
                  name="phone_number" 
                  rules={[{ required: true, message: '不能为空' }]}
                  fieldProps={{
                    prefix: <PhoneOutlined />,
                  }}
                />
              </Col>
              <Col span={8}>
                <ProFormSelect disabled={!client_id || client_id.length === 0} size="xl" placeholder="请选择连接" name="connection" options={connections?.map(it => ({ label: it.display_name || it.name, value: it.name }))}/>
              </Col>
              <Col span={8}>
                <ProFormSelect 
                  disabled={!client_id || client_id.length === 0} 
                  size="xl" 
                  placeholder="请选择角色" 
                  name="roles" 
                  mode="multiple" 
                  options={roles}
                  filterOption={(input, option) =>
                    option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }/>
              </Col>
            </Row>          
          </ProFormList>
        </>
      }
    </ProFormDependency>
  </ModalForm>;
};

export default InviteMembersModal;