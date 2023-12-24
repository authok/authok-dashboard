import { Effect, Reducer, Subscription } from 'umi';

import { list } from '@/services/group';

export interface GroupModelState {
  groupPage?: API.Page<API.Group>;
}

export interface GroupModelType {
  namespace: 'group';
  state: GroupModelState;
  effects: {
    list: Effect;
  };
  reducers: {
    saveGroups: Reducer<GroupModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GroupModel: GroupModelType = {
  namespace: 'group',
  state: {
    groupPage: { totalCount: 0, items: [] },
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      if (response) {
        yield put({
          type: 'saveGroups',
          payload: { groupPage: response },
        })
      }
    },
  },
  reducers: {
    saveGroups(state, { payload }) {
      const r = { ...state, ...payload };
      return r;
    },
  }
}

export default GroupModel;