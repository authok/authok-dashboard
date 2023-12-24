const postLogin = {
  "transaction": {
    "acr_values": [],
    "locale": "en",
    "requested_scopes": [],
    "ui_locales": [
      "en"
    ],
    "protocol": "oidc-basic-profile",
    "redirect_uri": "http://yourdomain.com",
    "prompt": [
      "none"
    ],
    "login_hint": "test@test.com",
    "response_mode": "form_post",
    "response_type": [
      "id_token"
    ],
    "state": "3io2ojjfoiJJOFJF"
  },
  "authentication": {
    "methods": [
      {
        "name": "pwd",
        "timestamp": "2018-11-13T20:20:39+00:00"
      }
    ]
  },
  "authorization": {
    "roles": []
  },
  "connection": {
    "id": "con_fpe5kj482KO1eOzQ",
    "name": "Username-Password-Authentication",
    "strategy": "authok",
    "metadata": {}
  },
  "organization": {
    "display_name": "租户1",
    "id": "org_2ojfoianDmc2dpEv",
    "metadata": {},
    "name": "my-org"
  },
  "resource_server": {
    "identifier": "biz.cn.authok.cn/api/v1"
  },
  "tenant": {
    "id": "biz"
  },
  "client": {
    "client_id": "OfOWNgklfRm4tyl5YYnl3JDSJy19h1ba",
    "name": "测试应用",
    "metadata": {}
  },
  "request": {
    "ip": "43.133.26.62",
    "method": "GET",
    "query": {
      "protocol": "oauth2",
      "client_id": "OfOWNgklfRm4tyl5YYnl3JDSJy19h1ba",
      "response_type": "code",
      "connection": "Username-Password-Authentication",
      "prompt": "login",
      "scope": "openid profile",
      "redirect_uri": "https://yourdomain/callback"
    },
    "body": {},
    "geoip": {
      "cityName": "北京",
      "continentCode": "NA",
      "countryCode3": "USA",
      "countryCode": "US",
      "countryName": "中国",
      "latitude": 31.2579921,
      "longitude": 120.729388,
      "timeZone": "中国/北京"
    },
    "hostname": "biz.cn.authok.cn",
    "language": "zh",
    "user_agent": "curl/7.65.1"
  },
  "stats": {
    "logins_count": 132
  },
  "user": {
    "app_metadata": {},
    "created_at": "2022-03-01T10:02:24.080Z",
    "email_verified": true,
    "email": "test@test.com",
    "nickname": "青蛙公主",
    "identities": [
      {
        "connection": "Username-Password-Authentication",
        "isSocial": false,
        "provider": "authok",
        "accessToken": "",
        "profileData": {},
        "user_id": "2d7c8ec7c33c6c004bbawe11"
      }
    ],
    "last_password_reset": "2022-03-02T11:27:21.080Z",
    "name": "小谷",
    "phone_number": "18888884444",
    "phone_verified": false,
    "picture": "http://www.gravatar.com/avatar/?d=identicon",
    "updated_at": "2022-03-04T10:07:13.080Z",
    "user_id": "authok|2ad2ec7c33c6d012d4c2g73",
    "user_metadata": {},
    "username": "test123",
    "multifactor": []
  }
}


const postRegister = {
  "transaction": {
    "acr_values": [],
    "locale": "en",
    "requested_scopes": [],
    "ui_locales": [
      "en"
    ],
    "protocol": "oidc-basic-profile",
    "redirect_uri": "http://yourdomain.com",
    "prompt": [
      "none"
    ],
    "login_hint": "test@test.com",
    "response_mode": "form_post",
    "response_type": [
      "id_token"
    ],
    "state": "3io2ojjfoiJJOFJF"
  },
  "connection": {
    "id": "con_fpe5kj482KO1eOzQ",
    "name": "Username-Password-Authentication",
    "strategy": "authok",
    "metadata": {}
  },
  "tenant": {
    "id": "biz"
  },
  "request": {
    "ip": "43.133.26.62",
    "method": "GET",
    "query": {
      "protocol": "oauth2",
      "client_id": "OfOWNgklfRm4tyl5YYnl3JDSJy19h1ba",
      "response_type": "code",
      "connection": "Username-Password-Authentication",
      "prompt": "login",
      "scope": "openid profile",
      "redirect_uri": "https://yourdomain/callback"
    },
    "body": {},
    "geoip": {
      "cityName": "北京",
      "continentCode": "NA",
      "countryCode3": "USA",
      "countryCode": "US",
      "countryName": "中国",
      "latitude": 31.2579921,
      "longitude": 120.729388,
      "timeZone": "中国/北京"
    },
    "hostname": "biz.cn.authok.cn",
    "language": "zh",
    "user_agent": "curl/7.65.1"
  },
  "stats": {
    "logins_count": 132
  },
  "user": {
    "app_metadata": {},
    "created_at": "2022-03-01T10:02:24.080Z",
    "email_verified": true,
    "email": "test@test.com",
    "nickname": "青蛙公主",
    "identities": [
      {
        "connection": "Username-Password-Authentication",
        "isSocial": false,
        "provider": "authok",
        "accessToken": "",
        "profileData": {},
        "user_id": "2d7c8ec7c33c6c004bbawe11"
      }
    ],
    "last_password_reset": "2022-03-02T11:27:21.080Z",
    "name": "小谷",
    "phone_number": "18888884444",
    "phone_verified": false,
    "picture": "http://www.gravatar.com/avatar/?d=identicon",
    "updated_at": "2022-03-04T10:07:13.080Z",
    "user_id": "authok|2ad2ec7c33c6d012d4c2g73",
    "user_metadata": {},
    "username": "test123",
    "multifactor": []
  }
}

export default {
  'post-login': postLogin,
  'post-register': postRegister,
} 