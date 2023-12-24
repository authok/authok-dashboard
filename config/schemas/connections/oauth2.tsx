
export default {
  "type": "object",
  "name": "oauth2",
  "properties": {
    "authorizationURL": {
      "x-component": "Input",
      "title": "Authorization URL",
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项",
          }
        ],
        "extra": "The URL where the transaction begins.",
      }
    },
    "tokenURL": {
      "x-component": "Input",
      "title": "Token URL",
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
        ],
        "extra": "The URL will use to exchange the code for an access_token.",
      }
    },
    "scope": {
      "title": "Scope",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "public",
      },
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "extra": "The scope parameters that you want to request consent for.",
      }
    },
    "client_id": {
      "title": "Client ID",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "public",
      },
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "extra": "Obtaining the Client ID differs across providers. Please check your provider's documentation.",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项"
          }
        ],
      }
    },
    "client_secret": {
      "title": "Client Secret",
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "public",
      },
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "extra": "For security purposes, we don’t show your existing Client Secret.",
        "rules": [
          {
            "required": true,
            "message": "此项为必填项"
          }
        ],
      }
    },
    "scripts.fetchUserProfile": {
      "title": "获取用户档案的脚本",
      "x-component": "CodeEditor",
      "x-component-props": {
        "width": "100%",
        "height": "32vh",
        "language": "javascript",
        "theme": "vs-dark",
        "defaultValue": "module.exports = function(accessToken, ctx, cb) {\n\tconst profile = {};\n\t// Call OAuth2 API with the accessToken and create the profile\n\tcb(null, profile);\n}",
      },
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
      }
    },    
  }
};