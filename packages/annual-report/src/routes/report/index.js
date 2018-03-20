import { Route } from 'react-router-dom';
import React from 'react';
import Report from './Report';

export default () => <Route path="/report/:id" component={Report} />;
