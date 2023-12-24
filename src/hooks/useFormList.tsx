import { useFormTable } from "@umijs/hooks";
import { PaginatedParams, PaginatedFormatReturn, CombineService, BaseOptions, OptionsWithFormat } from "@umijs/hooks/lib/useFormTable";
import { useMemo } from "react";
import { Sorter, PaginationConfig, Filter } from "@umijs/hooks/lib/useAntdTable/typings";
import { BaseResult } from '@umijs/use-request/lib/types';

export interface PaginatedResult<Item> extends BaseResult<PaginatedFormatReturn<Item>, PaginatedParams> {
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPage: number;
    onChange: (current: number, pageSize: number) => void;
    changeCurrent: (current: number) => void;
    changePageSize: (pageSize: number) => void;
    [key: string]: any;
  };
  listProps: {
    dataSource: Item[];
    loading: boolean;
    // onChange: (pagination: PaginationConfig, filters?: Filter, sorter?: Sorter) => void;
    pagination: PaginationConfig;
    [key: string]: any;
  };
  sorter?: Sorter;
  filters?: Filter;
}

export interface Result<Item> extends PaginatedResult<Item> {
  search: {
      type: 'simple' | 'advance';
      changeType: () => void;
      submit: () => void;
      reset: () => void;
  };
}

export default function useFormList<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>, 
  options: OptionsWithFormat<R, Item, U>
): Result<Item>;

export default function useFormList<R = any, Item = any, U extends Item = any>(
  service: CombineService<PaginatedFormatReturn<Item>, PaginatedParams>, 
  options: BaseOptions<U>): Result<Item> 
{
  const { tableProps, ...rest } = useFormTable(service, options);

  const listProps = useMemo(() => {
    const { pagination, onChange, ...rest } = tableProps;
    pagination.showTotal = (total: number, range: [number, number]) => <>共{total}条记录</>;
    
    pagination.onChange = (current, pageSize) => {
      onChange({ ...pagination, current, pageSize});
    };
    return { pagination, ...rest };
  }, [tableProps]);

  return { listProps, ...rest };
}