import React, { useCallback } from 'react';
import { CheckCard } from '@ant-design/pro-card';
import Avatar from 'antd/lib/avatar/avatar';
import useMergedState from 'rc-util/lib/hooks/useMergedState';

interface RegionSelectProps {
  value?: string;
  regions?: API.Region[];
  onChange?: (val: string) => void;
}

const RegionCheckCard: React.FC<{ region: API.Region }> = ({ region }) => {  
  return (
    <CheckCard
      value={region.name}
      avatar={<Avatar size="small" shape="square" />} 
      title={region.display_name}
      style={{ width: '120px' }}
    />
  );
}

const RegionSelect: React.FC<RegionSelectProps> = ({ value: _value, onChange, regions }) => {
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
    {regions?.map((it) => <RegionCheckCard key={it.name} region={it}/>)}
  </CheckCard.Group>;
};

export default RegionSelect;