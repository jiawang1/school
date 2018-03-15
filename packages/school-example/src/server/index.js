import merge from 'lodash.merge';
// import GraphQLJSON from 'graphql-type-json';
// import mergeTypes from './mergeSchema/merge_type';
import userResolver from './user/resolver';
import contextResolver from './context/resolver';
import utilResolver from './utils/resolver';
import courseResolver from './courses/courseResolver';

const resolvers = merge(userResolver, contextResolver, utilResolver, courseResolver);
// const schema = mergeTypes([userSchema, contextSchema, utilSchema, courseSchema]);

export default resolvers;
