import { Effect, Reducer } from 'umi';
import { retrieve, update, refresh } from '@/services/tenant'

export interface TenantModelState {
  current?: API.Tenant;
}

export interface TenantModelType {
  namespace: 'userpool';
  state: TenantModelState;
  effects: {
    changeUserPool: Effect;
    update: Effect;
    refresh: Effect;
  };
  reducers: {
    setUserPool: Reducer<TenantModelState>;
  };
}

const UserPoolModel: TenantModelType = {
  namespace: 'userpool',
  state: {
    current: {
      id: '',
      name: ''
    },
  },
  effects: {
    *changeUserPool({ payload, callback }, { call, put }) {
      const resp = yield call(retrieve, payload);
      if (callback && typeof callback === 'function') callback(resp);
      yield put({
        type: 'setUserPool',
        payload: resp,
      });
    },
    *update({ payload, callback }, { call, put }) {
      const resp = yield call(update, payload);
      if (callback && typeof callback === 'function') callback(resp);
      yield put({
        type: 'show',
        payload: resp,
      });
    },
    *refresh({ payload, callback }, { call, put }) {
      const resp = yield call(refresh, payload);
      if (callback && typeof callback === 'function') callback(resp);
      yield put({
        type: 'show',
        payload: resp,
      });
    }
  },
  reducers: {
    setUserPool(state, { payload }) {
      return {
        ...state,
        current: payload
      };
    },
  }
};

export default UserPoolModel;
