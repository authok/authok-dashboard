import { Effect } from 'umi';
import { list } from '@/services/resource';

export interface ResourceModelState {}

export interface ResourceModelType {
  namespace: 'resource';
  state: ResourceModelState;
  effects: {
    list: Effect;
  };
  reducers: {};
}

const ResourceModel: ResourceModelType = {
  namespace: 'resource',
  state: {},
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(list, payload);
      return response;
    },
  },
  reducers: {},
};

export default ResourceModel;
