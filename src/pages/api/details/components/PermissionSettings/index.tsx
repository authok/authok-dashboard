import React, { useCallback, useState } from 'react';
import { Space, Typography, Row, Col, Button, Popconfirm, message } from 'antd';
import { DeleteOutlined, PlusOutlined, EditOutlined } from '@ant-design/icons';
import ProForm, { ProFormText } from '@ant-design/pro-form'
import { EditableProTable } from '@ant-design/pro-table'
import { useForm } from 'antd/lib/form/Form';
const { Text } = Typography;

interface PermissionSettingsProps {
  loading?: boolean;
  resourceServer: API.ResourceServer;
  loadingUpdate?: boolean;
  onUpdate: (resourceServer: Partial<API.ResourceServer>) => Promise<boolean>;
}

const PermissionSettings: React.FC<PermissionSettingsProps> = ({ loading, loadingUpdate, resourceServer, onUpdate }) => {
  const [form] = useForm();

  const handleAddScope = useCallback(async (scope: API.Scope) => {
    const scopes = resourceServer.scopes || [];

    const idx = scopes.findIndex(it => it.value === scope.value);
    if (idx >= 0) {
      message.warning('该权限已经存在');
      return;
    }

    const newScopes = [...scopes, scope];

    const data = { scopes: newScopes };

    await onUpdate(data);
    form.resetFields();
  }, [resourceServer]);

  const handleEditScope = useCallback(async (index: number, scope: API.Scope) => {
    const scopes = resourceServer.scopes || [];
    const newScopes = [...scopes];
    newScopes[index] = scope;

    const data = { scopes: newScopes };

    await onUpdate(data);
  }, [resourceServer]);

  const handleDeleteScope = useCallback(async (index: number, scope: API.Scope) => {
    const newScopes =  [...resourceServer.scopes];
    newScopes.splice(index, 1);

    const data = { scopes: newScopes };

    await onUpdate(data);
  }, [resourceServer]);

  const columns = [
    {
      title: '权限',
      dataIndex: 'value',
      editable: false,
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: '描述',
      editable: true,
      dataIndex: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 120,
      render: (text, record, index, action) => {
        return (!resourceServer.is_system && <Space direction="horizontal" size="middle">
            <a onClick={() => action?.startEditable?.(record.value)}><EditOutlined /></a>
            <Popconfirm title="确定删除此条记录" okText="确定" cancelText="取消" onConfirm={() => handleDeleteScope(index, record)}>
              <a><DeleteOutlined/></a>
            </Popconfirm>
          </Space>
        );
      }
    }
  ];
  
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  return <Space direction="vertical" style={{ width: '100%' }}>
    { !resourceServer.is_system && <ProForm<API.Scope>
        form={form}
        onFinish={handleAddScope}
        submitter={false}
        size="large"
      >
        <Row gutter={16}>
          <Col span={10}>
            <ProFormText 
              label={<b>权限(Scope)</b>} name="value" placeholder="read:articles" rules={[ { required: true, message: '不能为空' }]}
              normalize={(value: string) => value.trim()}
            />
          </Col>
          <Col span={10}>
            <ProFormText label={<b>描述</b>} name="description" placeholder="读取文章" rules={[ { required: true, message: '不能为空' }]} />
          </Col>
          <Col span={4}>
            <ProForm.Item label={<div></div>}>
              <Button loading={loadingUpdate} htmlType="submit" icon={<PlusOutlined />} >添加</Button>
            </ProForm.Item>
          </Col>
        </Row>
      </ProForm>
    }
    <EditableProTable<API.Scope>
      options={false}
      search={false}
      title={() => <b>权限列表(共{resourceServer.scopes.length}项)</b>}
      loading={loading}
      rowKey="value"
      columns={columns}
      value={resourceServer.scopes}
      editable={{
        type: 'multiple',
        actionRender: (row, config, defaultDom) => [defaultDom.save, defaultDom.cancel],
        editableKeys,
        onSave: async (rowKey, data, row) => {
          console.log(rowKey, data, row);
          const { index, ...restData } = data;
          handleEditScope(row.index, restData);
        },
        onChange: setEditableRowKeys,
      }}
      recordCreatorProps={false}
      pagination={false}
    />
  </Space>;
};

export default PermissionSettings;