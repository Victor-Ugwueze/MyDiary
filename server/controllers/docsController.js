import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger';

const router = express.Router();

const options = {
  customCss: '.swagger-ui .topbar { display: none }',
};

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options));
export default router;
