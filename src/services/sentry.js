import Raven from 'raven-js';
import { secret } from 'constants';

export default () => {
  if (process.env.NODE_ENV === 'production') {
    Raven.config(secret.sentry).install();
    window.addEventListener('unhandledrejection', (e) => {
      console.error(e);
      Raven.captureException(e.reason);
    });

    window.addEventListener('error', (e) => {
      console.error(e);
      Raven.captureException(e.error);
    });
  }
};
