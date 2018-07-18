import express from 'express';
import { check, validationResult } from 'express-validator/check';
import EntryDb from '../models/entry';


const router = express.Router();

// get all diary entry
router.get('/api/v1/entries', (req, res) => {
  res.status(200).json({
    entries: EntryDb.getAll(),
    request_url: req.url,
    message: 'success',
  });
});

// get a single entry

router.get('/api/v1/entries/:id', (req, res) => {
  const entry = EntryDb.find(req.params.id);
  if (!entry) {
    res.status(404).json({ entry: {}, request_url: req.url, message: 'error' });
    return;
  }
  res.status(200).json({ entry, request_url: req.url, message: 'success' });
});

// Create a single entry

router.post('/api/v1/entries',
  [
    check('title', 'title is required')
      .isLength({ min: 1 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
      const entry = EntryDb.save({
        title: req.body.title,
        body: req.body.body || '',
      });
      res.status(201).json({ message: 'success', result: entry });
    } else {
      res.status(400).json({ message: 'error', error: errors.array() });
    }
  });

router.put('/api/v1/entries', [
  check('title', 'title is required')
    .isLength({ min: 1 }),
  check('body', 'body is required')
    .isLength({ min: 1 }),
],
(req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const entry = EntryDb.find(req.body.id);
    if (entry) {
      entry.title = req.body.title;
      entry.body = req.body.body;
      EntryDb.update(entry);
      res.status(200).json({ message: 'success', entry });
    } else {
      res.status(400).json({ message: 'erro', error: 'request not found' });
    }
  } else {
    res.status(400).json({ message: 'erro', error: errors.array() });
  }
});
export default router;
