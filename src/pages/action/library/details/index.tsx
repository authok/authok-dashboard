import React, { useCallback, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import CodeEditor from '@/components/CodeEditor';
import { Form, message, notification, Breadcrumb, Row, Col, Card, Spin, Button, Space, Tooltip, Input } from 'antd';
import { Link } from 'umi';
import { CodeOutlined, ArrowLeftOutlined, CaretRightOutlined, CodeSandboxOutlined, KeyOutlined, CloseOutlined, SettingOutlined } from '@ant-design/icons';
import styles from './index.less';
import { useResourceDetails, useResourceUpdate } from '@/hooks/useResource';
import { ActionEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';
import SecretEditor from './components/SecretEditor';
import { useActionTest } from '@/hooks/action';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darcula } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import actionCodes from './action.templates';
import eventCodes from './event.templates';
import { useKeyPress } from '@umijs/hooks';
import { useThrottleFn } from "ahooks"; // 不能用 umijs/hooks 的， umijs的实现有逻辑错误，感觉和 useDebounce 防抖动一样，要等 wait后才执行

const LibraryDetailsPage: React.FC<any> = ({ match }) => {
  const { id } = match.params;

  const { data: action, loading: loadingDetails, refresh } = useResourceDetails(ActionEntity, id);
  const { run: updateAction, loading: loadingUpdate } = useResourceUpdate(ActionEntity);
  const { run: testAction, loading: loadingTest } = useActionTest();

  const [block, setBlock] = useState<string>();
  const [changed, setChanged] = useState<boolean>(false);
  const [eventCode, setEventCode] = useState();
  const [form] = Form.useForm();

  const handleUpdateAction = useCallback(async (action: Partial<API.Action>) => {    
    await updateAction(id, action);

    refresh();

    setChanged(false);

    notification.success({
      key: `action.update`,
      message: '保存成功',
    })
  }, [id, action]);

  useEffect(() => {
    if (action) {
      const trigger = action.supported_triggers[0]?.id
      const code = actionCodes[trigger];
      form.setFieldsValue({
        ...action,
        code: action.code || code,
      });

      setEventCode(JSON.stringify(eventCodes[trigger], null, 2));
    }
  }, [action]);

  const [editorWidth, setEditorWidth] = useState<number>();

  useEffect(() => {
    if (block) {
      setEditorWidth(document.getElementById('editor-row')!.clientWidth - 56 - 300);
    } else {
      setEditorWidth(document.getElementById('editor-row')!.clientWidth - 56);
    }
  }, [block]);

  useEffect(() => {
    setEditorWidth(document.getElementById('editor-row')!.clientWidth - 56);
  }, []);

  const [result, setResult] = useState();
  const [outputVisible, setOutputVisible] = useState<boolean>(false);

  const { run: handleTest, cancel: cancelTest  } = useThrottleFn(async () => {
    setOutputVisible(true);

    if (changed) {
      await form.submit();
    }

    let event;
    try {
      event = JSON.parse(eventCode) as API.TriggerEvent;
    } catch(e) {
      message.error('事件数据不合法');
      return;
    }

    const testResult = await testAction(action.id, event);
    setResult(testResult);
  }, {
    wait: 1000,
  });

  let blockUI;
  if (block === 'test') {
    blockUI = (
      <Space direction="vertical" style={{ width: '100%', paddingBottom: 16, paddingRight: 16 }}>
        <CodeEditor
          value={eventCode}
          onChange={(v) => setEventCode(v)}
          options={{
            fontSize: 14,
            automaticLayout: true,
            minimap: { enabled: false },
            lineNumbers: 'off',
          }}
          height="calc(100vh - 400px)"
          language="json"
        />
        <Row justify="center" style={{ height: 40 }}>
          <Button type="primary" size="middle" onClick={handleTest} loading={loadingTest}>运行</Button>
        </Row>
      </Space>
    );
  } else if (block === 'secrets') {
    blockUI = <Form.Item name="secrets" noStyle><SecretEditor /></Form.Item>
  } else if (block === 'modules') {
    blockUI = <>modules</>;
  } else if (block === 'settings') {
    blockUI = <div className={styles.settings}>
      <Form.Item 
        name="name" 
        label="名称" 
        labelAlign="left"
        labelCol={{ 
          xs: { span: 24 },
          sm: { span: 24 },
        }}
        wrapperCol={{
          xs: { span: 24 },
          sm: { span: 24 },
        }}
      >
        <Input />
      </Form.Item>
    </div>;
  }

  useKeyPress(['meta.s', 'ctrl.s'], (e) => {
    if (changed) {
      form.submit();
    }
    e.preventDefault();
  });

  useKeyPress(['meta.r', 'ctrl.r'], (e) => {
    handleTest();
    setBlock('test');
    e.preventDefault();
  });

  useKeyPress(['esc'], (e) => {
    setBlock(undefined);
    setOutputVisible(false);
    cancelTest();
    e.preventDefault();
  });

  return (
    <PageContainer
      className={styles.actionEditorWrapper}
      pageHeaderRender={() => <>
        <Card bordered={false}>
          <Breadcrumb>
            <Breadcrumb.Item><Link to={formatPath('/actions/library')}><ArrowLeftOutlined /> 返回Action列表</Link></Breadcrumb.Item>
          </Breadcrumb>
          <Row style={{ marginTop: 32 }}>
            <Col flex="auto">
              <Space size="large">
                <CodeOutlined style={{ fontSize: 48 }}/>
                <div>
                  <h1>{action?.name}</h1>
                  <Space>
                    {action?.supported_triggers?.map(it => it.id)}
                    <span>运行时: {action?.runtime}</span>
                  </Space>
                </div>
              </Space>
            </Col>
            <Col flex="300px">
              <Row justify="end">
                <Space>
                  <Button size="large" type="primary" disabled={!changed} loading={loadingUpdate} onClick={() => form.submit()}>保存</Button>
                  <Button size="large" type="primary">部署</Button>
                </Space>
              </Row>
            </Col>
          </Row>
        </Card>
      </>}
    >
      <Form 
        form={form} 
        onFinish={handleUpdateAction} 
        initialValues={{
          code: ' ',
        }}
        onValuesChange={() => setChanged(true)}
      >
        <Spin spinning={loadingDetails}>
          <Row id="editor-row" className={styles.editor}>
            <Col flex="56px">
              <Row justify="center" style={{ paddingTop: 16 }}>
                <Space direction="vertical" size="middle">
                  <Tooltip title="测试(⌘/Ctrl + r)" placement="right">
                    <Button type="link" icon={<CaretRightOutlined style={{ fontSize: 21 }}/>} onClick={() => setBlock('test')}/>
                  </Tooltip>
                  <Tooltip title="Secrets" placement="right">
                    <Button type="link" icon={<KeyOutlined style={{ fontSize: 21 }}/>} onClick={() => setBlock('secrets')}/>
                  </Tooltip>
                  <Tooltip title="依赖模块" placement="right">
                    <Button type="link" icon={<CodeSandboxOutlined style={{ fontSize: 21 }}/>} onClick={() => setBlock('modules')} />
                  </Tooltip>
                  <Tooltip title="配置" placement="right">
                    <Button type="link" icon={<SettingOutlined style={{ fontSize: 21 }}/>} onClick={() => setBlock('settings')} />
                  </Tooltip>
                </Space>
              </Row>
            </Col>
            {!!blockUI && (
              <Col flex="300px">
                <Row justify="end" style={{ padding: 8 }}>
                  <Button type="link" icon={<CloseOutlined />} onClick={() => setBlock(undefined)}/>
                </Row>
                {blockUI}
              </Col>)
            }
            <Col flex="auto">
              <Form.Item name="code" noStyle>
                <CodeEditor
                  options={{
                    fontSize: 14,
                    insertSpaces: true,
                    tabSize: 2,  
                    colorDecorators: true,
                  }}
                  width={editorWidth}
                  height="calc(100vh - 300px)"
                  language="javascript"
                />
              </Form.Item>
              { outputVisible && <div className={styles.output}>
                <Row align="middle" style={{ paddingLeft: 8 }}>
                  <Col flex="auto"><b style={{ fontSize: 14 }}>测试结果</b></Col>
                  <Col flex="120px">
                    <Row justify="end" style={{ padding: 8 }}>
                      <Button type="link" icon={<CloseOutlined />} onClick={() => setOutputVisible(false)}/>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  {result && <SyntaxHighlighter
                    language='json'
                    customStyle={{
                      height: 240,
                      width: '100%'
                    }}
                    style={darcula}
                    wrapLongLines={false}
                    wrapLines={true}
                  >
                    {JSON.stringify(result, null, 4)}
                  </SyntaxHighlighter>}
                </Row>
              </div>}
            </Col>
          </Row>
        </Spin>
      </Form>
    </PageContainer>
  );
};

export default LibraryDetailsPage;