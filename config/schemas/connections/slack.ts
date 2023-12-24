export default {
  "type": "object",
  "properties": {
    "client_id": {
      "x-component": "Input",
      "title": "Client ID",
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
    "client_secret": {
      "x-component": "Input",
      "title": "Client Secret",
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
      "x-component": "FormGrid",
      "x-component-props": {
        "maxColumns": [2, 3, 4]
      },
      "title": "Permissions",
      "x-decorator": "FormItem",
      "x-decorator-props": {
        "labelAlign": "left",
        "wrapperWidth": "100%",
        "layout": "vertical"
      },
      "properties": {
        "scopes.identity.basic": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "checked": true,
            "scope": {
              "label": "Basic identity",
              "value": "identity.basic",
            },
            "disabled": true
          }
        },
        "scopes.identity.email": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Email address",
              "value": "identity.email",
            },
          }
        },
        "scopes.identity.avatar": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Avatar image URL",
              "value": "identity.avatar",
            },
          }
        },
        "scopes.identity.team": {
          "x-component": "ScopeCheckbox",
          "x-component-props": {
            "scope": {
              "label": "Team",
              "value": "identity.team",
            },
          }
        },
      }
    }
  }
}