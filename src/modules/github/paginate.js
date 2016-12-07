import merge from 'lodash/merge';
import union from 'lodash/union';
import _ from 'lodash';

// Creates a reducer managing pagination, given the action types to handle,
// and a function telling how to extract the key from an action.
export default function paginate({ types, mapActionToKey }) {
  if (!_.isArray(types) || types.length !== 3) {
    throw new Error('Expected types to be an array of three elements.');
  }
  if (!_.every(types, (t) => _.isString(t))) {
    throw new Error('Expected types to be strings.');
  }
  if (!_.isFunction(mapActionToKey)) {
    throw new Error('Expected mapActionToKey to be a function.');
  }

  const [requestType, successType, failureType] = types;

  function updatePagination(state = {
    isFetching: false,
    nextPageUrl: undefined,
    pageCount: 0,
    ids: []
  }, action) {
    switch (action.type) {
      case requestType:
        return merge({}, state, {
          isFetching: true
        });
      case successType:
        return merge({}, state, {
          isFetching: false,
          ids: union(state.ids, action.response.result),
          nextPageUrl: action.response.nextPageUrl,
          pageCount: state.pageCount + 1
        });
      case failureType:
        return merge({}, state, {
          isFetching: false
        });
      default:
        return state;
    }
  }

  return function updatePaginationByKey(state = {}, action) {
    switch (action.type) {
      case requestType:
      case successType:
      case failureType: {
        const key = mapActionToKey(action);
        if (!_.isString(key)) {
          throw new Error('Expected key to be a string.');
        }
        return merge({}, state, {
          [key]: updatePagination(state[key], action)
        });
      }
      default: {
        return state;
      }
    }
  };
}
