import React, { createContext, useReducer, useRef } from 'react';
import { Context } from 'koa';
import { reducer, buildActions } from '../../redux/reducer';
import { defaultState } from '../../redux/defaultState';

// 创建context，让所有收包裹组件都能得到state,dispatch
export const Store = createContext<any>(defaultState);

interface Props {
  context?: Context;
  children?: any;
}
export const Provider: React.FC<Props> = ({ context, children }) => {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const actionRef = useRef(buildActions(dispatch));
  return <Store.Provider value={{ state, dispatch, actions: actionRef.current, context }}>{children}</Store.Provider>;
};
