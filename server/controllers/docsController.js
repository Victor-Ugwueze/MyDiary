import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../docs/swagger';

const router = express.Router();

router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
export default router;
