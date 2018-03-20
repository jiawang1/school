import React, { Component } from 'react';
import './index.less';

/**
 *
 * @param {*} props
 * String state in ['error', 'info', 'warning']
 * String text
 */
class Message extends Component {
  componentDidMount() {
    const msg = document.getElementById('msg');
    msg.classList.add('ecnotifade-appear');
  }

  componentDidUpdate() {
    const msg = document.getElementById('msg');
    msg.classList.remove('ecnotifade-appear');
    setTimeout(() => {
      msg.classList.add('ecnotifade-appear');
    }, 200);
  }

  render() {
    const cls = `ec-notification ec-notification-${this.props.state}`;

    return (
      <div id="msg" className={cls}>
        <span>{this.props.text}</span>
      </div>
    );
  }
}

class Notification extends Component {
  shouldComponentUpdate(nextProps) {
    if (this.props.timestamp !== nextProps.timestamp) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    if (this.props.show && this.props.text) {
      return <Message {...this.props} />;
    } else {
      return null;
    }
  }
}

export default Notification;
