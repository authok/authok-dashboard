import React, { useMemo, useCallback } from 'react';
import { notification, Form, Table, Space, Card, Row, Col, Button, Divider, Typography, Tag, Dropdown, Menu, Input, Tooltip } from 'antd';
import { useSigningKeys, useRotateSigningKeys } from '@/hooks/signing-key';
import { DownloadOutlined } from '@ant-design/icons';
const { Text } = Typography;
import moment from 'moment';

interface SigningKeysProps {
  tenant: API.Tenant;
}

const SigningKeys: React.FC<SigningKeysProps> = ({ tenant }) => {
  const { data: signingKeys, refresh } = useSigningKeys();
  const { run: rotate, loading: loadingRotate } = useRotateSigningKeys();
  const using = useMemo(() => (signingKeys || []).filter(it => !it.revoked).sort((a, b) => {
    const i1 = (a.previous && 0) || (a.current && 1) || (a.next && 2);
    const i2 = (b.previous && 0) || (b.current && 1) || (b.next && 2);
    return i1 > i2 ? -1 : 1;
  }), [signingKeys]);
  const revoked = useMemo(() => (signingKeys || []).filter(it => !!it.revoked), [signingKeys]);

  const handleRotate = useCallback(async () => {
    await rotate();

    refresh();

    notification.success({
      key: 'key.rotate',
      message: '密钥轮换成功',
    });
  }, [signingKeys]);

  return <Card bordered={false}>
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card bordered>
        <Row align="middle">
          <Col style={{ flex: 1 }}>
            <h3>轮换签名密钥</h3>
            <p>
              仅仅轮换当前使用的签名密钥. 所有用此密钥签名的令牌仍继续有效.
            </p>
          </Col>
          <Col>
            <Button size="large" loading={loadingRotate} onClick={handleRotate}>轮换</Button>
          </Col>
        </Row>
        <Divider />
        <Row align="middle">
          <Col style={{ flex: 1 }}>
            <h3>轮换 & 回收签名密钥</h3>
            <p>
              轮换并回收当前使用的签名密钥. 所有当前被签名的令牌都将失效.
            </p>
          </Col>
          <Col>
            <Button size="large" danger type="primary">轮换并回收密钥</Button>
          </Col>
        </Row>
      </Card>
      <Table<API.SigningKey>
        rowKey="kid"
        pagination={false}
        columns={[
          {
            title: 'ID',
            dataIndex: 'kid',
            render: (text) => <Text code>{text}</Text>
          },
          {
            title: '状态',
            render: (_text, record) => {
              if (record.next) {
                return <Tag color="blue">队列中</Tag>
              } else if (record.current) {
                return <Tag color="green">正在使用</Tag>  
              } else if (record.previous) {
                return <Tag color="gray">之前使用</Tag>
              }
            }
          },
          {
            render: (text, record) => {
              return <Row justify="end">
                <Tooltip title="下载签名证书">
                  <a href="#">
                    <DownloadOutlined/>
                  </a>
                </Tooltip>
              </Row>;
            }
          }
        ]}
        dataSource={using}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: (record) => {
            return <Card bordered>
              <Form 
                size="large"
                wrapperCol={{
                  xl: 24,
                }}
                labelAlign="left"
                labelCol={{
                  xl: 24,
                }}
              >
                <Form.Item label="签名证书">
                  <Input.TextArea value={record.cert} 
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    editable={false} addonAfter={<Text copyable={{ text: record.cert }}/>}/>
                </Form.Item>
                <Form.Item label="签名证书Fingerprint">
                  <Input value={record.fingerprint} disabled suffix={<Text copyable={{ text: record.fingerprint }}/>}/>
                </Form.Item>
                <Form.Item label="签名证书Thumbprint">
                  <Input value={record.thumbprint} disabled suffix={<Text copyable={{ text: record.thumbprint }}/>}/>
                </Form.Item>
              </Form>
            </Card>
          }
        }}
      />

      <Table<API.SigningKey>
        rowKey="kid"
        pagination={false}
        columns={[
          {
            title: 'ID',
            dataIndex: 'kid',
            render: (text) => <Text code>{text}</Text>
          },
          {
            title: '撤销时间',
            dataIndex: 'revokedAt',
            render: (text) => text ? moment(text).format('YYYY-MM-DD hh:mm:ss') : '-',
          },
          {
            render: (text, record) => {
              return <Row justify="end">
                <Tooltip title="下载签名证书">
                  <a href="#">
                    <DownloadOutlined/>
                  </a>
                </Tooltip>
              </Row>;
            }
          }
        ]}
        dataSource={revoked}
        expandable={{
          defaultExpandAllRows: true,
          expandedRowRender: (record) => {
            return <Card bordered>
              <Form 
                size="large"
                wrapperCol={{
                  xl: 24,
                }}
                labelAlign="left"
                labelCol={{
                  xl: 24,
                }}
              >
                <Form.Item label="签名证书">
                  <Input.TextArea value={record.cert} 
                    autoSize={{ minRows: 6, maxRows: 6 }}
                    editable={false} addonAfter={<Text copyable={{ text: record.cert }}/>}/>
                </Form.Item>
                <Form.Item label="签名证书Fingerprint">
                  <Input value={record.fingerprint} disabled suffix={<Text copyable={{ text: record.fingerprint }}/>}/>
                </Form.Item>
                <Form.Item label="签名证书Thumbprint">
                  <Input value={record.thumbprint} disabled suffix={<Text copyable={{ text: record.thumbprint }}/>}/>
                </Form.Item>
              </Form>
            </Card>
          }
        }}
      />
    </Space>
  </Card>;
};

export default SigningKeys;