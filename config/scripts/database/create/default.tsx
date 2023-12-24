export default `module.exports = function create(user, callback) {
  // 在现有数据库中创建用户. 在 用户注册, Authok 管理后台创建用户 或 管理API创建用户 时执行.
  //
  // user 默认一定会包含以下属性:
  // * email or username or phone_number: 代表用户标识
  // * tenant: 用户所属的 Authok租户
  // * client_id: 用户注册所关联应用的 client ID, 如果在 Authok dashboard 或 管理API 创建，则为 API key
  // * connection: 数据库连接的名字
  //
  // 脚本有三种完成方式:
  // 1. 用户成功创建
  //     callback(null);
  // 2. 用户已经存在
  //     callback(new ValidationError("user_exists", "my error message"));
  // 3. 访问数据库出错
  //     callback(new Error("my error message"));

  const msg = '请实现创建脚本' + ' https://dashboard.authok.cn/#/connections/database';
  return callback(new Error(msg));
}`;