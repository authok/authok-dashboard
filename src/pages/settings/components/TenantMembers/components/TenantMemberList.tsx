import React from 'react';
import { Dropdown, Menu, Avatar, Space, Table } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useFormTable } from '@umijs/hooks';
import { formatPageQuery } from '@/utils/utils';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable'
import { useTenantMembers } from '@/hooks/tenant';
import { formatFormTablePagination } from '@/utils/formatter';

const TenantMemberList: React.FC = () => {
  const { run: paginate } = useTenantMembers({
    manual: true,
    formatResult: formatFormTablePagination,
  } as any);

  const getTableData = async ({ current, pageSize, ...rest }: PaginatedParams[0], formData: Object): Promise<{ list: API.OrganizationMember[]; total: number; }> => {
    const params = {current, pageSize};
    Object.entries(formData).forEach(([key, value]) => {
      params[key] = value;
    });
    const sorter = {
      created_at: 'DESC',
    }

    const query = formatPageQuery(params, sorter);
  
    return await paginate(query);
  };

  const { tableProps } = useFormTable(getTableData, {});
  
  const columns = [
    {
      title: '名称',
      render: (text, record) => {
        return <Space>
          <Avatar src={record.user.picture} />
          <Space direction="vertical">
            <b>{record.user.email || record.user.phone_number || record.user.nickname || record.user.username}</b>
          </Space>
        </Space>
      }
    },
    {
      title: '角色',
      render: (text, record) => <Space>{record.roles?.map(it => it.role?.name)}</Space>,
    },
    {
      title: '操作',
      render: (text, record) => {
        const overlay = <Menu>
          <Menu.Item key="delete" icon={<DeleteOutlined />}>删除</Menu.Item>
        </Menu>;

        return <Dropdown.Button overlay={overlay} />;
      }
    }
  ];

  return <Table<API.OrganizationMember>
    params={{
      select: 'id,roles.role_id,roles.role.name,user.username,user.nickname',
    }}
    rowKey="id"
    {...tableProps}
    columns={columns}
  />
};

export default TenantMemberList;