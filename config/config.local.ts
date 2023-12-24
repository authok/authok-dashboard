import { defineConfig } from 'umi';

export default defineConfig({
  define: {
    AUTHOK_CLIENT_ID: process.env.AUTHOK_CLIENT_ID,
    AUTHOK_DOMAIN: process.env.AUTHOK_DOMAIN || 'mgmt.dev.authok.cn',
    AUTHOK_SCOPE: process.env.AUTHOK_SCOPE || 'openid profile email offline_access',
    MGMT_API_HOST: process.env.MGMT_API_HOST || 'http://localhost:3005',
    AUTHOK_MGMT_AUDIENCE: process.env.AUTHOK_MGMT_AUDIENCE || 'https://mgmt.authok.cn/api/v1',
  },
});
