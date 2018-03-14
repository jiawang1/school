import { ApolloLink } from 'apollo-link';
import Observable from 'zen-observable';

const createProgressLink = progresshandler =>
  new ApolloLink((option, forward) => {
    console.log(option);
    return forward(option);
  });

export default createProgressLink;
