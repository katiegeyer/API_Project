const express = require('express');
const router = express.Router();
const { OP } = require('sequelize');
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



// Edit a Venue specified by its id

router.put('/:venueId', handleValidationErrors, requireAuth, async (req, res, next) => {
    const { venueId } = req.params;
    const { user } = req;
    // const { membership } = req;
    const {
        address, city, state, lat, lng
    } = req.body;
    //how to connect Membership.  query for group, query for co-host members of the group (do they have the same userid as the user dom id)
    const group = await Group.findOne({ where: { organizerId: user.id } });
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: group.id,
            status: 'Organizer(host)' || 'Co-host'
        },
    })
    if (!group) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    if (user.id !== group.organizerId && membership.status !== 'Co-host' && membership.status !== 'Organizer(host)') {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    const venue = await Venue.findOne({
        where: {
            id: venueId,
        },
    });
    if (!venue) {
        return res.status(404).json({
            message: "Venue couldn't be found",
        });
    }
    const updatedVenue = await venue.update({
        id: venue.id,
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    });

    return res.status(200).json(updatedVenue); //check on validation errors more ALSO TIME
});





module.exports = router;
