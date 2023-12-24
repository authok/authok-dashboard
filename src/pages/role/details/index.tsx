import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Space, Typography } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ProCard from '@ant-design/pro-card';
import RoleSettings from './components/RoleSettings';
import PermissionSettings from './components/PermissionSettings';
import UserSettings from './components/UserSettings';
import { RoleEntity } from '@/api';
import { useResourceDetails, useResourceUpdate } from '@/hooks/useResource';
const { Text } = Typography;

const RoleDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;

  const { data: role, loading, refresh } = useResourceDetails(RoleEntity, id);

  const { run: updateRole, loading: loadingUpdate } = useResourceUpdate(RoleEntity);

  const [tab, setTab] = useState(_tab || 'settings');

  const handleUpdateRole = useCallback(async (values: Partial<API.Role>) => {
    await updateRole(id, values);
    message.success('更新成功');
    return true;
  }, []);

  return <PageContainer>
    <ProCard>
      <Meta
        title={<h3>{role?.name}</h3>}
        description={
          <Space>
            <Text>角色ID</Text> 
            <Text keyboard>
              {role?.id}
            </Text>
          </Space>
        }
      />
    </ProCard>

    <ProCard
      tabs={{
        tabPosition: 'top',
        activeKey: tab,
        onChange: (key) => {
          setTab(key);
        },
        tabBarGutter: 64,
        size: 'large',
    }}>
      <ProCard.TabPane key="settings" tab="设置">
        {role && <RoleSettings role={role} refresh={refresh} onUpdate={handleUpdateRole} loading={loadingUpdate}/>}
      </ProCard.TabPane>
      <ProCard.TabPane key="permissions" tab="权限">
        { role && <PermissionSettings role={role} />}
      </ProCard.TabPane>
      <ProCard.TabPane key="users" tab="用户">
        { role && <UserSettings role={role}/>}
      </ProCard.TabPane>
    </ProCard>
  </PageContainer>;
}

export default RoleDetailsPage;