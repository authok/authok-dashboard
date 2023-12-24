import React, { useMemo } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useFactors, useFactorConfigs } from '@/hooks/factor';
import FactorCard from './components/FactorCard';
import { LockOutlined, PhoneOutlined, NotificationOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { Card, Space } from 'antd';
import * as _ from 'lodash';
import FactorIcon from '../components/FactorIcon';

const MultiFactorAuthentication: React.FC = () => {
  const { data: factors } = useFactors();

  const { data: factorConfigs } = useFactorConfigs();
  const name2factorConfig = useMemo(() => _.keyBy(factorConfigs, 'name'), [factorConfigs]);

  return <PageContainer>
    <Card bordered={false}>
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        {factors?.map(it => {
          return <FactorCard 
            avatar={<FactorIcon factor={it.name} />} 
            key={it.name} 
            title={it.title} 
            description={it.description}
            enabled={!!name2factorConfig[it.name] && name2factorConfig[it.name].enabled}
            link={`/security/mfa/${it.name}`}
          />
        })}
      </Space>
    </Card>
  </PageContainer>
};

export default MultiFactorAuthentication;