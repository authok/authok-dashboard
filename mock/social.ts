import { request, Request, Response } from 'express';

const genSocialConfigList = () => {
  const socailConfig: API.SocialConfig[] = [
    {
      id: 'miniprogram',
      name: 'App 拉起小程序登录',
      fields: [
        {
          key: 'AppID',
          value: 'appid',
        },
        {
          key: 'AppSecret',
          value: 'AppSecret',
        },
      ],
      enabled: true,
    },
  ];
  return socailConfig;
};

// 更新配置
function updateSocialAppConfig(req: Request, res: Response) {
  return res.json({ code: 0, data: req.body });
}

function updateSocialSupport(req: Request, res: Response) {
  return new Promise((resolver) => {
    setTimeout(() => {
      const r = res.json({ code: 0 });
      resolver(r);
    }, 1500);
  });
}
export default {
  'POST /api/social': updateSocialAppConfig,
  'GET /api/social/supported': updateSocialSupport,
};
