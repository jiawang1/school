import React from 'react';
import PropTypes from 'prop-types';
import { getTroopConnector } from './troopConnector';

export default class TroopWrapper extends React.Component {
  getChildContext() {
    return {
      connector: this.connector
    };
  }

  componentWillMount() {
    this.connector = getTroopConnector();
  }

  render() {
    const { children, asWrapper, ...props } = this.props;
    if (asWrapper) {
      return this.connector ? React.cloneElement(React.Children.only(children), props) : null;
    }
    return this.connector ? React.Children.only(children) : null;
  }
}

TroopWrapper.childContextTypes = {
  connector: PropTypes.object,
  asWrapper: PropTypes.bool
};

TroopWrapper.defaultProps = {
  asWrapper: false
};
