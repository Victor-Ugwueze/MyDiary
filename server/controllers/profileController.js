import express from 'express';
import verifyToken from '../helpers/verifyAuthentication';
import Profile from '../models/profile';


const router = express.Router();

// Verify User Token;
verifyToken(router);

// Update User Profile
router.post('/users/profile', (req, res) => {
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  profile.updatUserProfile(req)
    .then((user) => {
      res.status(200).json({ message: 'success', user });
    })
    .catch(() => {
      res.status(500).json({ message: 'server error' });
    });
});


router.get('/users/profile', (req, res) => {
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  profile.getUserProfile(id, req)
    .then((user) => {
      if (!user) {
        res.status(500).json({ message: "couldn't get user details " });
        return;
      }
      res.status(200).json({ message: 'success', user });
    })
    .catch(() => {
      res.status(500).json({ message: "couldn't get user details" });
    });
});

router.get('/users/profile/entries', (req, res) => {
  const id = req.body.userId;
  const profile = new Profile();
  profile.userId = id;
  profile.getUserEntryCount(id, req)
    .then((entries) => {
      res.status(200).json({ message: 'success', entries });
    })
    .catch(() => {
      res.status(500).json({ message: "couldn't get user entries" });
    });
});

export default router;
