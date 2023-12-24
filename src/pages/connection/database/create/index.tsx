import React, { useCallback } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDigitRange, ProFormText } from '@ant-design/pro-form';
import { Card, Row, Col, Switch, Button } from 'antd';
import { history } from 'umi';
import { useResourceCreate } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';
import { COMMMASSEPARATE } from '@/../config/regexp.config';

const CreateConnectionPage: React.FC = () => {

  return (
    <PageContainer title="新建数据库身份源" className="page-middle">
      <Card>
        <CreateConnectionForm />
      </Card>
    </PageContainer>
  );
} 

const CreateConnectionForm: React.FC = () => {
  const { run: createConnection } = useResourceCreate(ConnectionEntity);

  const handleCreate = useCallback(async (values: Partial<API.Connection>) => {
    const connection = await createConnection(values);
  
    history.push(formatPath(`/connections/database/${connection.id}`));
  }, []);

  return (
    <ProForm 
      size="large"
      initialValues={{
        strategy: 'authok',
      }}
      width="100%"
      onFinish={handleCreate}
      submitter={{
        render: (props, doms) => {
          return [
            <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>创建</Button>,
            <Button onClick={() => history.push('/connections/database') }>取消</Button>,
          ];
        },
      }}
    >
      <ProFormText name="strategy" hidden />
      <ProFormText label={<b>唯一标识符</b>} name="name" 
        required
        rules={[
          {
            validator: (rule: any, value: string, callback: any) => {
              if (value && !COMMMASSEPARATE.test(value)) {
                callback("必须以字母开头和结尾，特殊字符仅可包含 '-'. 不能超过40个字符.");
                return;
              }
              callback();
            }
          }
        ]}
        extra={<>必须以字母开头和结尾，特殊字符仅可包含 '-'. 不能超过40个字符.</>}
      />

      <Card bordered style={{ marginTop: '16px', width: '100%' }}>
        <Row style={{ alignItems: 'center' }}>
          <Col span={18}>
            <h3>用户名长度</h3>
            <p>设置最小和最大值</p>
          </Col>
          <Col span={6}></Col>
        </Row>
        <Row style={{ alignItems: 'center' }}>
          <Col span={18}>
            <ProForm.Group direction="horizontal">
              <ProFormDigitRange name="lengths" />
            </ProForm.Group>
          </Col>
          <Col span={6}></Col>
        </Row>
      </Card>

      <Card bordered style={{ marginTop: '16px', marginBottom: '16px', width: '100%' }}>
        <Row style={{ alignItems: 'center' }}>
          <Col span={18}>
            <h3>禁止注册</h3>
            <p>禁止新用户注册. 仍可通过 API 和 管理后台创建用户.</p>
          </Col>
          <Col span={6}>
            <Row justify="end">
              <Switch size="default" />
            </Row>
          </Col>
        </Row>
      </Card>
    </ProForm>
  );
};

export default CreateConnectionPage;