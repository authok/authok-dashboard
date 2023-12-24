import React, { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { List, Divider, Card, Layout, Space, Empty, Button } from 'antd';
import { useMarketplaceCatalogDetailsBySlug } from '@/hooks/marketplace-catalog';
const { Sider, Content } = Layout;
import ProSkeleton from '@ant-design/pro-skeleton';
import { Link } from 'umi';
import { formatPath } from '@/utils/link.utils';
import styles from './index.less';
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export default function({ match }) {
  const { slug } = match.params;
  const { data: catalog, loading, error } = useMarketplaceCatalogDetailsBySlug(slug);

  const [key, setKey] = useState('overview');

  if (loading && !catalog) {
    return <PageContainer><ProSkeleton type="descriptions" error={error}/></PageContainer>;
  }

  if (!catalog) {
    return <PageContainer>
      <Empty 
        image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
        imageStyle={{
          height: 60,
        }}
        description={
          <span>记录不存在</span>
        }
      >
        <Link to={formatPath('/marketplace')}><Button type="primary">返回</Button></Link>
      </Empty>
    </PageContainer>
  }

  const renderTab = (key: string) => {
    if (key === 'overview') {
      return <Space direction="vertical" style={{ width: '100%' }}>
        <ReactMarkdown children={catalog.description} remarkPlugins={[remarkGfm]} />
        { catalog.gallery && <List<API.Gallery>
          rowKey="title"
          dataSource={catalog.gallery}
          grid={{
            gutter: 16,
            xs: 1,
            xl: 2,
            xxl: 3,
          }}
          renderItem={(item) => <List.Item key={item.title}>
            <Card cover={<img alt={item.title} src={item.image}/>}>
              <Card.Meta title={item.title} description={item.description}/>
            </Card>
          </List.Item>}
        />}
      </Space>;
    } else if (key === 'install') {
      return <>
        <ReactMarkdown children={catalog.readme} remarkPlugins={[remarkGfm]} />
      </>;
    }
    return <></>;
  }

  return <PageContainer className="page-middle">
    <Layout>
      <Sider theme="light" width={240}>
        <Card bordered={false}>
          <Space direction="vertical" style={{ textAlign: 'center', width: '100%' }}>
            <div className={styles.catalogAvatar}>
              <img src={catalog.icon} />
            </div>
            <Link to={formatPath(catalog.creationUri)}><Button type="primary" size="large">添加</Button></Link>
            <p>
              <h3>支持</h3>
            </p>
            <ul>
              <li><a href="#" target="_blank">使用条款</a></li>
              <li><a href="#" target="_blank">隐私政策</a></li>
            </ul>
          </Space>
        </Card>
      </Sider>
      <Content>
        <Card bordered={false}>
          <h1>{catalog.name}</h1>
          <p>{catalog.shortDescription}</p>
          <p>
            开发者: {catalog.creator}
            <Divider type="vertical" />
          </p>
          <Card 
            bordered={false}
            tabList={[
              {
                tab: '概述',
                key: 'overview',
              },
              {
                tab: '安装',
                key: 'install',
              }
            ]}
            onTabChange={(key) => setKey(key)}
          >
            {renderTab(key)}
          </Card>
        </Card>
      </Content>
    </Layout>
  </PageContainer>;
} 