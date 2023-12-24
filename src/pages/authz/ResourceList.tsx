import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { ConnectProps, connect } from 'umi';
import { ProColumns } from '@ant-design/pro-table/lib/Table';
import XProTable from '@/components/XProTable';
import styles from './ResourceList.less';
import { formatPath } from '@/utils/link.utils';

interface TableProps extends ConnectProps {
}

const ResourceList: React.FC<TableProps> = (props) => {
  const { dispatch } = props;

  const queryPageData = async (pageQuery: API.PageQuery) => {
    console.log('queryPageData: ', pageQuery);
    const response = await dispatch({
      type: 'resource/list',
      payload: pageQuery,
    });
    const page = response.data;
    return page;
  }

  const columns: ProColumns<API.Resource> = [
    {
      title: '资源名称',
      dataIndex: 'code',
      render: (dom, record) => {
        return <a onClick={() => {
          history.push({
            pathname: formatPath(`/resource/${record.id}`)
          });
        }}>{dom}</a>;
      },
    },
    {
      title: '资源类型',
      dataIndex: 'type',
      valueEnum: {
        'DATA': { text: '数据' },
      },
    },
    {
      title: '备注',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      hideInSearch: true,
      render: (dom, record) => {
        record.actions?.map(it => (<div>{it.name}</div>))
      },
    },
  ];

  return (
    <PageContainer>
      <XProTable<API.Resource>
        columns={columns}
        request={queryPageData}
      />
    </PageContainer>
  );
}

export default connect(
  ({
    loading,
  }: {
    loading: {
      effects: {
        [key: string]: boolean;
      };
    };
  }) => ({
    createFormLoading: loading.effects['resource/create'],
  }),
)(ResourceList);