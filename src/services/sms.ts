import { request } from 'umi';
// 获取当前使用的短信渠道
export async function get() {
  // console.log('store', getDvaApp()?._store.getState().userpool.current.id)
  return request('/api/userpool/smsProvider', {
    method: 'GET',
    // data: params,
  });
}

// 获取当前渠道的配置
export async function getConfig() {
  return request('/api/userpool/smsProvider/qcloud', {
    method: 'GET',
    // data: params,
  });
}

// 更新渠道
export async function update(channel: string) {
  return request('/api/userpool/smsProvider', {
    method: 'POST',
    data: {
      channel,
    },
  });
}

// 更新渠道配置
export async function updateConfig(config: API.SmsConfig) {
  return request('/api/userpool/smsProvider/qcloud', {
    method: 'POST',
    data: config,
  });
}
