import entryController from '../controllers/entryController';
import userController from '../controllers/userController';
import docsController from '../controllers/docsController';


const mountRouter = (app) => {
  app.use('/api/v1', entryController);
  app.use('/auth', userController);
  app.use('/', docsController);
};

export default mountRouter;
