import React from 'react';
import { Alert, Space, Card, Row, Col, Divider, Button } from 'antd';
import ProForm, { ProFormDigit, ProFormCheckbox, ProFormDependency, ProFormTextArea } from '@ant-design/pro-form';

interface PasswordPolicyProps {
  connection?: API.Connection;
  onUpdate: (connection: API.Connection) => void;
}

const PasswordPolicy: React.FC<PasswordPolicyProps> = ({ connection, onUpdate }) => {
  return <Space direction="vertical" style={{ width: '100%' }} size="large">
    { connection?.options?.enabledDatabaseCustomization && connection?.options?.import_mode !== true && (
      <Alert showIcon type="warning" message="密码选项不会生效，因为您开启了自定义数据库，但是没有开启 用户导入选项."/>
    )}
    <Card>
      <ProForm 
        size="large"
        onFinish={onUpdate}
        initialValues={connection}
        submitter={{
          render: (props, doms) => {
            return <Row justify="center">
              <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>
                保存设置
              </Button>
            </Row>;
          },
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <h3>密码历史</h3>
            <p>fjfjfj</p>
          </Col>
          <Col span={12}>
            <ProFormCheckbox name={["options", "password_history", "enabled"]}>开启密码历史</ProFormCheckbox>
            <ProFormDependency name={["options", "password_history", "enabled"]}>
              {(val) => {
                console.log('val: ', val);
                return val.options?.password_history?.enabled && (
                  <ProFormDigit
                    name={["options", "password_history", "size"]}
                    width="xl"
                    label={'数量'}
                  />
                );
              }}
            </ProFormDependency>
          </Col>          
        </Row>
        <Divider/>
        <Row gutter={16} style={{ marginBottom: '16px' }}>
          <Col span={12}>
            <h3>密码字典</h3>
            <p>不允许使用密码字典中的密码。默认字典是10000个最常用密码的列表。此外，您还可以自定义。</p>
          </Col>
          <Col span={12}>
            <ProFormCheckbox name={["options", "password_dictionary", "enabled"]}>开启密码历史</ProFormCheckbox>
            <ProFormDependency name={["options", "password_dictionary", "enabled"]}>
              {(val) => {
                console.log('val: ', val);
                return val.options?.password_dictionary?.enabled && (
                  <ProFormTextArea
                    name={["options", "password_dictionary", "dict"]}
                    width="xl"
                    label={'追加字典条目'}
                    extra="每行一个"
                  />
                );
              }}
            </ProFormDependency>
          </Col>
        </Row>
      </ProForm>
    </Card>
  </Space>;
};

export default PasswordPolicy;