import express from 'express';
import EntryDb from '../models/Entry';
// import { Entry, EntryDb } from '../utils/EntryUtils';

const router = express.Router();

router.get('/api/v1/entries', (req, res) => {
  res.status(200).json({
    entries: EntryDb.getAll(),
    request_url: req.url,
    message: 'success',
  });
});

router.get('/api/v1/entries/:id', (req, res) => {
  const entry = EntryDb.find(req.params.id - 1);
  if (!entry) {
    res.status(404).json({ entry: {}, request_url: req.url, message: 'error' });
    return;
  }
  res.status(200).json({ entry, request_url: req.url, message: 'success' });
});

router.post('/api/v1/entries', (req, res) => {
  const entry = {
    title: req.body.title,
    body: req.body.body,
  };
  EntryDb.validate(entry)
    .then((db) => {
      const result = db.save(entry);
      if (result) {
        res.status(201).json({ message: 'success', result });
      }
    })
    .catch((err) => {
      const errors = {
        fields: {
          title: err.message,
        },
      };
      res.status(200).json({ errors });
    });
});

export default router;
