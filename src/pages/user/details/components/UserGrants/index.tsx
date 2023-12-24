import React from 'react';
import { Typography, Space, Row, Card, Col } from 'antd';
import { useUserGrants } from '@/hooks/user';
import ProTable from '@ant-design/pro-table';
import { formatProTablePagination } from '@/utils/formatter';
const { Text } = Typography;
import Avatar from 'antd/lib/avatar/avatar';
import { ApiOutlined } from '@ant-design/icons';
import Meta from 'antd/lib/card/Meta';
import { formatPageQuery } from '@/utils/utils';

interface UserGrantsProps {
  user: API.User;
}

const UserGrants: React.FC<UserGrantsProps> = ({ user }) => {
  const { run: paginate } = useUserGrants(user.user_id, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const columns = [
    {
      title: '应用',
      render: (text, record) => <Text code>{record.client_id}</Text>,
    },
    {
      title: 'scope',
      render: (text, record) => {
        const scopes = (record.openid?.scope || '').split(' ');
        return <Space>{scopes.map((scope, index) => (<Text key={index} code>{scope}</Text>))}</Space>;
      },
    },
    {
      title: '创建时间',
      valueType: 'dateTime',
      dataIndex: 'created_at',
    },
    {
      title: '更新时间',
      valueType: 'dateTime',
      dataIndex: 'updated_at',
    },
  ];

  return <ProTable<API.Grant>
    rowKey="id"
    options={false}
    search={false}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
    columns={columns}
    expandable={{
      defaultExpandAllRows: true,
      expandedRowRender: (record) => {
        const resources = [];
        Object.entries(record.resources || {}).forEach(([audience, scope]: string[]) => {
          resources.push({ audience, scopes: scope.split(' ') });
        });

        return <Space direction="vertical" style={{ width: '100%' }}>
          {resources.map(resource => (
            <Card key={resource.audience}>
              <Meta 
                avatar={<Avatar icon={<ApiOutlined />}/>}
                description={
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Row>
                      <Col flex="100px">Audience:</Col><Col flex="auto"><Text copyable={{ text: resource.audience }}><Text>{resource.audience}</Text></Text></Col>
                    </Row>
                    <Row>
                      <Col flex="100px">Scope: </Col>
                      <Col flex="auto">
                        <div>{resource.scopes.map((scope, index) => (<div style={{ display: 'inline-block', margin: 8 }}><Text key={index} code>{scope}</Text></div>))}</div>
                      </Col>
                    </Row>
                  </Space>
                }
              />
            </Card>
          ))}
        </Space>;
      },
      // rowExpandable: record => record.name !== 'Not Expandable',
    }}
  />;
};

export default UserGrants;