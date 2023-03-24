const express = require('express');
const router = express.Router();
const { OP } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');
const user = require('../../db/models/user');
const { Router } = require('express');

//CHANGE TIME FORMAT

//Get all groups
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();
    return res.status(200).json(groups)
})


//Get all Groups joined or organized by the Current User
// where do we stash the current user info

router.get('/current', requireAuth, async (req, res, next) => {
    let { user } = req;
    const memberships = await Membership.findAll({
        where: {
            userId: user.id
        },
        attributes: ['groupId']
    });

    const groupIds = memberships.map(membership => membership.groupId);

    const groups = await Group.findAll({
        // include: [{
        //     model: Membership,
        //     where: {
        //         userId: user.id,
        //     },
        // }],
        where: {
            id: groupIds
        },
        include: [{
            model: GroupImage,
            attributes: ['url'],
            limit: 1
        }]
    });
    const prepGroup = async (group) => {
        const img = await GroupImage.findOne({
            where: {
                groupId: group.id,
                preview: true
            },
        });
        const previewImage = img ? img.url : null;
        // console.log(group.name);
        // console.log(previewImage.url);
        const numMembers = await Membership.count({
            where: {
                groupId: group.id
            },
        })
        // console.log(numMembers);
        return {
            id: group.id,
            organizerId: group.organizerId,
            name: group.name,
            about: group.about,
            type: group.type,
            private: group.private,
            city: group.city,
            state: group.state,
            createdAt: group.createdAt,
            updatedAt: group.updatedAt,
            numMembers,
            previewImage
        }
    }
    const getData = async () => {
        return Promise.all(groups.map((group) => {
            return prepGroup(group)
        }));
    };
    getData().then(data => res.status(200).json(data))
})

//Get group details from id

router.get('/:groupId', requireAuth, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId, {

        include: [
            {
                model: GroupImage,
                attributes: ['id', 'url', 'preview'],
            },
            {
                model: User,
                attributes: ['id', 'firstName', 'lastName'],
                as: 'Organizer'
            },
            {
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
                as: 'Venue'
            }
        ]
    });
    if (!group) {
        return res.status(404).json({ "message": "Group couldn't be found", })
    };
    return res.json(group)
});

//create a Group

router.post('/', handleValidationErrors, requireAuth, async (req, res, next) => {
    const { user } = req;
    if (user) {
        const { name, about, type, private, city, state } = req.body;
        const newGroup = await Group.create({
            organizerId: user.id,
            name,
            about,
            type,
            private,
            city,
            state
        });
        return res.status(201).json(newGroup);
    } // work on validation errors
});

//Add image to a group based on group's id

router.post('/:groupId/images', requireAuth, async (req, res, next) => {
    const { user } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId) {
        return res.status(403).json({ messge: "User is not authorized to perform this action" });
    }
    const { url, preview } = req.body;
    const image = await GroupImage.create({
        url,
        preview,
        groupId: group.id
    });
    return res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
});

router.put('/:groupId', handleValidationErrors, requireAuth, async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    const {
        name, about, type, private, city, state
    } = req.body;
    const group = await Group.findOne({
        where: {
            id: groupId,
            organizerId: userId,
        },
    });

    if (!group) {
        return res.status(404).json({
            message: "Group couldn't be found",
        });
    }

    const updatedGroup = await group.update({
        name,
        about,
        type,
        private,
        city,
        state,
    });

    return res.status(200).json(updatedGroup); //check on validation errors more ALSO TIME
});

router.delete('/:groupId', requireAuth, async (req, res, next) => {
    const { user } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    await group.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
});

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
    const venues = await Venue.findAll({
        where: {
            groupId: group.id
        },
        attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng']
    });
    return res.json({ Venues: venues })
});

//Get all venues for group through groupId
router.post('/:groupId/venues', requireAuth, async (req, res, next) => {
    const { user } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId) {
        return res.status(403).json({ messge: "User is not authorized to perform this action" });
    }
    const { address, city, state, lat, lng } = req.body;
    const venue = await Venue.create({
        groupId: group.id,
        address,
        city,
        state,
        lat,
        lng
    });
    return res.status(200).json({
        id: venue.id,
        groupId: group.id,
        address: venue.address,
        city: venue.city,
        state: venue.state,
        lat: venue.lat,
        lng: venue.lng
    });
});

module.exports = router;
