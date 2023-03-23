// const express = require('express');
// const router = express.Router();
// const { OP } = require('sequelize');
// const bcrypt = require('bcryptjs');

// const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { User, Group, Membership, Event, Venue } = require('../../db/models');
// // const { check } = require('express-validator');
// // const { handleValidationErrors } = require('../../utils/validation');
// // const group = require('../../db/models/group');


// // const requireAuth = function (req, _res, next) {
// //     if (req.user) return next();

// //     const err = new Error('Authentication required');
// //     err.title = 'Authentication required';
// //     err.errors = { message: 'Authentication required' };
// //     err.status = 401;
// //     return next(err);
// // };

// //Get all groups
// router.get('/', async (req, res, next) => {
//     const groups = await Group.find();
//     return res.status(200).json(groups)
// })

// module.exports = router;
