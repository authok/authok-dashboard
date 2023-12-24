export default `module.exports = function remove(id, callback) {
  // This script remove a user from your existing database.
  // It is executed whenever a user is deleted from the API or Auth0 dashboard.
  //
  // 两种完成方式:
  // 1. 用户删除成功:
  //     callback(null);
  // 2. 删除失败:
  //     callback(new Error("my error message"));

  const msg = '请实现删除脚本' + ' https://dashboard.authok.cn/#/connections/database';
  return callback(new Error(msg));
}`;