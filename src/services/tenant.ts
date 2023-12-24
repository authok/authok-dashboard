import { request } from 'umi';

export async function create(params: { logo: string; name: string; domain: string }) {
  const { domain, logo, name } = params;
  return request('/api/userpool', {
    method: 'POST',
    data: { domain, logo, name },
  });
}

// eslint-disable-next-line no-shadow
export async function page(pageNo: number, limit: number): Promise<API.Page<API.Tenant>> {
  return request(`/api/userpools`, {
    method: 'GET',
    params: {
      pageNo,
      limit,
    },
  });
}

export async function retrieve(id: string): Promise<API.Tenant | undefined> {
  return undefined;
}

export async function update(payload): Promise<API.Tenant> {
  return {};
}

export async function refresh() {
}