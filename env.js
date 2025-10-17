/* eslint-env node */
const z = require('zod');

const packageJSON = require('./package.json');
const path = require('path');
const APP_ENV = process.env.APP_ENV ?? 'development';
// eslint-disable-next-line no-undef
const envPath = path.resolve(__dirname, `.env.${APP_ENV}`);

require('dotenv').config({
  path: envPath,
});

/**
 * 2nd part: Define some static variables for the app
 * Such as: bundle id, package name, app name.
 *
 * You can add them to the .env file but we think it's better to keep them here as as we use prefix to generate this values based on the APP_ENV
 * for example: if the APP_ENV is staging, the bundle id will be com.wd-knox-starter-kit.staging
 */

// TODO: Replace these values with the current app

const BUNDLE_ID = 'com.knoxstarter'; // ios bundle id
const PACKAGE = 'com.knox_expo_starter_kit'; // android package name
const NAME = 'knox_expo_starter_kit'; // app name
const EXPO_ACCOUNT_OWNER = 'expo-owner'; // expo account owner
const EAS_PROJECT_ID = '00000-6fe7-4686-aa49-0000000000000'; // eas project id
const SCHEME = 'knox_expo_starter_kit'; // app scheme

/**
 * Added because of plugins throwing errors. Not a ts file.
 * We declare a function withEnvSuffix that will add a suffix to the variable name based on the APP_ENV
 * Add a suffix to variable env based on APP_ENV
 * @param {string} name
 * @returns  {string}
 */

const withEnvSuffix = (name) => {
  return APP_ENV === 'production' ? name : `${name}.${APP_ENV}`;
};

const client = z.object({
  APP_ENV: z.enum(['development', 'staging', 'production']),
  NAME: z.string(),
  SCHEME: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),

  API_URL: z.string(),
  WD_TOKEN: z.string(),
  SENTRY_DSN: z.string().min(1, 'SENTRY_DSN is required'),
});

const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
  SENTRY_ORG: z.string().min(1, 'SENTRY_ORG is required'),
  SENTRY_PROJECT: z.string().min(1, 'SENTRY_PROJECT is required'),
});

const _clientEnv = {
  APP_ENV,
  NAME: NAME,
  SCHEME: SCHEME,
  BUNDLE_ID: withEnvSuffix(BUNDLE_ID),
  PACKAGE: withEnvSuffix(PACKAGE),
  VERSION: packageJSON.version,

  API_URL: process.env.API_URL,
  WD_TOKEN: process.env.WD_TOKEN,
  SENTRY_DSN: process.env.SENTRY_DSN,
};

const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID,
  SENTRY_ORG: process.env.SENTRY_ORG,
  SENTRY_PROJECT: process.env.SENTRY_PROJECT,
};

const _env = {
  ..._clientEnv,
  ..._buildTimeEnv,
};

const merged = buildTime.merge(client);
const parsed = merged.safeParse(_env);

if (parsed.success === false) {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,

    `\n❌ Missing variables in .env.${APP_ENV} file, Make sure all required variables are defined in the .env.${APP_ENV} file.`,
    `\n💡 Tip: If you recently updated the .env.${APP_ENV} file and the error still persists, try restarting the server with the -c flag to clear the cache.`
  );
  throw new Error(
    'Invalid environment variables, Check terminal for more details '
  );
}

const Env = parsed.data;
const ClientEnv = client.parse(_clientEnv);

module.exports = {
  Env,
  ClientEnv,
  withEnvSuffix,
};
