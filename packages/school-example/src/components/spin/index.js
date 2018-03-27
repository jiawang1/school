import React, { Component } from 'react';
import { Spin } from 'antd';

let instance = null;

export default class LoadingBar extends Component {
  constructor() {
    super();
    this.state = {
      show: false
    };
    instance = this;
  }
  show() {
    this.setState({
      show: true
    });
  }
  hide() {
    this.setState({
      show: false
    });
  }
  render() {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'rgba(0,0,0,0.1)',
          display: this.state.show ? 'block' : 'none'
        }}
      >
        <Spin
          spinning={this.state.show}
          size="large"
          style={{ position: 'absolute', left: '50%', top: '50%' }}
        />
      </div>
    );
  }
}

export const progresshandler = {
  show: () => {
    if (instance) {
      instance.show();
    }
  },
  hide: () => {
    if (instance) {
      instance.hide();
    }
  }
};
