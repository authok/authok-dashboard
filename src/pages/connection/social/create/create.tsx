import React, { useCallback, useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Breadcrumb, Space, Button } from 'antd';
import { history, useIntl, Link } from 'umi';
import { useMarketplaceCatalogDetails } from '@/hooks/marketplace-catalog';
import Avatar from 'antd/lib/avatar/avatar';
import { ArrowLeftOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import * as _ from 'lodash';
import ConnectionEditForm from '../../components/ConnectionEditForm';
import { useResourceCreate } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { formatPath } from '@/utils/link.utils';

const SocialConnectionCreatePage: React.FC<any> = ({ match }) => {
  const { strategy } = match.params;

  const { formatMessage } = useIntl();

  const { run: loadItem, loading } = useMarketplaceCatalogDetails('social-connections', strategy, {
    manual: true,
  });

  const [item, setItem] = useState();
  useEffect(() => {
    if (strategy === 'oauth2') {
      setItem({
        icon: '',
        name: '自定义',
      });
    } else {
      loadItem('social-connections', strategy).then((item) => setItem(item));
    }
  }, []);

  const { run: create } = useResourceCreate(ConnectionEntity);

  const [view, setView] = useState(strategy === 'oauth2' ? 'form' : 'license');

  const handleCreate = useCallback(async (data: API.Connection): Promise<boolean> => {
    const connection = { ...data, strategy };
    console.log('创建连接', connection);
    await create(connection);

    history.push(formatPath(`/connections/social`));
    return true;
  }, []);

  const licenseView = ( <Card bordered={false} loading={loading} style={{ width: '100%' }}>
    <Row justify="center">
      <Card style={{ width: '800px' }}>
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          <div>
            <h2 style={{ fontSize: 24 }}>{item?.metaTitle}</h2>
            <span>{item?.name}需要访问:</span>
          </div>
          <ProCard bordered={true} split="horizontal">
            <ProCard>重定向用户到{item?.companyName}进行登录</ProCard>
            <ProCard>从{item?.companyName}获取身份信息并进行保存</ProCard>
            <ProCard>通过{item?.companyName}来更新用户主档案信息</ProCard>
          </ProCard>
          <Row justify="center">
            <Space>
              <Button type="primary" size="large" onClick={() => setView('form')}>继续</Button>
              <Button size="large" onClick={() => history.push(formatPath('/connections/social/create'))}>取消</Button>
            </Space>
          </Row>
          <Row justify="center">
            <span style={{ color: '#65676e'}}>继续代表您授予集成访问给到集成商，并同意集成商的<a>使用条款</a>和<a>隐私条款</a>. 同样代表您同意 Authok 的<a>应用市场条款</a>.</span>
          </Row>
        </Space>
      </Card>
    </Row>
  </Card>);

  const formView = <ConnectionEditForm strategy={strategy} onFinish={handleCreate} />;

  return (
    <PageContainer 
      pageHeaderRender={false}
      className="page-middle"
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Breadcrumb style={{ color: '#65676e'}}>
            <Breadcrumb.Item>
              <Link to={formatPath('/connections/social/create')}><ArrowLeftOutlined /> 选择社会化身份源</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Space size="large">
            <Avatar shape="square" size={42} src={item?.icon} />
            <span style={{ fontSize: 32 }}><b>{item?.name}</b></span>
          </Space>
        </Space>
        {view === 'form' ? formView : licenseView }
      </Space>
    </PageContainer>
  );
};

export default SocialConnectionCreatePage;