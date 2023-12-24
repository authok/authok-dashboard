import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { List, Card, Typography, Button } from 'antd';
import { Link } from 'umi';
import Avatar from 'antd/lib/avatar/avatar';
import { PlusOutlined } from '@ant-design/icons';
import { formatPath } from '@/utils/link.utils';
const { Paragraph } = Typography;

const ExtentionListPage: React.FC = () => {
  

  return <PageContainer>
    <Card bordered={false}>
      <ProList 
        toolBarRender={() => 
          <Button size="large" type="primary" icon={<PlusOutlined />}>创建扩展</Button>
        }
        rowKey="id"
        request={async (params, sorter, filter) => {          
          return {
            success: true,
            data: [
              {
                id: '1',
              },
              {
                id: '2',
              }
            ]
          };
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
          return (
            <List.Item key={item.id} style={{ width: 360 }}>
              <Link to={formatPath(`/extensions/${item.id}`)}>
                <Card hoverable>
                  <Card.Meta 
                    avatar={<Avatar shape="square" size={48} src={item.icon} />}
                    title={<a>jfjfj</a>}
                    description={
                      <>
                        <Paragraph ellipsis={{ rows: 3 }}>
                          jfejief
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
};

export default ExtentionListPage;