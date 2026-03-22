import { body, validationResult } from 'express-validator';

const registerValidation = [
  body('username')
    .trim()
    .notEmpty().withMessage('username is required')
    .isLength({ min: 3 }).withMessage('username must be at least 3 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be valid'),
  body('password')
    .notEmpty().withMessage('password is required')
    .isLength({ min: 6 }).withMessage('password must be at least 6 characters'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];


const loginValidation = [
  body('email')
    .trim() 
  
  .notEmpty().withMessage('email is required')
    .isEmail().withMessage('email must be valid'),
  body('password')
    .notEmpty().withMessage('password is required'),
    ]
export { registerValidation, loginValidation  };