import { IActions, IState } from '../defaultState';

const formatValue = value => {
  let updateValue: any = value;
  if (Array.isArray(value)) {
    updateValue = [...value];
  } else if (typeof value === 'object') {
    updateValue = { ...value };
  }
  return updateValue;
};

export const actions = {
  setKeyValue(key: string | string[], value: any | any[]) {
    return {
      type: 'setKeyValue',
      preload: { key, value }
    };
  },
  setLoading(data: boolean) {
    return {
      type: 'setLoading',
      preload: data
    };
  },
  setModalBtnLoading(data: boolean) {
    return {
      type: 'setModalBtnLoading',
      preload: data
    };
  },
  setBtnLoading(data: boolean) {
    return {
      type: 'setBtnLoading',
      preload: data
    };
  }
};

export const reducers = {
  setKeyValue(state: IState, action: IActions) {
    const { key, value } = action.preload;
    const data: any = {};

    if (Array.isArray(key)) {
      key.forEach((k, index) => {
        if (value[index] !== undefined) {
          data[k] = formatValue(value[index]);
        }
      });
    } else {
      data[key] = formatValue(value);
    }
    if (state[key] === value) {
      return state;
    }
    return {
      ...state,
      ...data
    };
  },
  setLoading(state: IState, action: IActions) {
    return {
      ...state,
      isLoading: action.preload
    };
  },
  setModalBtnLoading(state: IState, action: IActions) {
    return {
      ...state,
      modalBtnLoading: action.preload
    };
  },
  setBtnLoading(state: IState, action: IActions) {
    return {
      ...state,
      btnLoading: action.preload
    };
  }
};
