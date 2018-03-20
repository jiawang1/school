import React from 'react';
import './index.less';
// import { getCacheServerUrl } from 'shared/Utils';
import Tracking from 'components/Tracking';
// import IconLogo from './smart-18-logo.svg';
// import IconJourney from './study-journey.svg';

const Page1 = () => {
  return (
    <div className="page page-1">
      <Tracking />
      {/* <img className="icon-logo" src={ getCacheServerUrl(IconLogo) } alt="logo of smart 18" /> */}
      <p className="desc-line-1">Your</p>
      <p className="desc-line-2">Smart</p>
      <p className="desc-line-3">Study Report</p>
      <p className="desc-line-4">过去一年，你的学习 SMART 了吗？</p>
      {/* <img className="icon-journey" src={ getCacheServerUrl(IconJourney) } alt="study journey" /> */}
    </div>
  );
};

export default Page1;
