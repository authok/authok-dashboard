#### 参考文章
* [阮一峰-理解OAuth 2.0](https://www.ruanyifeng.com/blog/2014/05/oauth_2_0.html)
* [阮一峰-OAuth 2.0 的一个简单解释](http://www.ruanyifeng.com/blog/2019/04/oauth_design.html)
* [OAuth2.0设计机制及原理](https://www.jianshu.com/p/662f48a18e23)




### 1.啥玩意
>  oauth2.0是一套授权标准。
### 2.为什么要用
>  提供一个授权机制
* 避免账号泄露，比如你的google账号
* 用户可以限制授权的时间和范围。
 
> 总结就是：让第三方应用可以使用google的服务,同时提供了一定的范围和时间限制，不必担心第三方应用泄露账号。


### 3. 具体流程
1. （A）用户打开第三方应用客户端以后，客户端要求用户给予授权。
2. （B）用户同意给予第三方应用客户端授权。
3. （C）客户端使用上一步获得的授权，向认证服务器申请令牌。
4. （D）认证服务器对客户端进行认证以后，确认无误，同意发放令牌(令牌作为身份认证的密令)。
5. （E）客户端使用令牌，向资源服务器申请获取资源。
6. （F）资源服务器确认令牌无误，同意向客户端开放资源。








* OpenID Provider（OP），实现OIDC的OAuth2授权服务器 
* Relying Party（RP），使用OIDC的OAuth2客户端  <应用域名>.xauth.cn
* End-User（EU），用户
* ID Token，JWT格式的授权Claims
* UserInfo Endpoint，用户信息接口，通过ID Token访问时返回用户信息，此端点必须为HTTPS 
https:// <应用域名>.xauth.cn/oidc/me


|OIDC|xauth|
|----|----|
|RP发送认证请求到OP  | https://<应用域名>.xauth.cn/oidc/auth  |
|OP验证End-User并颁发授权  | 回调到页面等用户确认,这里要有重定向的接口|
|OP用ID Token（通常是Access Token）进行响应|https://<应用域名>.xauth.cn/oidc/token|
|RP携带Access Token发送请求到UserInfo Endpoint|https://core.xauth.cn/oidc/me|
|UserInfo Endpoint返回End-User的Claims|