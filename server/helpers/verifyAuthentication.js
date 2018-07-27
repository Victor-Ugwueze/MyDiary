import jwt from 'jsonwebtoken';

const verifyToken = (router) => {
  router.use((req, res, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (!token) {
      res.status(403).json({ message: 'No Token' });
    } else {
      jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
          res.status(401).json({ message: 'Failed to authenticate', err, decoded });
          return;
        }
        next();
      });
    }
  });
};

export default verifyToken;
