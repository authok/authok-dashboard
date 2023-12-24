import { Effect, Reducer } from 'umi';
import { CurrentUser, GeographicItemType } from './data';
import { queryCurrent, query as queryUsers } from './service';

export interface ModalState {
  currentUser?: Partial<CurrentUser>;
  province?: GeographicItemType[];
  city?: GeographicItemType[];
  isLoading?: boolean;
}

export interface ModelType {
  namespace: string;
  state: ModalState;
  effects: {
    fetchCurrent: Effect;
    fetch: Effect;

  };
  reducers: {
    saveCurrentUser: Reducer<ModalState>;
    changeNotifyCount: Reducer<ModalState>;
    changeLoading: Reducer<ModalState>;
  };
}

const Model: ModelType = {
  namespace: 'settingsAndAccountSettings',

  state: {
    currentUser: {},
    isLoading: false,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state = {}, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    changeLoading(state, action) {
      return {
        ...state,
        isLoading: action.payload,
      };
    },
  },
};

export default Model;
