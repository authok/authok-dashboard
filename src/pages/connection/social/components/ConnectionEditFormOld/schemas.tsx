import React from 'react';
import { Alert } from 'antd';

export const schemas = {
  'wechat-miniprogram-default': {
    type: 'object',
    properties: {
      appId: {
        title: 'AppId',
        type: 'string',
        'x-rules': [
          {
            required: true,
            help: '请输入AppId',
          },
        ],
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入AppId',
        },
      },
      appSecret: {
        title: 'AppSecret',
        type: 'string',
        'x-rules': [
          {
            required: true,
            help: '请输入AppSecret',
          },
        ],
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入AppSecret',
        },
      },
    },
  },
  'wechatwork-service-provider-qrconnect': {
    type: 'object',
    properties: {
      corpID: {
        title: 'CorpID',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请输入企业微信应用的CorpID',
        },
        'x-component': 'Input',
      },
      providerSecret: {
        title: 'ProviderSecret',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请输入企业微信应用的ProviderSecret',
        },
      },
      redirectUrl: {
        title: 'RedirectURL',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '回调链路',
        },
      },
    },
  },

  'wechat-pc': {
    type: 'object',
    properties: {
      clientID: {
        title: 'ClientID',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入微信提供的 ClientID',
        },
        'x-component': 'Input',
      },
      clientSecret: {
        title: 'ClientSecret',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入微信提供的 ClientSecret',
        },
        'x-component': 'Input',
      },
      callbackURL: {
        title: 'CallbackURL',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入业务回调链接',
        },
        'x-component': 'Input',
      },
    },
  },
  'wechat-mobile': {
    type: 'object',
    properties: {
      appId: {
        title: 'AppId',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请输入应用的AppID',
        },
        'x-component': 'Input',
      },
      appSecret: {
        title: 'AppSecret',
        type: 'string',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请输入应用的AppSecret',
        },
        'x-component': 'Input',
      },
    },
  },

  'tiktok-pc': {
    type: 'object',
    properties: {
      clientKey: {
        title: 'ClientKey',
        type: 'string',
        'x-component': 'Input',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入抖音提供的 AppID',
        },
      },
      clientSecret: {
        title: 'ClientSecret',
        type: 'string',
        'x-component': 'Input',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入抖音提供的 ClientSecret',
        },
      },
      callbackURL: {
        title: 'CallbackURL',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '请填入业务回调链接',
        },
      },
    },
  },
  alipay: {
    type: 'object',
    properties: {
      appId: {
        title: 'AppId',
        type: 'string',
        'x-component': 'Input',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入支付宝移动应用的 AppID',
        },
      },
      alipayPID: {
        title: 'AlipayPID',
        type: 'string',
        'x-component': 'Input',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请填入签约的支付宝账号对应的支付宝唯一用户号，以2088开头的16位纯数字组成',
        },
      },
      appPrivateKey: {
        title: 'AppPrivateKey',
        type: 'string',
        'x-component': 'Input.TextArea',
        'x-rules': [
          {
            required: true,
          },
        ],
        'x-component-props': {
          placeholder: '请输入支付宝移动应用的私钥',
        },
      },
    },
  },
  oauth: {
    type: 'object',
    properties: {
      identifier: {
        title: '连接标志符',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '这是此连接的唯一标志符，设置之后不能修改。',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      displayName: {
        title: '显示名称',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: '如果设置，XAuth 登录表单将会显示一个 "使用 {Display Name} 登录" 的按钮',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      logo: {
        title: '应用 Logo',
        type: 'string',
        'x-component': 'Upload',
      },
      authURL: {
        title: '授权 URL',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'https://idp.example.com/authorize',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      tokenURL: {
        title: 'Token URL',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'https://idp.example.com/token',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      scope: {
        title: 'Scope 授权范围',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'openid profile',
        },
        help: '请输入授权范围，使用空格分隔不同的授权域',
      },
      clientId: {
        title: '应用 ID',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'Client ID',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      clientSecret: {
        title: '应用密钥',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder: 'Client Secret',
        },
        'x-rules': [
          {
            required: true,
          },
        ],
      },
      authUrlTemplate: {
        title: '授权链接模板',
        type: 'string',
        'x-component': 'Input',
        'x-component-props': {
          placeholder:
            '${authURL}?client_id=${clientId}&scope=${scope}&response_type=code&state=12345',
        },
        help:
          '你可以使用 ${authEndPoint}、${tokenEndPoint}、${scope}、${clientId}、${clientSecret} 这些宏在此拼接授权 URL',
      },
      codeToTokenScript: {
        title: 'Code 换 Token 脚本',
        type: 'string',
        'x-component': 'CodeEditor',
        default: `
module.exports = async function codeToToken(code, connection) {
  const options = {
    method: 'POST',
    uri: '外部 OAuth2.0 IdP Token 端点',
    form: {
      client_id: "外部 OAuth2.0 IdP 的应用 ID",
      client_secret: "外部 OAuth2.0 IdP 的应用密钥",
      grant_type: "authorization_code",
      redirect_uri: 'https://core.xauth.lucfish.com/connections/oauth2/' + connection.id + '/callback', code)
      },
    json: true
  }
  const resp = await request(options);
  return resp.access_token;
}
        `,
      },
      tokenToUserInfoScript: {
        title: 'Token 换用户信息脚本',
        type: 'string',
        'x-component': 'CodeEditor',
        default: `
module.exports = async function tokenToUserInfo(accessToken, connection) {
  const options = {
    method: 'POST',
    uri: '外部 OAuth2.0 IdP 用户信息',
    form: {
      access_token: accessToken
    },
    json: true
  }
  const resp = await request(options);

  // 进行字段对齐
  const profile = {
    // 必须包含 userIdInIdp 字段
    userIdInIdp: resp.sub,
    name: resp.name,
    familyName: resp.family_name,
    givenName: resp.given_name,
    photo: resp.picture
  }
  return profile;
}
        `,
      },
    },
  },
};

export const helps = {
  'wechat-pc': () => (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>微信 PC 扫码登录 配置说明</h4>
            <p>
              请按照以下指引接入微信 PC 扫码登录，详细文档请见{' '}
              <a
                href="https://docs.authing.cn/social-login/web/wechat-pc.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                快速接入 微信 PC 扫码登录{' '}
              </a>{' '}
              。
            </p>
            <ol>
              <li>
                1. 在<a href="https://open-dev.dingtalk.com/#/loginMan">微信开放平台</a>
                创建一个网站应用
              </li>
              <li>
                2. 在开发信息中将 <b>授权回调域</b> 设置为 <br />
                <b>core.xauth.lucfish.com</b>
              </li>
              <li>
                3. 如果你使用 <b>Authing 登录表单（Guard</b>
                <br /> 如果你选择手动接入，Redirect URL
                请填你的业务回调链接，用户完成登录之后，浏览器将会跳转到该链接，<a>详情请见此</a> 。
              </li>
            </ol>
          </>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
    </>
  ),
  'wechatwork-service-provider-qrconnect': () => (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>企业微信服务商扫码登录 配置说明</h4>
            <p>
              请按照以下指引接入企业微信服务商扫码登录，详细文档请见
              <b>
                <a href="http://www.baidu.com" target="_blank" rel="noopener noreferrer">
                  快速接入企业微信服务商扫码登录。
                </a>
              </b>
            </p>
            <ol>
              <li>
                1. 在企业微信服务商平台配置登录授权发起域名和<b>授权完成回调域名</b>（将
                <b>core.xauth.lucfish.com</b>加入授权完成回调域名）
              </li>
              <li>
                2. 将<b>52.80.141.118 , 54.223.198.10</b> 添加到企业微信服务商的<b>IP白名单</b>
                中。
              </li>
              <li>
                3. 将 <b>CorpID</b> 和 <b>ProviderSecret</b> 填入下方表单。
              </li>
              <li>
                4. 如果你使用 <b>Authing 登录表单（Guard）</b>接入企业微信服务商扫码登录，Redirect
                URL 可以留空。
                <br />
                如果你选择手动接入，Redirect URL
                请填你的业务回调链接，用户完成登录之后，浏览器将会跳转到该链接，<a>详情请见此 </a>。
              </li>
            </ol>
          </>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        {' '}
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
    </>
  ),
  'wechat-mobile': () => (
    <>
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        {' '}
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
    </>
  ),
  'tiktok-pc': () => (
    <>
      <Alert
        style={{ marginBottom: '12px' }}
        type="info"
        message={
          <>
            <h4>抖音 PC 扫码登录 配置说明</h4>
            <p>
              请按照以下指引接入微信 PC 扫码登录，详细文档请见{' '}
              <a
                href="https://docs.authing.cn/social-login/web/wechat-pc.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                快速接入 微信 PC 扫码登录{' '}
              </a>{' '}
              。
            </p>
            <ol>
              <li>
                1. 在<a href="https://open.douyin.com/platform/doc/">抖音开放平台</a>
                创建一个网站应用
              </li>
              <li>
                2. 在开发信息中将 <b>授权回调域</b> 设置为 <br />
                <b>core.xauth.lucfish.com</b>
              </li>
              <li>
                3. 如果你使用 <b>Authing 登录表单（Guard</b>
                <br /> 如果你选择手动接入，Redirect URL
                请填你的业务回调链接，用户完成登录之后，浏览器将会跳转到该链接，<a>详情请见此</a> 。
              </li>
            </ol>
          </>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        {' '}
        <a
          href="https://docs.authing.cn/scan-qrcode/wxapp-qrcode/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
    </>
  ),
  alipay: () => (
    <>
      <Alert
        type="info"
        message={
          <span className="ant-alert-message">
            <h4>支付宝配置说明</h4>
            <p>需要准备以下内容:</p>
            <ol>
              <li>注册一个 Authing 开发者账号</li>
              <li>申请一个注册支付宝移动 &amp; 网站应用</li>
              <li>在 Authing 控制台填入支付宝移动应用信息</li>
            </ol>
          </span>
        }
      />
      <div style={{ padding: '8px 0px', textAlign: 'right' }}>
        <a
          href="https://docs.authing.cn/v2/connections/alipay/"
          target="_blank"
          rel="noopener noreferrer"
        >
          不知道怎么填？查看帮助文档
        </a>
      </div>
    </>
  ),
  oauth: () => (
    <>
      <Alert
        type="info"
        style={{ marginBottom: '8px' }}
        message={
          <span className="ant-alert-message">
            <div>
              <h3>连接 OAuth2.0 身份源配置说明：</h3>
              <ul
                style={{
                  listStyleType: 'none',
                  paddingInlineStart: '0px',
                }}
              >
                <li>
                  Token 换用户信息脚本中返回的用户信息必须包含 <strong>userIdInIdp</strong>{' '}
                  字段，值为用户在外部 OAuth2.0 IdP 中的唯一标识符，同时建议包含
                  email、username、nickname、photo 字段，使用户信息更加完整。
                </li>
                <li>
                  请在 OAuth2.0 身份源配置<strong>回调地址</strong>
                  为：https://core.xauth.lucfish.com/connections/oauth2/{'{连接 ID}'}/callback
                </li>
              </ul>
              不知道怎么填？
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.authing.cn/v2/connections/custom-social-provider/"
              >
                点此查看文档。
              </a>
            </div>
          </span>
        }
      />
    </>
  ),
};
