const express = require('express');
const router = express.Router();
const { OP } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Event, Venue, GroupImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');


//Get all groups
router.get('/', async (req, res, next) => {
    const groups = await Group.findAll();
    return res.status(200).json(groups)
})


//Get all Groups joined or organized by the Current User
// where do we stash the current user info

router.get('/current', async (req, res, next) => {
    const groups = await Group.findAll({
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
        return res.status(404).json({"message": "Group couldn't be found",})
    };
    return res.json(group)
});


module.exports = router;
