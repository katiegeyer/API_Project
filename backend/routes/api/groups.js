// const express = require('express');
// const router = express.Router();
// const { OP } = require('sequelize');
// const bcrypt = require('bcryptjs');

// const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
// const { User, Group, Membership, Event, Venue } = require('../../db/models');
// const { check } = require('express-validator');
// const { handleValidationErrors } = require('../../utils/validation');
// const group = require('../../db/models/group');


// const requireAuth = function (req, _res, next) {
//     if (req.user) return next();

//     const err = new Error('Authentication required');
//     err.title = 'Authentication required';
//     err.errors = { message: 'Authentication required' };
//     err.status = 401;
//     return next(err);
// };

// //Get all groups
// router.get('/', async (req, res, next) => {
//     const groups = await Group.findAll();
//     return res.status(200).json(groups)
// })


// //Get all Groups joined or organized by the Current User
// router.get('/', async (req, res, next) => {
//     //requireAuth(req.user) to check if user is authenticated
//     const user = req.user;
//     const groups = await user.getGroups({
//         attributes: ['id', 'organizerId', 'name', 'about', 'type', 'private', 'city', 'state', 'createdAt', 'updatedAt'],
//         include: [{
//             model: GroupImage,
//             attributes: ['url'],
//             as: 'Images',
//             limit: 1
//         }]
//     });
//     const data = groups.map(group => {
//         const previewImage = group.Images.length > 0 ? group.Images[0].url : null; //is this necessary? it technically allowNull:false
//         const numMembers = group.Memberships.length;
//         return {
//             id: group.id,
//             organizerId: group.organizerId,
//             name: group.name,
//             about: group.about,
//             type: group.type,
//             private: group.private,
//             city: group.city,
//             state: group.state,
//             createdAt: group.createdAt,
//             updatedAt: group.updatedAt,
//             numMembers,
//             previewImage
//         }
//     });
//     res.status(200).json({ data });
// })

// router.get('/', async (req, res, next) => {


// module.exports = router;
