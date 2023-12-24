export default `module.exports = function login({ id, username, phone_number, email, password }, callback) {
  // 登录 或者 注册成功后触发.
  //
  // 返回的所有数据都会存入用户档案, 并且对租户管理员可见. 避免返回 密码, 密钥等敏感信息.
  //
  // \`password\` 参数是明文. 应该被 hashed/salted 来匹配你数据库的密码. 例如:
  //     var bcrypt = require('bcrypt@0.8.5');
  //     bcrypt.compare(password, dbPasswordHash, function(err, res)) { ... }
  //
  // 有三种方式完成当前脚本:
  // 1. 用户凭证有效. 返回的用户档案必须遵循以下格式: https://docs.authok.cn/users/normalized/auth0/normalized-user-profile-schema
  //     var profile = {
  //       user_id: ..., // user_id is mandatory
  //       email: ...,
  //       [...]
  //     };
  //     callback(null, profile);
  // 2. 用户凭证无效
  //     callback(new WrongUsernameOrPasswordError(email, "my error message"));
  // 3. 访问数据库出错
  //     callback(new Error("my error message"));
  //
  // 可用的 Node.js 模块:
  //
  //    https://tehsis.github.io/webtaskio-canirequire/

  const msg = '请实现 登录脚本' + ' https://dashboard.authok.cn/#/connections/database';
  return callback(new Error(msg));
}
`;