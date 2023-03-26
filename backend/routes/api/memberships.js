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

//Delete a membership
router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { user } = req;
    const membership = await Group.findByPk(req.params.userId);
    if (!membership) {
        return res.status(404).json({ message: "Membership couldn't be found" });
    }
    if (user.id !== group.organizerId) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    await group.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
});










module.exports = router
