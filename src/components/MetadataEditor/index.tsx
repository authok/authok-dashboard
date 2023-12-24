import React, { useMemo, useCallback } from "react";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Table, Popconfirm, Space, Row, Input, Col, Button } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useForm } from "antd/lib/form/Form";

interface MetadataEditorProps {
  value?: Record<string, any>;
  onChange?:(v: Record<string, any>) => void;
}

const MetadataEditor: React.FC<MetadataEditorProps> = ({ value, onChange }) => {
  const items = useMemo(() => {
    const items = [];
    for(let key in value) {
      items.push({ key, value: value[key]});
    }
    return items;
  }, [value]);

  const [form] = useForm();

  const handleAdd = useCallback(({ key, value }: { key: string; value: string; }) => {
    const index = items.findIndex((value, index) => key === value.key);
    const newItems = [...items];
    if (index === -1) {
      const newItem = { key, value };
      newItems.push(newItem);
    } else {
      newItems[index] = { key, value };
    }

    const newMetadata = {};
    for (const item of newItems) {
      newMetadata[item.key] = item.value;      
    }

    onChange?.(newMetadata);

    form.resetFields();
  }, [items]);

  const handleDelete = (i: number) => {
    const newItems = [...items];
    newItems.splice(i, 1);

    const newMetadata = {};
    for (const item of newItems) {
      newMetadata[item.key] = item.value;      
    }

    onChange?.(newMetadata);
  };

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
      valueType: 'option',
      render: (a, record, rowNumber) => {
        return (
          <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleDelete(rowNumber)}>
            <DeleteOutlined />
          </Popconfirm>
        ); 
      },
    }
  ];

  return <Space direction="vertical" style={{ padding: '16px', width: '100%' }}>
    <Form form={form} onFinish={handleAdd}>
      <Row gutter={16}>
        <Col span={10}>
          <Form.Item name="key" rules={[{ required: true, message: '不能为空' }]} normalize={(val) => val.trim()}>
            <Input placeholder="key" />
          </Form.Item>
        </Col>
        <Col span={10}>
          <Form.Item name="value" rules={[{ required: true, message: '不能为空' }]} normalize={(val) => val.trim()}>
            <Input placeholder="value" />
          </Form.Item>
        </Col>
        <Col span={4}><Button htmlType="submit" icon={<PlusOutlined />}>添加</Button></Col>
      </Row>
    </Form>
    <Table
      width="100%"
      size="large"
      columns={columns}
      dataSource={items}
      pagination={false}
    />
  </Space>;
};

export default MetadataEditor;