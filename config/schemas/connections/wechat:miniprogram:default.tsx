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
    "txt_filename": {
      "x-component": "Input",
      "x-component-props": {
        "placeholder": "请填入微信检验 txt 文件名",
      },
      "title": "Txt文件名",
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
        "extra": "微信校验txt文件名"
      }
    },
    "txt_content": {
      "x-component": "Input.TextArea",
      "x-component-props": {
        "placeholder": "请填入微信检验 txt 内容",
        "autoSize": { "minRows": 3, "maxRows": 3 }
      },
      "title": "Txt内容",
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
        "extra": "微信校验txt文件内容"
      }
    }
  }
}