import { PlusOutlined } from '@ant-design/icons';
import { List, Input, Form, Checkbox, Button, message, Modal, Menu, Row, Col, Space, Badge, Typography, Divider, Card, Select } from 'antd';
import React, { useRef, useMemo, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import { useUserBatchDelete } from '@/hooks/user';
import Avatar from 'antd/lib/avatar/avatar';
import CreateUserModal from '../components/CreateUserModal';
import { useSelections } from '@umijs/hooks';
import { Link, useIntl } from 'umi';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable'
import { formatFormTablePagination } from '@/utils/formatter';
const { Text } = Typography;
import styles from './index.less';
import useFormList from '@/hooks/useFormList';
import * as _ from 'lodash';
import { formatPageQuery } from '@/utils/utils';
import { useResourcePagination, useResourceCreate, useResourceDelete } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { UserEntity } from '@/api/entities/user.entity';
import { formatPath } from '@/utils/link.utils';

const UserListPage: React.FC = () => {
  const { formatMessage } = useIntl();

  const { run: paginate, data: userPage } = useResourcePagination(UserEntity, { 
    manual: true,
    formatResult: formatFormTablePagination,
  });

  const { data: connections, run: paginateConnection } = useResourcePagination(ConnectionEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Connection>) => page.items,
  });

  useEffect(() => {
    if (userPage) {
      paginateConnection({
        page_size: 100,
      });
    }
  }, [userPage]);

  const name2connection: Record<string, API.Connection> = useMemo(() => _.keyBy(connections || [], 'name'), [connections]);

  const { run: create } = useResourceCreate(UserEntity);
  const { run: deleteUser } = useResourceDelete(UserEntity);
  const { run: batchDelete } = useUserBatchDelete();

  const getTableData = async ({ current, pageSize, ...rest }: PaginatedParams[0], formData: Object): Promise<{ list: API.User[]; total: number; }> => {
    const params = {current, pageSize};
    console.log('getTableData params', params, rest);
    Object.entries(formData).forEach(([key, value]) => {
      params[key] = value;
    });
    const sorter = {
      created_at: 'DESC',
    }

    console.log('formData', formData);
    const query = formatPageQuery(params, sorter);
  
    return await paginate(query);
  };

  const user_ids = useMemo<string[]>(() => userPage?.list?.map((it) => it.user_id) || [], [userPage]);

  const { selected, allSelected, isSelected, toggle, toggleAll, partiallySelected } = useSelections(user_ids);

  const [form] = Form.useForm();
  const { listProps, search, refresh } = useFormList(getTableData, {
    form,
  });

  const { type, changeType, submit, reset } = search;

  const handleBatchDelete = async () => {
    if (!selected || selected.length === 0) {
      message.warning('请选择至少一条记录');
      return false;
    }

    const contentMsg = <p>您已选择{selected.length}条记录，是否确定删除?</p>;
    Modal.confirm({
      title: null,
      content: contentMsg,
      okText: '删除',
      cancelText: '取消',
      onOk: async () => {
        await batchDelete(selected);

        refresh();

        message.success('删除成功，即将刷新');
        return true;
      },
    });
    return false;
  };

  const handleDelete = (user_id: string) => {
    Modal.confirm({
      title: `确定删除该用户？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        await deleteUser(user_id);
        message.success('删除成功！');

        refresh();
      },
    });
  };

  const handleCreate = async (values: { [key: string]: any }) => {
    await create(values);
    
    message.success('用户创建成功');

    refresh();

    return true;
  };

  const importMenu = (
    <Menu>
      <Menu.Item key="importExcel">通过Excel导入</Menu.Item>
      <Menu.Item key="importScript">通过脚本导入</Menu.Item>
    </Menu>
  );
  const exportMenu = (
    <Menu>
      <Menu.Item key="exportUser">导出选中用户</Menu.Item>
      <Menu.Item key="exportAllUser">导出全部用户</Menu.Item>
      <Menu.Item key="exportHistory">查看导出历史</Menu.Item>
    </Menu>
  );

  const advanceSearchForm = (
    <div style={{ marginTop: 16, width: '100%' }}>
      <Form form={form}>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="手机号" name="phone_number">
              <Input placeholder="手机号" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="邮箱" name="email">
              <Input placeholder="邮箱" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item label="昵称" name="nickname">
              <Input placeholder="昵称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={8}>
            <Form.Item label="身份源" name="connection">
              <Select allowClear placeholder="请选择身份源" options={connections?.map((it) => ({ label: it.display_name || it.name, value: it.name }))}/>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Form.Item style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button type="primary" onClick={submit}>
              搜索
            </Button>
            <Button onClick={reset} style={{ marginLeft: 16 }}>
              重置
            </Button>
            <Button type="link" onClick={changeType}>
              模糊搜索
            </Button>
          </Form.Item>
        </Row>
      </Form>
    </div>
  );

  const searchForm = (
    <div style={{ marginTop: 16 }}>
      <Form form={form} style={{ display: 'flex', justifyContent: 'flex-start' }}>
        <Form.Item name="q">
          <Input.Search placeholder="请输入用户 ID / 用户名 / 手机号 / 邮箱 / 姓名 / 昵称" style={{ width: 420 }} onSearch={submit} />
        </Form.Item>
        <Button type="link" onClick={changeType}>
          高级搜索
        </Button>
      </Form>
    </div>
  );

  return (
    <PageContainer>
      <Card bordered={false}>
        <Row>
          {type !== 'simple' && advanceSearchForm}
        </Row>
        <Row align="middle" style={{ marginBottom: 16 }}>
          <Col span={12}>
            {type === 'simple' && searchForm }
          </Col>
          <Col span={12}>
            <Row justify="end" align="middle">
              <Space size={0} direction="horizontal" style={{ height: '100%', marginRight: 16 }}>
                {
                  selected.length > 0 && (<><a onClick={handleBatchDelete}>删除</a><Divider type="vertical"/></>)
                }
                <Checkbox checked={allSelected} indeterminate={partiallySelected} onClick={toggleAll}>全选</Checkbox>              
              </Space>
              <CreateUserModal 
                title="新建用户"
                trigger={<Button icon={<PlusOutlined/>} type="primary" size="large">新建用户</Button>} 
                onFinish={handleCreate}
              />
            </Row>
          </Col>
        </Row>
        <List<API.User>
          style={{ minWidth: '1024px' }}
          {...listProps}
          grid={{ gutter: 16, column: 1 }}
          rowKey="user_id"
          renderItem={(row: API.User, index: number) => {
            const connection: API.Connection = name2connection[row.connection];

            return (
              <Badge.Ribbon text={connection && (connection.display_name || connection.name)} color="blue">
              <div className={styles['list-item-container']}>
                <Row gutter={4} style={{ width: '100%', height: '72px' }}>
                  <Col span={1}>
                    <Row align="middle" style={{ height: '100%'}}>
                      <Checkbox checked={isSelected(row.id)} onClick={() => toggle(row.id)} />
                    </Row>
                  </Col>
                  <Col span={4}>
                    <Link to={formatPath(`/user_mgmt/users/${row.user_id}`)}>
                      <Space style={{ height: '100%' }}>
                        <Avatar size={36} src={row.picture} />
                        <b>{row.nickname || row.username}</b>
                      </Space>
                    </Link>
                  </Col>
                  <Col span={4}>
                    <Space direction="vertical">
                      <span style={{
                        fontSize:'12px',
                        fontWeight: 400,
                        color: '#a1abc8',
                      }}>
                        手机号
                      </span>
                      <span>
                        {row.phone_number? (
                          <Space size={0} direction="vertical">
                            {row.phone_number}
                            {
                              row.phone_number_verified ? 
                              <Badge status="success" text={<span style={{
                                fontSize:'12px',
                                fontWeight: 400,
                                color: '#a1abc8',
                              }}>已验证</span>} />: 
                              <Badge status="warning" text={<span style={{
                                fontSize:'12px',
                                fontWeight: 400,
                                color: '#a1abc8',
                              }}>未验证</span>}/>
                            }
                          </Space>
                        ) : '-'}
                      </span>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space direction="vertical" style={{ height: '100%' }}>
                      <span style={{
                        fontSize:'12px',
                        fontWeight: 400,
                        color: '#a1abc8',
                      }}>
                        邮箱
                      </span>
                      <span>
                        {row.email ? (
                          <Space size={0} direction="vertical">
                            {row.email}
                            {
                              row.email_verified ? 
                              <Badge status="success" text={<span style={{
                                fontSize:'12px',
                                fontWeight: 400,
                                color: '#a1abc8',
                              }}>已验证</span>} />: 
                              <Badge status="warning" text={<span style={{
                                fontSize:'12px',
                                fontWeight: 400,
                                color: '#a1abc8',
                              }}>未验证</span>}/>
                            }
                          </Space>
                        ) : '-' }
                      </span>
                    </Space>
                  </Col>
                  <Col span={4}>
                    <Space direction="vertical" style={{ width: '100%' }}>
                      <span style={{
                        fontSize:'12px',
                        fontWeight: 400,
                        color: '#a1abc8',
                      }}>
                        连接
                      </span>
                      <span>
                        <Text ellipsis={true}>{row.connection}</Text>
                      </span>
                    </Space>
                  </Col>
                  <Col span={3}>
                    <Space direction="vertical">
                      <span style={{
                        fontSize:'12px',
                        fontWeight: 400,
                        color: '#a1abc8',
                      }}>
                        最后登录时间
                      </span>
                      <span>
                        {row.lastLogin ? moment(row.lastLogin).format('YYYY-MM-DD hh:mm:ss') : '-'}
                      </span>
                    </Space>
                  </Col>
                  <Col span={2}>
                    <Space direction="vertical">
                      <span style={{
                        fontSize:'12px',
                        fontWeight: 400,
                        color: '#a1abc8',
                      }}>
                        登录次数
                      </span>
                      <span>
                        {row.loginsCount || 0}
                      </span>
                    </Space>
                  </Col>
                  <Col span={2}>
                    <Row align="middle" style={{ height: '100%' }}>
                      <Button type="link" onClick={() => handleDelete(row.user_id)}>删除</Button>
                    </Row>
                  </Col>
                </Row>
              </div>
              </Badge.Ribbon>
            );
          }}
        />
      </Card>
    </PageContainer>
  );
};

export default UserListPage;