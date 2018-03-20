import React from 'react';
// import { withCookies } from 'react-cookie';
import './index.less';

class Tracking extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: ''
    };
  }

  componentDidMount() {
    // const { cookies } = this.props;
    // const guid = encodeURIComponent(cookies.get('EFID'));
    // const ctr = encodeURIComponent(cookies.get('ctr'));
    // const ptr = encodeURIComponent(window.config.app.config.partnerCode);
    // const request = encodeURIComponent(window.location.href);
    // const vmsi = encodeURIComponent(cookies.get('VMsi'));
    // const cmus = encodeURIComponent(cookies.get('CMus'));
    // const etag = encodeURIComponent('annual-report-2018');
    // const href = '/track/trackhandler.ashx';
    // const action = `${href}?guid=${guid}&ctr=${ctr}&ptr=${ptr}&request=${request}&vmsi=${vmsi}&cmus=${cmus}&etag=${etag}`;
    // this.setState({
    //   action: action
    // });
  }

  render() {
    return <iframe title="iframeTracking" className="iframeTracking" src={this.state.action} />;
  }
}

export default Tracking;
