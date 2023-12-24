export default {
  "type": "object",
  "properties": {
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
      }
    },
    "token": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "3-32字符",
      },
      "title": "令牌(Token)",
      "required": true,
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
       
        "extra": "必须为英文或数字，长度为 3-32 字符。"
      }
    },
    "message_decrypt_method": {
      "x-component": "Radio.Group",
      "enum": [
        {
          "label": "明文模式",
          "value": "plain"
        },
        {
          "label": "兼容模式",
          "value": "compatible"
        },
        {
          "label": "安全模式(推荐)",
          "value": "secure"
        }
      ],
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "extra": "请根据业务需要，选择消息加解密类型。"
      }
    },
    "encodingAESKey": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "",
      },
      "title": "消息加解密密钥(EncodingAESKey)",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical",
        "extra": "消息加密密钥由 43 位字符组成，可随机修改，字符范围为 A-Z，a-z，0-9。如果你选择的消息加解密方式为明文模式，此项可以留空。"
      },
      "x-reactions": {
        "dependencies": [".message_decrypt_method"],
        "when": "{{$deps[0] == 'plain'}}",
        "fulfill": {
          "state": {
            "required": false,
          },
        },
        "otherwise": {
          "state": {
            "required": true,
          },
        },
      }
    }
  }
}