import React, { useCallback, useState, useEffect } from 'react';
import { Input, Form, Card, Row, Col, Button, Popconfirm, Table, Typography, Space } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { useIntl } from 'umi';
const { Text } = Typography;

interface ConfigEditorProps {
  loading: boolean;
  value: Var[];
  onChange: (value: Var[]) => void;
}

interface Var {
  key: string;
  value: any;
} 

const ConfigEditor: React.FC<ConfigEditorProps> = ({ value: _value, loading, onChange }) => {
  const { formatMessage } = useIntl();

  const [items, setItems] = useState<Var[]>(_value);

  useEffect(() => {
    console.log('changedxxxx');
    setItems(_value);
  }, [_value]);

  const handleAdd = useCallback((item: Var) => {
    const index = items.findIndex((value, index) => item.key === value.key);
    const newItems = [...items];
    if (index === -1) {
      newItems.push(item);
    } else {
      newItems[index] = item;
    }

    setItems(newItems);

    onChange?.(newItems);
  }, [_value, items]);

  const handleDelete = useCallback((i: number) => {
    const newItems = [...items];
    newItems.splice(i, 1);

    setItems(newItems);

    onChange?.(newItems);
  }, [_value, items]);

  const columns: ColumnsType<{ key: string; value: any; }> = [
    {
      title: 'Key',
      key: 'key',
      dataIndex: 'key',
    },
    {
      title: 'Value',
      dataIndex: 'value',
    },
    {
      title: '复制代码',
      render: (text, row) => {
        const code = `config.${row.key}`;
        return <Text copyable={code}><Text code>{code}</Text></Text>;
      }
    },
    {
      valueType: 'option',
      render: (a, row, rowNumber) => {
        return (
          <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleDelete(rowNumber)}>
            <DeleteOutlined style={{ color: 'red' }}/>
          </Popconfirm>
        ); 
      },
    }
  ];

  return (
    <Card>
      <Form onFinish={handleAdd}>
        <Row>
          <Col>
            <h3>{formatMessage({ id: 'component.connection.database.settings.title' })}</h3>
            <p>变量对所有脚本可见. 通过全局 config 变量进行访问.</p>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={10}>
            <Form.Item name="key" required rules={[{ required: true, message: '不能为空' }]} normalize={(val) => val.trim()}>
              <Input placeholder="key"/>
            </Form.Item>
          </Col>
          <Col span={10}>
            <Form.Item name="value" required rules={[{ required: true, message: '不能为空' }]}>
              <Input placeholder="value"/>
            </Form.Item>
          </Col>
          <Col span={4}><Button htmlType="submit" loading={loading} size="default" icon={<PlusOutlined />}>添加</Button></Col>
        </Row>
        <Table
          width="100%"
          size="large"
          columns={columns}
          dataSource={items}
          pagination={false}
        />
    </Form>
  </Card>);
}

export default ConfigEditor;