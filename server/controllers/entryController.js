import express from 'express';
import Entry from '../models/entry';
import validateEntry from '../helpers/validateEntry';
import verifyToken from '../helpers/verifyAuthentication';

const router = express.Router();
// get a refrence of Entry model
// Middleware to check token
verifyToken(router);
const entry = new Entry();
// get all diary entry
router.get('/entries', (req, res) => {
  // const entry = new Entry();
  res.status(200).json({
    entries: entry.findAll(),
    request_url: req.url,
    message: 'success',
  });
});

// get a single entry

router.get('/entries/:id', (req, res) => {
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

router.post('/entries', validateEntry.addEntry, (req, res) => {
  const errors = validateEntry.validationResult(req);
  if (errors.isEmpty()) {
    entry.save({
      title: req.body.title,
      body: req.body.body,
    }).then((result) => {
      const createdEntry = result.rows[0];
      createdEntry.created_at = new Date(createdEntry.created_at).toDateString();
      res.status(200).json({ message: 'success', createdEntry });
    })
      .catch(() => {
        res.status(500).json({ message: 'error' });
      });
  } else {
    res.status(400).json({ message: 'error', error: errors.array() });
  }
});

// Update entry

router.put('/entries/:id', validateEntry.updateEntry, (req, res) => {
  const errors = validateEntry.validationResult(req);
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
router.delete('/entries/:id', (req, res) => {
  entry.delete(req.params.id)
    .then(() => {
      res.status(200).json({ message: 'success' });
    })
    .catch(() => {
      res.status(404).json({ message: 'error' });
    });
});

export default router;
