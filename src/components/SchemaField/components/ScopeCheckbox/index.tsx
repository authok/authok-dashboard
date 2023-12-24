import React from 'react';
import { Checkbox, Row, Tooltip, Typography, Space } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
const { Text } = Typography;
import { connect, mapProps, mapReadPretty } from '@formily/react'

interface Scope {
  label: string;
  value?: string;
  tooltip?: string;
} 

interface ScopeCheckboxProps {
  scope: Scope;
  value?: CheckboxValueType;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checkedValue: CheckboxValueType) => void;
  disabled?: boolean;
}

const _ScopeCheckbox: React.FC<ScopeCheckboxProps> = ({ scope, value, defaultChecked, checked, onChange, disabled }) => {
  return (
    <div style={{
      margin: '8px',
      width: '300px',
    }}>
      <Checkbox 
        onChange={onChange}
        value={value}
        checked={checked}
        disabled={disabled}
        defaultChecked={defaultChecked}
      >
        <Row>
          <Space direction="horizontal">
            {scope.label}
            { scope.tooltip && <Tooltip title={scope.tooltip}><QuestionCircleOutlined /></Tooltip>}
          </Space>
        </Row>
        <Row><Text code>{scope.value}</Text></Row>
      </Checkbox>
    </div>
  );
};


interface GroupProps {
  options?: Scope[];
  value?: Array<CheckboxValueType>;
  onChange?: (checkedValue: Array<CheckboxValueType>) => void;
}

const _Group: React.FC<GroupProps> = ({ value, onChange, options }) => {    
  return <Checkbox.Group value={value} onChange={onChange}>
    <Space>{options?.map(option => <ScopeCheckbox scope={option} value={option.value} />)}</Space>
  </Checkbox.Group>;
};


export const Group = connect(
  _Group,
  mapProps({
    dataSource: 'options',
  }),
)
 
const ScopeCheckbox = connect(
  _ScopeCheckbox,
  mapProps({
    value: 'checked',
    onInput: 'onChange',
  })
);

export default ScopeCheckbox;