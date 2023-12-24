import React, { useCallback } from 'react';
import { CheckCard } from '@ant-design/pro-card';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { BuildFilled, CodeFilled, CheckSquareFilled } from '@ant-design/icons';

const environments = [
  {
    name: 'development',
    title: '开发',
    avatar: <CodeFilled style={{ fontSize: '24px'}}/>,
  },
  {
    name: 'staging',
    title: '测试',
    avatar: <BuildFilled style={{ fontSize: '24px'}}/>,
  },
  {
    name: 'production',
    title: '生产',
    avatar: <CheckSquareFilled style={{ fontSize: '24px'}}/>,
  },
];

interface EnvironmentSelectProps {
  value?: string;
  onChange?: (val: string) => void;
}

const EnvironmentSelect: React.FC<EnvironmentSelectProps> = ({ value: _value, onChange }) => {
  const [value, setValue] = useMergedState<string | undefined>(_value, {
    value: _value,
    onChange,
  });
  
  const handleChange = useCallback((v) => {
    if (v) {
      setValue(v);
    }
  }, [_value]);

  return <CheckCard.Group value={value} style={{ width: '100%' }} onChange={handleChange}>
    {environments?.map((it) => <CheckCard style={{ width: '120px' }} key={it.name} avatar={it.avatar} value={it.name} title={it.title} />)}
  </CheckCard.Group>;
};

export default EnvironmentSelect;