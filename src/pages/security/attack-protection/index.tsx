import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Badge, Card, Row, Col, Space } from 'antd';
import { RightOutlined, RobotOutlined, RiseOutlined, LockOutlined, SecurityScanOutlined } from '@ant-design/icons';
import { useConfigDetails } from '@/hooks/config';
import { history } from 'umi';
import { formatPath } from '@/utils/link.utils';

const AttackProtectionListPage: React.FC = () => {
  const { data: captchasConfig } = useConfigDetails('protection-config', 'captchas');
  const { data: suspiciousIpThrottlingConfig } = useConfigDetails('protection-config', 'suspicious-ip-throttling');
  const { data: bruteForceConfig } = useConfigDetails('protection-config', 'brute-force');
  const { data: breachedPasswordConfig } = useConfigDetails('protection-config', 'breached-password');
  
  return <PageContainer title="攻击防护">
    <Card bordered={false}>
      <Space size="large" direction="vertical" style={{ width: '100%' }}>
        <ProtectionCard 
          avatar={<RobotOutlined style={{ fontSize: 32 }} />}
          title="机器人检测"
          description="采用authok的风控引擎来检测机器人和脚本攻击, 并开启验证码进行屏蔽"
          enabled={!!captchasConfig && captchasConfig.enabled}
          link="/security/attack-protection/bot-detection"
        />

        <ProtectionCard 
          avatar={<RiseOutlined style={{ fontSize: 32 }} />}
          title="可疑IP限流"
          description="保护您的租户不受可疑登录的影响，主要针对来自单IP地址的过多帐户。"
          enabled={!!suspiciousIpThrottlingConfig && suspiciousIpThrottlingConfig.enabled}
          link="/security/attack-protection/suspicious-ip"
        />

        <ProtectionCard 
          avatar={<LockOutlined style={{ fontSize: 32 }} />}
          title="暴力攻击(DDOS)保护"
          description="防止针对单个用户帐户的暴力攻击。"
          enabled={!!bruteForceConfig && bruteForceConfig.enabled}
          link="/security/attack-protection/brute-force"
        />

        <ProtectionCard 
          avatar={<SecurityScanOutlined style={{ fontSize: 32 }} />}
          title="密码泄漏检测"
          description="Authok 可以检测特定用户的密码/凭据是否包含在重大公共安全漏洞中, 比如现用密码是否存在于社工库中。"
          enabled={!!breachedPasswordConfig && breachedPasswordConfig.enabled}
          link="/security/attack-protection/breached-password"
        />
      </Space>
    </Card>
  </PageContainer>
};

interface ProtectionCardProps {
  avatar: JSX.Element;
  title: string;
  description: string;
  enabled: boolean;
  link: string;
}

const ProtectionCard: React.FC<ProtectionCardProps> = ({ avatar, title, description, enabled, link }) => {
  return <Card hoverable bordered>
    <Row align="middle" onClick={() => history.push(formatPath(link))}>
      <Col span={19}>
        <Space size="large" direction="horizontal" style={{ width: '100%' }}>
          {avatar}
          <Space direction="vertical">
            <h3>{title}</h3>
            <p>{description}</p>
          </Space>
        </Space>
      </Col>
      <Col span={4}>
        { enabled ? <Badge status="success" text="已开启" /> : <Badge color="gray" text="未开启" /> }
      </Col>
      <Col span={1}>
        <RightOutlined />
      </Col>
    </Row>
  </Card>
};

export default AttackProtectionListPage;