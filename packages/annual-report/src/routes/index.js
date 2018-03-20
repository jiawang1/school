import React from 'react';
import { HashRouter, Redirect, Switch } from 'react-router-dom';
import Logonpage from './logon';
import Report from './report';

const Routes = ({ redirectTo }) => (
  <React.Fragment>
    <Switch>
      {redirectTo ? <Redirect from="/" exact to={redirectTo} /> : null}
      <Logonpage />
      <Report />
    </Switch>
  </React.Fragment>
);

export default ({ redirectTo }) => (
  <HashRouter>
    <Routes redirectTo={redirectTo} />
  </HashRouter>
);
