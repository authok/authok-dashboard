import React, { useMemo, useState } from 'react';
import { Table, Row, Col, Button, Space, Badge } from 'antd';
import { useUserLogPagination } from '@/hooks/user';
import { ColumnsType } from 'antd/lib/table';
import { LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import moment from 'moment';
import { formatPath } from '@/utils/link.utils';

interface UserEventHistoryProps {
  user: API.User;
}

const UserEventHistory: React.FC<UserEventHistoryProps> = ({ user }) => {
  const [params, setParams] = useState<API.CursorQuery>({
    first: 100,
  });

  const { run: paginate, data: data, loading } = useUserLogPagination(user.user_id, {
    defaultParams: [params]
  });

  const dataSource = useMemo(() => data?.data?.map((it) => it.node),[data]);

  const goNextPage = () => {
    const newParams = {...params};
    newParams.before = undefined;
    newParams.after = data?.endCursor;
    setParams(newParams);

    paginate(newParams);
  };

  const goPrevPage = () => {
    const newParams = {...params};
    newParams.after = undefined;
    newParams.before = data?.startCursor;
    setParams(newParams);

    paginate(newParams);
  };

  const columns: ColumnsType<API.Log>[] = [
    {
      title: '事件',
      filters: [
        { text: '成功', value: 'success' },
        { text: '失败', value: 'error' },
      ],
      onFilter: (value, record) => {
        switch (value) {
          case 'error': {
            return !!record.details?.error;
          }
          case 'success': {
            return !record.details?.error;
          }
        }
      },
      valueType: 'select',
      valueEnum: {
        success: { text: '已上线', status: 'Success' },
        error: { text: '异常', status: 'Error' },
      },
      render: (_, row) => {
        const icon = row.details?.error ? <CheckCircleOutlined style={{ color: 'red' }}/> : <CheckCircleOutlined style={{ color: 'green' }}/>;
        let message;
        if (row.details?.error) {
          message = row.details?.error?.message; 
        } else {
          // 根据 事件类型来显示
          message = '成功登录';
        }

        return <Row gutter={16}>
          <Col span={4}>{icon}</Col>
          <Col span={20}><Link to={formatPath(`/logs/${row.id}`)}>{message}</Link></Col>
        </Row>
      },
    },
    {
      title: '时间',
      render: (_, row) => {
        return moment(row.date).format('YYYY-MM-DD hh:mm:ss');
      }
    },
    {
      title: '应用',
      render: (_, row) => {
        return row.client_name;
      },
    },
    {
      title: '身份提供者',
      render: (_, row) => {
        return row.connection;
      },
    },
    {
      title: '来源',
      render: (text, row) => {
        return row.ip;
      }
    },
  ];

  return <Space direction="vertical" style={{ width: '100%' }}>
    <Table<API.Log>
      rowKey="id"
      loading={loading}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
    />
    <Row style={{ width: '100%' }}>
      <Col span={4}>
        <Button disabled={data?.hasPreviousPage != true} onClick={goPrevPage}><LeftOutlined />上一页</Button>
      </Col>
      <Col span={16}>
      </Col>
      <Col span={4}>
        <Row justify="end">
          <Button disabled={data?.hasNextPage != true} onClick={goNextPage}>下一页<RightOutlined /></Button>
        </Row>
      </Col>
    </Row>
  </Space>;
};

export default UserEventHistory;