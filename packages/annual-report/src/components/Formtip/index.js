import React from 'react';
import './index.less';

/**
 *
 * @param {*} props
 * String state in ['error', 'info', 'warning']
 * String text
 */
const Formtip = props => {
  let cls = 'ec-formtip';
  if (['error', 'info', 'warning'].indexOf(props.state) < 0) {
    return <span className={cls}>&nbsp;</span>;
  }

  cls = `${cls} ${props.state}`;
  return <span className={cls}>{props.text}</span>;
};

export default Formtip;
