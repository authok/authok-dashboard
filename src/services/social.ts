import { request } from 'umi';

export async function configure(connection: API.SocialConnection) {
  return request<API.BaseResponse<API.SocialConnection>>('/api/social/configure', {
    method: 'POST',
    data: connection,
  });
}
export async function configured() {
  return request<API.BaseResponse<API.SocialConnection[]>>('/api/social/configured', {
    method: 'GET',
  });
}
export async function supported() {
  return request<API.BaseResponse<API.SocialApp[]>>('/api/social/supported', {
    method: 'GET',
  });
}
