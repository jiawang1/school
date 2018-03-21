import React from 'react';
import { HashRouter, Redirect, Switch } from 'react-router-dom';
import Logonpage from './logon';
import Report from './report';

const Routes = ({ redirectTo }) => (
  <React.Fragment>
    <Logonpage />
    <Report />
  </React.Fragment>
);

export default ({ redirectTo }) => (
  <HashRouter>
    <Switch>
      {redirectTo ? <Redirect from="/" exact to={redirectTo} /> : null}
      <Routes redirectTo={redirectTo} />
    </Switch>
  </HashRouter>
);
