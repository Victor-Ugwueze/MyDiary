
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import v1Router from './api/routes/v1/route';
import getRequestApiVersion from './api/routes/utils/util';

const app = express();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  const versionRoute = getRequestApiVersion(req.path);
  app.use(`/api/${versionRoute}`, v1Router);
  next();
});

export default app;
