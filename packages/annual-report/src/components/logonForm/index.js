import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import LogonForm from './LogonForm';
import blurbQL from '../../services/blurbService';

const logon = gql`
  mutation logon($username: String, $password: String, $onsuccess: String) {
    logon(username: $username, password: $password, onsuccess: $onsuccess) {
      success
      redirect
    }
  }
`;

const LogonFormWithData = compose(
  graphql(blurbQL, {
    options: {
      variables: { id: ['706170', '706169', '508941', '508944'] },
      name: 'blurbs'
    }
  }),
  graphql(logon, {
    name: 'logon'
  })
)(LogonForm);

export default LogonFormWithData;
