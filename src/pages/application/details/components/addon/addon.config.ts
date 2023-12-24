const samlpSchema = {
  "type": "object",
  "properties": {
    "callback": {
      "x-component": "Input",
      "title": "应用回调URL",
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项"
          }
        ]
      }
    },
    "settings": {
      "x-component": "CodeEditor",
      "x-component-props": {
        "language": "json",
        "options": {
          "minimap": {
            "enabled": false
          }
        }
      },
      "title": "设置",
      "default": `{
      //  "audience":  "urn:foo1"
      // "recipient": "http://foo",
      // "mappings": {
      //   "user_id":     "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
      //   "email":       "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      //   "name":        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name",
      //   "given_name":  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname",
      //   "family_name": "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname",
      //   "upn":         "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/upn",
      //   "groups":      "http://schemas.xmlsoap.org/claims/Group"
      // },
      // "createUpnClaim":       true,
      // "passthroughClaimsWithNoMapping": true,
      // "mapUnknownClaimsAsIs": false,
      // "mapIdentities":        true,
      // "signatureAlgorithm":   "rsa-sha1",
      // "digestAlgorithm":      "sha1",
      // "destination":          "http://foo",
      // "lifetimeInSeconds":    3600,
      // "signResponse":         false,
      // "typedAttributes":      true,
      // "includeAttributeNameFormat":  true,
      // "nameIdentifierFormat": "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified",
      // "nameIdentifierProbes": [
      //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier",
      //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress",
      //   "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"
      // ],
      // "authnContextClassRef": "urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified",
      // "logout": {
      //   "callback": "http://foo/logout",
      //   "slo_enabled": true
      // },
      // "binding": "urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST"
      }`,
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项"
          }
        ]
      }
    }
  }
};

const samlpUsage = `
## SAML 协议配置参数
- SAML 版本: 2.0
- Issuer: urn:{{issuer}}
- Identity Provider Certificate: [下载 AuthOK 证书](#)
- Identity Provider SHA1 fingerprint: {{fingerprint}}
- Identity Provider Login URL: {{loginUrl}}
- Identity Provider Metadata: [下载](#)

您可以添加身份源参数:
- {{loginUrl}}?connection=google-oauth2
- {{loginUrl}}?connection=slack
- {{loginUrl}}?connection=Username-Password-Authentication

AuthOK 将会重定向用户到指定的身份源，此时不会显示登录UI. 取保您使用 **HTTP POST** 发送 SAMLRequest.`;


const wsfedSchema = {

};

export default [
  {
    key: 'samlp',
    name: 'SAMLP Web App',
    icon: '',
    schema: samlpSchema,
    usage: samlpUsage,
  },
  {
    key: 'wsfed',
    name: 'WS-FED Web App',
    icon: '',
    schema: wsfedSchema,
    usage: ''
  }
];