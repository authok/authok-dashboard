import { request } from 'umi';

export async function create(params: API.Resource) {
  return request('/api/resources/create', {
    method: 'POST',
    data: params,
  });
}

export async function list(pageQuery: API.PageQuery) {
  return request<API.BaseResponse<API.Page<API.Resource>>>('/api/resources/list', {
    method: 'POST',
    data: pageQuery,
  });
}