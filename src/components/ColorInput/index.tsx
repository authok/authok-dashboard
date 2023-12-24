import React from 'react';
import { Popover, Input } from 'antd';
import { SketchPicker } from 'react-color';

interface ColorInputProps {
  value?: string;
  onChange?: (value?: string) => void;
}

const ColorInput: React.FC<ColorInputProps> = ({ value, onChange }) => {
  const defaultColor = '#69c0ff';

  const colorOption = (
    <div>
      <Popover
        trigger="click"
        placement="bottom"
        content={<SketchPicker
        color={value || defaultColor}
        onChangeComplete={({ hex }) => onChange?.(hex)}/>}
      >
        <div 
          style={{
            height: 20, 
            width: 20,
  　　　　　　background: value || defaultColor,
  　　　　　　border: '1px solid #E6E6E6',
  　　　　　　borderRadius: '3'
          }}
        />
      </Popover>
    </div>
　);

  return <Input value={value}
    onChange={e => onChange?.(e.target.value)}
    placeholder={defaultColor}
    prefix={colorOption}
    style={{ width: 180 }}
  />;
};

export default ColorInput;