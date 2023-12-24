import { Reducer, Subscription } from 'umi';

export interface GlobalModelState {
  createModalVisible: boolean;
}

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {};
  reducers: {
    changeCreateModalVisible: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',
  state: {
    createModalVisible: false,
  },
  effects: {
  },
  reducers: {
    changeCreateModalVisible(state, action) {
      return { ...state, createModalVisible: action.payload };
    },
  },
}

export default GlobalModel;