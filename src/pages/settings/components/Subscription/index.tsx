import React from 'react';
import { Row, Col, Card, Collapse, Statistic, Space, Divider, Slider } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
const { Panel } = Collapse;

interface SubscriptionProps {
  tenant: API.Tenant;
}

const authentication = {
  title: '认证',
  name: 'authentication',
  features: [
    {
      title: '活跃用户数',
      versions: {
        free: {
          description: '20000',
        },
        essentials: {
          description: '20000',
        },
        professional: {
          description: '20000',
        },
        enterprise: {
          description: '不限制',
        },
      },
    },
    {
      title: '员工数',
      versions: {
        free: {
          description: '0',
        },
        essentials: {
          description: '-',
        },
        professional: {
          description: '-',
        },
        enterprise: {
          description: '不限制',
        },
      },
    },
    {
      title: '社会化身份源',
      versions: {
        free: {
          description: '1',
        },
        essentials: {
          description: '不限制',
        },
        professional: {
          description: '不限制',
        },
        enterprise: {
          description: '不限制',
        },
      },
    },
    {
      title: '自定义社会化身份源',
      versions: {
        free: {
          description: '1',
        },
        essentials: {
          description: '不限制',
        },
        professional: {
          description: '不限制',
        },
        enterprise: {
          description: '不限制',
        },
      },
    },
    {
      title: '企业身份连接',
      versions: {
        free: {
          description: '-',
        },
        essentials: {
          description: '-',
        },
        professional: {
          description: '-',
        },
        enterprise: {
          description: '不限制',
        },
      },
    },
    {
      title: '自定义数据库',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        },
      }
    },
    {
      title: '自建应用',
      versions: {
        free: {
          description: '5',
        },
        essentials: {
          description: '10',
        },
        professional: {
          description: '30',
        },
        enterprise: {
          description: '不限制',
        },
      }
    },
    {
      title: '集成应用',
      versions: {
        free: {
          description: '1',
        },
        essentials: {
          description: '2',
        },
        professional: {
          description: '10',
        },
        enterprise: {
          description: '无限',
        },
      }
    },
  ],
};
const versions = [
  {
    title: '免费版',
    name: 'free',
  },
  {
    title: '基础版',
    name: 'essentials',
  },
  {
    title: '专业版',
    name: 'professional',
  },
  {
    title: '企业版',
    name: 'enterprise',
  }
];

const branding = {
  title: '品牌化',
  name: 'branding',
  features: [
    {
      title: '自定义域名',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        },
      },
    },
    {
      title: '个性化登录体验',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        },
      },
    },
  ],
};

const extensibility = {
  title: '可扩展性',
  name: 'extensibility',
  features: [
    {
      title: '企业集成',
      versions: {
        free: {
          description: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        },
      },
    },
    {
      title: '触发器',
      versions: {
        free: {
          description: '3',
        },
        essentials: {
          description: '5',
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        },
      },
    },
  ],
};

const security = {
  title: '安全',
  name: 'security',
  features: [
    {
      title: '自适应MFA',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '机器人检测',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '泄漏密码检测',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '增强密码保护',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '企业级多因素认证',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '防暴力破解',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '可疑IP限流',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    }
  ]
};

const user_management = {
  title: '用户管理',
  name: 'user_management',
  features: [
    {
      title: '账号关联',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '用户导出',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '自定义属性',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '角色管理',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '组织架构',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '组织机构/多租户',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    }
  ]
};

const platform = {
  title: '平台服务',
  name: 'platform',
  features: [
    {
      title: '管理员账号数',
      versions: {
        free: {
          description: '3',
        },
        essentials: {
          description: '10',
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          description: '无限制',
        }
      }
    },
    {
      title: '社区支持',
      versions: {
        free: {
          enabled: true,
        },
        essentials: {
          enabled: true,
        },
        professional: {
          enabled: true,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '响应时间',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          description: '48小时内可响应',
        },
        professional: {
          description: '24小时内可紧急响应',
        },
        enterprise: {
          description: '1小时内可紧急响应',
        }
      }
    },
    {
      title: '审计日志存储',
      versions: {
        free: {
          description: '1天',
        },
        essentials: {
          description: '3天',
        },
        professional: {
          description: '10天',
        },
        enterprise: {
          description: '30天',
        }
      }
    },
    {
      title: '服务级别(SLA)',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          description: '99.9%',
        },
        enterprise: {
          description: '99.9%',
        }
      }
    },
    {
      title: '企业级定制',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    },
    {
      title: '私有化部署',
      versions: {
        free: {
          enabled: false,
        },
        essentials: {
          enabled: false,
        },
        professional: {
          enabled: false,
        },
        enterprise: {
          enabled: true,
        }
      }
    }
  ]
};

const groups = [
  authentication,
  branding,
  extensibility,
  security,
  user_management,
  platform,
];

const Subscription: React.FC<SubscriptionProps> = () => {
  
  return <Card bordered={false}>
    <Card title="订购">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Row gutter={16}>
          <Col span={8}>
            <Statistic title="当前版本" value={"免费版"} />
          </Col>
          <Col span={8}>
            <Statistic title="用户数" value={20000} />
          </Col>
          <Col span={8}>
            <Statistic title="版本有效期" value="无限期" />
          </Col>
        </Row>
        <Divider />
        <Slider defaultValue={0} step={null} marks={{
          0: '1000',
          25: '2500',
          50: '5000',
          75: '10000',
          100: '10000+',
        }} />
        <Collapse defaultActiveKey={['authentication']}>
          {groups.map(it => (
            <Panel header={it.title} key={it.name}>
              {it.features.map((feature, idx) => (
                <Row gutter={[16, 16]} key={idx} style={{ borderBottom: '1px solid #f0f0f0', padding: '12px' }}>
                  <Col span={8}>{feature.title}</Col>
                  {
                    versions.map((version, idx) => {
                      const v = feature.versions[version.name];
                      return (<Col key={idx} span={16 / versions.length}>
                        {v.description ? v.description : v.enabled ?<CheckCircleFilled style={{ color: 'var(@primary-color)' }} /> : '-' }
                      </Col>);
                    })
                  }
                </Row>
              ))}
            </Panel>
          ))}
        </Collapse>
      </Space>
    </Card>
  </Card>;
};

export default Subscription;