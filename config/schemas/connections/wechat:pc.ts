export default {
  "type": "object",
  "properties": {
    "app_id": {
      "x-component": "Input",
      "title": "App ID",
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
        "extra": "如何获取App ID"
      }
    },
    "app_secret": {
      "x-component": "Input",
      "title": "App Secret",
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
        "extra": "如何获取 App Secret"
      }
    },
    "scopes": {
      "type": "void",
      "x-component": "FormGrid",
      "x-component-props": {
        "maxColumns": [2, 3, 4]
      },
      "properties": {
        "scopes.snsapi_login": {
          "x-component": "ScopeCheckbox",
          "default": true,
          "x-component-props": {
            "scope": {
              "label": "snsapi_login",
              "value": "snsapi_login",
              "tooltip": "二维码扫码登录"
            },
            "disabled": true
          }
        }
      }
    }
  }
}