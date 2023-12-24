import React, { useState } from 'react';
import _ from 'lodash';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, Collapse, List, message, Modal, Switch } from 'antd';
import { useRequest } from 'umi';
import { DeleteOutlined, MenuOutlined, PlusOutlined } from '@ant-design/icons';
import {
  create as createConnection,
  list as listConnections,
  update as updateConnection,
  del as delConnection,
} from '@/services/connection';
import styles from './EnterpriseList.less';
import CreateEnterprise from './social/components/createEnterprise';

const { Panel } = Collapse;

const EnterpriseList: React.FC<API.Connection> = (props) => {
  const [visible, setVisible] = useState(false);
  const [currentEnterprise, setCurrentEnterprise] = useState({});
  const { run: createConnectionRun } = useRequest(createConnection, { manual: true });
  const { run: updateConnectionRun } = useRequest(updateConnection, { manual: true });
  const [appInfos, setAppInfos] = useState<Partial<API.Connection>[]>([]);
  // 请求应用列表
  const { refresh } = useRequest(listConnections, {
    onSuccess: (result) => {
      if (!result) return;
      const data = result ? result.list || [] : [];
      setAppInfos(data);
    },
  });
  // 开关drawer
  const showDrawer = () => {
    setVisible(true);
  };
  const closeDrawer = () => {
    setVisible(false);
  };
  // 创建成功
  const onSaveOrUpadte = async (appInfo: API.Connection) => {
    console.log('appInfo', appInfo);
    const isUpdate = appInfos.some((it) => it.identifier === appInfo.identifier);
    if (!isUpdate) {
      const newAppInfo = await createConnectionRun(appInfo);
      if (!newAppInfo) {
        message.error('创建失败!');
        return;
      }
      message.success('创建成功!');
    } else {
      const newAppInfo = await updateConnection(appInfo);
      if (!newAppInfo) {
        message.error('创建失败!');
        return;
      }
      message.success('更新成功!');
    }
    refresh();
  };
  // 添加身份源
  const addOIDC = () => {
    return (
      <>
        <PlusOutlined
          style={{ fontSize: '24px' }}
          onClick={(event) => {
            setCurrentEnterprise({});
            // If you don't want click extra trigger collapse, you can prevent this:
            event.stopPropagation();
            showDrawer();
          }}
        />
      </>
    );
  };
  // 点击switch开关
  const onSwitch = async (identifier: string | undefined, checked: boolean) => {
    if (!identifier) return;
    await updateConnectionRun({ identifier, enabled: checked });
    refresh();
    message.success('更新成功!');
  };
  // 点击配置按钮
  const onWatchConfig = (identifier: string | undefined) => {
    if (!identifier) return;
    const identifierMap = _.keyBy(appInfos, (it) => it.identifier);
    setCurrentEnterprise(identifierMap[identifier]);
    showDrawer();
  };
  // 删除按钮
  const onDelete = (identifier: string | undefined) => {
    if (!identifier) return;
    Modal.confirm({
      title: `确认要删除连接源:${identifier}`,
      // content: contentMsg,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        const res = await delConnection({ identifier });
        if (res.code === 0) {
          message.success('删除成功');
          refresh();
        } else {
          message.error('删除失败');
        }
      },
    });
  };
  // collapse展开时的回调
  const tabCallback = (key: string | string[]) => {
    console.log(key);
  };
  return (
    <PageContainer style={{ backgroundColor: '#fff', height: '100vh' }}>
      <CreateEnterprise
        initvalues={currentEnterprise}
        visable={visible}
        onClose={closeDrawer}
        onOk={onSaveOrUpadte}
      />
      <Collapse defaultActiveKey={['oidc']} onChange={tabCallback} ghost>
        <Panel header="连接 OIDC 身份源" key="oidc" extra={addOIDC()}>
          <List
            size="large"
            dataSource={appInfos}
            renderItem={(item) => (
              <List.Item key={item.identifier}>
                <List.Item.Meta
                  avatar={
                    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                  }
                  title={<a href="https://ant.design">{item.displayName}</a>}
                  // description='描述'
                />
                <div className={styles.right}>
                  <div className={styles.icon} style={{ fontSize: '18px', lineHeight: 0 }}>
                    <MenuOutlined
                      onClick={() => {
                        onWatchConfig(item.identifier);
                      }}
                    />
                  </div>
                  <div className={styles.icon}>
                    <Switch
                      checked={item.enabled}
                      onChange={(checked) => {
                        onSwitch(item.identifier, checked);
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '18px', lineHeight: 0 }} className={styles.icon}>
                    <DeleteOutlined
                      onClick={() => {
                        onDelete(item.identifier);
                      }}
                    />
                  </div>
                </div>
              </List.Item>
            )}
          />
        </Panel>
      </Collapse>
    </PageContainer>
  );
};

export default EnterpriseList;
