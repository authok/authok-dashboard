export default {
  "type": "object",
  "properties": {
    "api_key": {
      "x-component": "Input",
      "title": "API Key",
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
      }
    },
    "secret_key": {
      "x-component": "Input",
      "title": "Secret Key",
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
      }
    },
    "scopes": {
      "type": "void",
      "title": "Attributes",
      "x-component": "FormGrid",
      "x-component-props": {
        "maxColumns": [2, 3, 4]
      },
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical"
      },
      "properties": {
        "scopes.profile": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "checked": true,
            "scope": {
              "label": "Profile",
              "value": "profile",
            },
            "disabled": true
          }
        },
        "scopes.basic_profile": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Basic Profile",
              "value": "basic_profile",
            },
          }
        }
      }
    }
  }
}