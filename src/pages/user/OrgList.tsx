import React, { useState, useRef, useEffect } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
import {
  Form,
  Tree,
  Alert,
  Button,
  Card,
  Dropdown,
  Menu,
  Table,
  Row,
  Col,
  Select as AntdSelect,
  Input as AntdInput,
  DatePicker as AntdDatePicker,
} from 'antd';
import CustomFormItemHoc, { FormDisabledContext } from '@/components/FormDisabledContext';
import { OrgModelState, history, connect, ConnectProps, useDispatch, formatMessage } from 'umi';
import { useRequest, useToggle } from '@umijs/hooks';
import { PageContainer } from '@ant-design/pro-layout';
import { DownOutlined } from '@ant-design/icons';
import Avatar from 'antd/lib/avatar/avatar';
import { ActionType } from '@ant-design/pro-table';
import { getOrgTree, editOrg } from '@/services/org';
import styles from './OrgList.less';
import { runInContext } from 'lodash';
import { formatPath } from '@/utils/link.utils';

const { Search } = AntdInput;

const { Option } = AntdSelect;
const Input = CustomFormItemHoc(AntdInput);
const Select = CustomFormItemHoc(AntdSelect);
const DatePicker = CustomFormItemHoc(AntdDatePicker);

interface OrgTreeProps {
  onSelect?: (selectedKeys: any, info: any) => Promise<any>;
}

const OrgTree: React.FC<OrgTreeProps> = (props) => {
  const { onSelect } = props;

  const [treeData, setTreeData] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const dispatch = useDispatch();

  const loop = (data: API.Organization[]): any =>
    data.map((item: API.Organization): any => {
      const index = item.name.indexOf(searchValue);
      const beforeStr = item.name.substr(0, index);
      const afterStr = item.name.substr(index + searchValue.length);

      const title =
        index > -1 ? (
          <span>
            {beforeStr}
            <span className={styles['site-tree-search-value']}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
            <span>{item.name}</span>
          );

      if (item.children) {
        return { title, key: item.id, children: loop(item.children), org: item };
      }

      return { title, key: item.id, org: item };
    });

  const visit = (data: any[], listener: (item: any) => void): any => {
    data.forEach((item: any) => {
      listener(item);
      if (item.children) visit(item.children, listener);
    });
  };

  // debounce, merge, loading, error catch
  const { run, loading } = useRequest(getOrgTree, { manual: true });

  async function loadOrgTree() {
    const response = await run();
    const treeData = response.data;

    const indexList = [];
    visit(response.data, (org) => {
      indexList.push({ key: org.id, title: org.name });
    });

    setIndexList(indexList);
    setTreeData(treeData);

    if (treeData.length > 0) {
      const node = treeData[0];
      setExpandedKeys([node.id]);
      setSelectedKeys([node.id]);
    }
  }

  useEffect(() => {
    loadOrgTree();
  }, []);

  const getParentKey = (id, tree) => {
    let parentKey;
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i];
      if (node.children) {
        if (node.children.some((item) => item.id === id)) {
          parentKey = node.id;
        } else if (getParentKey(id, node.children)) {
          parentKey = getParentKey(id, node.children);
        }
      }
    }
    return parentKey;
  };

  const onExpand = (expandedKeys) => {
    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onChange = (e) => {
    const { value } = e.target;
    const expandedKeys1 = indexList
      .map((item) => {
        if (item.title.indexOf(value) > -1) {
          return getParentKey(item.key, treeData);
        }
        return null;
      })
      .filter((item, i, self) => item && self.indexOf(item) === i);

    setExpandedKeys(expandedKeys1);
    setSearchValue(value);
    setAutoExpandParent(true);
  };

  return (
    <div className={styles.directory}>
      <Search style={{ marginBottom: 8 }} placeholder="输入部门名称查找" onChange={onChange} />
      <Tree
        onSelect={onSelect}
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        defaultSelectedKeys={selectedKeys}
        autoExpandParent={autoExpandParent}
        treeData={loop(treeData)}
      />
    </div>
  );
};

interface OrgUserTableProps {
  org?: API.Organization;
  loading: boolean;
}

let OrgUserTable: React.FC<OrgUserTableProps> = (props) => {
  const { org, loading } = props;

  const dispatch = useDispatch();

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userPage, setUserPage] = useState<API.Page<API.User>>({});
  const [filteredUsers, setFilteredUsers] = useState<API.User[]>([]);

  const handleUserSearchChange = (selectedItems: any) => {
    setSelectedUsers(selectedItems);
    const filtered = userPage.items?.filter((o) => !selectedUsers.includes(o)) || [];
    setFilteredUsers(filtered);
  };

  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const searchUsers = () => {
    // 从后台搜索数据
    const pageData = {
      items: [
        {
          id: '1',
          avatar:
            'https://files.authing.co/user-contents5f74f487bc121542ad0c7e3d/avatar/be5d18d6-d772-4ec7-a4cf-2e9912e6cb4f.jpg',
          username: 'test1',
          nickname: '测试1',
        },
        {
          id: '2',
          avatar:
            'https://files.authing.co/user-contents5f74f487bc121542ad0c7e3d/avatar/be5d18d6-d772-4ec7-a4cf-2e9912e6cb4f.jpg',
          username: 'test2',
          nickname: '测试2',
        },
      ],
      total: 2,
    };

    dispatch({
      type: 'org/searchUsers',
      payload: {
        orgId: org?.id,
        pageQuery: {
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
        },
      },
    });

    setUserPage(pageData);
    setFilteredUsers(pageData.items);
  };

  useEffect(() => {
    searchUsers();
  }, [pagination]);

  // pageNum改变触发的回调
  const onPaginationChange = (pagination, filters, sorter, extra) => {
    console.log('onPaginationChange: ', pagination);
    setPagination(pagination);
  };

  const columns = [
    {
      dataIndex: 'avatar',
      render: (_, record) => {
        return <Avatar src={record.avatar} />;
      },
    },
    {
      title: '用户信息',
      key: 'userinfo',
      render: (dom, record) => {
        return (
          <Row>
            <Col span="6">用户名: </Col>
            <Col span="18">{record.username}</Col>
            <Col span="6">手机号: </Col>
            <Col span="18">{record.mobile}</Col>
            <Col span="6">昵称: </Col>
            <Col span="18">{record.nickname}</Col>
            <Col span="6">邮箱: </Col>
            <Col span="18">{record.email}</Col>
          </Row>
        );
      },
    },
    {
      title: '操作',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              history.push({
                pathname: formatPath(`/user/user-list/${record.id}`),
              });
            }}
          >
            查看详情
          </a>
        </>
      ),
    },
  ];

  return (
    <>
      <div className={styles.titleWrapper}>
        <div className={styles.title} style={{ fontSize: '20px' }}>
          <span>节点成员</span>
        </div>
        <div>
          <Select
            mode="multiple"
            placeholder="搜索成员"
            style={{ width: '150px', marginRight: '8px' }}
            showArrow
            value={selectedUsers}
            onChange={handleUserSearchChange}
            onSearch={searchUsers}
          >
            {filteredUsers?.map((user) => (
              <Option key={user.id} value={user.id || ''}>
                {user.username}
              </Option>
            ))}
          </Select>
          <Button type="primary">添加成员</Button>
        </div>
      </div>
      <Table
        style={{ marginBottom: 24 }}
        pagination={{
          total: userPage.total,
          ...pagination,
        }}
        loading={loading}
        dataSource={userPage?.items}
        columns={columns}
        rowKey="id"
        onChange={onPaginationChange}
      />
    </>
  );
};

OrgUserTable = connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  loading: loading.effects['org/getUsers'],
}))(OrgUserTable);

interface SubOrgTableProps {
  org?: API.Organization;
  loading: boolean;
}

let SubOrgTable: React.FC<SubOrgTableProps> = (props) => {
  const { org, loading } = props;

  const actionRef = useRef<ActionType>();

  const dispatch = useDispatch();

  const [selectedRows, setSelectedRows] = useState<API.Organization[]>([]);
  const [itemPage, setItemPage] = useState<API.Page<API.Organization>>({});

  const [pagination, setPagination] = useState({
    pageNo: 1,
    pageSize: 10,
  });

  const searchItems = () => {
    // 从后台搜索数据
    const pageData = {
      items: [
        {
          id: '1',
          avatar:
            'https://files.authing.co/user-contents5f74f487bc121542ad0c7e3d/avatar/be5d18d6-d772-4ec7-a4cf-2e9912e6cb4f.jpg',
          username: 'test1',
          nickname: '测试1',
        },
        {
          id: '2',
          avatar:
            'https://files.authing.co/user-contents5f74f487bc121542ad0c7e3d/avatar/be5d18d6-d772-4ec7-a4cf-2e9912e6cb4f.jpg',
          username: 'test2',
          nickname: '测试2',
        },
      ],
      total: 2,
    };

    dispatch({
      type: 'org/searchSubOrgs',
      payload: {
        orgId: org?.id,
        pageQuery: {
          pageNo: pagination.pageNo,
          pageSize: pagination.pageSize,
        },
      },
    });

    setItemPage(pageData);
  };

  useEffect(() => {
    searchItems();
  }, [pagination]);

  // pageNum改变触发的回调
  const onPaginationChange = (pagination, filters, sorter, extra) => {
    console.log('onPaginationChange: ', pagination);
    setPagination(pagination);
  };

  const handleDelete = async (selectedRows: API.User[]) => {
    console.log('handleDelete');
  };

  const columns = [
    {
      dataIndex: 'name',
      title: '节点名称',
    },
    {
      title: '描述',
      key: 'description',
    },
    {
      title: '操作',
      valueType: 'option',
      align: 'center',
      render: (_, record) => (
        <div>
          <Button
            type="link"
            style={{ marginRight: '12px' }}
            onClick={() => {
              history.push({
                pathname: formatPath(`/user/user-list/${record.id}`),
              });
            }}
          >
            查看详情
          </Button>
          <Button type="link" danger onClick={() => { }}>
            删除
          </Button>
        </div>
      ),
    },
  ];

  return (
    <>
      <div className={styles.titleWrapper}>
        <div className={styles.title} style={{ fontSize: '20px' }}>
          <span>下级节点</span>
        </div>
        <div>
          {selectedRows?.length > 0 && (
            <Button
              type="primary"
              danger
              style={{ marginRight: '12px' }}
              onClick={async () => {
                await handleDelete(selectedRows);
                setSelectedRows([]);
                actionRef.current?.reloadAndRest?.();
              }}
            >
              批量删除
            </Button>
          )}
          <Button type="primary">添加子节点</Button>
        </div>
      </div>
      <Table
        style={{ marginBottom: 24 }}
        pagination={{
          total: itemPage.total,
          ...pagination,
        }}
        loading={loading}
        dataSource={itemPage?.items}
        columns={columns}
        rowKey="id"
        onChange={onPaginationChange}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
    </>
  );
};

SubOrgTable = connect(({ loading }: { loading: { effects: { [key: string]: boolean } } }) => ({
  loading: loading.effects['org/getSubOrgs'],
}))(SubOrgTable);

interface OrgEditFormProps {
  org?: API.Organization;
}

const OrgEditForm: React.FC<OrgEditFormProps> = (props) => {
  const { org } = props;
  const [form] = Form.useForm();
  const { state: editMode, toggle: toggleEditMode } = useToggle(false);

  useEffect(() => {
    form.setFieldsValue(org);
  }, [org]);

  const { run, loading } = useRequest(editOrg, { manual: true });

  const handleClick = async () => {
    if (editMode) {
      const values = form.getFieldsValue();
      console.log('edit: ', values);
      const r = await run(values);
    }

    toggleEditMode();
  };

  return (
    <>
      <div className={styles.titleWrapper}>
        <div className={styles.title} style={{ fontSize: '20px' }}>
          <span>组织机构详情 - {org?.name}</span>
        </div>
        <div>
          <Button loading={loading} type="primary" onClick={handleClick}>
            {editMode ? '保存' : '编辑'}
          </Button>
        </div>
      </div>
      <FormDisabledContext.Provider
        value={{
          disabled: !editMode,
        }}
      >
        <Form layout="vertical" form={form}>
          <Form.Item name="id" hidden />
          <Form.Item
            label="节点名称"
            name="name"
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'org.name.required' }),
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item label="节点ID" name="id">
            <Input />
          </Form.Item>
          <Form.Item label="节点标识符" name="code">
            <Input />
          </Form.Item>
          <Form.Item label="节点描述" name="description">
            <Input />
          </Form.Item>
        </Form>
      </FormDisabledContext.Provider>
    </>
  );
};

interface OrgListProps extends ConnectProps {
  // currentOrg?: API.Organization;
  createFormLoading: boolean;
}

const OrgList: React.FC<OrgListProps> = (props) => {
  const [currentOrg, setCurrentOrg] = useState<API.Organization>({});

  const onOrgSelected = async (selectedKeys: any, info: any) => {
    // const key = selectedKeys[0]

    const { org } = info.node.props;
    setCurrentOrg(org);
  };

  const handleMenuClick = (e) => {
    console.log('click', e);
  };

  const importMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="excel">从 Excel 导入</Menu.Item>
      <Menu.Item key="wechatwork">从企业微信导入</Menu.Item>
      <Menu.Item key="dingtalk">从钉钉导入</Menu.Item>
      <Menu.Item key="sync-history">查看导入历史</Menu.Item>
    </Menu>
  );

  const helpMessage = (
    <div>
      Authing 的组织架构支持从企业微信、钉钉、Excel 等方式导入。
      <a target="_blank" href="http://www.baidu.com">
        点击了解如何使用 API 管理组织结构。
      </a>
    </div>
  );
  return (
    <PageContainer>
      <Card>
        <div className={styles.titleWrapper}>
          <div className={styles.title}>
            <div>
              <Button type="primary" style={{ marginRight: '12px' }}>
                创建组织机构
              </Button>
              <Dropdown overlay={importMenu}>
                <Button type="primary">
                  导入组织机构
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          </div>
        </div>
        <Alert style={{ marginBottom: '12px' }} type="info" message={helpMessage} />
        <div className={styles.wrapper}>
          <OrgTree onSelect={onOrgSelected} />
          <div className={styles.orgInfo}>
            <OrgEditForm org={currentOrg} />
            <OrgUserTable org={currentOrg} />
            <SubOrgTable org={currentOrg} />
          </div>
        </div>
      </Card>
    </PageContainer>
  );
};

export default connect(
  ({
    loading,
  }: {
    org: OrgModelState;
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    createFormLoading: loading.effects['org/create'],
  }),
)(OrgList);
