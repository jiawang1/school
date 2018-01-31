import { put } from 'truant-core';
import { troopClient } from '@school/troop-adapter';

const LOG_SUCCESS = 'logon/success';
const LOG_USER = 'logon/currentUser';
const LOG_FAILED = 'logon/failed';

/**
 *  construct initial state. this should be immutable object
 */
const initialState = {
  message: ''
};

export default {
  managedSaga: {
    sagaNamespace: 'logon',
    *logonSchool({ data }) {
      try {
        yield troopClient.postForm('/login/secure.ashx', data);
        yield put({
          type: LOG_SUCCESS,
          payload: { userName: data.userName, message: 'logon success' }
        });
      } catch (error) {
        console.error(error);
        yield put({ type: LOG_FAILED, payload: { message: 'logon failed cause by HTTP request' } });
      }
    },
    *getUser() {
      try {
        const response = yield troopClient.postForm(
          '/services/api/proxy/queryproxy?c=countrycode%3Dde%7Cculturecode%3Dzh-CN%7Cpartnercode%3DNone%7Csiteversion%3Ddevelopment%7Cstudentcountrycode%3Dde%7Clanguagecode%3Dcs',
          {
            q: 'student_level!ca06ddea-857d-4966-a55b-4d14641d9371.children,.levelTest'
          }
        );
        const data = JSON.parse(response);
        yield put({ type: LOG_USER, payload: data[0] });
      } catch (err) {
        console.log(err);
      }
    },
    *getUserByTroopAPI() {
      try {
        const response = yield troopClient.query(
          '/services/api/proxy/queryproxy',
          'student_level!ca06ddea-857d-4966-a55b-4d14641d9371.children,.levelTest|user!current'
        );
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    }
  },
  topSaga: {},
  reducer: (state = initialState, action) => {
    switch (action.type) {
      case LOG_SUCCESS:
        const { userName, message } = action.payload;
        return {
          ...state,
          userName,
          message
        };
      case LOG_FAILED:
        return {
          ...state,
          message: action.payload.message
        };
      case LOG_USER:
        return {
          ...state,
          userInfo: action.payload
        };
      default:
        return state;
    }
  }
};
