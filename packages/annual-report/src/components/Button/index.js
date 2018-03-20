import React from 'react';
import PropTypes from 'prop-types';
import Spinner from './Spinner';
import './index.less';

const Button = ({ submit, status }) => {
  const show = status === 'pending';
  const cls = status === 'normal' ? 'ec-form-button' : 'ec-form-button hide';

  return (
    <div className="ec-form-submit">
      <Spinner show={show} />
      <button className={cls} onClick={submit}>
        查 看 我 的 报 告
      </button>
    </div>
  );
};

Button.propTypes = {
  submit: PropTypes.func.isRequired,
  status: PropTypes.string
};

Button.defaultProps = {
  status: 'normal'
};

export default Button;
