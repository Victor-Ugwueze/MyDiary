import express from 'express';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator/check';
import User from '../models/user';


const router = express.Router();

// Create a single entry
const valideteLoginRule = [
  check('email', 'email is required')
    .isLength({ min: 1 }),
  check('password', 'password is required')
    .isLength({ min: 6 }),
];
router.post('/login', valideteLoginRule, (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const user = new User();
    user.email = req.body.email;
    user.password = req.body.password;
    user.doLogin()
      .then((result) => {
        const payload = {
          userId: result.id,
        };
        const token = jwt.sign(payload, 'secret', { expiresIn: '1hr' });
        res.status(200).json({ message: 'success', token });
      })
      .catch((err) => {
        res.status(400).json({ message: err });
      });
  } else {
    res.status(400).json({ message: 'error', errors: errors.array() });
  }
});

// Update entry
const validateSignupRule = [
  check('firstName', 'firstaname is required')
    .isLength({ min: 1 }),
  check('lastName', 'lastname is required')
    .isLength({ min: 1 }),
  check('email', 'email is required')
    .isLength({ min: 1 }),
  check('password', 'invalid password')
    .isLength({ min: 6 })
    .custom((value, { req, loc, path }) => {
      if (value !== req.body.confirmPassword) {
        throw new Error("Passwords don't match");
      } else {
        return value;
      }
    }),
];

router.post('/signup', validateSignupRule, (req, res) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    const user = new User();
    user.checkIfEmailExists(req.body)
      .then((emailExists) => {
        if (!emailExists) { // Email doesn't exist so signup user;
          user.doSignup()
            .then((userId) => {
              const payload = {
                userId,
              };
              const token = jwt.sign(payload, 'secret', { expiresIn: '1hr' });
              res.status(200).json({ message: 'success', token });
            });
        } else {
          res.status(422).json({ message: 'email exist', email: emailExists.email });
        }
      });
  } else {
    res.status(400).json({ message: 'error', error: errors.array() });
  }
});

export default router;
