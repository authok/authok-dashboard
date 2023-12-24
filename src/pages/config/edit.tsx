import React, { useState, useRef } from 'react';

import { SchemaEditor } from '@formily-editor/schema-editor';
import extensions from '@formily-editor/extensions';
import { message, Tabs, Modal, Button } from 'antd';
import { useToggle } from '@umijs/hooks';
import MonacoEditor from 'react-monaco-editor';
import useClipboard from '@/hooks/useClipboard';
import _ from 'lodash';
import '@alifd/next/dist/next.css';
import {
  Input,
  Select,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  TimePicker,
  Range,
  Upload,
  Checkbox,
  Radio,
  Rating,
  Transfer,
  FormCard,
  ArrayTable,
  ArrayCards,
} from '@formily/antd-components';
import 'antd/dist/antd.css';
import CodeEditor from '@/components/CodeEditor';

const BuiltInComponents = {
  Input,
  Select,
  TextArea: Input.TextArea,
  Password,
  NumberPicker,
  Switch,
  DatePicker,
  RangePicker: DatePicker.RangePicker,
  WeekPicker: DatePicker.WeekPicker,
  MonthPicker: DatePicker.MonthPicker,
  YearPicker: DatePicker.YearPicker,
  TimePicker,
  Range,
  Upload,
  Checkbox,
  CheckboxGroup: Checkbox.Group,
  Radio,
  RadioGroup: Radio.Group,
  Rating,
  Transfer,
};

const LayoutComponents = {
  FormCard,
};

const ArrayComponents = {
  ArrayTable,
  ArrayCards,
};

const ExtraComponents = {
  CodeEditor,
};

const components = {
  ...BuiltInComponents,
  ...LayoutComponents,
  ...ArrayComponents,
  ...ExtraComponents,
};

const EditConfig = () => {
  const { state: visible, toggle: toggleVisible } = useToggle(false);
  const { state: exportDialogVisible, toggle: toggleExportDialogVisible } = useToggle(false);
  const [valid, setValid] = useState(true);
  const JsonSchemaMonaco = useRef(null);
  const JsonMonaco = useRef(null);

  const [schema, setSchema] = useState({
    type: 'object',
    properties: {
      xx: {
        type: 'string',
        'x-component': 'input',
        'x-component-props': {
          addonTextBefore: '',
          trim: true,
          hasClear: true,
          placeholder: '',
          addonTextAfter: '',
        },
        title: 'xx',
        'x-index': 0,
        key: 'xx',
      },
    },
  });
  const [activeKey, setActiveKey] = useState('JSONSCHEMA');

  const { ref, copy } = useClipboard();

  const renderToolbar = (context) => {
    const { mode, MODES, setMode, getSchema } = context;
    return (
      <>
        <Button.Group>
          {Object.values(MODES).map((item) => (
            <Button
              key={item.value}
              className="height-32"
              type={item.value === mode ? 'primary' : 'default'}
              onClick={() => setMode(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </Button.Group>
        <Button onClick={() => toggleVisible()}>导入数据</Button>
        <Button onClick={() => toggleExportDialogVisible()}>导出数据</Button>
        <Button
          onClick={() => {
            console.log(getSchema());
            alert(JSON.stringify(getSchema()));
          }}
        >
          保存并关闭
        </Button>
      </>
    );
  };

  const validateContent = (currentTab = activeKey) => {
    const currentMonaco =
      currentTab === 'JSONSCHEMA' ? JsonSchemaMonaco.current : JsonMonaco.current;
    if (!currentMonaco) return;
    const decorations = currentMonaco.editor.getModel().getAllDecorations();
    const error = decorations.filter((decoration) => {
      const cls = decoration.options.className;
      return !_.isEmpty(cls) && _.isString(cls) && cls.includes('error');
    });
    setValid(error.length <= 0);
  };

  const editorDidMount = (editor) => {
    editor.focus();
    editor.onDidChangeModelDecorations((e) => {
      validateContent();
    });
  };

  const renderFooter = () => {
    return (
      <>
        <Button
          type="primary"
          style={{ marginRight: '8px' }}
          disabled={!valid}
          onClick={() => {
            const value = JsonSchemaMonaco.current.editor.getModel().getValue();
            setSchema(JSON.parse(value));
            toggleVisible();
          }}
        >
          确定
        </Button>
        <Button onClick={() => toggleVisible()}>取消</Button>
      </>
    );
  };

  const renderExportDialogFooter = () => {
    return (
      <>
        <Button
          type="primary"
          style={{ marginRight: '8px' }}
          disabled={!valid}
          onClick={() => {
            copy(ref.current.editor.getModel().getValue()).then(() => {
              message.success('已复制到剪切板');
            });
            toggleExportDialogVisible();
          }}
        >
          确定
        </Button>
        <Button onClick={() => toggleExportDialogVisible()}>取消</Button>
      </>
    );
  };

  return (
    <>
      <SchemaEditor
        initialMode="HALF_PREVIEW"
        renderToolbar={renderToolbar}
        extensions={Object.values(extensions)} // 扩展组件
        schema={schema} // 初始schema
      />
      <Modal visible={visible} footer={renderFooter()} onCancel={() => toggleVisible()}>
        <Tabs
          activeKey={activeKey}
          onChange={(key) => {
            setActiveKey(key.toString());
            validateContent(key.toString());
          }}
        >
          <Tabs.TabPane tab="导入JSON SCHEMA" key="JSONSCHEMA">
            <MonacoEditor
              ref={JsonSchemaMonaco}
              width="500"
              height="400"
              language="json"
              theme="vs-dark"
              editorDidMount={editorDidMount}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="导入JSON" key="JSON" disabled>
            <MonacoEditor
              ref={JsonMonaco}
              width="500"
              height="400"
              language="json"
              theme="vs-dark"
              editorDidMount={editorDidMount}
            />
          </Tabs.TabPane>
        </Tabs>
      </Modal>
      <Modal
        title="导出数据"
        visible={exportDialogVisible}
        footer={renderExportDialogFooter()}
        onCancel={() => toggleExportDialogVisible()}
      >
        <MonacoEditor
          ref={ref}
          width="500"
          height="400"
          language="json"
          value={JSON.stringify(schema, null, '\t')}
          options={{
            readOnly: true,
          }}
        />
      </Modal>
    </>
  );
};

export default EditConfig;
