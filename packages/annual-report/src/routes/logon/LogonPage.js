import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from 'components/Button';
import Formtip from 'components/Formtip';
import './LogonPage.less';

class LogonPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      returnURL: 'http://smartuat2.englishtown.com/',
      submitStatus: 'normal'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(e) {
    const { logon } = this.props;
    const { username, password } = this.state;
    e.preventDefault();
    logon({
      variables: { username, password }
    })
      .then(({ data }) => {
        if (data.logon && data.logon.success) {
          const { history } = this.props;
          history.push('/report/1');
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  handleChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  handleFocus() {}

  render() {
    const { blurbs } = this.props;

    return (
      <div className="ec-login-form">
        <div className="inner">
          <form>
            <div className="ec-form-control-wrapper">
              {/* <img className="icon" src={getCacheServerUrl(IconUser)} alt="icon of username" /> */}
              <input
                // placeholder={blurbs['508941']}
                name="username"
                type="text"
                autoComplete="username"
                value={this.state.username}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
              />
              <div className="hr" />
              <Formtip {...this.state.userValidator} />
            </div>
            <div className="ec-form-control-wrapper">
              {/* <img
                className="icon icon-password"
                src={getCacheServerUrl(IconPassword)}
                alt="icon of password"
              /> */}
              <input
                // placeholder={blurbs['508944']}
                name="password"
                autoComplete="current-password"
                type="password"
                value={this.state.password}
                onChange={this.handleChange}
                onFocus={this.handleFocus}
              />
              <div className="hr" />
              <Formtip {...this.state.passValidator} />
            </div>
            <Button submit={this.submit} status={this.state.submitStatus} />
            <input id="onsuccess" name="onsuccess" type="hidden" value={this.state.returnURL} />
          </form>
        </div>
      </div>
    );
  }
}

LogonPage.propTypes = {
  logon: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

export default withRouter(LogonPage);
