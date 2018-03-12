import gql from 'graphql-tag';

const blurbQL = gql`
  query queryBlurb($id: [String]!) {
    blurb(id: $id) {
      id
      translation
    }

    studentLevel(id: ["3ecc6a0b-c18b-4112-a7cb-8da2cf061ae6"]) @troop(type: "student_level") {
      __typename
      studentLevelId
      courseVersion
      levelName
      progress {
        score
      }
    }
  }
`;

const queryBlurb = (client, id = []) =>
  client.query({
    query: blurbQL,
    variables: { id }
  });

export { blurbQL, queryBlurb };
