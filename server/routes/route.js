import entryController from '../controllers/entryController';
import userController from '../controllers/userController';


const mountRouter = (app) => {
  app.use('/api/v1', entryController);
  app.use('/auth', userController);
};

export default mountRouter;
