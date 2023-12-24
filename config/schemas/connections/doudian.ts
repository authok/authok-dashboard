export default {
  "type": "object",
  "properties": {
    "service_id": {
      "x-component": "Input",
      "title": "Service ID",
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
        "extra": '{{link("如何获取 Service ID", "https://op.jinritemai.com/docs/guide-docs/9/22")}}',
      }
    },
    "app_key": {
      "x-component": "Input",
      "title": "App Key",
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
        "extra": "如何获取 App Key",
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
        "extra": "如何获取 App Secret",
      }
    },
    "scopes": {
      "type": "void",
      'x-component': 'FormGrid',
      'x-component-props': {
        maxColumns: [2, 3, 4],
      },
      properties: {
       "scopes.scope1": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "scope1",
              "value": "scope1",
              "tooltip": "scope1"
            }
          }
        },
        "scopes.scope2": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "scope2",
              "value": "scope2",
              "tooltip": "scope2"
            }
          }
        }
      }
    }
  }
};