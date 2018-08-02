import { check, validationResult } from 'express-validator/check';

const validateEntry = {
  ValidateInput: [
    check('title', 'title is required and a minimum of 6 chracters')
      .isLength({ min: 6 }),
    check('body', 'body is required and a minimum of 6 chracters')
      .isLength({ min: 6 }),
  ],
  validationResult,
};
export default validateEntry;
