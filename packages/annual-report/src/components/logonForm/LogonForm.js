import React, { Component } from 'react';

import Formtip from './Formtip';
import Button from '../Button';

export default class LogonForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      returnURL: undefined
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit() {
    const { logon } = this.props;
    logon()
      .then(data => {
        console.log(data);
      })
      .catch();
  }

  handleChange() {}

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
