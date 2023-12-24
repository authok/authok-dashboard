export interface IResource {  
}

export interface IRestfulResource<R> extends IResource {
  get(id: string): Promise<R | undefined>;
  create(data: Partial<R>): Promise<R>;
  delete(id: string): Promise<R>;
  update(id: string | number, data: Partial<R>): Promise<R>;
  paginate(query: API.PageQuery): Promise<API.Page<R>>;
  cursor(query: API.CursorQuery): Promise<API.CursorResult<R>>;
}