import express from 'express';
import entries from '../models/entry';

const router = express.Router();

router.get('/api/v1/entries', (req, res) => {
  res.json(entries);
});

module.exports = router;
