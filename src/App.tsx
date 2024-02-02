import React, { useCallback } from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Provider } from './components/Provider';
import Dashboard from './pages/Dashboard/Map';
import Index from './pages/Index';
import { DEVELOP_ADDRESS, TOKEN_KEY, USERLOGININFO } from './utils/constant';
import Login from './pages/Login';
import TaiZhengTong from './pages/TaiZhengTong';

const App = () => {
  /** 跳转到某个路由之前触发 */
  const onEnter = useCallback((Component, props) => {
    if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
      const userInfo = localStorage.getItem(USERLOGININFO) || '';
      if (userInfo) {
        return <Component {...props} />;
      }
      return <Redirect to="/login" />;
    } else {
      return <Component {...props} />;
    }
  }, []);
  return (
     <Router>
        <Provider context={undefined}>
          <Switch>
          <Route path="/login" component={Login} />
          <Route path="/taizhengtong" component={TaiZhengTong} />
          <Route
            path="/"
            render={(props): JSX.Element => onEnter(Index, props)}
          />
          </Switch>
        </Provider>
    </Router>
  )
};

export default App;
