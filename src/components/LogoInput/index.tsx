import React, { useState } from 'react';
import Avatar from 'antd/lib/avatar/avatar';
import { Card, Input } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import { useDebounce } from '@umijs/hooks';

interface LogoInputProps {
  value?: string;
  onChange?: (v: string) => void;
}

const LogoInput: React.FC<LogoInputProps> = ({ value: _value, onChange }) => {
  const [value, setValue] = useState(_value);
  const debouncedValue = useDebounce(value, 500);

  const input = (
    <div style={{ paddingLeft: '8px', paddingRight: '8px' }}>
      <Input addonBefore={<LinkOutlined />} value={_value} onChange={(e) => {
        setValue(e.target.value);
        return onChange?.(e.target.value);
      }}/>
    </div>
  );

  return <Card bordered className={"pro-field-xl"} actions={[input]}>
    <Card.Grid style={{ width: '100%', textAlign: 'center' }} hoverable={false}><Avatar shape="square" src={debouncedValue} size={64}/></Card.Grid>
  </Card>;
};

export default LogoInput;