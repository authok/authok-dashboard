import React, { useCallback } from 'react';
import { Table, Menu, Badge, Dropdown, Popconfirm, Typography } from 'antd';
import { formatFormTablePagination } from '@/utils/formatter';
import { useTenantMemberInvitations, useTenantMemberInvitationRemove } from '@/hooks/tenant';
import { formatPageQuery } from '@/utils/utils';
import { useFormTable } from '@umijs/hooks';
import { PaginatedParams } from '@umijs/hooks/lib/useFormTable'
import moment from 'moment';
import { DeleteOutlined } from '@ant-design/icons';
import { EventEmitter } from '@umijs/hooks/lib/useEventEmitter';
import useClipboard from '@/hooks/useClipboard';
const { Text } = Typography;

interface TenantMemberInvitationListProps {
  newInvitationEvent$?: EventEmitter<API.Invitation>;
}

const TenantMemberInvitationList: React.FC<TenantMemberInvitationListProps> = ({ newInvitationEvent$ }) => {
  const { run: paginate } = useTenantMemberInvitations({
    manual: true,
    formatResult: formatFormTablePagination,
  } as any);

  const { run: removeInvitation } = useTenantMemberInvitationRemove();

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

  const { tableProps, refresh } = useFormTable(getTableData, {});

  const handleDelete = useCallback(async (id: string) => {
    await removeInvitation(id);

    refresh();
  }, [refresh]);

  newInvitationEvent$?.useSubscription(() => {
    refresh();
  });

  const { copy } = useClipboard();

  const columns = [
    {
      title: '被邀请人',
      render: (text, record) => {
        return record.invitee.email;
      }
    },
    {
      title: '状态',
      render: (text, record) => {
        return <Badge status="processing" text="等待确认"/>
      }
    },
    {
      title: '创建时间',
      render: (text, record) => {
        return moment(record.created_at).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    {
      title: '过期时间',
      render: (text, record) => {
        return moment(record.expires_at).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    {
      title: '创建人',
      render: (text, record) => {
        return record.inviter?.username || record.inviter?.nickname || record.inviter?.email || record.inviter?.phone_number;
      }
    },
    {
      title: '操作',
      render: (text, record) => {
        const overlay = <Menu>
          <Menu.Item key="copy_url" onClick={() => copy(record.invitation_url)}>拷贝邀请链接</Menu.Item>
          <Menu.Item key="delete" icon={<DeleteOutlined />}>
            <Popconfirm title="确定要删除" okText="是" cancelText="否" onConfirm={() => handleDelete(record.id)}>
              删除
            </Popconfirm>
          </Menu.Item>
        </Menu>

        return <Dropdown.Button overlay={overlay}/>
      }
    }
  ];

  return <Table<API.Invitation>
    rowKey="id"  
    columns={columns}
    {...tableProps}
  />;
}

export default TenantMemberInvitationList;