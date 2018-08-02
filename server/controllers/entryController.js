import express from 'express';
import Entry from '../models/entry';
import validateEntry from '../helpers/validateEntry';
import verifyToken from '../helpers/verifyAuthentication';

const router = express.Router();
// get a refrence of Entry model
// Middleware to check token and append userId to req
verifyToken(router);
const entry = new Entry();
// get all diary entry
router.get('/entries', (req, res) => {
  entry.userId = req.body.userId;
  entry.findAll(req)
    .then((entries) => {
      res.status(200).json({ message: 'success', entries });
    })
    .catch(() => {
      res.status(500).json({ message: 'internal server error' });
    });
});

// get a single entry

router.get('/entries/:id', (req, res) => {
  entry.userId = req.body.userId;

  entry.find(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json({ result, message: 'success' });
        return;
      }
      res.status(404).json({ message: 'entry not found' });
    })
    .catch(() => {
      res.status(500).json({ message: 'internal error' });
    });
});

// Create a single entry

router.post('/entries', validateEntry.ValidateInput, (req, res) => {
  const errors = validateEntry.validationResult(req);
  if (errors.isEmpty()) {
    entry.save({
      title: req.body.title,
      body: req.body.body,
      userId: req.body.userId,
    }).then((result) => {
      const createdEntry = result.rows[0];
      createdEntry.created_at = new Date(createdEntry.created_at).toDateString();
      res.status(200).json({ message: 'success', createdEntry });
    })
      .catch(() => {
        res.status(500).json({ message: 'internal server error' });
      });
  } else {
    res.status(400).json(
      {
        message: 'error',
        errors: [errors.array()[0].msg],
      },
    );
  }
});

// Update entry

router.put('/entries/:id', validateEntry.ValidateInput, (req, res) => {
  const errors = validateEntry.validationResult(req);
  if (errors.isEmpty()) {
    entry.userId = req.body.userId;
    entry.update(req)
      .then((updatedEntry) => {
        if (updatedEntry) {
          res.status(200).json({ message: 'success', updatedEntry });
          return;
        }
        res.status(404).json({ message: 'entry not found' });
      })
      .catch(() => {
        res.status(500).json({ message: 'failed', error: 'internal server error' });
      });
  } else {
    res.status(422).json({ message: 'failed', error: errors.array()[0].msg });
  }
});

// Delete entry
router.delete('/entries/:id', (req, res) => {
  entry.userId = req.body.userId;
  entry.delete(req.params.id)
    .then((result) => {
      if (result.rowCount) {
        res.status(200).json({ message: 'success' });
        return;
      }
      res.status(404).json({ message: 'entry not found' });
    })
    .catch(() => {
      res.status(500).json({ message: 'internal error' });
    });
});

export default router;
