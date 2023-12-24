import { request } from 'umi';
import { API } from './API';

export async function retrieve(id: string) {
  return request<API.BaseResponse<API.Organization>>(`/api/orgs/${id}`);
}

export async function create(org: API.Organization) {
  return request<API.BaseResponse>('/api/orgs', {
    method: 'POST',
    data: org,
  });
}

export async function editOrg(org: API.Organization) {
  return request<API.BaseResponse>(`/api/orgs/${org.id}`, {
    method: 'PUT',
    data: org,
  });
}

export async function deleteOrg(id: string) {
  return request<API.BaseResponse>(`/api/orgs/${id}`, {
    method: 'DELETE',
  });
}

export async function getOrgTree() {
  return request<API.BaseResponse<API.Page<API.Organization>>>('/api/orgs/getOrgTree');
}
