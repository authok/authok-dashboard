import { PageContainer } from '@ant-design/pro-layout';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { Avatar, Button, Space, Typography } from 'antd';
import { history, Link, FormattedMessage } from 'umi';
import React, { useRef } from 'react';
import CreateApplicationModal from '../components/CreateApplicationModal';
import { PlusOutlined, AppstoreFilled } from '@ant-design/icons';
import { formatProTablePagination } from '@/utils/formatter';
import { formatPath } from '@/utils/link.utils';
import { ClientEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { useResourceCreate, useResourcePagination } from '@/hooks/useResource';
const { Text } = Typography;

const ApplicationList: React.FC = () => {
  const actionRef = useRef();

  const { loading: loadingCreate, run: createApplication } = useResourceCreate(ClientEntity);

  const { loading: loadingPaginate, run: paginateApplications } = useResourcePagination(
    ClientEntity,
    {
      manual: true,
      formatResult: formatProTablePagination,
    },
  );

  const metas: ProListMetas<API.Application> = {
    avatar: {
      // dataIndex: 'logo',
      render: (_, row) => {
        if (row.logo_uri) {
          return <Avatar src={row.logo_uri} size={48} shape="square" />;
        } else {
          return <Avatar icon={<AppstoreFilled />} size={48} shape="square" />;
        }
      }
    },
    title: {
      dataIndex: 'name',
      render: (_, row) => <Link to={formatPath(`/app/applications/${row.client_id}`)}><b style={{ fontSize: 16 }}>{row.name}</b></Link>,
    },
    description: {
      render: (_, row) => <p>应用类型: <FormattedMessage id={`app.settings.application.app_type.${row.app_type}`} /></p>,
    },
    content: {
      render: (_, row) => {
        return (
          <Space>
            Client ID: 
            <Text
              copyable={{
                text: row.client_id,
              }}
            >
              <Text code>{row.client_id}</Text>
            </Text>
          </Space>
        );
      },
    },
    actions: {
      render: (_, row) => [
        <Link key="quickstart" to={formatPath(`/app/applications/${row.client_id}/quickstart`)}>快速开始</Link>,
        <Link key="settings" to={formatPath(`/app/applications/${row.client_id}/settings`)}>设置</Link>,
      ],
    },
  };

  // 创建成功
  const handleCreateApp = async (app: Partial<API.Application>) => {
    const createdApp = await createApplication(app);

    console.log('createdApp: ', createdApp);

    history.push(formatPath(`/app/applications/${createdApp.client_id}`));
    return true;
  };

  return (
    <PageContainer 
      className="page-middle"
      extra={
        <CreateApplicationModal loading={loadingCreate} title="创建应用" trigger={<Button icon={<PlusOutlined/>} type="primary" size="large">创建应用</Button>} onFinish={handleCreateApp} />
      }
    >
      <ProList<API.Application>
        rowKey="client_id"
        loading={loadingPaginate}
        actionRef={actionRef}
        params={{
          app_type: [
            'web',
            'native',
            'non_interactive',
            'spa',
          ],
        }}
        request={(params, sorter, filter) => paginateApplications(
          formatPageQuery(
            params, sorter, filter, 
            'client_id,name,app_type,logo_uri',
          )
        )}
        pagination={{
          pageSize: 10,
        }}
        metas={metas}
      />
    </PageContainer>
  );
};

export default ApplicationList;
