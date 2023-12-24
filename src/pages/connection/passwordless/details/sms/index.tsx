import React, { useState, useCallback } from 'react';
import ProCard from '@ant-design/pro-card';
import { Typography, Col, Row, Space, Button, Empty } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ProSkeleton from '@ant-design/pro-skeleton';
import { PageContainer } from '@ant-design/pro-layout';
import { Avatar, message } from 'antd';
import { CaretRightOutlined, PhoneOutlined } from '@ant-design/icons';
import * as _ from 'lodash';
import ApplicationSettings from '../../../components/ApplicationSettings';
const { Text } = Typography;
import SmsConnectionSettings from './components/SmsConnectionSettings';
import TrySendSmsModal from './components/TrySendSmsModal';
import { ConnectionEntity } from '@/api';
import { useResourceDetails, useResourceUpdate } from '@/hooks/useResource';

const SmsConnectionDetailsPage: React.FC<any> = ({ match }) => {
  const { id, tab: _tab } = match.params;
  const [tab, setTab] = useState(_tab || 'settings');

  const { error, data: connection, loading, refresh } = useResourceDetails(ConnectionEntity, id);
  const { run: update } = useResourceUpdate(ConnectionEntity);

  const handleUpdate = useCallback(async (data: Partial<API.Connection>): Promise<boolean> => {
    console.log('update value: ', data);
    await update(id, data);

    message.success('保存成功');
    refresh();

    return true;
  }, [connection]);


  if (loading && !connection) {
    return <PageContainer className="page-middle"><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!connection) {
    return <PageContainer className="page-middle"><Empty/></PageContainer>;  
  }

  return (
    <PageContainer className="page-middle">
      <ProCard>
        <Meta
          avatar={<Avatar icon={<PhoneOutlined />} size={64}/>}
          title={<h2>{connection.display_name || connection.name}</h2>}
          description={
            <Row justify="center" gutter={16}>
              <Col span={20}>
                <Space size="middle">
                  <Space>
                    <Text>{connection.strategy}</Text>
                  </Space>
                  <Text>Identifier</Text> 
                  <Text keyboard>
                    {connection.id}
                  </Text>
                </Space>
              </Col>
              <Col span={4}>
                <Row style={{ justifyItems:'end' }}>
                  <TrySendSmsModal connection={connection} trigger={<Button size="large" icon={<CaretRightOutlined/>}>测试</Button>}/>
                </Row>
              </Col>
            </Row>
          }
        >
        </Meta>
      </ProCard>

      <ProCard        
        style={{ paddingLeft: '16px', paddingRight: '16px' }}
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
          <SmsConnectionSettings connection={connection} onUpdate={handleUpdate}/>
        </ProCard.TabPane>
        <ProCard.TabPane key="applications" tab="应用">
          <ApplicationSettings connection={connection} onUpdate={handleUpdate}/>
        </ProCard.TabPane>
      </ProCard>
    </PageContainer>
  );
}

export default SmsConnectionDetailsPage;