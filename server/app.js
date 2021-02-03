import express from 'express';
import bodyParser from 'body-parser';

// third-party libraries
import session from 'express-session';
import cors from 'cors';
import dotenv from 'dotenv';
import mountRouter from './routes/route';


dotenv.config();


// Create global app object
const app = express();


app.use(cors());


// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(require('method-override')());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(`${__dirname}/public`));
app.use(
  session({
    secret: 'mydiary',
    cookie: { maxAge: 60000 },
    resave: false,
    saveUninitialized: false,
  }),
);


mountRouter(app);

// / catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});


export default app;
