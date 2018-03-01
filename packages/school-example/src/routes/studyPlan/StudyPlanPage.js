import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import { Button, Tabs } from 'antd';
import { queryCommand } from '../../services/commandService';
import { querySchema } from '../../services/schemaService';
import { queryBlurb } from '../../services/blurbService';
import CourseTab from './CourseTab';
import './StudyPlan.less';

const TabPane = Tabs.TabPane;

const blurbList = ['450052', '443583', '150622'];

class StudyPlanPage extends Component {
  constructor() {
    super();
    this.state = {

    };
  }
  loadCommand() {
    const { client } = this.props;

    queryCommand(client).then(data => {
      this.setState({
        command: data.data.command[0]
      });
    });
  }

  loadBlurb() {
    const { client } = this.props;
    queryBlurb(client, blurbList).then(data => {
      console.log(data);
      this.setState({
        blurb: data.data.blurb
      });
    });
  }

  loadSchema() {
    const { client } = this.props;
    querySchema(client).then(data => {
      console.log(data);
      // this.setState({
      //   blurb: data.data.blurb
      // });
    });
  }

  __renderCommand(command = {}) {
    return (
      <div className="command-frame">
        <ul>
          {command.results &&
            Object.keys(command.results).map(co => (
              <li key={co}>
                <span>{co}</span>
              </li>
            ))}
        </ul>
      </div>
    );
  }

  __renderBlurb(blurbs = []) {
    return (
      <table style={{ width: '50%' }}>
        <thead className="t-header">
          <tr>
            <th>
              <span>blurb ID</span>
            </th>
            <th>
              <span>text</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {blurbs.map(blurb => {
            return (
              <tr key={blurb.id}>
                <td style={{ textAlign: 'center' }}> {blurb.id} </td>
                <td style={{ textAlign: 'center' }}> {blurb.translation} </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }

  __renderBasicTab() {
    const { data } = this.props;
    return (
      <TabPane tab="Basic" key="1">
        <div className="study-plan-section">
          <div> current user : {data.user ? data.user[0].member_id : ''}</div>
        </div>
        <div className="study-plan-section">
          <Button
            type="primary"
            onClick={() => {
              this.loadCommand();
            }}
          >
            load command
          </Button>
          {this.__renderCommand(this.state.command)}
        </div>

        <div className="study-plan-section">
          <Button
            type="primary"
            onClick={() => {
              this.loadBlurb();
            }}
          >
            load blurb
          </Button>
          {this.__renderBlurb(this.state.blurb)}
          <div />
        </div>

        <div className="study-plan-section">
          <Button
            type="primary"
            onClick={() => {
              this.loadSchema();
            }}
          >
            load services schema
          </Button>

          <div />
        </div>
      </TabPane>
    );
  }

  __renderCourseTab() {
    return (
      <TabPane tab="Courses" key="2">
        <CourseTab />
      </TabPane>
    );
  }
  render() {
    return (
      <div className="study-plan">
        <Tabs type="card">
          {this.__renderBasicTab()}
          {this.__renderCourseTab()}
        </Tabs>
      </div>
    );
  }
}

export default withApollo(StudyPlanPage);
