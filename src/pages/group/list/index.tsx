import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Row, Col, Space, Button, Dropdown, Menu } from 'antd';
import Avatar from 'antd/lib/avatar/avatar';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import GroupTree from './components/GroupTree';
import { formatProTablePagination } from '@/utils/formatter';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { formatPageQuery } from '@/utils/utils';
import { useResourcePagination } from '@/hooks/useResource';
import { UserEntity } from '@/api/entities/user.entity';

const GroupListPage: React.FC = () => {
  const { run: paginateUser } = useResourcePagination(UserEntity, {
    manual: true,
    formatResult: formatProTablePagination,
  });

  const [group, setGroup] = useState<API.Group>();
  const actionRef = useRef<ActionType>();

  const [containChildren, setContainChildren] = useState<boolean>(false);

  const handlePaginateUser = (_params, sorter, filter) => {
    const params = {..._params };
    if (group) {
      params['group'] = group.id;
    }

    const query = formatPageQuery(params, sorter, filter);

    return paginateUser(query);
  };

  const columns: ProColumns<API.User> = [
    {
      title: '姓名',
      render: (_, record) => {
        return <Space direction="horizontal">
          <Avatar src={record.picture}/>
          {record.nickname}
        </Space>;
      },
    }, {
      title: '手机号',
      dataIndex: 'phone_number',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '操作',
      render: (_, record) => {
        const actionMenu = (
          <Menu onClick={({ key }) => {}}>
            <Menu.Item key="details">查看详情</Menu.Item>
            <Menu.Item key="remove_member">移除成员</Menu.Item>
            <Menu.Item key="change_group">变更组织</Menu.Item>
          </Menu>
        );
        return <Dropdown.Button overlay={actionMenu}/>;
      }
    }
  ];

  console.log('group: ', group);

  return <PageContainer className="page-middle">
    <Space size="large" direction="vertical" style={{ width: '100%' }}>
      <Card>
        <Row>
          <Col flex="auto">
            <Space size="large" direction="horizontal" style={{ width: '100%' }}>
              <Avatar src="https://gw.alipayobjects.com/zos/bmw-prod/2dd637c7-5f50-4d89-a819-33b3d6da73b6.svg" size={64}/>
              <p>
                <h3>组织架构</h3>
                <span>组织架构支持从企业微信、钉钉、Excel 等方式导入。<a href="https://docs.authok.cn/groups" target="_blank">点击了解如何使用 API 管理组织架构。</a></span>
              </p>
            </Space>
          </Col>
          <Col flex="300px">
            <Space direction="horizontal" align="center" style={{ width: '100%', height: '100%', justifyContent: 'end' }}>
              <Button size="large">成员加入</Button>
              <Button size="large" type="primary">导入组织架构</Button>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row>
          <Col flex="360px">
            <GroupTree onSelect={(group) => {
              setGroup(group)
              actionRef.current?.reloadAndRest();
            }} />
          </Col>
          <Col flex="auto">
            <ProTable<API.User>
              headerTitle={<Space direction="horizontal">
                {group?.name}
                <Checkbox defaultChecked={false} onChange={(v) => setContainChildren(v)}>包含下级分组的用户</Checkbox>
              </Space>}
              actionRef={actionRef}
              columns={columns}
              options={false}
              request={handlePaginateUser}
            />
          </Col>
        </Row>
      </Card>
    </Space>
  </PageContainer>;
}

export default GroupListPage;