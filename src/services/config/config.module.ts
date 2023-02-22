import { config } from 'dotenv';
import firebase, { ServiceAccount } from 'firebase-admin';
import serviceAccount from './serviceAccount.json';

config({ path: `${process.cwd()}/.env` });

export default {
  PORT: Number(process.env.PORT) ?? 3333,
  PROXY_URL: process.env.PROXY_URL,
  CRM_URL: process.env.CRM_URL,
  APP_URL: `${process.env.APP_DOMAIN}:${Number(process.env.PORT)}`,
  FIREBASE_DB: firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount as ServiceAccount),
    databaseURL: process.env.DATABASE_URL,
  }),
  APP_SECRET: process.env.APP_SECRET,
  IG_URL: process.env.IG_URL,
  VERIFY_TOKEN: process.env.VERIFY_TOKEN,
  SSL_KEY_PATH: process.env.SSL_KEY_PATH,
  SSL_CERT_PATH: process.env.SSL_CERT_PATH,
};
