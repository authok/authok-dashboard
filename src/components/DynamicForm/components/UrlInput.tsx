import React from 'react';
import { Input, Select } from 'antd';
import { InputProps } from 'antd/lib/input';

const { Option } = Select;

const selectBefore = (
  <Select defaultValue="http://" style={{ width: '90px' }}>
    <Option value="https://">https://</Option>
    <Option value="http://">http://</Option>
  </Select>
);

export const UrlInput: React.FC<InputProps> = (props) => {
  return <Input addonBefore={selectBefore} {...props} />;
};
