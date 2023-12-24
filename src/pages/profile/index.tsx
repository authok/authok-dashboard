import React, { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useProfile } from '@/hooks/profile';
import { Menu, Avatar, Row, Col, Select, Descriptions, Card, Dropdown } from 'antd';
import { useTenants } from '@/hooks/tenant';

const ProfileSettings: React.FC = () => {
  const { data: profile } = useProfile();
  console.log('profile: ', profile);

  const { data: tenants } = useTenants();

  const tenantOptions = useMemo(() => tenants?.map(it => ({ label: it.display_name || it.name, value: it.id })), [tenants]);

  const actionMenu = <Menu>
    <Menu.Item key="change_password">
      修改密码
    </Menu.Item>
  </Menu>;

  return <PageContainer 
    className="page-middle"
    extra={[
      <Dropdown.Button type="primary" size="large" overlay={actionMenu}>操作</Dropdown.Button>
    ]}
  >
    <Card bordered={false}>
      <Card>
        <Row gutter={16}>
          <Col>
            <Avatar size={64} src={profile?.picture}/>
          </Col>
          <Col style={{ flex: 1 }}>
            <Descriptions column={3} layout="vertical">
              <Descriptions.Item label={<b>身份提供者</b>}>{profile?.connection}</Descriptions.Item>
              <Descriptions.Item label={<b>用户名</b>}>{profile?.username}</Descriptions.Item>
              <Descriptions.Item label={<b>手机号</b>}>{profile?.phone_number}</Descriptions.Item>
              <Descriptions.Item label={<b>邮箱</b>}>{profile?.email}</Descriptions.Item>
              <Descriptions.Item label={<b>昵称</b>}>{profile?.nickname}</Descriptions.Item>

              <Descriptions.Item label={<b>默认租户</b>}>
                <Select value={profile?.user_metadata?.default_tenant} options={tenantOptions}/>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Card>
    </Card>
  </PageContainer>;
};

export default ProfileSettings;