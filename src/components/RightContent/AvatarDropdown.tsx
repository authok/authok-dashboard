import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import { useAuthok } from '@authok/authok-react';
import { formatPath } from '@/utils/link.utils';
import { Link } from 'umi';

export interface GlobalHeaderRightProps {
  menu?: boolean;
}

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { isLoading, user, logout } = useAuthok();

  console.log('user: ', user);

  const onMenuClick = useCallback(
    (event: {
      key: React.Key;
      keyPath: React.Key[];
      item: React.ReactInstance;
      domEvent: React.MouseEvent<HTMLElement>;
    }) => {
      const { key } = event;
      if (key === 'logout') {
        logout({ return_to: window.location.origin });
        return;
      }
    },
    [],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );


  if (isLoading) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="settings">
        <SettingOutlined />
        <Link to={formatPath('profile')}>个人设置</Link>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={user.picture} alt="avatar" />
        <span className={`${styles.name} anticon`}>{user.nickname || user.phone_number || user.email}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
