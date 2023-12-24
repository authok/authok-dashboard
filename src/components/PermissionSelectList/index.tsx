import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useSelections } from '@umijs/hooks';
import { Input, List, Space, Row, Col, Checkbox, Button, Tooltip, Card } from 'antd';
import { QuestionCircleOutlined, SearchOutlined } from '@ant-design/icons';

interface PermissionSelectListProps {
  permissions: Partial<API.Permission>[];
  rowKey: React.Key;
  rowSelection?: {
    selectedRowKeys?: React.Key[],
    onChange?: (keys: React.Key[]) => void;
  }
}

export const PermissionSelectList: React.FC<PermissionSelectListProps> = ({ rowKey, permissions: _permissions, rowSelection }) => {
  const [filterValue, setFilterValue] = useState<string>('');

  const permissions = useMemo(() => {
    if (filterValue.length > 0) {
      return _permissions.filter((it) => it.permission_name && it.permission_name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0);
    } else {
      return _permissions;
    }
  }, [filterValue, _permissions]);

  const { selected, allSelected, toggle, toggleAll, partiallySelected } = useSelections<React.Key>(permissions?.map(it => it[rowKey]), rowSelection?.selectedRowKeys || []);

  useEffect(() => {
    rowSelection?.onChange?.(selected);
  }, [selected]);

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      <Row align="middle">
        <Col span={6}><b>权限</b></Col>
        <Col span={18}>
          <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
            <Checkbox checked={allSelected} onClick={toggleAll} indeterminate={partiallySelected}>全选</Checkbox>
            <Input prefix={<SearchOutlined />} onChange={(e) => setFilterValue(e.target.value)} placeholder="过滤权限" allowClear />
          </Space>
        </Col>
      </Row>
      {/* 这里用到了 checkbox.Group 就不需要 在每个 checkbox里判断 isSelected 了 */}
      <Checkbox.Group style={{ width: '100%' }} value={selected}>
        <Card style={{ width: '100%', maxHeight: '400px', overflow: 'scroll' }}>
          <List<Partial<API.Permission>>
            rowKey={rowKey}
            itemLayout="horizontal"
            dataSource={permissions}
            renderItem={(permission: Partial<API.Permission>, index: number) => {
              return (
                <Button size="small" key={permission.permission_name} style={{ height: '42px', margin: '8px' }}>
                  <Checkbox
                    onClick={() => permission.permission_name && toggle(permission.permission_name)}
                    value={permission.permission_name}
                  >
                    <Space>
                      {permission.permission_name}
                      { permission.description && <Tooltip title={permission.description}><QuestionCircleOutlined /></Tooltip> }
                    </Space>
                  </Checkbox>
                </Button>
              );
            }}
          />
        </Card>
      </Checkbox.Group>
    </Space>    
  );
}