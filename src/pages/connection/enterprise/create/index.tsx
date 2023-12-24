import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import ProList from '@ant-design/pro-list';
import { Typography, List, Card } from 'antd';
import { Link } from 'umi';
import { formatProTablePagination } from '@/utils/formatter';
import Avatar from 'antd/lib/avatar/avatar';
import { formatPath } from '@/utils/link.utils';
import { formatPageQuery } from '@/utils/utils';
const { Paragraph } = Typography;

const EnterpriseConnectionCreatePage: React.FC = () => {
  const { run: paginate } = useMarketplaceCatalogPaginationByFeature('enterprise-connections', { 
    manual: true,
    formatResult: formatProTablePagination,
  });

  return (
    <PageContainer>
      <Card bordered={false}>
        <ProList<API.Catalog>
          rowKey="id"
          request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
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
            return (
              <List.Item key={item.id} style={{ width: 360 }}>
                <Link to={formatPath(`/connections/enterprise/create/${item.catalog_id}`)}>
                  <Card hoverable>
                    <Card.Meta 
                      avatar={<Avatar shape="square" size={48} src={item.icon} />}
                      title={item.metaTitle}
                      description={
                        <>
                          <Paragraph ellipsis={{ rows: 3 }}>
                            {item.metaDescription}
                          </Paragraph>
                        </>
                      }
                    />
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

export default EnterpriseConnectionCreatePage;