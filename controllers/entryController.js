import express from 'express';
import entries from '../models/entry';

const router = express.Router();

router.get('/api/v1/entries', (req, res) => {
  const response = {
    entries,
    request_url: req.url,
    status: 'ok',
  };
  res.status(200).json({ response });
});

module.exports = router;
