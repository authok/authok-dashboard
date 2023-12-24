const postRegisterCode = `/**
* 注册成功后调用.
* @param {Event} event - 上下文.
*/
exports.onPostUserRegister = async (event) => {
};`

const postLogin = `/**
* 登录成功后调用.
* @param {Event} event - 用户登录上下文信息.
* @param {PostLoginAPI} api - 可以被调用的api.
*/
exports.onPostLogin = async (event, api) => {

}`;

const m2m = `/**
/**
* 在交换客户端凭证时触发.
*
* @param {Event} event - 客户端凭证请求详情.
* @param {CredentialsExchangeAPI} api - 可以被调用的api.
*/
exports.onExecuteCredentialsExchange = async (event, api) => {
};`;

export default {
  'post-login': postLogin,
  'post-register': postRegisterCode,
  m2m,
}