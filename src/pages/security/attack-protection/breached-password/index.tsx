import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { notification, Tag, Badge, Space, Button, Card, Row, Col, Switch, Divider } from 'antd';
import { useConfigDetails, useConfigSet } from '@/hooks/config';
import ProForm, { ProFormSwitch, ProFormCheckbox } from '@ant-design/pro-form';
import { useForm } from 'antd/es/form/Form';

const BreachedPassword: React.FC = () => {
  const { data: breachedPasswordConfig, loading } = useConfigDetails('protection-config', 'breached-password');
  const { run: setConfig, loading: loadingSet } = useConfigSet();

  const [form] = useForm();

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      form.setFieldsValue(breachedPasswordConfig?.value);
      setEnabled(breachedPasswordConfig?.enabled || false);
    }
  }, [breachedPasswordConfig, loading]);

  const handleEnabled = useCallback(async (enabled: boolean) => {
    await setConfig('protection-config', 'breached-password', { enabled });

    setEnabled(enabled);

    if (enabled) {
      notification.success({
        key: 'breached-password.set',
        message: '密码泄漏检测已开启'
      });
    } else {
      notification.success({
        key: 'breached-password.set',
        message: '密码泄漏检测已关闭'
      });
    }
  }, [breachedPasswordConfig]);

  const handleUpdate = useCallback(async (_value) => {
    const value = {..._value};
    const shields = {...value.shields }
    if (value.admin_notification_frequency && value.admin_notification_frequency.length > 0) {
      shields.admin_notification = true;
    } else {
      delete shields.admin_notification;
    }

    value.shields = shields; 
  
    await setConfig('protection-config', 'breached-password', { value });
    notification.success({
      key: 'breached-password.set',
      message: '设置成功'
    });
  }, [breachedPasswordConfig]);

  return <PageContainer title={false}>
    <Space direction="vertical" style={{ width: '100% '}} size="large">
      <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
        <Col span={20}>
          <Space direction="vertical" style={{ width: '100% '}} size="middle">
            <Space direction="horizontal" align="center" size="middle">
              <span style={{ fontSize: '27px' }}><b>密码泄漏检测</b></span>
              { !loading && (enabled ? <Tag color="default"><Badge status="success" text="已开启" /></Tag> : <Tag color="default"><Badge color="gray" text="已关闭" /></Tag>)}
            </Space>
            <p>Authok 可以检测特定用户的密码/凭据是否包含在重大公共安全漏洞中, 比如现用密码是否存在于社工库中。</p>
          </Space>
        </Col>
        <Col span={4}>
          <Row justify="end" align="middle">
            <Switch checked={enabled} onChange={handleEnabled} loading={loadingSet}/>
          </Row>
        </Col>
      </Row>
      <Card bordered={true} style={{ backgroundColor: '#eff0f2' }}>
        <Row gutter={[16, 16]}>
          <Col span={15}>
            <h3>密码泄漏检测的工作原理</h3>
            <p>
              我们会定期检测第三方数据泄漏，通过匹配您的用户名密码组合，来判定您的用户数据是否已经被公开泄漏.
            </p>
          </Col>
          <Col span={9}></Col>
        </Row>
      </Card>

      <ProForm
        form={form}
        size="large"
        onFinish={handleUpdate}
        initialValues={{
        
        }}
        submitter={{
          render: (props, doms) => {
            return <Row>
              <Col span={10}></Col>
              <Col span={14}>
                <Button type="primary" key="submit" onClick={() => props.form?.submit?.()}>保存</Button>
              </Col>
            </Row>;
          }
        }}
      >
        <Space direction="vertical" style={{ width: '100% '}} size="large">
          <Card title={<h3>响应</h3>} style={{ marginBottom: '16px' }}>
            <Row>
              <Col span={10}><h3>屏蔽</h3></Col>
              <Col span={14}>
                <ProFormSwitch 
                  name={['shields', 'block']}
                  label={<b>是否屏蔽</b>}
                  extra="屏蔽有密码风险的账户。"
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}><h3>通知</h3></Col>
              <Col span={14}>
                <ProFormSwitch 
                  name={['shields', 'user_notification']}
                  label={<b>发送通知给受影响的用户</b>}
                  extra="通过 电子邮件/短信/企业微信/钉钉/slack/飞书 发送通知"
                />
                <ProFormCheckbox.Group
                  name="admin_notification_frequency"
                  label={<b>发送通知给管理员</b>}
                  extra="通过 电子邮件/短信/企业微信/钉钉/slack/飞书 发送通知"
                  options={[
                    {
                      label: '立即',
                      value: 'immediately',
                    },
                    {
                      label: '每天',
                      value: 'daily',
                    },
                    {
                      label: '每周',
                      value: 'weekly',
                    },
                    {
                      label: '每月',
                      value: 'monthly',
                    }
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </Space>
      </ProForm>
    </Space>
  </PageContainer>
};

export default BreachedPassword;

