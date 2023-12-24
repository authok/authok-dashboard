export default `module.exports = function getUser({ id, email, username, phone_number }, callback) {
  // 三种完成方式:
  // 1. 找到用户. 档案必须符合格式规范: https://docs.authok.cn/users/normalized/authok/normalized-user-profile-schema.
  //     callback(null, profile);
  // 2. 用户未找到
  //     callback(null);
  // 3. 访问数据库出错:
  //     callback(new Error("my error message"));

  const msg = '请实现 获取用户脚本' + ' https://dashboard.authok.cn/#/connections/database';
  return callback(new Error(msg));
}`;