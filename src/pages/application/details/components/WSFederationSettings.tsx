import React from 'react';
import ProForm from '@ant-design/pro-form';
import { Space } from 'antd';
import CodeEditor from '@/components/CodeEditor';

const WSFederationSettings: React.FC = () => {
  return (
    <Space style={{ width: '100%', marginTop: '16px' }} direction="vertical">
      <h3>表单模版</h3>
      <ProForm.Item name="form_template">
        <CodeEditor 
          width="100%"
          height="40vh"
          language="html"
          theme="vs-dark"
        />
      </ProForm.Item>
    </Space>
  );
};

export default WSFederationSettings;