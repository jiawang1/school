import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { troopClient } from '@shanghai/troop-adapter';
import { withApollo } from 'react-apollo';
import { Input, Col, Button } from 'antd';
import { queryContext } from '../../common/troopContext';
import './LogonPage.less';

const InputGroup = Input.Group;

class LogonPage extends Component {
  constructor() {
    super();
    this.state = {
      userName: '',
      password: '',
      message: ''
    };
  }
  componentWillReceiveProps(next) {
    const { message } = next;
    if (message) {
      this.setState({
        message
      });
    }
  }

  handleLogon() {
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
            queryContext(client)
              .then(data => {
                console.log(data);
                history.push('/studyplan');
              })
              .catch(err => {
                console.error(err);
              });
          } else {
            this.setState({
              message: 'Logon failed'
            });
          }
        })
        .catch(err => {});
    } else {
      this.setState({
        message: 'Please input user name and password'
      });
    }
  }

  handleInput(e) {
    this.setState({
      [e.target.id]: e.target.value,
      message: ''
    });
  }

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
                  onPressEnter={() => {
                    this.handleLogon();
                  }}
                  onChange={(...args) => {
                    this.handleInput(...args);
                  }}
                />
              </Col>
            </div>
            <div className="wrapper">
              <Col span={30}>
                <Input
                  id="password"
                  type="password"
                  addonBefore="Password"
                  onPressEnter={() => {
                    this.handleLogon();
                  }}
                  value={this.state.password}
                  onChange={(...args) => {
                    this.handleInput(...args);
                  }}
                />
              </Col>
            </div>
          </InputGroup>
          <Button
            type="primary"
            style={{ float: 'right', marginRight: 10, marginTop: 20 }}
            onClick={() => {
              this.handleLogon();
            }}
          >
            Logon
          </Button>
          <div className="message">{this.state.message}</div>
        </div>
      </div>
    );
  }
}

export default withApollo(withRouter(LogonPage));
