import helmet from 'helmet';

const defaultDirectives = helmet.contentSecurityPolicy.getDefaultDirectives();

defaultDirectives['script-src'] = [
  "'self'",
  "'unsafe-inline'",
  'https://cdn.redoc.ly',
];

export const CSP_CONFIG = {
  contentSecurityPolicy: {
    directives: {
      ...defaultDirectives,
      workerSrc: ["'self'", 'blob:'],
    },
  },
};
