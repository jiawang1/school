import React, { Component } from 'react';
import { withApollo, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Tree, Select } from 'antd';
import PropTypes from 'prop-types';

const { TreeNode } = Tree;
const { Option } = Select;
let seq = 0;

class CourseTab extends Component {
  constructor() {
    super();
    this.state = {
      data: {}
    };
    this.templateId = null;
  }

  componentWillReceiveProps(next) {
    const { data: { student_course_enrollment = {} } } = next;
    this.setState({
      data: student_course_enrollment
    });
  }

  updateEnrollment(e) {
    const { updateEnrollment } = this.props;
    if (this.templateId !== e) {
      updateEnrollment({
        variables: { templateId: e }
      }).then(() => {
        this.templateId = e;
      });
    }
  }

  renderTreeNodes(data) {
    const __renderNode = _data =>
      Object.keys(_data).map(k => {
        if (typeof _data[k] === 'object') {
          return (
            <TreeNode title={`${k}`} key={seq++} dataRef={_data[k]}>
              {this.renderTreeNodes(_data[k])}
            </TreeNode>
          );
        }
        return <TreeNode title={`${k} : ${_data[k]}`} key={seq++} dataRef={_data[k]} isLeaf />;
      });

    if (typeof data !== 'object' || data === null) return [];

    if (Array.isArray(data)) {
      return data.map(__renderNode);
    }
    return __renderNode(data);
  }

  render() {
    const { data: { student_course_enrollment } } = this.props;
    const enrollment = student_course_enrollment ? student_course_enrollment[0] : {};
    return (
      <div>
        <div>
          <div>
            <span style={{ marginRight: 20 }}>update enrollment</span>
            <Select
              style={{ width: 120 }}
              onChange={(...args) => {
                this.updateEnrollment(...args);
              }}
            >
              <Option value="20000585">十级</Option>
              <Option value="20000527">五级</Option>
            </Select>
          </div>
          <span>enrollment ID :</span>
          <span>{enrollment.id}</span>
        </div>
        <div>
          <Tree>{this.renderTreeNodes(this.state.data)}</Tree>
        </div>
      </div>
    );
  }
}

const enrollmentQuery = gql`
  query queryEnrollment($id: String!) {
    student_course_enrollment(id: $id) {
      id
      studentCourseId
      studentLevelId
      studentUnitId
      studentLessonId
      studentLevel {
        id
        levelName
        templateLevelId
        progress {
          score
        }
        children {
          unitName
          progress {
            score
          }
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
/* eslint-disable react/require-default-props */
CourseTab.propTypes = {
  updateEnrollment: PropTypes.func,
  data: PropTypes.object
};

const updateEnrollment = gql`
  mutation updateEnrollment($templateId: String) {
    updateCurrentEnrollment(templateId: $templateId) {
      student_course_enrollment {
        id
        studentCourseId
        studentLevelId
        studentUnitId
        studentLessonId
      }
    }
  }
`;

export default compose(
  graphql(enrollmentQuery, {
    options: {
      variables: { id: 'current' }
    }
  }),
  graphql(updateEnrollment, {
    name: 'updateEnrollment'
    // options: {
    //   refetchQueries: ['queryEnrollment']
    // }
  })
)(withApollo(CourseTab));
