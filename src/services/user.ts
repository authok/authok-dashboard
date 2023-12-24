import { request } from 'umi';

export async function retrieve(id: string): Promise<API.User | undefined> {
  const user = null;
  if (!user) return undefined;

  return {
    ...user,
    id: user.id,
    username: user.username || '',
    nickname: user.nickname || '',
    lastLoginTime: user.lastLogin ? new Date(user.lastLogin!) : undefined,
    lastLoginIP: user.lastIP || '',
    blocked: user.blocked!,
  };
}

export async function getLocation(uid: string) {
  return request<API.BaseResponse<API.UserLocation>>(`/api/users/${uid}/location`);
}

export async function block(payload: { id: string; blocked: boolean }) {
  const { id, blocked } = payload;
  return user;
}

export async function modifyEmail(payload: { id: string; email: string }) {
  const { id, email } = payload;
  return user;
}

export async function refreshToken(id: string) {
  /// const user = await client?.users.refreshToken(id);
  return user;
}

export async function changePassword(payload: { id: string; password: string }) {
  const { id, password } = payload;
  return user;
}
