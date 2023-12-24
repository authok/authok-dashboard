
export const formatProTablePagination = <T>(page: API.Page<T>) => {
  return {
    success: true,
    data: page.items,
    total: page.meta.total,
    pageSize: page.meta.limit,
    pageNo: page.meta.page,
  }
}

export const formatFormTablePagination = <T>(page: API.Page<T>) => {
  return {
    list: page.items,
    total: page.meta.total,
  }
}