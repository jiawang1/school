import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { CSSTransitionGroup } from 'react-transition-group';
import { AlloyFinger } from 'components/Gesture';
import './Report.less';
import Page1 from './Page1';

class Report extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: Number(props.match.params.id || 1),
      fade: 'fadeup'
    };
    this.nextPage = this.nextPage.bind(this);
  }

  getPage() {
    const number = this.state.page;
    const rdata = this.props.app.rdata;
    switch (number) {
      case 1:
        return <Page1 key={number} {...rdata} />;
      // case 2:
      //   return <Page2 key={number} {...rdata} />;
      // case 3:
      //   return <Page3 key={number} {...rdata} />;
      // case 4:
      //   return <Page4 key={number} {...rdata} />;
      // case 5:
      //   return <Page5 key={number} {...rdata} />;
      // case 6:
      //   return <Page6 key={number} {...rdata} />;
      // case 7:
      //   return <Page7 key={number} {...rdata} />;
      // case 8:
      //   return <Page8 key={number} {...rdata} />;
      // case 9:
      //   return <Page9 key={number} {...rdata} />;
      // case 10:
      //   return <Page10 key={number} {...rdata} />;
      // case 11:
      //   return <Page11 key={number} {...rdata} />;
      // case 12:
      //   return <Page12 key={number} {...rdata} />;
      default:
        return null;
    }
  }

  nextPage(evt) {
    let count;
    const direction = evt.direction;
    const rdata = this.props.app.rdata;
    if (direction.toLowerCase() === 'up') {
      count = rdata[`page${this.state.page}`].next || 0;
      if (!count) {
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        this.setState({
          page: count,
          fade: 'fadeup'
        });
      }
    } else if (direction.toLowerCase() === 'down') {
      count = rdata[`page${this.state.page}`].prev || 0;
      if (!count) {
        evt.preventDefault();
        evt.stopPropagation();
      } else {
        this.setState({
          page: count,
          fade: 'fadedown'
        });
      }
    }
  }
  render() {
    return (
      <div className="App">
        <CSSTransitionGroup
          transitionName={this.state.fade}
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}
        >
          {this.getPage()}
        </CSSTransitionGroup>
        <AlloyFinger onSwipe={this.nextPage}>
          <div className="nextPage" />
        </AlloyFinger>
      </div>
    );
  }
}

export default withRouter(Report);
