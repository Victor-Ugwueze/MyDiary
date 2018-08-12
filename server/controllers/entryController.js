import express from 'express';
import Entry from '../models/entry';
import validateEntry from '../helpers/validations/validateEntry';
import verifyToken from '../helpers/verifyAuthentication';

const router = express.Router();
// get a refrence of Entry model
// Middleware to check token and append userId to req
verifyToken(router);
const entry = new Entry();
// get all diary entry
router.get('/entries', (req, res) => {
  entry.userId = req.body.userId;
  const { page } = req.query;
  const { perPage } = req.query;
  if (page || perPage) {
    if ((page < 1) || (perPage < 1)
      || Number.isNaN(parseInt(page, 10))
      || Number.isNaN(parseInt(perPage, 10))
    ) {
      res.status(400).json({ status: 'failed', message: 'Problem in query construction' });
      return;
    }
  }
  entry.findAll(page, perPage)
    .then((entries) => {
      if (entries.name) {
        throw new Error();
      }
      res.status(200).json({ status: 'success', entries });
    })
    .catch(() => {
      res.status(500).json({ status: 'failed', message: 'Problem getting entries' });
    });
});

// get a single entry

router.get('/entries/:id', (req, res) => {
  entry.userId = req.body.userId;

  entry.find(req.params.id)
    .then((dairyEntry) => {
      if (dairyEntry) {
        res.status(200).json({ dairyEntry, status: 'success', message: 'Entry found' });
        return;
      }
      res.status(404).json({ status: 'success', message: 'Entry not found', dairyEntry: {} });
    })
    .catch(() => {
      res.status(500).json({ status: 'failed', message: 'Problem getting entry' });
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
      res.status(200).json({ status: 'success', message: 'Entry created', createdEntry });
    })
      .catch(() => {
        res.status(500).json({ status: 'failed', message: 'Problem adding entry' });
      });
  } else {
    res.status(400).json(
      {
        status: 'failed',
        message: errors.array()[0].msg,
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
          res.status(200).json({ status: 'success', message: 'Entry updated successfully', updatedEntry });
          return;
        }
        res.status(404).json({ status: 'success', message: 'Entry not found' });
      })
      .catch(() => {
        res.status(500).json({ status: 'failed', message: 'problem updating entry' });
      });
  } else {
    res.status(422).json({ status: 'failed', message: errors.array()[0].msg });
  }
});

// Delete entry
router.delete('/entries/:id', (req, res) => {
  entry.userId = req.body.userId;
  entry.delete(req.params.id)
    .then((result) => {
      if (result.rowCount) {
        res.status(200).json({ status: 'success', message: 'Entry successfully deleted' });
        return;
      }
      res.status(404).json({ status: 'success', message: 'Entry not found' });
    })
    .catch(() => {
      res.status(500).json({ status: 'failed', message: 'Problem deleting entry' });
    });
});

export default router;
