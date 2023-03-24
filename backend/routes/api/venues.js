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
const venue = require('../../db/models/venue')
const { Router } = require('express');

//Get all venues for group through groupId

router.get('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { user } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId) {
        return res.status(403).json({ messge: "User is not authorized to perform this action" });
    }
    const venues = await Group.findAll({
        
    })
})
