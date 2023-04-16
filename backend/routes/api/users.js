const express = require('express');
const bcrypt = require('bcryptjs');

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();


const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
// where do we stash the current user info in the backend
// router.post(
//     '',
//     validateSignup,
//     async (req, res) => {
//         const { email, password, username, firstName, lastName } = req.body;
//         const hashedPassword = bcrypt.hashSync(password);
//         const user = await User.create({ email, username, firstName, lastName, hashedPassword });

//         const safeUser = {
//             id: user.id,
//             email: user.email,
//             username: user.username,
//             firstName: user.firstName,
//             lastName: user.lastName,
//         };

//         await setTokenCookie(res, safeUser);

//         return res.json({
//             user: safeUser
//         });
//     }
// );

router.post(
  "",
  validateSignup,
  async (req, res) => {
    const { email, password, username, firstName, lastName } = req.body;
    const hashedPassword = bcrypt.hashSync(password);
    try {
      const user = await User.create({ email, username, firstName, lastName, hashedPassword });

      const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
      };

      await setTokenCookie(res, safeUser);

      return res.json({
        user: safeUser,
      });
    } catch (err) {
      if (err.name === "SequelizeUniqueConstraintError") {
        const errorMessages = Object.values(err.errors).map(error => error);
        return res.status(400).json({ errors: errorMessages });
      }
      // Handle other errors if necessary
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);


module.exports = router;
