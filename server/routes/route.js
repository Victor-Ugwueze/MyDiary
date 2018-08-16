import entryController from '../controllers/entryController';
import userController from '../controllers/userController';
import docsController from '../controllers/docsController';

import profileController from '../controllers/profileController';
import notificationController from '../controllers/notificationController';
import registerCronJob from '../helpers/cron-jobs/email-schedule';

const mountRouter = (app) => {
  app.use('/api/v1', profileController);
  app.use('/api/v1', entryController);
  app.use('/api/v1', notificationController);
  app.use('/auth', userController);
  app.use('/', docsController);
  app.get('/', (req, res) => {
    res.redirect('/api-docs');
  });
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'sorry, page not found' });
  });
  registerCronJob();
};

export default mountRouter;
