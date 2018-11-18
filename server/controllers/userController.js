import express from 'express';
import jwt from 'jsonwebtoken';
import validateAuth from '../helpers/validations/validateAuth';
import User from '../models/user';


const router = express.Router();

// Create a single entry

router.post('/login', validateAuth.login, (req, res) => {
  const errors = validateAuth.validationResult(req);
  if (errors.isEmpty()) {
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.doLogin()
      .then((result) => {
        switch (result.code) {
          case 2:
            {
              const payload = {
                userId: result.user.id,
              };
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
              res.status(200).json({
                status: 'success',
                message: 'You are logged in!',
                token,
                user: result.user,
              });
            }
            break;
          default:
            res.status(401).json({ status: 'failed', message: 'credentials mismatch' });
        }
      })
      .catch(() => {
        res.status(500).json({ status: 'failed', message: 'internal server error' });
      });
  } else {
    res.status(400).json({ status: 'failed', message: errors.array()[0].msg });
  }
});


router.post('/signup', validateAuth.singUp, (req, res) => {
  const errors = validateAuth.validationResult(req);

  if (errors.isEmpty()) {
    const user = new User();
    user.checkIfEmailExists(req.body)
      .then((emailExists) => {
        if (!emailExists) { // Email doesn't exist so signup user;
          user.doSignup()
            .then((createdUser) => {
              const payload = { userId: createdUser.id };
              const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1hr' });
              res.status(200).json(
                {
                  status: 'success',
                  token,
                  user: createdUser,
                  message: 'Account created ',
                },
              );
            })
            .catch(() => {
              res.status(500).json({ status: 'failed', message: 'Problem signing up' });
            });
        } else {
          res.status(422).json({ status: 'failed', message: 'email exist', email: emailExists.email });
        }
      });
  } else {
    res.status(400).json({ status: 'failed', message: errors.array()[0].msg });
  }
});

export default router;
