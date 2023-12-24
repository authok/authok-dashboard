import { PageContainer } from '@ant-design/pro-layout';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { Avatar, Space, Typography, Button } from 'antd';
import { history, Link } from 'umi';
import React, { useRef } from 'react';
import { formatProTablePagination } from '@/utils/formatter';
import CreateResourceServerModal from './components/CreateResourceServerModal';
import { PlusOutlined, ApiOutlined } from '@ant-design/icons';
import { useResourcePagination, useResourceCreate } from '@/hooks/useResource';
import { ResourceServerEntity } from '@/api/entities/resource-server.entity';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';
const { Text } = Typography;

const ApiList: React.FC = () => {
  const { loading: loadingCreate, run: createResourceServer } = useResourceCreate(ResourceServerEntity);

  const actionRef = useRef();

  const { loading: loadingPaginate, run: paginate } = useResourcePagination(ResourceServerEntity, { 
    manual: true,
    formatResult: formatProTablePagination,
  });

  const metas: ProListMetas<API.ResourceServer> = {
    avatar: {
      // dataIndex: 'logo',
      render: (_, row) => {
        if (row.logo) {
          return <Avatar src={row.logo} size={48} shape="square" />;
        } else {
          return <Avatar shape="square" size={48} icon={<ApiOutlined />} />
        }
      }
    },
    title: {
      dataIndex: 'name',
      render: (_, row) => <Link to={formatPath(`/app/apis/${row.id}`)}><h3>{row.name}</h3></Link>,
    },
    description: {
      render: (_, row) => <p>{row.is_system ? '系统API' : '自定义API'}</p>,
    },
    content: {
      render: (_, row) => {
        return (
          <Space>
            Audience: 
            <Text copyable={{ text: row.identifier }}>
              <Text code>{row.identifier}</Text>
            </Text>
          </Space>
        );
      },
    },
    actions: {
      render: (_, row) => [
        <Link to={formatPath(`/app/apis/${row.id}/settings`)}>设置</Link>,
      ],
    },
  };

  // 创建成功
  const handleCreateResourceServer = async (resourceServer: Partial<API.ResourceServer>) => {
    const createdApp = await createResourceServer(resourceServer);
    history.push(formatPath(`/app/apis/${createdApp.id}`));
    return true;
  };

  return (
    <PageContainer 
      className="page-middle"
      extra={
        <CreateResourceServerModal loading={loadingCreate} title="创建API" trigger={<Button icon={<PlusOutlined />} type="primary" size="large">创建API</Button>} onFinish={handleCreateResourceServer} />
      }
    >
      <ProList<API.ResourceServer>
        rowKey="id"
        loading={loadingPaginate}
        actionRef={actionRef}
        request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
        pagination={{
          pageSize: 10,
        }}
        metas={metas}
      />
    </PageContainer>
  );
};

export default ApiList;
