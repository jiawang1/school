import { graphql, compose } from 'react-apollo';
import { Route } from 'react-router-dom';
import React from 'react';
import gql from 'graphql-tag';
import LogonPage from './LogonPage';
// import blurbQL from '../../services/blurbService';

const logon = gql`
  mutation logon($username: String, $password: String, $onsuccess: String) {
    logon(username: $username, password: $password, onsuccess: $onsuccess) {
      success
      redirect
    }
  }
`;

const LogonPageWithData = compose(
  // graphql(blurbQL, {
  //   options: {
  //     variables: { id: ['706170', '706169', '508941', '508944'] },
  //     name: 'blurbs'
  //   }
  // }),
  graphql(logon, {
    name: 'logon'
  })
)(LogonPage);

export default () => <Route path="/login" component={LogonPageWithData} />;
