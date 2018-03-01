import React, { Component } from 'react';
import { withApollo, graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { Tree, Button, Select } from 'antd';

const TreeNode = Tree.TreeNode;

const Option = Select.Option;

const level = ['20000585', '20000527'];
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
    const { data: { studentCourseEnrollment = {} } } = next;
    this.setState({
      data: studentCourseEnrollment
    });
  }

  loadData(node) {
    const { client } = this.props;
  }

  updateEnrollment(e) {
    const { updateEnrollment } = this.props;
    if (this.templateId !== e) {
      updateEnrollment({
        variables: { templateId: e }
      }).then(data => {
        this.templateId = e;
      });
    }
  }

  renderTreeNodes(data) {
    const __renderNode = _data =>
      Object.keys(_data).map((k, inx) => {
        if (typeof _data[k] === 'object') {
          return (
            <TreeNode title={`${k}`} key={seq++} dataRef={_data[k]}>
              {this.renderTreeNodes(_data[k])}
            </TreeNode>
          );
        }
        return (
          <TreeNode title={`${k} : ${_data[k]}`} key={seq++} dataRef={_data[k]} isLeaf={true} />
        );
      });

    if (typeof data !== 'object' || data === null) return [];

    if (Array.isArray(data)) {
      return data.map(__renderNode);
    }
    return __renderNode(data);
  }

  render() {
    const { data: { studentCourseEnrollment } } = this.props;
    const enrollment = studentCourseEnrollment ? studentCourseEnrollment[0] : {};
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
    studentCourseEnrollment(id: $id) {
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

const updateEnrollment = gql`
  mutation updateEnrollment($templateId: String) {
    updateCurrentEnrollment(templateId: $templateId) {
      id
      studentCourseId
      studentLevelId
      studentUnitId
      studentLessonId
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
    name: 'updateEnrollment',
    options: {
      refetchQueries: ['queryEnrollment']
    }
  })
)(withApollo(CourseTab));
