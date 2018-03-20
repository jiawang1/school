import merge from 'lodash.merge';
import utilResolver from './utils/resolver';
import logonResolver from './logon/logonResolver';

const resolvers = merge(utilResolver, logonResolver);

export default resolvers;
