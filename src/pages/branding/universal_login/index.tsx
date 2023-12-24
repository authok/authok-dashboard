import React, { useState, useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { message, Typography } from 'antd';
import ProCard from '@ant-design/pro-card';
import * as _ from 'lodash';
import UniversalLoginSettings from './components/UniversalLoginSettings';

const UniversalLoginSettingsPage: React.FC<any> = ({ match }) => {
  const { tab: _tab } = match.params;
  const [tab, setTab] = useState(_tab || 'settings');

  const branding = {} as API.Branding;

  const handleUpdateBranding = useCallback((values: API.Branding) => {
    message.success('更新成功');
  }, []);

  return <PageContainer className="page-middle">
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
        <UniversalLoginSettings branding={branding} onUpdate={handleUpdateBranding}/>
      </ProCard.TabPane>
      <ProCard.TabPane key="custom_login" tab="自定义登录">
        <UniversalLoginSettings branding={branding} onUpdate={handleUpdateBranding}/>
      </ProCard.TabPane>
    </ProCard>  
  </PageContainer>
};


export default UniversalLoginSettingsPage;