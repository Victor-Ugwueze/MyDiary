import express from 'express';
import verifyToken from '../helpers/verifyAuthentication';
import validateProfileUpdate from '../helpers/validations/validateProfile';
import Profile from '../models/profile';


const router = express.Router();

// Verify User Token;
verifyToken(router);

// Update User Profile
router.put('/users/profile', validateProfileUpdate.profileUpdate, (req, res) => {
  const errors = validateProfileUpdate.validationResult(req);
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  if (errors.isEmpty()) {
    profile.updatUserProfile(req)
      .then((result) => {
        if (result.rowCount !== 1) {
          throw new Error('Problem updating profile');
        }
        res.status(200).json({ status: 'Success', user: result.rows[0], message: 'Profile Updated SuccesFully'});
      })
      .catch((err) => {
        res.status(500).json({ status: 'failed', message: err.message });
      });
  } else {
    res.status(400).json({ status: 'failed', message: errors.array()[0].msg });
  }
});


router.get('/users/profile', (req, res) => {
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  profile.getUserProfile(id, req)
    .then((user) => {
      if (!user) {
        throw new Error("Couldn't get user profile");
      }
      res.status(200).json({ status: 'Success', user, message: 'User found' });
    })
    .catch(() => {
      res.status(500).json({ status: 'failed', message: "Couldn't get user details" });
    });
});

router.get('/users/profile/entries', (req, res) => {
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  profile.getUserEntryCount(id, req)
    .then((entries) => {
      if (!(/[0-9]/.test(entries))) {
        throw new Error();
      }
      res.status(200).json({ status: 'Success', entries, message: 'Number of entries found' });
    })
    .catch(() => {
      res.status(500).json({ status: 'failed', message: 'Problem getting number of entries' });
    });
});

export default router;
