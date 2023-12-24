import React, { useState } from 'react';
import { Avatar, Space, List, Card, Switch } from 'antd';
import AddonEditDrawer from './components/AddonEditDrawer';
import ADDONS from './addon.config';

interface AddonSettingsProps {
  application: API.Application;
  onUpdate: (application: Partial<API.Application>) => Promise<boolean>;
}

const AddonSettings: React.FC<AddonSettingsProps> = ({ application, onUpdate }) => {
  const addons = ADDONS.map(it => {
    const addons = application.addons || {};
    const config = addons[it.key];
    if (config) {
      return {...it, enabled: true };
    } else {
      return {...it, enabled: false };  
    }
  });

  const [addon, setAddon] = useState();

  const handleSwitch = (addon: API.Addon) => async (v: boolean, e: MouseEvent) => {
    e.stopPropagation();

    if (v) {
      const addons = application.addons || {};
      const config = addons[addon.key];

      setAddon(addon);
    } else {
      const newAddons = {...application.addons};
      delete newAddons[addon.key];
      await onUpdate({ addons: newAddons});
    }
  };

  return  <Space direction="vertical" style={{ width: '100%'}}>
    <AddonEditDrawer 
      application={application}
      visible={!!addon}
      addon={addon}
      onFinish={onUpdate} 
      onClose={() => {
        setAddon(undefined);
      }}
    />
    <List<API.Addon>
      rowKey="key"
      dataSource={addons}
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 3,
        xl: 3,
        xxl: 3,
      }}
      renderItem={(item: API.Addon) => {
        return <List.Item>
          <a onClick={(e) => handleSwitch(item)(true, e)}>
            <Card actions={[<Switch checked={item.enabled} onChange={handleSwitch(item)}/>]}>
              <Card.Meta avatar={<Avatar size={48} src={item.icon}/>} title={item.name} />
            </Card>
          </a>
        </List.Item>
      }}
    />
  </Space>;
};

export default AddonSettings;