// eslint-disable-next-line no-unused-vars
import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import LoadingBar from 'components/loadingBar/LoadingBar';
import StudyPlanPage from 'routes/studyPlan';
import Logonpage from 'routes/logon';

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
