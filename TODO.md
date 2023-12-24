# 禁止注册设置


# 开始开发用户管理页面


# 列表容器总结

            状态管理                    页面定制                          适用场景                     缺陷
ProList       自带                    可自由定制                       UI匹配度高的场景              meta/expendable有一定局限性
ProTable      自带                    可自由定制                       UI匹配度高的场景
Table      配合useFormTable           可自由定制
List       用useFormTable实现useList  可自由定制



# API页面 M2M 应用授权列表[working] [完成]
需要自定义 expandable
容器选择

# APP页面, API授权 [完成]
参考 API M2M 应用授权列表即可.

# formily 表单提交，集成内嵌到外部 antd from. 作为 form 子对象 [OK]
通过委托 submit的方式完成，form没法直接传承 antd Form 和 ProForm, 有点不优雅.
attack-protection 中的 captchas配置是参考例子.

# mfa数据模型 [OK]
有N种 factor,
每种 factor 作为一个全局 factor-template 模版进行元数据保存在 config
{ namespace: 'mfa-factor-template',  name: provider }

每种 factor 下面有 M 种 provider
不同的 provider, 表单录入方式不一样. 那么为每个 provider, 在 config 中 存储一条元数据 
{ namespace: 'mfa-factor-${factor}-provider-template',  name: provider }

每个用户针对不同的 factor 的不同 provider 有自己的配置, 统一利用一个 config, 只需要存储 N 条记录, 否则需要存储 N x M 条记录可能性，并且还需要知道每个factor当前采用的哪个 provider, 可能还需要额外N条记录来维护.
基于 config 做 关系 和 数据分离的CRUD会比较晦涩，并且没有一致性保证.
{ 
  namespace: 'mfa-factor-config', 
  name: factor, 
  value: {
    provider, // 当前选中的 provider
    providers: {

    },
  }
}


# 平台账户的逻辑关系[TODO]
参考 Auth0/Authing
借用 organization 概念

# 注册平台账户[TODO]
参考 Auth0/Authing

# 调通 Database 用户登录/创建 脚本 [TODO]

# 用户基本信息编辑 [OK]

# linkAccount / unlinkAccount [ALPHA]
初步实现
UI要优化

# 租户切换 [TODO]
参考 Auth0/Authing


# 租户切换 router问题

link 租户路径问题 [WORK]

# ProLayout 样式 [TODO]

### highlightsyntax 没有 copy clipboard 按钮, 但是在 docusaurus 的 prism代码编辑器里头有，找空可以看看 [TODO]

### 如何让 formily 不提交未变更项 [TODO]

### node-oidc-provider 怎么界定用户登录？[TODO]
authorization.success 只要获取令牌就会

### SAMLP 的流程
腾讯云授权

