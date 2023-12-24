import React, { useCallback } from 'react';
import { Dropdown, Menu, Row, Col } from 'antd';
import { DownOutlined, SettingOutlined, PlusOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import CreateTenantModalForm from '../CreateTenantModalForm';
import styles from './index.less';
import { useAuthok } from '@authok/authok-react';
import { useTenantDetails, useTenantCreate } from '@/hooks/tenant';
import { useTenants } from '@/hooks/tenant';
import PageLoading from '../PageLoading';
import useTenantContext from '@/providers/tenant/useTenantContext';

const regions = [{
  display_name: '中国',
  name: 'cn',
}, {
  display_name: '日本',
  name: 'jp',
}, {
  display_name: '美国',
  name: 'us',
}];

const TenantDropdown: React.FC = () => {
  const { user } = useAuthok();
  const { switchTenant } = useTenantContext();
  const { data: tenantSettings } = useTenantDetails();

  if (!user) {
    return <PageLoading />;
  }

  const { run: create } = useTenantCreate();

  const { data: tenants } = useTenants({
    cacheKey: 'tenants',
    cacheTime: 3000,
  });

  const handleCreateTenant = useCallback(async (values: Partial<API.Tenant>): Promise<boolean> => {
    console.log('创建租户: ', values);
    const tenant = await create(values);

    // switch tenant
    switchTenant(tenant);

    return true;
  }, []);

  const menu = (
    <Menu style={{ width: '280px' }}>
      <div key="0" style={{ padding: '5px 15px' }}>
        <h3>{tenantSettings?.region} {tenantSettings?.name}</h3>
      </div>
      <Menu.Item key="1" icon={<SettingOutlined />}>
        设置
      </Menu.Item>
      <Menu.Item key="2" icon={<UserAddOutlined />}>
        邀请成员
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3" icon={<SettingOutlined />}>
        配额
      </Menu.Item>
      <Menu.Divider />
      <CreateTenantModalForm 
        onFinish={handleCreateTenant}
        regions={regions}
        trigger={
          <Menu.Item key="4" icon={<PlusOutlined />}>
            创建租户
          </Menu.Item>
        }
      />
      <Menu.Divider />
      <SubMenu key="a2" title="切换租户" icon={<SwapOutlined className="ant-dropdown-menu-item-icon" />}>
        {tenants?.map(tenant => (
          <Menu.Item key={tenant.name} onClick={() => switchTenant(tenant)}>{tenant.display_name || tenant.name}</Menu.Item>
        ))}
      </SubMenu>
    </Menu>
  );

  return (
    <>     
      <Dropdown overlay={menu} trigger="click" placement="bottomLeft">
        <Row className={styles.action} gutter={8} style={{ color: '#FFFFFF', minWidth: '120px', height: '100%' }}>
          <Col span={20}>
            {tenantSettings?.name}
          </Col>
          <Col span={4}>
            <Row justify="end" align="middle">
              <DownOutlined />
            </Row>
          </Col>
        </Row>
      </Dropdown>
    </>
  );
};

export default TenantDropdown;