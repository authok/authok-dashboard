import React, { useMemo, useRef, useEffect, useCallback } from 'react';
import { Form, Space, Badge, Card, Button, Input, Select, Typography, Row, Col, Table, notification, Popconfirm } from 'antd';
import moment from 'moment';
import * as _ from 'lodash';
import ProForm from '@ant-design/pro-form';
import CodeEditor from '@/components/CodeEditor';
import DangerItem from '@/components/DangerItem';
import ProDescriptions from '@ant-design/pro-descriptions';
import { MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { useMarketplaceCatalogPaginationByFeature } from '@/hooks/marketplace-catalog';
import ProTable from '@ant-design/pro-table';
import Avatar from 'antd/lib/avatar/avatar';
import NodeSelectModal from '@/components/NodeSelectModal';
import { useResourcePagination } from '@/hooks/useResource';
import { ConnectionEntity } from '@/api';
import { UserEntity } from '@/api/entities/user.entity';
import { formatPageQuery } from '@/utils/utils';
const { Text } = Typography;
import styles from './index.less';

interface UserDetailsSettingsProps {
  user: API.User;
  onUpdate?: (user: Partial<API.User>) => Promise<boolean>;
  loadingUpdate?: boolean;
  onDelete?: () => Promise<void>;
  loadingDelete?: boolean;
  loadingLink?: boolean;
  onLinkIdentity?: (primaryUserId: string, linkReq: API.LinkIdentityReq) => Promise<boolean>;
  loadingUnlink?: boolean;
  onUnlinkIdentity?: (primaryUserId: string, connection: string, secondaryUserId: string) => Promise<boolean>;
  onBlock?: (blocked: boolean) => Promise<void>;
}

const defaultMetadata = `{
}`;

const UserDetailsSettings: React.FC<UserDetailsSettingsProps> = ({ user, onUpdate, loadingUpdate, onBlock, onDelete, loadingDelete, onLinkIdentity, loadingLink, onUnlinkIdentity, loadingUnlink }) => {    
  const actionRef = useRef();

  const { data: connectionPage } = useResourcePagination(ConnectionEntity, {
    defaultParams: [{
      name: _.first(user.identities)?.connection,
    }]
  } as any);

  const { run: paginateItems, data: catalogs } = useMarketplaceCatalogPaginationByFeature('social-connections', {
    manual: true,
    formatResult: (page: API.Page<API.Catalog>) => page.items,
  });

  const catalogMap = useMemo(() => _.keyBy(catalogs || [], 'catalog_id'), [catalogs]);

  useEffect(() => {
    if (!user) return;

    let catalogIds = user.identities.map(it => it.provider);
    catalogIds = Array.from(new Set(catalogIds));

    if (catalogIds.length > 0) {
      paginateItems({
        catalog_id: catalogIds,
      });
    }
  }, [user]);

  const connection = useMemo(() => _.first(connectionPage?.items), [connectionPage]);

  const [form] = Form.useForm();

  useEffect(() => {
    actionRef.current?.reload();
  }, [user, connection]);

  const { run: paginateUsers } = useResourcePagination(UserEntity, {
    manual: true,
    formatResult: (page: API.Page<API.User>): API.Page<API.Node<any>> => ({
      meta: page.meta,
      items: page.items.map(it => ({ type: 'user', data: it, id: it.user_id })),
    })
  });

  const handleLinkIdentity = useCallback(async (u: API.User) => {
    return await onLinkIdentity?.(user.user_id, {
      connection: u.connection,
      user_id: u.user_id,
    });
  }, [user]);

  return <Space size="large" direction="vertical" style={{ width: '100%' }}>
    <Card title="基本信息">
      <ProDescriptions 
        actionRef={actionRef}
        rowKey="user_id"
        layout="vertical"
        editable={{
          form,
          onSave: async (keypath, newInfo, oriInfo) => {
            const values = {...form.getFieldsValue()};
            if (values.birthdate) {
              values.birthdate = moment(values.birthdate).format('YYYY-MM-DD hh:mm:ss');
            }

            await onUpdate?.(values);
            return true;
          },
        }}
        column={{ xs: 1, sm: 2, md: 3}}
        formProps={{
          onValuesChange: (value) => {
          }
        }}
        request={async () => ({
          success: true,
          data: user,
        })}
        columns={[
          {
            title: <b>昵称</b>,
            dataIndex: 'nickname',
          },
          {
            title: <b>用户名</b>,
            dataIndex: 'username',
          },
          {
            title: <b>姓名</b>,
            dataIndex: 'name',
          },
          {
            title: <b>邮箱</b>,
            render: (text, record) => {
              return <Space direction="horizontal">
                {record.email}
                { record.email && (record.email_verified ? <Badge status="success" text="已验证"/> : <Badge status="warning" text="未验证"/>)}
              </Space>
            },
            dataIndex: 'email',
            renderFormItem: (r, p2, form) => {
              return (
                <Input addonBefore={<MailOutlined/>} 
                  addonAfter={
                    <Form.Item name="email_verified" noStyle>
                      <Select defaultValue={r.entity.email_verified} options={[{ label: '已验证', value: true}, { label: '未验证', value: false}]}/>
                    </Form.Item>
                  } />
              );
            },
          },
          {
            title: <b>手机号</b>,
            render: (text, record) => {
              return <Space direction="horizontal">
                {record.phone_number}
                { record.phone_number && (record.phone_number_verified ? <Badge status="success" text="已验证"/> : <Badge status="warning" text="未验证"/>)}
              </Space>
            },
            dataIndex: 'phone_number',
            renderFormItem: (r, p2, form) => {
              return <Input addonBefore={<PhoneOutlined />} addonAfter={
                <Form.Item name="phone_number_verified" noStyle>
                  <Select defaultValue={r.entity.phone_number_verified} options={[{ label: '已验证', value: true}, { label: '未验证', value: false}]}/>
                </Form.Item>
              }/>;
            },
          },
          {
            title: <b>性别</b>,
            dataIndex: 'gender',
            valueType: 'select',
            valueEnum: {
              0: '未知',
              1: '男',
              2: '女',
            },
            key: "gender",
            renderFormItem: (r, p2, form) => {
              return <Select 
                options={[
                  { label: '未知', value: 0 },
                  { label: '男', value: 1 },
                  { label: '女', value: 2 },
                ]} />;
            },
          },
          {
            title: <b>生日</b>,
            dataIndex: 'birthdate',
            valueType: 'date',
          },
          {
            title: <b>注册时间</b>,
            dataIndex: 'signup_at',
            editable: false,
            valueType: 'dateTime',
          },
          {
            title: <b>最后登录时间</b>,
            dataIndex: 'last_login',
            editable: false,
            render: (text, record) => record.last_login ? moment(record.last_login).format('YYYY-MM-DD hh:mm:ss') : '从未登录',
          },
          {
            title: <b>主身份提供者</b>,
            dataIndex: 'last_login',
            editable: false,
            render: (text, record) => {
              if (!connection) return;
              if (connection.strategy === 'authok') {
                return '数据库';
              }

              const catalog = catalogMap[connection.strategy];
              return catalog?.name;
            }
          }
        ]}
      >
      </ProDescriptions>
    </Card>

    <Card className={styles.identities} title="身份提供者信息" extra={
      <NodeSelectModal 
        title="选择用户" 
        request={(params, sorter, filter) => paginateUsers(formatPageQuery(params, sorter, filter))} 
        trigger={<Button loading={loadingLink} type="link">关联账户</Button>} onFinish={(nodes: API.Node<any>[]) => handleLinkIdentity(_.first(nodes?.map(it => it.data))) }
      />
    }>
      <ProTable
        rowKey="user_id"
        options={false}
        pagination={false}
        search={false}
        columns={[
          {
            title: '平台',
            render: (text, record) => {
              if (record.provider === 'authok') {
                return <Space>
                  <Avatar src="https://cdn.authok.cn/market/catalog/assets/connections/social/authok.svg" /> 
                  <span>数据库</span>
                </Space>
              }

              const catalog = catalogMap[record.provider];
              return <Space>
                <Avatar src={catalog?.icon}/>
                <span>{catalog?.name || record.provider}</span>
              </Space>; 
            }
          },
          {
            title: '用户',
            render: (text, record) => {
              return (<Space>
                <Avatar src={record.profile_data?.picture} />
                <Space direction="vertical">
                  <Text>{record.profile_data?.nickname || record.profile_data?.username || record.profile_data?.name || record.profile_data?.email || record.profile_data?.phone_number}</Text>
                  <span>用户ID: <Text copyable={{ text: record.user_id }}><Text code>{record.user_id}</Text></Text></span>
                </Space>
              </Space>
              );
            }
          },
          {
            title: '最后登录时间',
            dataIndex: 'last_login',
            valueType: 'dateTime',
          },
          {
            title: '创建时间',
            dataIndex: 'created_at',
            valueType: 'dateTime',
          },
          {
            valueType: 'option',
            render: (text, record) => {
              const userId = `${record.provider}|${record.user_id}`;
              if (userId === user.user_id) return;

              return <Popconfirm title="确定要解除关联" okText="确定" cancelText="取消" onConfirm={() => onUnlinkIdentity?.(user.user_id, record.connection, record.user_id)}>
                <Button loading={loadingUnlink} type="link">解除关联</Button>
              </Popconfirm>
            }
          },
        ]}
        dataSource={user.identities}
      />
    </Card>

    <Card title="元数据">
      { user && <ProForm
        size="large"
        initialValues={{
          user_metadata: user.user_metadata ? JSON.stringify(user.user_metadata, null, 2) : defaultMetadata,
          app_metadata: user.app_metadata ? JSON.stringify(user.app_metadata, null, 2) : defaultMetadata,
        }}
        submitter={{
          searchConfig: {
            submitText: '保存',
          },
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
        onFinish={(_values: Record<string, any>) => {
          if (_values.user_metadata) _values.user_metadata = JSON.parse(_values.user_metadata);
          if (_values.app_metadata) _values.app_metadata = JSON.parse(_values.app_metadata);
          return onUpdate(_values);
        }}
      >
        <ProForm.Item 
          name="user_metadata"
          label={<b>user_metadata</b>}
          rules={[
            {
              validator: (_: any, value: string) => {
                const promise = Promise;
                try {
                  JSON.parse(value);
                } catch (e) {
                  return promise.reject('不是合法JSON数据');
                }
                return promise.resolve();
              }
            }
          ]}
          extra="用户可读/写的元数据(例如. 用户偏好设置, 博客url 等)"
        >
          <CodeEditor 
            width="100%"
            height="24vh"
            language="json"
            theme="vs-dark"
          />
        </ProForm.Item>
        <ProForm.Item 
          name="app_metadata"
          label={<b>app_metadata</b>}
          rules={[
            {
              validator: (_: any, value: string) => {
                const promise = Promise;
                try {
                  JSON.parse(value);
                } catch (e) {
                  return promise.reject('不是合法JSON数据');
                }
                return promise.resolve();
              }
            }
          ]}
          extra="用户只读的元数据(例如: 角色, 权限, vip 等)"
        >
          <CodeEditor 
            width="100%"
            height="24vh"
            language="json"
            theme="vs-dark"
          />
        </ProForm.Item>
      </ProForm>
    }
    </Card>
    <h2 style={{ marginTop: '24px' }}>危险操作</h2>
    <DangerItem title="删除用户" description="删除用户" actions={[<Button size="large" danger type="primary" loading={loadingDelete} onClick={() => onDelete?.()}>删除</Button>]} />
    { user.blocked ? 
      <DangerItem title="解锁用户" description="解除锁定后用户可正常登录系统" actions={[<Button size="large" danger type="primary" loading={loadingUpdate} onClick={() => onBlock?.(!user.blocked)}>解除锁定</Button>]} />
      :
      <DangerItem title="锁定用户" description="用户被锁定后不可登录" actions={[<Button size="large" danger type="primary" loading={loadingUpdate} onClick={() => onBlock?.(!user.blocked)}>锁定</Button>]} />
    }
  </Space>;
}

export default UserDetailsSettings;