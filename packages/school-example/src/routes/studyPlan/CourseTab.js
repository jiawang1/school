import React, { Component } from 'react';
import { withApollo, graphql } from 'react-apollo';
import gql from 'graphql-tag';

class CourseTab extends Component {
  render() {
    const { data: { studentCourseEnrollment } } = this.props;
    console.log(studentCourseEnrollment);
    const enrollment = studentCourseEnrollment ? studentCourseEnrollment[0] : {};
    return (
      <div>
        <div>
          <span>enrollment ID :</span>
          <span>{enrollment.id}</span>
        </div>
      </div>
    );
  }
}

const enrollmentQuery = gql`
  query queryEnrollment($id: String!) {
    studentCourseEnrollment(id: $id) {
      id
      studentCourseId
      studentLevelId
      studentUnitId
      studentLessonId
      studentLevel {
        id
        levelName
        progress {
          score
        }
        children {
          unitName
        }
      }
      studentCourse {
        id
        courseName
        courseLocation {
          id
        }
      }
    }
  }
`;

export default graphql(enrollmentQuery, {
  options: {
    variables: { id: 'current' }
  }
})(withApollo(CourseTab));
