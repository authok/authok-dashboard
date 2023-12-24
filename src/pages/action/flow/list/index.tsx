import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProList from '@ant-design/pro-list';
import { LoginOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { Carousel, List, Card } from 'antd';
import Meta from 'antd/lib/card/Meta';
import { formatProTablePagination } from '@/utils/formatter';
import { useResourcePagination } from '@/hooks/useResource';
import { TriggerEntity } from '@/api/entities/trigger.entity';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';
import './index.less';

const icons = {
  'post-login': <LoginOutlined style={{ fontSize: 48 }}/>,
  'pre-register': <LoginOutlined style={{ fontSize: 48 }}/>,
};

const FlowListPage: React.FC = () => {
  const { run: paginate } = useResourcePagination(TriggerEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  
  return <PageContainer className="page-middle">
    <Card bordered={false}>
      <Carousel autoplay style={{ marginBottom: '24px' }}>
        <div>
          <img style={{ width: '100%', height: '100%' }} src="https://cdn.authok.cn/assets/action/authok-action.jpg" alt="action" />
        </div>
        <div>
          <img style={{ width: '100%', height: '100%' }} src="https://cdn.authok.cn/assets/action/authok-action.jpg" alt="action" />
        </div>
      </Carousel>
      <ProList
        rowKey="name"
        pagination={false}
        rowSelection={false}
        showActions="hover"
        grid={{ gutter: 16, column: 4 }}
        onItem={(record: any) => {
          console.log('onItem record: ',record);
          return {
            onMouseEnter: () => {
              console.log(record);
            },
            onClick: () => {
              console.log(record);
            },
          };
        }}
        renderItem={(item, index) => {
          return <List.Item key={item.id}>
            <Card hoverable onClick={() => history.push(formatPath(`/actions/flows/${item.id}`))}>
              <Meta title={item.display_name} avatar={icons[item.id] || <LoginOutlined style={{ fontSize: 48 }}/>}/>
            </Card>
          </List.Item>
        }}
        request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
      />
    </Card>
  </PageContainer>
};

export default FlowListPage;