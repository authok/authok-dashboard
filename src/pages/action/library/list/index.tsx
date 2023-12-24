import React, { useCallback, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Radio, Space, Typography, Tag, Dropdown, Menu, Card, Button, Col, Row } from 'antd';
import ProList from '@ant-design/pro-list';
import { formatProTablePagination } from '@/utils/formatter';
import Avatar from 'antd/lib/avatar/avatar';
import { CodeOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import ProTable from '@ant-design/pro-table';
import { history, Link } from 'umi';
import { useResourcePagination, useResourceCreate } from '@/hooks/useResource';
import { ActionEntity } from '@/api';
import { formatPageQuery } from '@/utils/utils';
import { formatPath } from '@/utils/link.utils';
import CreateActionModal from '../../flow/components/CreateActionModal';
const { Text } = Typography;

export default function({ match }: any) {
  const _tab = match.tab || 'custom';
  const [tab, setTab] = useState(_tab);

  const { run: createAction } = useResourceCreate(ActionEntity);

  const handleTabChange = useCallback((key: string) => {
    setTab(key);
  }, []);

  const handleCreateAction = useCallback(async (value: API.Action): Promise<boolean> => {
    const action = await createAction(value);
    history.push(formatPath(`/actions/library/${action.id}`));
    return true;
  }, []);

  const renderTab = (key: string) => {
    switch(key) {
      case 'custom':
        return <ActionList />;
      case 'installed':
        return <IntegrationList />;
    } 

    return null;
  }

  return <PageContainer 
    className="page-middle"
    extra={[
      <CreateActionModal trigger={<Button size="large" icon={<PlusOutlined />} type="primary">自定义动作</Button>} onFinish={handleCreateAction} />,
      <Button size="large" icon={<PlusOutlined />} type="primary">添加第三方动作</Button>
    ]}
    tabActiveKey={tab}
    onTabChange={handleTabChange}
    tabList={[
      {
        key: 'custom',
        tab: '自定义',
      },
      {
        key: 'installed',
        tab: '已安装'
      }
    ]}
  >
    <Card bordered={false}>
      {renderTab(tab)}        
    </Card>
  </PageContainer>
};

interface IntegrationList {
  params?: any;
}

const IntegrationList: React.FC<IntegrationList> = ({ params }) => {
  // 这里要改成读 integration
  const { run: paginate } = useResourcePagination(ActionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  return <ProList<API.Action>
    rowKey="id"
    params={params}
    metas={{
      avatar: {
      },
      title: {
        dataIndex: 'name',
      }
    }}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
  /> 
}

interface ActionListProps {
  params?: any;
}

const ActionList: React.FC<ActionListProps> = ({ params }) => {
  const { run: paginate } = useResourcePagination(ActionEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });


  const extraContent = (
    <Space>
      <Radio.Group defaultValue="all">
        <Radio.Button value="all">全部</Radio.Button>
        <Radio.Button value="pending">pending</Radio.Button>
        <Radio.Button value="built">built</Radio.Button>
      </Radio.Group>
    </Space>
  );

  return <ProTable<API.Action>
    rowKey="id"
    params={params}
    options={false}
    search={false}
    toolBarRender={() => extraContent}
    columns={[
      {
        title: '名称',
        render: (_, record) => <Link to={formatPath(`/actions/library/${record.id}`)}>
          <Space>
            <Avatar shape="square" size={48} icon={<CodeOutlined />} />
              <b>{record.name}</b>
          </Space>
        </Link>
      },
      {
        title: '触发器',
        render: (_, record) => <Space>{record.supported_triggers?.map(it => <Text code>{it.display_name}</Text>)}</Space>,
      },
      {
        title: '最后更新',
        valueType: 'dateTime',
        dataIndex: 'updated_at',
      },
      {
        title: '最后部署',
        valueType: 'dateTime',
        dataIndex: 'deployed_at',
      },
      {
        title: 'status',
        valueEnum: {
          pending: <Tag>pending</Tag>,
          built: <Tag color="blue">built</Tag>,
        },
        dataIndex: 'status',
      },
      {
        valueType: 'option',
        render: (_, record) => {
          const overlay = (
            <Menu style={{ minWidth: 120 }}>
              <Menu.Item key="details"><Link to={formatPath(`/actions/library/${record.id}`)}>详情</Link></Menu.Item>
              <Menu.Divider />
              <Menu.Item key="delete" icon={<DeleteOutlined/>}>删除</Menu.Item>
            </Menu>
          );

          return <Dropdown.Button overlay={overlay}/>
        },
      }
    ]}
    request={(params, sorter, filter) => paginate(formatPageQuery(params, sorter, filter))}
  /> 
}