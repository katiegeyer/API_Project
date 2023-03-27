const express = require('express');
const router = express.Router();
const { Op, useInflection } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Venue, GroupImage, Event } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');
const user = require('../../db/models/user');
const venue = require('../../db/models/venue');
const { Router } = require('express');


// const requireMembership = async (req, res, next) => {
//     const { user } = req;
//     const { group } = req;
//     const groupId = req.params.groupId;
//     const membership = await Membership.findOne({
//         where: {
//             userId: user.id,
//             groupId: group.id,
//         },
//     });
//     if (!membership) {
//         return res.status(403).json({ message: "User is not a member of this group" });
//     }
//     req.membership = membership;
//     return next();
// };

// const requireHost = async (req, res, next) => {
//     const { user } = req;
//     const { group } = req;
//     const groupId = req.params.groupId;
//     const membership = await Membership.findOne({
//         where: {
//             userId: user.id,
//             groupId: group.id,
//         },
//     });
//     if (membership) {
//         if (membership.status !== 'Organizer(host)' || membership.status !== 'Co-host') {
//             return res.status(403).json({ message: "User is not authorized to perform this action" });
//         }
//     };
//     if (!membership) {
//         return res.status(403).json({ message: "User is not a member of this group" });
//     }
//     req.membership = membership;
//     return next();
// };

// const requireHost = async (req, res, next) => {
//     const { user } = req;
//     const group = await Group.findOne({ where: { organizerId: user.id } });
//     const membership = await Membership.findOne({
//         where: {
//             userId: user.id,
//             groupId: group.id,
//         },
//     });
//     if (membership) {
//         if (group.organizerId !== user.id && membership.status !== 'Co-host') {
//             return res.status(403).json({ message: "User is not authorized to perform this action" });
//         }
//     };
//     if (!membership) {
//         return res.status(403).json({ message: "User is not a member of this group" });
//     }
//     req.membership = membership;
//     return next();
// };

const requireHost = async (req, res, next) => {
    const { user } = req;
    const group = await Group.findOne({ where: { organizerId: user.id } });
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: group.id,
        },
    });
    if (!membership) {
        return res.status(403).json({ message: "User is not a member of this group" });
    }
    req.membership = membership;

    // Check if the user is a cohost or organizer
    if (group.organizerId !== user.id && membership.status !== 'Co-host') {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }

    return next();
};


// Edit a Venue specified by its id

router.put('/:venueId', handleValidationErrors, requireAuth, requireHost, async (req, res, next) => {
    const { venueId } = req.params;
    const { user } = req;
    // const { membership } = req;
    const {
        address, city, state, lat, lng
    } = req.body;
    const venue = await Venue.findOne({
        where: {
            id: venueId,
        },
        attributes: {
            exclude: ['updatedAt']
        }
    });
    if (!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found",
        });
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: venue.groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    };
    const updatedVenue = await venue.update({
        // id: venue.id,
        // groupId: venue.groupId,
        address,
        city,
        state,
        lat,
        lng
    });

    return res.status(200).json(updatedVenue); //check on validation errors more ALSO TIME
});





module.exports = router;
