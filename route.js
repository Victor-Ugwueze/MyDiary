import entries from './controllers/entryController';

module.exports = (app) => {
  app.use('/', entries);
};
