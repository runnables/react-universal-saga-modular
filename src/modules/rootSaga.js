import { fork, join } from 'redux-saga/effects';
import _ from 'lodash';

// IMPORT ALL SAGA WATCHERS
import {
  watchNavigate
} from './common/sagas';
import {
  watchLoadUserPage,
  watchLoadRepoPage,
  watchLoadMoreStargazers,
  watchLoadMoreStarred
} from './github/sagas';

// CUSTOM METHOD FOR USAGE AT server.js TO RUN SAGAS ON SERVER SIDE (e.g. fetch data)
export const waitAll = (sagas) => function* genTasks() {
  const tasks = yield _.map(sagas, ([saga, ...params]) => fork(saga, ...params));
  yield _.map(tasks, join);
};

// CONSOLIDATE AND EXPORT ALL SAGAS
export default function* rootSaga() {
  yield [
    fork(watchNavigate),
    fork(watchLoadUserPage),
    fork(watchLoadRepoPage),
    fork(watchLoadMoreStarred),
    fork(watchLoadMoreStargazers)
  ];
}
