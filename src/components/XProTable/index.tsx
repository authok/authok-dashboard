import ProTable from '@ant-design/pro-table';
import { formatPageQuery } from '@/utils/utils';

const XProTable: ProTable<T, U> = (props: any) => {
  const { request, children, ...restProps } = props;

  const requestData = async (params: any, sort: any, filter: any) => {
    const pageQuery = formatPageQuery(params, sort, filter);
    const page = await request(pageQuery);
    return {
      data: page.items,
      total: page.total,
      success: true,
      pageSize: page.pageSize,
      pageNo: parseInt(`${page.pageNo}`, 10) || 1,
    }
  };

  return (<ProTable<T, U> request={requestData} {...restProps}>{children}</ProTable>);
};

export default XProTable;