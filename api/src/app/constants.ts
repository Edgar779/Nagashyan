const dbs = {
  DEV: 'DEV',
  TEST_H: 'TEST_H',
  TEST_E: 'TEST_E',
  PROD: 'productionv1',
};

const DB = dbs.DEV;
let connectionString = null;
if (DB === dbs.PROD) {
  connectionString = ``;
} else {
  connectionString = `mongodb://localhost:27017`;
}

export const MONGO_CONN_STR = connectionString;
