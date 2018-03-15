import { ApolloLink } from 'apollo-link';
import Observable from 'zen-observable';
import { graphql } from 'graphql-anywhere/lib/async';
import utils from './utils';

const troop = {};
['type', 'command', 'id'].forEach(key => {
  troop[key] = info => info.directives && info.directives.troop && info.directives.troop[key];
});

/**
 *  this method used to generate troop style query string
 * @param  {} selections : graphql AST selections. should include all query fields
 * @param  {} parent : parent data object
 */
export const constructTroopQuery = (selections, parent) => {
  if (!selections) return parent;

  let hasSibling = false;
  return selections.reduce((str, field) => {
    if (field.name.value === '__typename') return str;
    let query = str;
    if (field.selectionSet) {
      if (hasSibling) {
        query = `${query},${parent}.${field.name.value}`;
      } else {
        hasSibling = true;
        query = `${query}.${field.name.value}`;
      }
      return constructTroopQuery(field.selectionSet.selections, query);
    }
    return query;
  }, parent);
};
/**
 * @param  {} query
 * @param  {} field
 */
export const getSelection = (query, field) =>
  query.definitions[0] &&
  query.definitions[0].selectionSet &&
  query.definitions[0].selectionSet.selections &&
  query.definitions[0].selectionSet.selections.find(sel => sel.name.value === field);

/**
 * @param  {} directives
 */

export const getTypeFromDirective = directives => {
  let type = null;
  directives.some(_dir => {
    if (_dir.name.value === 'troop') {
      return _dir.arguments.some(arg => {
        if (arg.name.value === 'type') {
          type = arg.value.value;
          return true;
        }
        return false;
      });
    }
    return false;
  });
  return type;
};

/**
 * @param  {} resolvers : customize graphql resolvers , used to supply data for data type or fields.
 *                        This resolver has higher priority than default resolver.
 * @param  {} graphqlClient : request client shoudl provide methods query and mutate
 */
const createAsyncLink = (graphqlClient, resolvers = {}) => {
  const schema = { types: [] };

  const defaultQueryResolver = (fieldName, rootValue, args, { currentContext, query }, info) => {
    const id = args && args.id;
    if (!id) return null;

    const prefix = troop.type(info) || fieldName;
    const selection = getSelection(query, fieldName);
    const condition = constructTroopQuery(selection.selectionSet.selections, '');
    let __query = '';
    if (Array.isArray(id)) {
      __query = id.map(_id => `${prefix}!${_id}${condition}`).join('|');
    } else {
      __query = `${prefix}!${id}${condition}`;
    }
    return graphqlClient.query(__query, currentContext);
  };

  const getCommandFromCache = (cache, fieldName) => {
    if (
      cache &&
      cache.data &&
      cache.data.data &&
      cache.data.data['command:command!*'] &&
      cache.data.data['command:command!*'].results
    ) {
      const { results: { json } } = cache.data.data['command:command!*'];
      return json ? json[fieldName] : null;
    }
    return null;
  };

  const defaultMutationResolver = async (
    fieldName,
    rootValue,
    args,
    { currentContext, query, cache },
    info
  ) => {
    if (cache && cache.data && cache.data.data) {
      const commandKey = troop.command(info);
      const command = getCommandFromCache(cache, commandKey);
      const mutationSelection = getSelection(query, fieldName);
      const body = mutationSelection.arguments.reduce(
        (_body, arg) => Object.assign({}, _body, { [arg.name.value]: args[arg.name.value] }),
        // (_body, arg) => ({ ..._body, [arg.name.value]: args[arg.name.value] }),
        {}
      );
      if (command) {
        const res = await graphqlClient.mutate(command.url, body, {
          troopContext: currentContext,
          headers: { 'content-type': command.contentType }
        });
        const queryType = troop.type(info);
        if (queryType) {
          const id = troop.id(info) || args.id;
          if (!id) {
            throw new Error(`only query ${queryType} supplied, but no ID`);
          }
          // const querySel = Object.assign({}, mutationSelection, {
          //   name: { kind: 'name', value: queryType }
          // });

          const querySel = { ...mutationSelection, name: { kind: 'name', value: queryType } };
          const selectionSet = { kind: 'SelectionSet', selections: [querySel] };

          // const def = Object.assign({}, query.definitions[0], {
          //   kind: 'name',
          //   value: queryType,
          //   operation: 'query',
          //   selectionSet
          // });
          const def = {
            ...query.definitions[0],
            kind: 'name',
            value: queryType,
            operation: 'query',
            selectionSet
          };

          const folkQuery = { definitions: [def], kind: 'Document' };
          // eslint-disable-next-line
          return resolver(queryType, {}, { id }, { currentContext, query: folkQuery, cache }, {});
        }
        return res || null; // must no undefined return
      }
    }
    return null;
  };

  const defaultResolver = (fieldName, rootValue, args, context, info) => {
    if (context.query.definitions[0].operation === 'query') {
      return defaultQueryResolver(fieldName, rootValue, args, context, info);
    }
    return defaultMutationResolver(fieldName, rootValue, args, context, info);
  };

  const __generate = oService => {
    Object.keys(oService).forEach(key => {
      const _obj = { name: key };
      if (utils.isObject(oService[key])) {
        _obj.type = 'Object';
        schema.types.push(_obj);
        __generate(oService[key]);
      } else if (utils.isFunction(oService[key])) {
        _obj.type = 'Function';
        schema.types.push(_obj);
      }
    });
  };
  const generateServices = oService => {
    if (schema.isReady) return schema;

    __generate(oService);
    schema.isReady = true;
    return schema;
  };

  const resolver = (fieldName, rootValue = {}, args, context, info) => {
    if (fieldName === '__schema') return generateServices(resolvers);
    const fieldValue = rootValue[fieldName];

    // If fieldValue is defined, server returned a value
    if (fieldValue !== undefined) return fieldValue;
    // do not resolve __typename in resolver, just generate __typename after this method
    if (fieldName === '__typename') return null;

    // Look for the field in the custom resolver mapresolvers
    const { query } = context;
    let resolverMap = null;

    if (query.definitions[0].operation === 'query') {
      resolverMap = resolvers.Query || resolvers.query;
    } else {
      resolverMap = resolvers.Mutation || resolvers.mutation;
    }

    if (resolverMap && resolverMap[fieldName]) {
      return resolverMap[fieldName](rootValue, args, context, info);
    }
    return defaultResolver(fieldName, rootValue, args, context, info);
  };

  const findDefination = (name, defs) => defs.find(def => def.name.value === name);

  const generateType = (data, definations, type) => {
    if (Array.isArray(data)) {
      data.forEach(__data => {
        if (utils.isObject(__data)) {
          // eslint-disable-next-line
          __data.__typename = type;
          generateType(__data, definations);
        }
      });
    } else {
      Object.keys(data).forEach(k => {
        if (Array.isArray(data[k]) || utils.isObject(data[k])) {
          const def = findDefination(k, definations);
          const troopType = getTypeFromDirective(def.directives) || k;

          if (utils.isObject(data[k])) {
            // eslint-disable-next-line no-param-reassign
            data[k].__typename = troopType;
          }
          /* for some dynamic fields case ( troop command ), selectionSet maybe not match with data
              so here must check def.selectionSet
           */
          if (def.selectionSet) {
            generateType(data[k], def.selectionSet.selections, troopType);
          }
        }
      });
    }
  };

  return new class AsyncLink extends ApolloLink {
    request(operation) {
      const { setContext, query } = operation;
      let context = null;
      // context = Object.assign({}, operation.getContext(), { query });
      context = { ...operation.getContext(), query };
      setContext(context);
      return new Observable(observer => {
        const observerErrorHandler = observer.error.bind(observer);
        const sub = Observable.of({
          data: {}
        }).subscribe({
          next: ({ data, errors }) => {
            graphql(resolver, operation.query, data, operation.getContext(), operation.variables)
              .then(nextData => {
                generateType(nextData, operation.query.definitions[0].selectionSet.selections);
                observer.next({
                  data: nextData,
                  errors
                });
                observer.complete();
              })
              .catch(err => observerErrorHandler(err));
          },
          error: observerErrorHandler
        });

        return () => {
          if (sub) sub.unsubscribe();
        };
      });
    }
  }();
};

export default createAsyncLink;
