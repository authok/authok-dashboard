import React, { useMemo } from 'react';
import { Checkbox, Space, Card, Button } from 'antd';
import ProForm from '@ant-design/pro-form';
import * as _ from 'lodash';

const DEFAULT_GRANT_TYPES = [
  {
    label: 'Implicit',
    value: 'implicit',
    group: 'implicit',
  },
  {
    label: '授权码',
    value: 'authorization_code',
    group: 'authorization_code',
  },
  {
    label: '刷新令牌',
    value: 'refresh_token',
    group: 'refresh_token',
  },
  {
    label: '客户端凭证',
    value: 'client_credentials',
    group: 'client_credentials',
  },
  {
    label: '密码',
    value: 'password',
    group: 'password',
  },
  {
    label: '多因素认证',
    value: 'http://authok.cn/oauth/grant-type/mfa-oob',
    group: 'mfa',
  },{
    label: '多因素认证',
    value: 'http://authok.cn/oauth/grant-type/mfa-otp', 
    group: 'mfa',
  },{
    label: '多因素认证',
    value: 'http://authok.cn/oauth/grant-type/mfa-recovery-code',
    group: 'mfa',
  },
  {
    label: '免密登录',
    value: 'http://authok.cn/oauth/grant-type/passwordless/otp',
    group: 'passwordless'
  },
  {
    label: '设备',
    value: 'urn:ietf:params:oauth:grant-type:device_code',
    group: 'urn:ietf:params:oauth:grant-type:device_code'
  }
];

const groupMapping = _.groupBy(DEFAULT_GRANT_TYPES, 'group');
const valueMapping = _.keyBy(DEFAULT_GRANT_TYPES, 'value');

const grantTypeOptions = Object.values(_.keyBy(DEFAULT_GRANT_TYPES, 'group')).map((it: any) => ({ label: it.label, value: it.group }));
console.log('grantTypeOptions: ', grantTypeOptions);

const GrantTypeSettings: React.FC = () => {

  return (
    <Space direction="vertical">
      <h2>授权</h2>
      <Card>
        <ProForm.Item name="grant_types">
          <GrantTypeCheckboxGroup />
        </ProForm.Item>
      </Card>
    </Space>
  );
};

export default GrantTypeSettings;

interface GrantTypeCheckboxGroupProps {
  value?: string[];
  onChange?: (v: string[]) => void;
}

const GrantTypeCheckboxGroup: React.FC<GrantTypeCheckboxGroupProps> = ({ value, onChange }) => {
  const _value = useMemo(() => {
    const grantVaules = value?.map((it) => valueMapping[it]?.group)
    return Array.from(new Set(grantVaules));
  }, [value]);
  
  const handleChange = (groups: Array<string>) => {
    const values = [];
    for (let groupName of groups) {
      const items = groupMapping[groupName];
      if (items) {
        for (let item of items) {
          values.push(item.value);
        }
      }
    }

    console.log('values: ', values);
    onChange?.(values);
  }; 

  return (
    <Checkbox.Group value={_value} onChange={handleChange}>
      {grantTypeOptions.map((it) => (
        <Button key={it.value} style={{ margin: '8px' }}>
          <Checkbox value={it.value}>{it.label}</Checkbox>
        </Button>
      ))}
    </Checkbox.Group>
  );
};