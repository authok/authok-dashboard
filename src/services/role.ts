import { request } from 'umi';

export async function create(params: API.Role) {
  return request('/api/roles/create', {
    method: 'POST',
    data: params,
  });
}

export async function list() {
  return request<API.Page<API.Role>>('/api/roles/list');
}

export async function getUserRoles() {
  return request<API.Page<API.Role>>('/api/roles/getUserRoles');
}