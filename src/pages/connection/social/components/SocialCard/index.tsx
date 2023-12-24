import React from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { Switch } from 'antd';
import styles from './index.less';

interface SocialCardProps {
  app: API.SocialApp;
  onMenuClick: (app: API.SocialApp) => void;
  onSwitch: (checked: boolean, app: API.SocialApp) => void;
}

export const SocialCard: React.FC<SocialCardProps> = ({ app, onMenuClick, onSwitch }) => {
  const handleSwitch = async (checked: boolean, event: MouseEvent) => {
    onSwitch(checked, app);
  };

  return (
    <div className={styles.socialCard}>
      <div className={styles.left}>
        <div className={styles.appLogo}>
          <img src={app.logo} alt="" />
        </div>
        <span className={styles.appName}>{app.name}</span>
      </div>
      <div className={styles.right}>
        <div className={styles.icon}>
          <MenuOutlined
            style={{ fontSize: '16px' }}
            onClick={() => {
              onMenuClick(app);
            }}
          />
        </div>
        <Switch
          style={{ marginLeft: '10px' }}
          checked={app.connection?.enabled || false}
          onChange={handleSwitch}
        />
      </div>
    </div>
  );
};
