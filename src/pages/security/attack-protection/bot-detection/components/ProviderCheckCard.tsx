import { CheckCard, CheckGroupValueType } from '@ant-design/pro-card';
import useMergedState from 'rc-util/lib/hooks/useMergedState';
import { useCallback } from 'react';

interface ProviderCheckCardProps {
  value?: string;
  onChange?: (val: CheckGroupValueType) => void;
  options?: API.CatpchaProvider[];
}

const ProviderCheckCard: React.FC<ProviderCheckCardProps> = ({ value: _value, onChange, options }) => {  
  const [value, setValue] = useMergedState<string | undefined>(_value, {
    value: _value,
    onChange,
  });
  
  const handleChange = useCallback((v) => {
    if (v) {
      setValue(v);
    }
  }, [_value]);
  
  return <CheckCard.Group style={{ width: '100%' }} value={value} onChange={handleChange}>
    {options?.map(option => 
      <CheckCard
        key={option.name}
        style={{ width: '100%' }}
        title={option.title} 
        value={option.name} 
      />)
    }
  </CheckCard.Group>;
};

export default ProviderCheckCard;