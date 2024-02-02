import { Context } from 'koa';
import { useContext } from 'react';
import { Store } from '../components/Provider';
import { IState } from '../redux/defaultState';
import { actionsType } from '../redux/reducer';

interface IContent {
  state: IState;
  actions: actionsType; // TODO
  dispatch: ({ preload, type }: { preload: any; type: string }) => {};
  context?: Context;
}

export const useRedux = () => {
  const { state, actions, dispatch, context } = useContext<IContent>(Store);
  return {
    state,
    actions,
    dispatch,
    context
  };
};
