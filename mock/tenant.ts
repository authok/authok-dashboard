import { Request, Response } from 'express';


function listUserpools(req: Request, res: Response) {
    res.json({
        data: {
            list:
                [{
                    "frequentRegisterCheck":
                        { "timeInterval": 300, "limit": 50, "enabled": false },
                    "loginFailCheck": { "timeInterval": 300, "limit": 50, "enabled": false },
                    "changePhoneStrategy": { "verifyOldPhone": true },
                    "changeEmailStrategy": { "verifyOldEmail": true },
                    "qrcodeLoginStrategy": {
                        "qrcodeExpiresAfter": 120,
                        "ticketExpiresAfter": 300, "returnFullUserInfo": false,
                        "allowExchangeUserInfoFromBrowser": true
                    },
                    "app2WxappLoginStrategy": { "ticketExpiresAfter": 120, "ticketExchangeUserInfoNeedSecret": false },
                    "id": "5f8d8c800dc378b2bf96a2b3",
                    "createdAt": "2020-10-19T12:54:24.969Z",
                    "updatedAt": "2020-10-19T12:54:24.969Z",
                    "isRoot": false,
                    "userId": "5f8d38a53e3500802c70ff17",
                    "logo": "//files.authing.co/authing-console/login_logo.svg",
                    "name": "4444",
                    "domain": "fdsfdfsd",
                    "secret": "37b056aac02314d3872a4bf1dee86f90",
                    "allowedOrigins": "",
                    "emailVerifiedDefault": false, "sendWelcomeEmail": true,
                    "registerDisabled": false, "description": "",
                    "jwtSecret": "f5da27fe25821fdd544dfd719f6fc533",
                    "tokenExpiresAfter": 1296000, "isDeleted": false,
                    "userpoolTypes": null, "passwordStrength": 0,
                    "passwordFaas": { "enabled": false, "encryptUrl": null, "decryptUrl": null, "validateUrl": null }, "whitelist": { "phoneEnabled": false, "emailEnabled": false, "usernameEnabled": false }, "customSMSProvider": { "enabled": false, "provider": null, "config253": null }, "userOverview": { "list": [{ "thirdPartyIdentity": { "provider": null, "refreshToken": null, "accessToken": null, "scope": null, "expiresIn": null, "updatedAt": null }, "id": "5f8d8c826a822c730c8930ba", "createdAt": "2020-10-19T12:54:26.408Z", "updatedAt": "2020-10-19T12:54:26.408Z", "userPoolId": "5f8d8c800dc378b2bf96a2b3", "isRoot": false, "oauth": null, "email": null, "phone": null, "username": "test", "unionid": null, "openid": null, "nickname": null, "company": null, "photo": "https://usercontents.authing.cn/authing-avatar.png", "browser": null, "device": null, "password": null, "salt": null, "token": null, "tokenExpiredAt": null, "loginsCount": 0, "lastIp": null, "name": null, "givenName": null, "familyName": null, "middleName": null, "profile": null, "preferredUsername": null, "website": null, "gender": "U", "birthdate": null, "zoneinfo": null, "locale": null, "address": null, "formatted": null, "streetAddress": null, "locality": null, "region": null, "postalCode": null, "city": null, "province": null, "country": null, "registerSource": ["unknown"], "emailVerified": false, "phoneVerified": false, "lastLogin": null, "blocked": false, "isDeleted": false, "sendSmsCount": 0, "sendSmsLimitCount": 1000, "signedUp": "2020-10-19T12:54:26.408Z" }], "totalCount": 1 }
                }, { "frequentRegisterCheck": { "timeInterval": 300, "limit": 50, "enabled": false }, "loginFailCheck": { "timeInterval": 300, "limit": 50, "enabled": false }, "changePhoneStrategy": { "verifyOldPhone": true }, "changeEmailStrategy": { "verifyOldEmail": true }, "qrcodeLoginStrategy": { "qrcodeExpiresAfter": 120, "ticketExpiresAfter": 300, "returnFullUserInfo": false, "allowExchangeUserInfoFromBrowser": true }, "app2WxappLoginStrategy": { "ticketExpiresAfter": 120, "ticketExchangeUserInfoNeedSecret": false }, "id": "5f8d879025f5cb4aed7f354e", "createdAt": "2020-10-19T12:33:20.160Z", "updatedAt": "2020-10-19T12:33:20.160Z", "isRoot": false, "userId": "5f8d38a53e3500802c70ff17", "logo": "//files.authing.co/authing-console/login_logo.svg", "name": "123", "domain": "dasdasdsadasdasdas", "secret": "60d445423605a561fe11c1c2a39eca59", "allowedOrigins": "", "emailVerifiedDefault": false, "sendWelcomeEmail": true, "registerDisabled": false, "description": "", "jwtSecret": "8823cbcff9814e23b4a80902e9fc0d45", "tokenExpiresAfter": 1296000, "isDeleted": false, "userpoolTypes": null, "passwordStrength": 0, "passwordFaas": { "enabled": false, "encryptUrl": null, "decryptUrl": null, "validateUrl": null }, "whitelist": { "phoneEnabled": false, "emailEnabled": false, "usernameEnabled": false }, "customSMSProvider": { "enabled": false, "provider": null, "config253": null }, "userOverview": { "list": [{ "thirdPartyIdentity": { "provider": null, "refreshToken": null, "accessToken": null, "scope": null, "expiresIn": null, "updatedAt": null }, "id": "5f903c0d9447dbc3f210f63d", "createdAt": "2020-10-21T13:47:57.987Z", "updatedAt": "2020-10-21T13:47:58.004Z", "userPoolId": "5f8d879025f5cb4aed7f354e", "isRoot": false, "oauth": null, "email": "1231231", "phone": null, "username": "123123", "unionid": null, "openid": null, "nickname": null, "company": null, "photo": "https://usercontents.authing.cn/authing-avatar.png", "browser": null, "device": null, "password": "c6f07d5f0c70c25d784fe27596a4fb1c", "salt": "oihb574c43kg", "token": null, "tokenExpiredAt": null, "loginsCount": 0, "lastIp": null, "name": null, "givenName": null, "familyName": null, "middleName": null, "profile": null, "preferredUsername": null, "website": null, "gender": "U", "birthdate": null, "zoneinfo": null, "locale": null, "address": null, "formatted": null, "streetAddress": null, "locality": null, "region": null, "postalCode": null, "city": null, "province": null, "country": null, "registerSource": ["import:manual"], "emailVerified": false, "phoneVerified": false, "lastLogin": null, "blocked": false, "isDeleted": false, "sendSmsCount": 0, "sendSmsLimitCount": 1000, "signedUp": "2020-10-21T13:47:57.987Z" }, { "thirdPartyIdentity": { "provider": null, "refreshToken": null, "accessToken": null, "scope": null, "expiresIn": null, "updatedAt": null }, "id": "5f8d8791ef4e7ad9d667efb7", "createdAt": "2020-10-19T12:33:21.291Z", "updatedAt": "2020-10-19T12:33:21.291Z", "userPoolId": "5f8d879025f5cb4aed7f354e", "isRoot": false, "oauth": null, "email": null, "phone": null, "username": "test", "unionid": null, "openid": null, "nickname": null, "company": null, "photo": "https://usercontents.authing.cn/authing-avatar.png", "browser": null, "device": null, "password": null, "salt": null, "token": null, "tokenExpiredAt": null, "loginsCount": 0, "lastIp": null, "name": null, "givenName": null, "familyName": null, "middleName": null, "profile": null, "preferredUsername": null, "website": null, "gender": "U", "birthdate": null, "zoneinfo": null, "locale": null, "address": null, "formatted": null, "streetAddress": null, "locality": null, "region": null, "postalCode": null, "city": null, "province": null, "country": null, "registerSource": ["unknown"], "emailVerified": false, "phoneVerified": false, "lastLogin": null, "blocked": false, "isDeleted": false, "sendSmsCount": 0, "sendSmsLimitCount": 1000, "signedUp": "2020-10-19T12:33:21.291Z" }], "totalCount": 2 } }],
            "totalCount": 2
        }
    })
}

export default {
    'GET /api/userpools': listUserpools,

};