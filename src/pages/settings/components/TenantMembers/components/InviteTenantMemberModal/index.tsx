import React, { useEffect } from 'react';

import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { MailOutlined } from '@ant-design/icons';
import { Form, Checkbox, Row } from 'antd';
import { useTenantRolePagination } from '@/hooks/tenant';

interface InviteTenantMemberModalProps {
  trigger: JSX.Element;
  onFinish?: (values: API.Invitation) => Promise<boolean>;
}

const InviteTenantMemberModal: React.FC<InviteTenantMemberModalProps> = ({ trigger, onFinish }) => {
  const { data: roles } = useTenantRolePagination({
    formatResult: (page: API.Page<API.Role>) => page.items,
  });

  return <ModalForm<API.Invitation>
    size="large"  
    trigger={trigger}
      modalProps={{
        centered: true,
        destroyOnClose: true,
      }}
      onFinish={onFinish}
      initialValues={{
        roles: roles?.map(it => it.id),
        client_id: AUTHOK_CLIENT_ID,
      }}
    >
      <Form.Item name="client_id" hidden></Form.Item>
      <ProFormText 
        label={<b>Email</b>}
        fieldProps={{
          prefix: <MailOutlined />,
        }}
        name={['invitee', 'email']}
        rules={[
          { required: true, message: '请输入被邀请成员邮箱' }
        ]}
      />
      <Form.Item name="roles">
        <Checkbox.Group>
          {roles?.map((role, i) => (
            <Row>
              <Checkbox key={i} value={role.id}>
                <Row><b>{role.name}</b></Row>
                <Row>{role.description}</Row>
              </Checkbox>
            </Row>
          ))}
        </Checkbox.Group>
      </Form.Item>
    </ModalForm>;
};

export default InviteTenantMemberModal;