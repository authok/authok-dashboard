import React, { useCallback } from 'react';
import { Space, Typography, Card, Row, Col, Alert, Switch, Button } from 'antd';
const { Text } = Typography;
import SignUpSettings from '../../components/SignUpSettings';
import DangerItem from '@/components/DangerItem';
import KeywordConfirmModal from '@/components/KeywordConfirmModal';
const { Paragraph } = Typography;
import ProForm, { ProFormText, ProFormDigitRange } from '@ant-design/pro-form';

interface ConnectionSettingsProps {
  connection: API.Connection;
  onUpdate: (connection: Partial<API.Connection>) => void;
  onDelete: (id: string) => void;
}

const ConnectionSettings: React.FC<ConnectionSettingsProps> = ({ connection, onUpdate, onDelete }) => {
  const handleImportModeChange = useCallback(async (val) => {
    if (!connection) return;

    return await onUpdate({
      options: {
        import_mode: val,
      },
    });
  }, [connection]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Text>
        以下设置只会影响当前数据库连接. 如果您需要自定义行为，可以尝试添加规则.
      </Text>

      <ProForm 
        size="large"
        onFinish={onUpdate}
        initialValues={connection}
        submitter={{
          render: (props, doms) => {
            return <Row justify="center" style={{ marginTop: 8 }}>
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>保存</Button>
            </Row>;
          },
        }}
      >
        <Card bordered style={{ marginTop: '16px' }}>
          <h3>基础设置</h3>
          <Row style={{ alignItems: 'center' }}>
            <Col span={18}>
              <ProFormText label="身份源显示名称" name="display_name" />
              <ProForm.Group>
                <ProFormDigitRange label="用户名长度" name={['options', 'lengths']} placeholder="请输入" min="1" />
              </ProForm.Group>
            </Col>
            <Col span={6}></Col>
          </Row>
        </Card>
      </ProForm>
      <Card bordered style={{ marginTop: '16px' }}>
        <Row style={{ alignItems: 'center' }}>
          <Col span={18}>
            <h3>迁移用户到 Authok</h3>
            <p>逐步将旧用户迁移到 Authok。<a>了解更多。</a></p>
          </Col>
          <Col span={6}>
            <Row justify="end">
              {
                connection.options?.enabledDatabaseCustomization && <Switch defaultChecked={connection.options.import_mode} onChange={handleImportModeChange} />
              }
            </Row>
          </Col>
        </Row>
        {connection.options?.enabledDatabaseCustomization || <Alert showIcon message={<>你需要使用 <a>自定义数据库</a> 来开启此选项.</>}/>}
      </Card>
      <SignUpSettings />
  
      <h2 style={{ marginTop: '24px' }}>危险操作</h2>
      <DangerItem
        title="确定要删除此连接"
        description="操作不可撤销"
        actions={[
          <KeywordConfirmModal 
            title="确定要删除此连接"
            keyword={connection.name}
            description={<>
              <Paragraph>操作不可撤销</Paragraph>
              <ul>
                <li>将会永久删除 <b>{connection.name}</b> 数据库身份源</li>
                <li>同名身份源在一小段时间内不可用</li>
              </ul>
            </>}
            trigger={<Button danger type="primary" size="large">删除</Button>}
            onOk={() => onDelete(connection.id)}
          />
        ]}
      />
    </Space>
  );
};

export default ConnectionSettings;