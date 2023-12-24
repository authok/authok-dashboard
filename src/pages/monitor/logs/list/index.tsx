import React, { useMemo, useState, useEffect } from 'react';
import { Table, Row, Col, Button, Space } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { LeftOutlined, RightOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';
import moment from 'moment';
import { formatPath } from '@/utils/link.utils';
import { useResourceCursorList, useResourcePagination } from '@/hooks/useResource';
import { LogEntity } from '@/api/entities/log.entity';
import { PageContainer } from '@ant-design/pro-layout';
import { ClientEntity } from '@/api';
import * as _ from 'lodash';

const LogEventListPage: React.FC = () => {
  const [params, setParams] = useState<API.CursorQuery>({
    first: 20,
  });

  const { run: paginate, data: logPage, loading } = useResourceCursorList(LogEntity, {
    defaultParams: [params]
  } as any);

  const { run: loadClients, data: clients } = useResourcePagination(ClientEntity, {
    manual: true,
    formatResult: (page: API.Page<API.Application>) => page.items,
  });

  const clientMap = useMemo(() => _.keyBy(clients || [], 'client_id'), [clients]);

  useEffect(() => {
    if (logPage) {
      const client_ids = Array.from(new Set(logPage.data.map(it => it.node.client_id).filter(it => !!it)));

      loadClients({ client_id: client_ids, page_size: client_ids.length });
    }
  }, [logPage]);

  const dataSource = useMemo(() => logPage?.data?.map((it) => it.node), [logPage]);

  const goNextPage = () => {
    const newParams = {...params};
    newParams.before = undefined;
    newParams.after = logPage?.endCursor;
    setParams(newParams);

    paginate(newParams);
  };

  const goPrevPage = () => {
    const newParams = {...params};
    newParams.after = undefined;
    newParams.before = logPage?.startCursor;
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
        const client = clientMap[row.client_id];
        if (client) {
          return <Link to={formatPath(`/app/applications/${row.client_id}`)}>{client.display_name || client.name}</Link>;
        } else {
          return row.client_name;
        }
      },
    },
    {
      title: '身份源',
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

  return (
    <PageContainer className="page-middle">
      <Space direction="vertical" style={{ width: '100%' }}>
        <Table<API.Log>
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={false}
        />
        <Row style={{ width: '100%' }}>
          <Col span={4}>
            <Button disabled={logPage?.hasPreviousPage !== true} onClick={goPrevPage}><LeftOutlined />上一页</Button>
          </Col>
          <Col span={16}>
          </Col>
          <Col span={4}>
            <Row justify="end">
              <Button disabled={logPage?.hasNextPage !== true} onClick={goNextPage}>下一页<RightOutlined /></Button>
            </Row>
          </Col>
        </Row>
      </Space>
    </PageContainer>
  );
};

export default LogEventListPage;