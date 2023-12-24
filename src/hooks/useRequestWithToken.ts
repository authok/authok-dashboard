import { useAuthok } from "@authok/authok-react";
import { RequestResponse } from "umi-request";
import { useCallback } from "react";
import { request } from "umi";

export type RequestFn = <R>(url: string, scope: string, options?: any) => Promise<RequestResponse<R>>;

const useRequestWithToken = (): RequestFn => {
  const { getAccessTokenSilently, getAccessTokenWithPopup } = useAuthok();

  return useCallback(async <R>(url: string, scope: string, options?: any): Promise<RequestResponse<R>> => {
    let accessToken;
    try {
      accessToken = await getAccessTokenSilently({ audience: AUTHOK_MGMT_AUDIENCE, scope });
    } catch(e1) {
      if (e1.error === 'consent_required') {
        try {
          accessToken = await getAccessTokenWithPopup({ audience: AUTHOK_MGMT_AUDIENCE, scope });
        } catch(e2) {
          console.error('获取token失败: ', e2);
          throw e2;
        }
      }
    }
    
    return await request<R>(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }, [getAccessTokenSilently, getAccessTokenWithPopup]);
}

export default useRequestWithToken;