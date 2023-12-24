import { Effect, Reducer, Subscription } from 'umi';

import { create, list } from '@/services/role';
import { message } from "antd";

export interface RoleModelState {
  rolePage?: API.Page<API.Role>;
}

export interface RoleModelType {
  namespace: 'role';
  state: RoleModelState;
  effects: {
    list: Effect;
    create: Effect;
  };
  reducers: {
    saveRoles: Reducer<RoleModelState>;
  };
  subscriptions: { setup: Subscription };
}

const RoleModel: RoleModelType = {
  namespace: 'role',
  state: {
    rolePage: { totalCount: 0, items: [] },
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response) {
        yield put({
          type: 'saveRoles',
          payload: { rolePage: response },
        })
      }
    },
    *create({ payload }, { call, put }) {
      const response = yield call(create, payload);
      if (response.code === 200) {
        message.success(`创建成功`, 3);
      } else {
        message.success(`创建失败: ${response.msg}`);
      }

      yield put({
        type: 'global/changeCreateModalVisible',
        payload: false,
      });
    },
  },
  reducers: {
    saveRoles(state, { payload }) {
      const r = { ...state, ...payload };
      return r;
    },
  }
}

export default RoleModel;