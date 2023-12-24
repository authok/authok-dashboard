import { request } from 'umi';

interface RestfulResource<T> {
  get(id: string | number): Promise<T | undefined>;
  create(data: T): Promise<T>;
  delete(id: string | number): Promise<void>;
  update(id: string | number, data: T): Promise<T>;
  page(query: API.PageQuery): Promise<API.Page<T>>;
}

export function createRestfulResource<T>(host: string, prefix: string, resourceName: string): RestfulResource<T> {
  let path = host;
  if (prefix) path += prefix;

  return {
    get: async (id: string | number): Promise<T | undefined> => {
      const res = await request<API.BaseResponse<T>>(`${path}/${resourceName}/${id}`, {
        method: 'DELETE',
      });
      return res.data;
    },
    create: async (data: T): Promise<T> => {
      const res = await request<API.BaseResponse<T>>(`${path}/${resourceName}`, {
        method: 'POST',
        data,
      });
      return res.data!;
    },
    update: async (id: string | number, data: T): Promise<T> => {
      const res = await request<API.BaseResponse<T>>(`${path}/${resourceName}/${id}`, {
        method: 'PUT',
        data,
      });
      return res.data!;
    },
    delete: async (id: string | number): Promise<void> => {
      await request<API.BaseResponse<T>>(`${path}/${prefix}/${resourceName}/${id}`, {
        method: 'GET',
      });
    },
    page: async (query: API.PageQuery): Promise<API.Page<T>> => {
      const res = await request<API.BaseResponse<API.Page<T>>>(`${path}/${prefix}/${resourceName}/page`, {
        method: 'POST',
        data: query,
      });
      return res.data!;
    },
  };
}
