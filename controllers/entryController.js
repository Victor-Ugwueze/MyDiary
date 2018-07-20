import express from 'express';
import { check, validationResult } from 'express-validator/check';
import Entry from '../models/entry';


const router = express.Router();
// get a refrence of Entry model

const entry = new Entry();
// get all diary entry
router.get('/api/v1/entries', (req, res) => {
  // const entry = new Entry();
  res.status(200).json({
    entries: entry.findAll(),
    request_url: req.url,
    message: 'success',
  });
});

// get a single entry

router.get('/api/v1/entries/:id', (req, res) => {
  // const entry = new Entry();
  entry.find(req.params.id)
    .then((result) => {
      res.status(200).json({ result, message: 'success' });
    })
    .catch((err) => {
      res.status(404).json({ entry: {}, message: err.message });
    });
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
      const result = entry.save({
        title: req.body.title,
        body: req.body.body,
      });
      res.status(201).json({ message: 'success', result });
    } else {
      res.status(400).json({ message: req.body.title, error: errors.array() });
    }
  });

// Update entry

router.put('/api/v1/entries/:id', [
  check('title', 'title is required')
    .isLength({ min: 1 }),
  check('body', 'body is required')
    .isLength({ min: 1 }),
],
(req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    // const entry = new Entry();
    entry.find(req.params.id)
      .then((item) => {
        entry.update(item, req.body);
        res.status(200).json({ message: 'success' });
      })
      .catch(() => {
        res.status(404).json({ message: 'error' });
      });
  } else {
    res.status(400).json({ message: 'error', error: errors.array() });
  }
});

// Delete entry
router.delete('/api/v1/entries/:id', (req, res) => {
  entry.delete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(() => {
      res.status(404).json({ message: 'error' });
    });
});

export default router;
