import actions from './actions/index';
import { IState, defaultState } from './defaultState';

let currentState = defaultState;

interface IActionType {
  type: string;
  preload: any;
}
let reducerFuncData: {
  [key: string]: (state: IState, action: IActionType) => {};
};

type actionsKeyType = keyof typeof actions;

export const reducer = (state: IState, action: IActionType) => {
  if (reducerFuncData[action.type]) {
    const data: any = reducerFuncData[action.type](state, action);
    currentState = data;
    return currentState;
  }
  currentState = state;
  return currentState;
};

export default reducer;

export type actionsType = {
  [key in actionsKeyType]: typeof actions[key]['actions'];
};
let actionFuncData: actionsType;

export const buildActions = dispatch => {
  Object.keys(actions).forEach(key => {
    const filterActionFunc: { [key: string]: Function } = {};
    const actionFunc = actions[key].actions;
    const reducersFunc = actions[key].reducers;
    const _dispath = result => {
      if (typeof result === 'function') {
        const func = result(_dispath, currentState);
        if (func && func.then) {
          return func;
        }
      } else if (result && result.then) {
        result.then(res => {
          if (typeof res === 'function') {
            res(dispatch, currentState);
          } else {
            dispatch(res);
          }
        });
      } else if (result && result.type) {
        dispatch(result);
      }
    };
    Object.keys(actionFunc).forEach(fKey => {
      filterActionFunc[fKey] = (...args) => {
        const result = actionFunc[fKey].apply(null, args);
        return _dispath(result);
      };
    });

    actionFuncData = { ...actionFuncData, [key]: filterActionFunc };
    reducerFuncData = { ...reducerFuncData, ...reducersFunc };
  });
  return actionFuncData;
};
