export default {
  "type": "object",
  "properties": {
    "private_deploy": {
      "x-component": "Switch",
      "title": "是否开启私有化部署",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical"
      }
    },
    "app_id": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请填入微信提供的 App ID",
      },
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
      },
      "x-reactions": {
        "dependencies": [".private_deploy"],
        "when": "{{$deps[0]}}",
        "fulfill": {
          "state": {
            "visible": true,
          },
        },
        "otherwise": {
          "state": {
            "visible": false,
          },
        },
      }
    },
    "app_secret": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请填入微信提供的 App Secret",
      },
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
      },
      "x-reactions": {
        "dependencies": [".private_deploy"],
        "when": "{{$deps[0]}}",
        "fulfill": {
          "state": {
            "visible": true,
          },
        },
        "otherwise": {
          "state": {
            "visible": false,
          },
        },
      },
    },
    "logo": {
      "title": "小程序Logo",
      "x-component": "Upload",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
      },
      "extra": "Logo会显示在小程序二维码中央",
    },
    "redirect_uri": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "https://my-domain/callback",
      },
      "title": "业务回调链接",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
      },
      "extra": "如果配置了这个链接，用户在完成登录之后，浏览器将会携带用户信息跳转到该页面。"
    }
  }
}