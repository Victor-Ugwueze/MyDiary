import entryController from '../controllers/entryController';
import userController from '../controllers/userController';
import docsController from '../controllers/docsController';

import profileController from '../controllers/profileController';


const mountRouter = (app) => {
  app.use('/api/v1', profileController);
  app.use('/api/v1', entryController);
  app.use('/auth', userController);
  app.use('/', docsController);
  app.get('*', (req, res) => {
    res.status(404).json({ message: 'sorry, page not found' });
  });
};

export default mountRouter;
