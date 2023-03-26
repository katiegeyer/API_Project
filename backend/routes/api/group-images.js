const express = require('express');
const router = express.Router();
const { OP } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Venue, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');
const user = require('../../db/models/user');
const venue = require('../../db/models/venue');
const { Router } = require('express');

router.delete('/:imageId', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const image = await GroupImage.findByPk(req.params.imageId);

    if (!image) {
        return res.status(404).json({ message: "Group Image couldn't be found" });
    }

    const group = await Group.findOne({ where: { id: image.groupId } });
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: group.id,
            status: ['Organizer(host)', 'Co-host']
        },
    });

    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }

    await image.destroy();

    return res.status(200).json({ message: "Successfully deleted" });
});


module.exports = router
