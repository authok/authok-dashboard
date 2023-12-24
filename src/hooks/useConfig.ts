import { useEffect } from 'react';
import { request } from 'umi';
import { useRequest, useLocalStorageState } from '@umijs/hooks';

/**
 * 根据 版本获取配置项, 加速本地访问, 用于 低代码平台的 schema 缓存等
 * @param key 配置 key
 */
function useConfig(resource: string, key: string): JSON {
  const [config, setConfig] = useLocalStorageState(key);

  const configUrl = `${resource}/*/${key}`;
  const { data, loading } = useRequest(() => request(configUrl));

  useEffect(() => {
    if (loading || !data) return;
    if (data.code !== 0) return;

    // 版本一致就直接返回
    if (config && data.data?.version === config.version) return;

    setConfig(data.data);
  }, [data, loading]);

  return config;
}

export default useConfig;
