import entryController from '../controllers/entryController';


const mountRouter = (app) => {
  app.use('/api/v1', entryController);
};

export default mountRouter;
