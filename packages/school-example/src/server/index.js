import merge from 'lodash.merge';
//import GraphQLJSON from 'graphql-type-json';
import mergeTypes from './mergeSchema/merge_type';
import userResolver, { userSchema } from './user/resolver';
import contextResolver, { contextSchema } from './context/resolver';
import utilResolver, { utilSchema } from './utils/resolver';
import courseResolver, { courseSchema } from './courses/courseResolver';

const resolver = merge(userResolver, contextResolver, utilResolver, courseResolver);
//const schema = mergeTypes([userSchema, contextSchema, utilSchema, courseSchema]);

export { resolver };
