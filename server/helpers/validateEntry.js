import { check, validationResult } from 'express-validator/check';

const validateEntry = {
  addEntry: [
    check('title', 'title is required')
      .isLength({ min: 1 }),
  ],
  updateEntry: [
    check('title', 'title is required')
      .isLength({ min: 1 }),
    check('body', 'body is required')
      .isLength({ min: 1 }),
  ],
  validationResult,
};
export default validateEntry;
