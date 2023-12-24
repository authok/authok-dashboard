/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const formatPageQuery = (params: Record<string, any>, sorter?: any, filter?: any, fields?: string): API.PageQuery => {
  const query = {};

  const { current = 1, pageSize = 20, filters, ...restParams } = params || {};
  if (restParams) {
    Object.keys(restParams).forEach((k: string) => {
      const v = restParams[k];
  
      if (Array.isArray(v)) {
        query[k] = v;
        /*
        if (v.length === 2) {
          query[k] = {
            BETWEEN: [v[0], v[1]],
          };
        }*/
      } else {
        query[k] = v;
      }
    });
  }

  const pageQuery = {
    ...restParams,
    page: current,
    page_size: pageSize,
    ...(fields && { fields }),
  } as API.PageQuery;

  if (sorter) {
    const sort: string[] = [];
    Object.keys(sorter).forEach((k: string) => {
      const v = sorter[k];
      const direction = v === 'ascend' ? '' : '-';
      sort.push(direction + k);
    });

    if (sort.length > 0) {
      pageQuery.sort = sort.join(':');
    }
  }

  return pageQuery;
};
