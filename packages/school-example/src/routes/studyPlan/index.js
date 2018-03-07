import { Route } from 'react-router-dom';
import React from 'react';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import StudyPlanPage from './StudyPlanPage';

const userQuery = gql`
  query queryUser($id: String!) {
    user(id: $id) {
      id
      member_id
      userName
      memberTypeCode
      partnerCode
      divisionCode
      email
      firstName
      lastName
      countryCode
      gender
    }
  }
`;
const StudyPlanPageWithData = graphql(userQuery, {
  options: {
    variables: { id: 'current' }
  }
})(StudyPlanPage);

export default () => <Route path="/studyplan" component={StudyPlanPageWithData} />;
