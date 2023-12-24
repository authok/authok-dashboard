import login from './login';
import verify from './verify';
import create from './create';
import change_password from './change_password';
import get_user from './get_user';
import deleteScripts from './delete';

import defaultLogin from './login/default';
import defaultCreate from './create/default';
import defaultVerify from './verify/default';
import defaultChangePassword from './change_password/default';
import defaultGetUser from './get_user/default';
import defaultDelete from './delete/default';

export const customScripts = {
  login,
  create,
  verify,
  change_password,
  get_user,
  'delete': deleteScripts,
}

export const defaultCustomScripts = {
  login: defaultLogin,
  create: defaultCreate,
  verify: defaultVerify,
  change_password: defaultChangePassword,
  get_user: defaultGetUser,
  'delete': defaultDelete,
}