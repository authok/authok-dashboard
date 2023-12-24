import React, { useCallback } from 'react';
import { message, Space, Button, Row, List, Col, Empty, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { ModalForm, ProFormText } from '@ant-design/pro-form';

interface SecretEditorProps {
  value?: API.ActionSecret[];
  onChange?: (value?: API.ActionSecret[]) => void;
}

const SecretEditor: React.FC<SecretEditorProps> = ({ value, onChange }) => {  
  const handleAddSecret = useCallback(async (secret): Promise<boolean> => {
    if (value && value.find(it => it.name === secret.name)) {
      message.error('已存在同名secret');
      return false;
    }

    const newValue = [...(value || [])];
    newValue?.push(secret);
    onChange?.(newValue);

    return true;
  }, [value]);

  const handleEditSecret = (index: number) => (secret: API.ActionSecret) => {
    const newValue = [...value];
    newValue[index] = secret;
    onChange?.(newValue);
    return true;
  };

  const handleDeleteSecret = (index: number) => () => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange?.(newValue);
    return true;
  }

  return <Space direction="vertical" style={{ width: '100%' }}>
    <List 
      rowKey="name"
      dataSource={value}
      renderItem={(item, index) => {
        return <List.Item>
          <Row gutter={[8, 8]} style={{ fontSize: 14, color: '#FFFFFF', width: '100%' }}>
            <Col flex="auto">
              <Tag>{item.name}</Tag>
            </Col>
            <Col flex="32px">
              <Space>
                <EditSecretDialog title="编辑Secret" value={item} onFinish={handleEditSecret(index)} trigger={<a><EditOutlined /></a>} />                
                <a onClick={handleDeleteSecret(index)}><DeleteOutlined /></a>
              </Space>
            </Col>
          </Row>
        </List.Item>
      }}
      locale={{
        emptyText: <Empty />
      }}
    />
    <Row justify="center">
      <EditSecretDialog title="新增Secret" onFinish={handleAddSecret} trigger={<Button type="primary">添加Secret</Button>} />
    </Row>
  </Space>;
};

interface EditSecretDialogProps {
  title: string;
  value?: API.ActionSecret;
  trigger: JSX.Element;
  onFinish?: (secret: API.ActionSecret) => Promise<boolean>;
}

const EditSecretDialog: React.FC<EditSecretDialogProps> = ({ title, value, trigger, onFinish }) => {
  return (
    <ModalForm<API.ActionSecret>
      title={title}
      size="large"
      trigger={trigger}
      onFinish={onFinish}
      initialValues={value}
      modalProps={{
        destroyOnClose: true,
        centered: true,
      }}
    >
      <ProFormText label="名称" name="name" rules={[{ required: true }]} />
      <ProFormText label="值" name="value" rules={[{ required: true }]} />
    </ModalForm>
  );
};

export default SecretEditor;