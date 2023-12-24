import { Effect, Subscription } from 'umi';
import { create, retrieve, editOrg, deleteOrg, getOrgTree } from '@/services/org';

export interface OrgModelState {}

export interface OrgModelType {
  namespace: 'org';
  state: OrgModelState;
  effects: {
    list: Effect;
    retrieve: Effect;
    create: Effect;
    update: Effect;
    delete: Effect;
  };
  reducers: {};
  subscriptions: { setup: Subscription };
}

const OrgModel: OrgModelType = {
  namespace: 'org',
  state: {},
  effects: {
    *retrieve({ payload }, { call, put }) {
      const response = yield call(retrieve, payload);
      yield put({
        type: 'show',
        payload: response,
      });
    },
    *create({ payload, callback }, { call }) {
      const response = yield call(create, payload);
      if (callback && typeof callback === 'function') callback(response);
    },
    *update({ payload, callback }, { call }) {
      try {
        const response = yield call(editOrg, payload);
        if (callback && typeof callback === 'function') callback(response);
      } catch (e) {
        // console.error(e);
      }
    },
    *delete({ payload, callback }, { call }) {
      const response = yield call(deleteOrg, payload);
      if (callback && typeof callback === 'function') callback(response);
    },
    *getOrgTree({ payload }, { call }) {
      const response = yield call(getOrgTree, payload);
      return response;
    },
  },
  reducers: {},
};

export default OrgModel;
