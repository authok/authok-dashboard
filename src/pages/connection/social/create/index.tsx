import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import ProList from '@ant-design/pro-list';
import { Typography, List, Card } from 'antd';
import { PlusCircleFilled } from '@ant-design/icons';
import styles from './style.less';
import { Link } from 'umi';
import { formatProTablePagination } from '@/utils/formatter';
import Avatar from 'antd/lib/avatar/avatar';
import { formatPath } from '@/utils/link.utils';
import { formatPageQuery } from '@/utils/utils';
const { Paragraph } = Typography;

const SocialConnectionCreatePage: React.FC = () => {
  const { run, loading } = useMarketplaceCatalogPaginationByFeature('social-connections', { 
    manual: true,
    formatResult: formatProTablePagination,
  });

  return (
    <PageContainer>
      <Card bordered={false}>
        <ProList<API.Catalog>
          className={styles.cardList}
          rowKey="id"
          loading={loading}
          request={async (params, sorter, filter) => {
            const r = await run(formatPageQuery(params, sorter, filter));
            r.data = [...r.data, {}];
            return r;
          }}
          pagination={{
            pageSize: 100,
          }}
          grid={{
            gutter: 4,
            xs: 1,
            sm: 2,
            md: 3,
            lg: 3,
            xl: 3,
          }}
          renderItem={(item) => {
            if (item && item.id) {
              return (
                <List.Item key={item.id} style={{ width: 360 }}>
                  <Link to={formatPath(`/connections/social/create/${item.catalog_id}`)}>
                    <Card
                      hoverable
                      className={styles.card}                     
                    >
                      <Card.Meta 
                        avatar={<Avatar shape="square" size={48} src={item.icon} />}
                        title={<a>{item.metaTitle}</a>}
                        description={
                          <>
                            <Paragraph className={styles.item} ellipsis={{ rows: 3 }}>
                              {item.metaDescription}
                            </Paragraph>
                          </>
                        }
                      />
                    </Card>
                  </Link>
                </List.Item>
              );
            }
            return (
              <List.Item className={styles.card} style={{ width: 360 }}>
                <Link to={formatPath(`/connections/social/create/oauth2`)}>
                  <Card hoverable>
                    <div className={styles.customItem}>
                      <div><PlusCircleFilled style={{ fontSize: 32 }} /></div>
                      <div><h3>创建自定义身份源</h3></div>
                    </div>
                  </Card>
                </Link>  
              </List.Item>
            );
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default SocialConnectionCreatePage;