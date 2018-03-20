import React, { Component } from 'react';
// import { CookiesProvider } from 'react-cookie';
import PropTypes from 'prop-types';

// import CachePage from './CachePage';
import Routes from 'routes';
import { getReportFromSessionStorage } from 'services/reportService';
import Notification from 'components/notification';
import 'styles/index.css';
import 'styles/mobile.css';
import 'styles/overwrite.less';

const BLURB_ERROR_EXPISUSP = 'blurb_errorExpisusp';
const BLURB_ERROR_SERVER = 'blurb_errorServer';

const toggleLoading = flag => {
  const elLoading = document.getElementById('loading');
  if (elLoading) {
    if (flag === 'show') {
      elLoading.className = 'loading';
    } else {
      elLoading.className = 'loading-hide';
    }
  }
};

const catchException = event => {
  const reason = event.reason || (event.detail && event.detail.reason);
  if (reason) {
    const message = String(reason.message || reason);
    console.log({
      msg: `${event.type}:${message}`,
      stack: reason.stack
    });
    event.preventDefault();
  }
  toggleLoading('hide');
};

const getErrorFromUrl = errorUrl => {
  const errorPart = errorUrl.split('?')[1];
  if (errorPart !== undefined) {
    const query = errorPart.split('&');
    const arrErrMsg = [];
    for (let i = 0; i < query.length; i++) {
      if (query[i] === 'auth=false' || query[i] === 'expisusp=true') {
        arrErrMsg.push(query[i]);
      }
    }
    if (arrErrMsg.length && arrErrMsg[arrErrMsg.length - 1] === 'expisusp=true') {
      return BLURB_ERROR_EXPISUSP;
    } else if (arrErrMsg.length) {
      return BLURB_ERROR_SERVER;
    }
  } else {
    return false;
  }
};

class App extends Component {
  componentWillMount() {
    const report = getReportFromSessionStorage();
    let redirectTo;
    if (report) {
      // actions.app.setReportData(report);
      redirectTo = '/report/1';
    } else {
      redirectTo = '/login';
    }

    this.setState({
      redirectTo
    });
  }

  componentDidMount() {
    window.addEventListener('unhandledrejection', catchException);
    window.addEventListener('unhandledRejection', catchException);
    // actions.app.uiInit();
    toggleLoading('hide');
  }

  render() {
    return (
      //  <CookiesProvider>
      <React.Fragment>
        <Notification {...this.props.app.notification} />
        {/* <CachePage /> */}
        <Routes redirectTo={this.state.redirectTo} />
      </React.Fragment>
      /* </CookiesProvider> */
    );
  }
}

App.propTypes = {
  app: PropTypes.object
};

App.defaultProps = {
  app: {}
};

export default App;
