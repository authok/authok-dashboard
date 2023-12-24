import React, { useCallback, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { notification, Tag, Badge, Space, Button, Card, Row, Col, Switch, Divider } from 'antd';
import { useConfigDetails, useConfigSet } from '@/hooks/config';
import ProForm, { ProFormSwitch, ProFormDigit, ProFormDependency, ProFormTextArea } from '@ant-design/pro-form';
import CheckCardSelect from '@/components/CheckCardSelect';
import { useForm } from 'antd/es/form/Form';

const SuspiciousIPThrottling: React.FC = () => {
  const { data: suspiciousIpThrottlingConfig, loading } = useConfigDetails('protection-config', 'suspicious-ip-throttling');
  const { run: setConfig, loading: loadingSet } = useConfigSet();

  const [form] = useForm();

  const [enabled, setEnabled] = useState<boolean>(false);

  useEffect(() => {
    if (!loading) {
      form.setFieldsValue(suspiciousIpThrottlingConfig?.value);
      setEnabled(suspiciousIpThrottlingConfig?.enabled || false);
    }
  }, [suspiciousIpThrottlingConfig, loading]);

  const handleEnabled = useCallback(async (enabled: boolean) => {
    await setConfig('protection-config', 'suspicious-ip-throttling', { enabled });

    setEnabled(enabled);

    if (enabled) {
      notification.success({
        key: 'suspicious-ip-throttling.set',
        message: '可疑IP限流已开启'
      });
    } else {
      notification.success({
        key: 'suspicious-ip-throttling.set',
        message: '可疑IP限流已关闭'
      });
    }
  }, [suspiciousIpThrottlingConfig]);

  const handleUpdate = useCallback(async (options) => {
    await setConfig('protection-config', 'suspicious-ip-throttling', { value: options });
    notification.success({
      key: 'suspicious-ip-throttling.set',
      message: '设置成功'
    });
  }, [suspiciousIpThrottlingConfig]);

  return <PageContainer title={false}>
    <Space direction="vertical" style={{ width: '100% '}} size="large">
      <Row align="middle" gutter={16} style={{ marginTop: 16 }}>
        <Col span={20}>
          <Space direction="vertical" style={{ width: '100% '}} size="middle">
            <Space direction="horizontal" align="center" size="middle">
              <span style={{ fontSize: '27px' }}><b>可疑IP限流</b></span>
              { !loading && (enabled ? <Tag color="default"><Badge status="success" text="已开启" /></Tag> : <Tag color="default"><Badge color="gray" text="已关闭" /></Tag>)}
            </Space>
            <p>保护您的帐户免受来自单IP地址的多帐户攻击。</p>
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
          threshold_type: 'default',
          'pre-login': {
            max_attempts: 100,
            rate: 100,
          },
          'pre-registration': {
            max_attempts: 50, 
            rate: 3,
          }
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
                <h3>可疑IP阈值</h3>
                <p>在采取攻击缓解措施之前，管理单个IP地址允许的错误登录和注册尝试次数。</p>
              </Col>
              <Col span={14}>
                <ProForm.Item name="threshold_type">
                  <CheckCardSelect style={{ width: '100%' }} cardStyle={{ width: '100%' }} options={[{
                    title: '默认',
                    value: 'default',
                    description: '采用系统的标准设置',
                  },
                  {
                    title: '自定义',
                    value: 'custom',
                    description: '自定义阈值',
                  }]} />
                </ProForm.Item>
              </Col>
            </Row>
            <Divider />
            <ProFormDependency name={['threshold_type']}>
              {({ threshold_type }) => threshold_type === 'custom' && (<>
                <Row>
                  <Col span={10}><h3>登录阈值</h3></Col>
                  <Col span={14}>
                    <ProFormDigit 
                      name={['pre-login', 'max_attempts']} 
                      label={<b>最大次数</b>}
                      required 
                    />
                    <ProFormDigit 
                      name={['pre-login', 'rate']} 
                      label={<b>频率</b>}
                      fieldProps={{
                        addonAfter: '每天',
                      }}
                      required 
                    />
                  </Col>
                </Row>
                <Divider />
                <Row>
                  <Col span={10}><h3>注册阈值</h3></Col>
                  <Col span={14}>
                    <ProFormDigit 
                      name={['pre-registration', 'max_attempts']} 
                      label={<b>最大次数</b>}
                      required 
                    />
                    <ProFormDigit 
                      name={['pre-registration', 'rate']} 
                      label={<b>频率</b>}
                      fieldProps={{
                        addonAfter: '每天',
                      }}
                      required 
                    />
                  </Col>
                </Row>
                <Divider />
              </>)}
            </ProFormDependency>
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
                  extra="过多帐户的登录尝试超过阀值时，限制来自IP地址的流量。"
                />
              </Col>
            </Row>
            <Divider />
            <Row>
              <Col span={10}><h3>通知</h3></Col>
              <Col span={14}>
                <ProFormSwitch 
                  name={['shields', 'notification']}
                  label={<b>发送通知给管理员</b>}
                  extra="当一个或多个IP地址的流量因超过阀值限流时，发送 电子邮件/企业微信/钉钉/slack 通知。"
                />
              </Col>
            </Row>
          </Card>
        </Space>
      </ProForm>
    </Space>
  </PageContainer>
};

export default SuspiciousIPThrottling;

