import React, { useEffect, useState } from 'react';
import { Select, Input } from 'antd';
const { Option } = Select;

export interface LinkInputProps {
  name?: string;
  value?: string;
  onChange?: (v: string) => void;
}

const LinkInput: React.FC<LinkInputProps> = ({ value, onChange }) => {
  let _value: string = '';
  let _prefix: string = 'https://';
  if (value?.startsWith('http://')) {
    _prefix = 'http://'
    _value = value.substr(7);
  } else if(value?.startsWith('https://')) {
    _prefix = 'https://'
    _value = value.substr(8);
  }
  
  console.log('xxo: ', value, _prefix, _value);

  const [prefix, setPrefix] = useState<string>(_prefix || '');
  const [val, setVal] = useState<string>(_value || '');

  useEffect(() => {
    console.log('change prefix: ', prefix);
    console.log('change value: ', val);

    onChange?.(prefix + val);
  }, [prefix, val]);

  return (
    <Input 
      value={_value} 
      onChange={(e) => setVal(e.target.value)} 
      size="large"
      addonBefore={
        <Select value={_prefix} style={{ width: '90px' }} onChange={(e) => setPrefix(e)}>
          <Option value="https://">https://</Option>
          <Option value="http://">http://</Option>
        </Select>
      }
    />
  );
};


export default LinkInput;