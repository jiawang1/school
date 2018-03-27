// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import StudyPlanPage from '../routes/studyPlan';
import Logonpage from '../routes/logon';
import LoadingBar from 'components/spin';

const Routes = () => (
  <React.Fragment>
    <StudyPlanPage />
    <Logonpage />
    <LoadingBar />
  </React.Fragment>
);

export default () => (
  <HashRouter>
    <Routes />
  </HashRouter>
);
