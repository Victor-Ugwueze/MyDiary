import express from 'express';
import Entry from '../models/Entry';

const router = express.Router();

router.get('/api/v1/entries', (req, res) => {
  res.status(200).json({
    entries: Entry.getAll(),
    request_url: req.url,
    message: 'success',
  });
});

router.get('/api/v1/entries/:id', (req, res) => {
  const entry = Entry.find(req.params.id - 1);
  if (!entry) {
    res.status(404).json({ entry: {}, request_url: req.url, message: 'error' });
    return;
  }
  res.status(200).json({ entry, request_url: req.url, message: 'success' });
});

module.exports = router;
