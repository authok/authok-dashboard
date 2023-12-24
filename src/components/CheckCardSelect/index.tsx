import React from 'react';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { useCallback, CSSProperties } from 'react';
import { CheckCard } from '@ant-design/pro-card';

interface CheckCardSelectProps {
  value?: string;
  onChange?: (val: string | undefined, prevValue?: string | undefined) => void;
  options?: any[];
  style?: CSSProperties;
  cardStyle?: CSSProperties;
  loading?: boolean;
}

const CheckCardSelect: React.FC<CheckCardSelectProps> = ({ value: _value, onChange, loading = false, options, style, cardStyle }) => {
  const [value, setValue] = useMergedState<string | undefined>(_value, {
    value: _value,
    onChange,
  });
  
  const handleChange = useCallback((v) => {
    if (v) {
      setValue(v);
    }
  }, [_value]);

  return <CheckCard.Group value={value} style={style} onChange={handleChange} loading={loading}>
    {options?.map((it) => <CheckCard style={cardStyle} key={it.value} avatar={it.avatar} value={it.value} title={it.title} description={it.description}/>)}
  </CheckCard.Group>;
};

export default CheckCardSelect;
