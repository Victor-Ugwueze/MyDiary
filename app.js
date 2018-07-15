
import express from 'express';
import logger from 'morgan';
import mountRouter from './route';

const app = express();

mountRouter(app);
app.use(logger('dev'));

module.exports = app;
