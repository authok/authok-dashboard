import { Modal, Card, Typography, Space, Row, Button, Col, Dropdown, Menu, notification } from 'antd';
import React, { useState, useCallback, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import Avatar from 'antd/lib/avatar/avatar';
import { useLinkIdentity, useUnlinkIdentity } from '@/hooks/user';
import UserDetailsSettings from './components/UserDetailsSettings';
import UserRawJson from './components/UserRawJson';
import UserEventHistory from './components/UserEventHistory';
import UserPermissions from './components/UserPermissions';
import UserRoles from './components/UserRoles';
import UserLocation from './components/UserLocation';
import { DeleteOutlined, MailOutlined, DownOutlined, StopOutlined } from '@ant-design/icons';
import UserDevices from './components/UserDevices';
import ChangePasswordModal from '../components/ChangePasswordModal';
const { Text } = Typography;
const { Meta } = Card;
import * as _ from 'lodash';
import UserGrants from './components/UserGrants';
import { history } from 'umi';
import { useResourcePagination, useResourceDetails, useResourceUpdate, useResourceDelete } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { UserEntity } from '@/api/entities/user.entity';
import { formatPath } from '@/utils/link.utils';


const UserDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;
  const [tab, setTab] = useState<string>(_tab || 'details');
  useEffect(() => {
    if (_tab) {
      setTab(_tab);
    }
  }, [_tab]);

  const { data: user, refresh } = useResourceDetails(UserEntity, id);
  const { run: updateUser } = useResourceUpdate(UserEntity);
  const { run: deleteUser, loading: loadingDelete } = useResourceDelete(UserEntity);
  const { run: linkIdentity, loading: loadingLink } = useLinkIdentity();
  const { run: unlinkIdentity, loading: loadingUnlink } = useUnlinkIdentity();
  const { data: connection, run: fetchConnections } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Connection>) => _.first(page.items),
  });

  useEffect(() => {
    if (user) {
      fetchConnections({
        name: user.connection,
      });
    }
  }, [user]);

  const handleUpdate = useCallback(async (values: Record<string, any>): Promise<boolean> => {
    await updateUser(id, values);

    notification.success({
      key: 'user.update',
      message: '更新成功',
    });

    refresh();
  
    return true;
  }, [user]);

  const handleDelete = useCallback(async (): Promise<void> => {
    if (!user) return;

    Modal.confirm({
      title: `确定要删除当前用户`,
      content: `确定要删除用户 ${user.nickname || user.username || user.name || user.email || user.phone_number}? 删除操作不可恢复`,
      okText: '确认',
      cancelText: '取消',
      centered: true,
      onOk: async () => {
        await deleteUser?.(user.user_id);
        history.push(formatPath('/user_mgmt/users'));
      },
    });
  }, [user]);

  const handleBlock = useCallback(async (blocked: boolean): Promise<void> => {
    if (!user) return;

    if (blocked) {
      Modal.confirm({
        title: `确定要锁定当前用户`,
        content: `确定要锁定用户 ${user.nickname || user.username || user.name || user.email || user.phone_number}`,
        okText: '确认',
        cancelText: '取消',
        centered: true,
        onOk: async () => {
          await updateUser(id, {
            blocked,
          });

          notification.success({
            key: 'user.update',
            message: '用户已被锁定',
          });

          refresh();
        },
      });
    } else {
      await updateUser(id, {
        blocked,
      });

      notification.success({
        key: 'user.update',
        message: '用户已被解除锁定',
      });

      refresh();
    }
  }, [user]);

  const handleLinkIdentity = useCallback(async (primaryUserId: string, linkReq: API.LinkIdentityReq): Promise<boolean> => {
    await linkIdentity(primaryUserId, linkReq);

    notification.success({
      key: 'link_identity',
      message: '关联成功',
    });

    refresh();

    return true;
  }, [user]);

  const handleUnlinkIdentity = useCallback(async (primaryUserId: string, connection: string, secondaryUserId: string): Promise<boolean> => {
    await unlinkIdentity(primaryUserId, connection, secondaryUserId);

    notification.success({
      key: 'unlink_identity',
      message: '解除关联成功',
    });

    refresh();

    return true;
  }, [user]);


  const overlay = (
    <Menu>
      { connection?.strategy === 'authok' && <>
          <Menu.Item key="send_verify" icon={<MailOutlined/>}>发送验证邮件/短信</Menu.Item>
          <Menu.Divider/>
        </>
      }
      { connection?.strategy === 'authok' && <ChangePasswordModal 
        onFinish={handleUpdate}
        trigger={
          <Menu.Item key="change_password">修改密码</Menu.Item>
        }/>
      }
      {
        user?.blocked ?
        <Menu.Item key="unblock" onClick={() => handleBlock(false)}>解锁用户</Menu.Item>
        :
        <Menu.Item key="block" icon={<StopOutlined />} onClick={() => handleBlock(true)}>锁定用户</Menu.Item>
      }
      <Menu.Divider/>
      <Menu.Item key="delete" icon={<DeleteOutlined/>} onClick={() => handleDelete()}>删除用户</Menu.Item>
    </Menu>
  );

  return (
    <PageContainer className="page-middle">
      <Row align="middle">
        <Col flex="auto">
          <ProCard>
            <Meta
              avatar={<Avatar src={user?.picture} size={64}/>}
              title={user?.nickname || user?.username}
              description={
                <Space>
                  <Text>User ID: </Text> 
                  <Text keyboard>
                    {user?.user_id}
                  </Text>
                </Space>
              }
            />
          </ProCard>
        </Col>
        <Col flex="300px">
          <Row justify="end">
            <Dropdown overlay={overlay} trigger="hover"><Button size="large" type="primary">操作 <DownOutlined/></Button></Dropdown>
          </Row>
        </Col>
      </Row>
      <ProCard
        tabs={{
          tabPosition: 'top',
          activeKey: _tab,
          onChange: (key) => {
            // setTab(key);
            history.push(formatPath(`/user_mgmt/users/${user.user_id}/${key}`));
          },
          tabBarGutter: 64,
          size: 'large',
      }}>
        <ProCard.TabPane key="details" tab="用户详情">
          { user && <UserDetailsSettings user={user} 
            onUpdate={handleUpdate}
            onDelete={handleDelete} loadingDelete={loadingDelete}
            onBlock={handleBlock}
            onLinkIdentity={handleLinkIdentity} loadingLink={loadingLink}
            onUnlinkIdentity={handleUnlinkIdentity} loadingUnlink={loadingUnlink}
          />}
        </ProCard.TabPane>
        <ProCard.TabPane key="devices" tab="设备信息">
          { user && <UserDevices user={user} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="raw_json" tab="原始JSON数据">
          <UserRawJson user={user} />          
        </ProCard.TabPane>
        <ProCard.TabPane key="event_history" tab="访问记录">
          { user && <UserEventHistory user={user} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="location" tab="定位信息">
          { user && <UserLocation user={user} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="grants" tab="授权应用">
          { user && <UserGrants user={user} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="permissions" tab="权限">
          { user && <UserPermissions user={user} />}
        </ProCard.TabPane>
        <ProCard.TabPane key="roles" tab="角色">
          { user && <UserRoles user={user} />}
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
}

export default UserDetailsPage;