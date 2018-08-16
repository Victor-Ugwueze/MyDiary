
import express from 'express';
import logger from 'morgan';
import bodyParser from 'body-parser';
import mountRouter from './routes/route';


const app = express();
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Credentials: true');
  res.header('Access-Control-Allow-Methods', 'POST,GET,PUT,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, page, perPage, Access-Control-Allow-Headers, Authorization, X-Requested-With, x-access-token');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
mountRouter(app);
export default app;
