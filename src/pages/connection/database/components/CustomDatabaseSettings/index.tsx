import React, { useCallback, useRef, useEffect, useState, useMemo } from 'react';
import { Card, Row, Col, Switch, Space, Tabs, Button, Dropdown, Menu, Spin } from 'antd';
import { useIntl } from 'umi';
import MonacoEditor from 'react-monaco-editor';
import { CaretRightOutlined, DownOutlined } from '@ant-design/icons';
import { customScripts as customDatabaseScriptTemplates, defaultCustomScripts } from '../../../../../../config/scripts/database';
import * as merge from 'deepmerge';
import ConfigEditor from './ConfigEditor';

interface CustomDatabaseSettingsProps {
  connection?: API.Connection;
  onUpdate: (connection: API.Connection) => void;
  loading: boolean;
}

const CustomDatabaseSettings: React.FC<CustomDatabaseSettingsProps> = ({ connection, onUpdate, loading }) => {
  const { formatMessage } = useIntl();
  
  const handleSwitchCustomDatabase = useCallback(async (val) => {
    if (!connection) return;

    const data = { 
      id: connection.id, 
      options: {
        enabledDatabaseCustomization: val,
      },
    };

    if (val) {
      const customScripts = merge(defaultCustomScripts, connection?.options?.customScripts || {});
      data.options.customScripts = customScripts;
    }  

    await onUpdate(data);
  }, [connection]);


  const config = useMemo(() => Object.entries(connection?.options?.config || {}).map(([key, value]) => ({ key, value })), [connection])

  const handleConfigChange = useCallback(async (items: any[]) => {
    if (!connection) return;

    const newConfig = {};

    for (const item of items) {
      newConfig[item.key] = item.value;
    }

    const data = { 
      id: connection.id, 
      options: {
        config: newConfig,
      },
    };

    await onUpdate(data);
  }, [connection]);

  return (
    <Space style={{ width: '100%' }} direction="vertical" size="large">
      <Card>
        <Row style={{ alignItems: 'center' }}>
          <Col span={20}>
            <h3>{formatMessage({ id: 'component.connection.database.enabledDatabaseCustomization' })}</h3>
            <p>登录脚本是必须项. 其它脚本都是可选的, 主要用作 注册, 邮件/手机号验证, 密码重置 和 用户删除.</p>
          </Col>
          <Col span={4}>
            <Row justify="end">
              <Switch loading={loading} size="default" defaultChecked={connection?.options?.enabledDatabaseCustomization} onChange={handleSwitchCustomDatabase}/>
            </Row>
          </Col>
        </Row>
      </Card>
      <Spin indicator={<></>} spinning={connection?.options?.enabledDatabaseCustomization !== true}>
        <Card style={{ marginBottom: '16px' }}>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Row>
              <Col>
                <h3>{formatMessage({ id: 'component.connection.database.action.scripts' })}</h3>
                <p>默认 Authok 会托管存储用户. 如果您有自己的用户数据库 (MySql, Mongo, SQL Server, 等). 可开启使用.</p>
              </Col>
            </Row>
            <Tabs size="middle">
              {['login', 'create', 'verify', 'change_password', 'get_user', 'delete'].map((it) => (
                <Tabs.TabPane key={it} tab={formatMessage({ id: `app.settings.database.custom_scripts.${it}` })}>
                  <ScriptEditor 
                    loading={loading}
                    templates={customDatabaseScriptTemplates[it]} 
                    value={connection?.options?.customScripts?.[it]} 
                    onFinish={(v) => {
                      if (!connection) return;

                      const customScripts = {};
                      customScripts[it] = v;

                      onUpdate({
                        id: connection?.id,
                        options: {
                          customScripts,
                        },
                      })
                    }}
                  />
                </Tabs.TabPane>
              ))}
            </Tabs>
          </Space>
        </Card>
        <ConfigEditor value={config} loading={loading} onChange={handleConfigChange}/>
      </Spin>
    </Space>
  );
};

interface ScriptEditorProps {
  templates: Record<string, string>;
  value: string;
  loading: boolean;
  onFinish: (v: string) => void;
}

const ScriptEditor: React.FC<ScriptEditorProps> = ({ templates, value: _value, onFinish, loading }) => {
  const editorRef = useRef();
  const [value, setValue] = useState<string>(_value);
  const { formatMessage } = useIntl();

  useEffect(() => {
    setValue(_value);
  }, [_value]);

  const handleSave = useCallback(() => {
    onFinish(editorRef.current.getValue())
  }, [_value, value]);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor; 
  }

  const handleMenuClick = e => {
    const script = templates[e.key];
    console.log('script: ', script);
    if (script) setValue(script);
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {Object.keys(templates).map((key) => <Menu.Item key={key}>{formatMessage({ id: `app.settings.database.custom_scripts.${key}`})}</Menu.Item>)}
    </Menu>
  );

  return (
    <Card bordered={false}>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <Row>
          <Col span={18}>
            <Button loading={loading} onClick={handleSave} type="primary" style={{ marginRight: '12px'}}>保存</Button>
            <Button loading={loading} icon={<CaretRightOutlined />}>保存并测试</Button>
          </Col>
          <Col span={6}>
            <Row justify="end">
              <Dropdown overlay={menu} placement='bottomRight'>
                <Button>选择模版 <DownOutlined /></Button>
              </Dropdown>
            </Row>
          </Col>
        </Row>
        <MonacoEditor 
          width="100%"
          height="40vh"
          language="javascript"
          theme="vs-dark"
          value={value} 
          editorDidMount={handleEditorDidMount}
        />
      </Space>
    </Card>
  );
};

export default CustomDatabaseSettings;