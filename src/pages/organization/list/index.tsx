import { PageContainer } from '@ant-design/pro-layout';
import ProList, { ProListMetas } from '@ant-design/pro-list';
import { Avatar, Button, Space, Typography, Dropdown, Menu } from 'antd';
import { history, Link } from 'umi';
import React, { useRef } from 'react';
import CreateOrganizationModal from '../components/CreateOrganizationModal';
import { PlusOutlined } from '@ant-design/icons';
import { formatProTablePagination } from '@/utils/formatter';
import { useResourcePagination, useResourceCreate } from '@/hooks/useResource';
import { OrganizationEntity } from '@/api/entities/organization.entity';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';
const { Text } = Typography;

const OrganizationListPage: React.FC = () => {
  const { run: createOrganization } = useResourceCreate(OrganizationEntity);

  const actionRef = useRef();

  const { loading: loadingPaginate, run: paginateOrganizations } = useResourcePagination(OrganizationEntity, { 
    manual: true,
    formatResult: formatProTablePagination,
  });

  const metas: ProListMetas<API.Organization> = {
    avatar: {
      // dataIndex: 'logo',
      render: (_, row) => <Avatar src={row.logo_uri} size={48} shape="square" />,
    },
    title: {
      dataIndex: 'name',
      render: (_, row) => <Link to={formatPath(`/organizations/${row.id}`)}><b style={{ fontSize: 16 }}>{row.name}</b></Link>,
    },
    content: {
      render: (_, row) => {
        return (
          <Space>
            组织ID: 
            <Text
              copyable={{
                text: row.id,
              }}
            >
              <Text code>{row.id}</Text>
            </Text>
          </Space>
        );
      },
    },
    actions: {
      valueType: 'option',
      render: (_, row) => {
        const overlay = (
          <Menu style={{ minWidth: 120 }}>
            <Link to={formatPath(`/organizations/${row.id}/settings`)}>
              <Menu.Item key="settings">设置</Menu.Item>
            </Link>
            <Link to={formatPath(`/organizations/${row.id}/members`)}>
              <Menu.Item key="members">成员</Menu.Item>
            </Link>
            <Link to={formatPath(`/organizations/${row.id}/invitations`)}>
              <Menu.Item key="invitations">邀请</Menu.Item>
            </Link>
            <Link to={formatPath(`/organizations/${row.id}/connections`)}>
              <Menu.Item key="connections">身份源</Menu.Item>
            </Link>
          </Menu>
        );
  
        return <Dropdown.Button overlay={overlay} />;
      },
    },
  };

  // 创建成功
  const handleCreateOrganization = async (organization: Partial<API.Organization>) => {
    const createdOrganization = await createOrganization(organization);

    console.log('createdOrganization: ', createdOrganization);

    history.push(formatPath(`/organizations/${createdOrganization.id}`));
    return true;
  };

  return (
    <PageContainer>
      <ProList<API.Organization>
        rowKey="client_id"
        loading={loadingPaginate}
        actionRef={actionRef}
        request={(params, sorter, filter) => paginateOrganizations(formatPageQuery(params, sorter, filter))}
        pagination={{
          pageSize: 10,
        }}
        metas={metas}
        toolBarRender={() => [
          <CreateOrganizationModal title="创建组织" trigger={<Button icon={<PlusOutlined/>} type="primary" size="large">创建组织</Button>} onFinish={handleCreateOrganization} />
        ]}
      />
    </PageContainer>
  );
};



export default OrganizationListPage;