import { request } from 'umi';

export async function list() {
  return request<API.Page<API.Group>>('/api/groups/list');
}