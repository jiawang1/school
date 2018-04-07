import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { troopClient } from '@shanghai/troop-adapter';
import PropTypes from 'prop-types';
import { withApollo } from 'react-apollo';
import { Input, Col, Button } from 'antd';
import { queryContext } from '../../common/troopContext';
import { queryCommand } from '../../services/commandService';
import './LogonPage.less';

const InputGroup = Input.Group;

class LogonPage extends Component {
  static getDerivedStateFromProps(nextProps) {
    const { message } = nextProps;
    return message ? message : null; // eslint-disable-line  no-unneeded-ternary
  }
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      message: ''
    };
  }
  handleLogon = () => {
    const { history, client } = this.props;
    if (this.state.userName && this.state.password) {
      const { password, userName } = this.state;
      troopClient
        .postForm('/login/secure.ashx', {
          userName,
          password
        })
        .then(data => {
          if (data.success) {
            queryCommand(client)
              .then(() => queryContext(client))
              .then(() => {
                history.push('/studyplan');
              })
              .catch(err => {
                // eslint-disable-next-line
                console.error(err);
              });
          } else {
            this.setState({
              message: 'Logon failed'
            });
          }
        });
    } else {
      this.setState({
        message: 'Please input user name and password'
      });
    }
  };

  handleInput = e => {
    this.setState({
      [e.target.id]: e.target.value,
      message: ''
    });
  };

  render() {
    return (
      <div className="logon-frame">
        <div className="form-frame">
          <InputGroup>
            <div className="wrapper">
              <Col span={30}>
                <Input
                  id="userName"
                  addonBefore="User Name"
                  value={this.state.userName}
                  onPressEnter={this.handleLogon}
                  onChange={this.handleInput}
                />
              </Col>
            </div>
            <div className="wrapper">
              <Col span={30}>
                <Input
                  id="password"
                  type="password"
                  addonBefore="Password"
                  onPressEnter={this.handleLogon}
                  value={this.state.password}
                  onChange={this.handleInput}
                />
              </Col>
            </div>
          </InputGroup>
          <Button
            type="primary"
            style={{ float: 'right', marginRight: 10, marginTop: 20 }}
            onClick={this.handleLogon}
          >
            Logon
          </Button>
          <div className="message">{this.state.message}</div>
        </div>
      </div>
    );
  }
}
/* eslint-disable react/require-default-props */
LogonPage.propTypes = {
  history: PropTypes.object,
  client: PropTypes.object
};

export default withApollo(withRouter(LogonPage));
