import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { notification, Tag, Badge, Space, Button, Card, Row, Col, Switch, Divider } from 'antd';
import { useConfigDetails, useConfigSet } from '@/hooks/config';
import ProForm, { ProFormSwitch, ProFormDigit, ProFormDependency, ProFormTextArea } from '@ant-design/pro-form';
import { useForm } from 'antd/es/form/Form';

const BruteForce: React.FC = () => {
  const { data: bruteForceConfig, loading } = useConfigDetails('protection-config', 'brute-force');
  const { run: setConfig, loading: loadingSet } = useConfigSet();

  const [form] = useForm();

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      form.setFieldsValue(bruteForceConfig?.value);
      setEnabled(bruteForceConfig?.enabled || false);
    }
  }, [bruteForceConfig, loading]);

  const handleEnabled = useCallback(async (enabled: boolean) => {
    await setConfig('protection-config', 'brute-force', { enabled });

    setEnabled(enabled);

    if (enabled) {
      notification.success({
        key: 'brute-force.set',
        message: '暴力攻击防护已开启'
      });
    } else {
      notification.success({
        key: 'brute-force.set',
        message: '暴力攻击防护已关闭'
      });
    }
  }, [bruteForceConfig]);

  const handleUpdate = useCallback(async (_options) => {
    const options = {..._options};
    if (_options.mode) {
      options.mode = 'count_per_identifier';
    } else {
      options.mode = 'count_per_identifier_ip';
    }

    await setConfig('protection-config', 'brute-force', { value: options });
    notification.success({
      key: 'brute-force.set',
      message: '设置成功'
    });
  }, [bruteForceConfig]);

  return <PageContainer title={false}>
    <Space direction="vertical" style={{ width: '100% '}} size="large">
      <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
        <Col span={20}>
          <Space direction="vertical" style={{ width: '100% '}} size="middle">
            <Space direction="horizontal" align="center" size="middle">
              <span style={{ fontSize: '27px' }}><b>暴力攻击防护</b></span>
              {enabled ? <Tag color="default"><Badge status="success" text="已开启" /></Tag> : (!loading && <Tag color="default"><Badge color="gray" text="已关闭" /></Tag>)}
            </Space>
            <p>防止针对单个用户帐户的暴力攻击。默认情况下，此功能分别限制每个源IP地址的登录尝试，以限制攻击者将合法用户锁定在其帐户之外的可能性。无论IP地址是否变化，都可启用帐户锁定模式来限制登录。</p>
          </Space>
        </Col>
        <Col span={4}>
          <Row justify="end" align="middle">
            <Switch checked={enabled} onChange={handleEnabled} loading={loadingSet}/>
          </Row>
        </Col>
      </Row>

      <ProForm
        form={form}
        size="large"
        onFinish={handleUpdate}
        initialValues={{
          max_attempts: 100,
          mode: false,
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
          <Card title={<h3>检测</h3>}>
            <Row gutter={[16, 16]}>
              <Col span={10}>
                <h3>登录阈值</h3>
                <p>超过此阈值将屏蔽登录。</p>
              </Col>
              <Col span={14}>
                <ProFormDigit 
                  name="max_attempts"
                  label="最大尝试次数"
                  required
                  max="100"
                  min="1"
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}><h3>IP白名单</h3></Col>
              <Col span={14}>
                <ProFormTextArea 
                  name="whitelist" 
                  label={<b>IP地址白名单</b>} 
                  placeholder="25.31.21.42, 32.10.221.31"
                  fieldProps={{
                    autoSize: { minRows: 5, maxRows: 5 },
                  }}
                  extra="您可以创建一个可信IP地址列表，系统不会对来自这些IP的访问实施攻击保护。可通过逗号分隔指定多个IP地址或范围。可以使用IPv4, IPv6还有CIDR格式。"
                />
              </Col>
            </Row>
          </Card>
          <Card title={<h3>响应</h3>} style={{ marginBottom: '16px' }}>
            <Row>
              <Col span={10}><h3>限流屏蔽</h3></Col>
              <Col span={14}>
                <ProFormSwitch 
                  name={['shields', 'block']}
                  label={<b>是否屏蔽</b>}
                  extra="登录失败次数超过阀值时，限制来自目标IP地址的登入。"
                />
                <ProFormSwitch 
                  name={['mode']}
                  label={<b>账号锁定</b>}
                  extra="登录失败次数超过阀值时，锁定账户，任何IP都无法登入。"
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
                  extra="当用户帐户被屏蔽时，向其发送 电子邮件/短信/企业微信/钉钉/slack/飞书"
                />
              </Col>
            </Row>
          </Card>
        </Space>
      </ProForm>
    </Space>
  </PageContainer>
};

export default BruteForce;

