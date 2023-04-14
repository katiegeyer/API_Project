const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Venue, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');
const user = require('../../db/models/user');
const venue = require('../../db/models/venue');
const { Router } = require('express');
const event = require('../../db/models/event');

const requireMembership = async (req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
        },
    });
    if (!membership) {
        return res.status(403).json({ message: "User is not a member of this group" });
    }
    req.membership = membership;
    return next();
};

const requireHost = async (req, res, next) => {
    const { user } = req;
    const groupId = req.params.groupId;
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
        },
    });
    if (membership) {
        if (membership.status !== 'Organizer(host)' && membership.status !== 'Co-host') {
            return res.status(403).json({ message: "User is not authorized to perform this action" });
        }
    };
    if (!membership) {
        return res.status(403).json({ message: "User is not a member of this group" });
    }
    req.membership = membership;
    return next();
};



//Get all groups
router.get('/', handleValidationErrors, async (req, res, next) => {
    const groups = await Group.findAll({
        include: [{
            model: GroupImage,
            attributes: ['url']
            // limit: 1
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

        const events = await Event.count({
            where: {
                groupId: group.id,
            },
        });

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
            events,
            numMembers,
            previewImage
        }
    }
    const getData = async () => {
        return Promise.all(groups.map((group) => {
            return prepGroup(group)
        }));
    };
    getData().then(data => res.status(200).json({ Groups: data }))
});

//     return res.status(200).json(groups)
// })


//Get all Groups joined or organized by the Current User

router.get('/current', requireAuth, handleValidationErrors, async (req, res, next) => {
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
            organizerId: user.id,
            id: groupIds
        },
        include: [{
            model: GroupImage,
            attributes: ['url'],
            // limit: 1
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
        const events = await Event.count({
            where: {
                groupId: group.id,
            },
        });
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
            events,
            numMembers,
            previewImage
        }
    }
    const getData = async () => {
        return Promise.all(groups.map((group) => {
            return prepGroup(group)
        }));
    };
    getData().then(data => res.status(200).json({ Groups: data }))
})

//Get group details from id

router.get('/:groupId', requireAuth, handleValidationErrors, async (req, res, next) => {
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
            },
            {
                model: Event,
                attributes: ['id', 'groupId']
            }
        ]


    });
    const numMembers = await Membership.count({
        where: {
            groupId: group.id
        },
    });
    if (!group) {
        return res.status(404).json({ "message": "Group couldn't be found", })
    };

    const img = await GroupImage.findOne({
        where: {
            groupId: group.id,
            preview: true
        },
    });
    const previewImage = img ? img.url : null;

    const events = await Event.count({
        where: {
            groupId: group.id,
        },
    });

    const organizer = await User.findOne({
        where: {
            id: group.id,
        },
    });

    const organizerName = organizer ? organizer.firstName + ' ' + organizer.lastName : null;

    return res.json({
        id: group.id,
        organizerId: group.organizerId,
        name: group.name,
        about: group.about,
        type: group.type,
        private: group.private,
        city: group.city,
        state: group.state,
        numMembers,
        previewImage,
        events,
        organizerName,
        createdAt: group.createdAt,
        updatedAt: group.updatedAt
    })
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
        // router.post('/', handleValidationErrors, requireAuth, async (req, res, next) => {
        //     const { user } = req;
        //     if (user) {
        //         const { name, about, type, private, city, state } = req.body;
        //         const newGroup = await Group.create({
        //             organizerId: user.id,
        //             name,
        //             about,
        //             type,
        //             private,
        //             city,
        //             state
        //         });

        //         return res.status(201).json(newGroup);
        //     } // work on validation errors
        // });
        await Membership.create({
            groupId: newGroup.id,
            userId: user.id,
            status: 'Organizer(host)'
        });
        return res.status(201).json(newGroup);
    } // work on validation errors
});

//Add image to a group based on group's id

router.post('/:groupId/images', handleValidationErrors, requireAuth, async (req, res, next) => {
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

//edit group

// router.put('/:groupId', handleValidationErrors, requireAuth, requireHost, async (req, res, next) => {
//     const { groupId } = req.params;
//     const userId = req.user.id;
//     const {
//         name, about, type, private, city, state, previewImage
//     } = req.body;
//     const group = await Group.findOne({
//         where: {
//             id: groupId,
//             organizerId: userId,
//         },
//     });

//     if (!group) {
//         return res.status(404).json({
//             message: "Group couldn't be found",
//         });
//     }

//     const updatedGroup = await group.update({
//         name,
//         about,
//         type,
//         private,
//         city,
//         state,
//         previewImage,
//     });

//     return res.status(200).json(updatedGroup); //check on validation errors more ALSO TIME
// });

router.put('/:groupId', handleValidationErrors, requireAuth, requireHost, async (req, res, next) => {
    const { groupId } = req.params;
    const userId = req.user.id;
    const {
        name, about, type, private, city, state, previewImage
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

    // Find and update the preview image separately
    const groupImage = await GroupImage.findOne({
        where: {
            groupId: groupId,
            preview: true,
        },
    });

    if (groupImage && previewImage) {
        await groupImage.update({ url: previewImage });
    }

    // Add the updated preview image to the response
    const responseGroup = updatedGroup.toJSON();
    responseGroup.previewImage = groupImage ? groupImage.url : null;

    return res.status(200).json(responseGroup);
});

//delete a group

router.delete('/:groupId', requireAuth, handleValidationErrors, async (req, res, next) => {
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

router.get('/:groupId/venues', requireAuth, handleValidationErrors, async (req, res, next) => { //RETURNING EMPTY ARRAY IF USER DOESN'T CREATE VENUE
    const { user } = req;
    const { groupId } = req.params;
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    const venue = await Group.findByPk(req.params.groupId, {
        attributes: [],
        include:
            [{
                model: Venue,
                attributes: ['id', 'groupId', 'address', 'city', 'state', 'lat', 'lng'],
                as: 'Venue'
            }]
    }).then(group => group.get('Venue'));

    return res.json({ Venues: venue });
});

//create venue for group through groupId
router.post('/:groupId/venues', requireAuth, handleValidationErrors, requireMembership, async (req, res, next) => {
    const { user } = req;
    const { membership } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId && membership.status !== 'Co-host') {
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

//Get all Events of a Group specified by its id

router.get('/:groupId/events', handleValidationErrors, async (req, res, next) => {
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    const events = await Event.findAll({
        where: {
            groupId: group.id
        },
        attributes: ['id', 'name', 'type', 'startDate', 'endDate'],
        include: [{
            model: Group,
            attributes: ['id', 'name', 'city', 'state']
        },
        {
            model: Venue,
            attributes: ['id', 'city', 'state']
        }]
    });
    const prepEvent = async (event) => {
        const img = await EventImage.findOne({
            where: {
                eventId: event.id,
                preview: true
            },
        });
        const previewImage = img ? img.url : null;
        // console.log(group.name);
        // console.log(previewImage.url);
        const numAttending = event.id ? await Attendance.count({
            where: {
                eventId: event.id,
                status: 'Attending'
            },
        }) : 0;
        return {
            id: event.id,
            groupId: event.Group.id,
            venueId: event.Venue.id,
            name: event.name,
            type: event.type,
            startDate: event.startDate,
            endDate: event.endDate,
            numAttending,
            previewImage,
            Group: event.Group,
            Venue: event.Venue
        }
    }
    const getData = async () => {
        return Promise.all(events.map((event) => {
            return prepEvent(event)
        }));
    };
    getData().then(data => res.status(200).json(data))
});

//Create an Event for a Group specified by its id

router.post('/:groupId/events', handleValidationErrors, requireAuth, requireMembership, async (req, res, next) => {
    const { user } = req;
    const { membership } = req;
    const group = await Group.findByPk(req.params.groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    if (user.id !== group.organizerId && membership.status !== 'Co-host') {
        return res.status(403).json({ messge: "User is not authorized to perform this action" });
    }
    const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body;
    const event = await Event.create({
        groupId: group.id,
        venueId: venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    }/*, { returning: true }*/);
    console.log(event.id)
    console.log(Event)
    return res.status(200).json({
        id: event.id, //WHY IS EVENT.ID UNDEFINED???
        groupId: group.id,
        venueId: event.venueId,
        name: event.name,
        type: event.type,
        capacity: event.capacity,
        price: event.price,
        description: event.description,
        startDate: event.startDate,
        endDate: event.endDate
    });
});

// Get all Members of a Group specified by its id
//**figure out how to show two success res */

router.get('/:groupId/members', handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params;
    // const { membership } = req;
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    const members = await Membership.findAll({
        where: {
            groupId: group.id
        },
        include: {
            model: User,
            attributes: ['id', 'firstName', 'lastName']
        },
        attributes: ['id', 'status']
    });
    const membersResults = members.map(member => {
        return {
            id: member.User.id,
            firstName: member.User.firstName,
            lastName: member.User.lastName,
            Membership: {
                status: member.status
            }
        }
    });
    return res.json({
        Members: membersResults
    });
});


// Request a Membership for a Group based on the Group's id

router.post('/:groupId/membership', handleValidationErrors, requireAuth, async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params;

    // Check if the group exists
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }

    // Check if the user already has a pending membership request for the group
    const existingMembership = await Membership.findOne({
        where: {
            groupId,
            userId: user.id,
            status: 'Pending'
        }
    });
    if (existingMembership) {
        return res.status(400).json({ message: "Membership has already been requested" });
    }

    // Check if the user is already a member of the group
    const existingMember = await Membership.findOne({
        where: {
            groupId,
            userId: user.id,
            status: 'Member' || 'Organizer(host)' || 'Co-host'
        }
    });
    if (existingMember) {
        return res.status(400).json({ message: "User is already a member of the group" });
    }

    // Create a new membership request for the user
    const newMembership = await Membership.create({
        groupId,
        userId: user.id,
        status: 'Pending'
    });

    return res.json({
        memberId: newMembership.id,
        status: newMembership.status
    });
});



//Delete a membership

router.delete('/:groupId/membership', requireAuth, async (req, res, next) => {
    const { user } = req;
    const { groupId } = req.params;
    const membership = await Membership.findOne({
        where: {
            groupId: groupId,
            userId: user.id
        }
    });
    if (!membership) {
        return res.status(404).json({ message: "Membership does not exist for this User" });
    }
    if (user.id !== membership.userId && user.id !== membership.group.organizerId) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    await membership.destroy();
    return res.status(200).json({ message: "Successfully deleted membership from group" });
});

// Change the status of a membership for a group specified by id
router.put('/:groupId/membership', requireAuth, handleValidationErrors, async (req, res) => {
    const { groupId } = req.params;
    const { memberId, status } = req.body;
    const userId = req.user.id;
    // Check if changing status to "pending"
    if (status === 'Pending') {
        return res.status(400).json({ message: 'Validations Error', errors: { status: 'Cannot change a membership status to pending' } });
    }
    const group = await Group.findByPk(groupId);
    if (!group) {
        return res.status(404).json({ message: "Group couldn't be found" });
    }
    const membership = await Membership.findOne({
        where: { groupId, userId },
    });
    if (!membership) {
        return res.status(404).json({ message: 'Membership between the user and the group does not exist' });
    }
    // Check if user exists
    const user = await User.findByPk(memberId);
    if (!user) {
        return res.status(404).json({ message: 'Validation Error', errors: { memberId: "User couldn't be found" } });
    }

    const currentUserMembershipStatus = membership.status;

    const targetUserMembership = await Membership.findOne({
        where: {
            userId: memberId,
            groupId
        }
    });
    const targetUserMembershipStatus = targetUserMembership.status;
    if (targetUserMembershipStatus === 'Pending' && status === 'Member') {
        if (currentUserMembershipStatus !== 'Organizer(host)' && currentUserMembershipStatus !== 'Co-host') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    }
    if (targetUserMembershipStatus === 'Member' && status === 'Co-host') {
        if (currentUserMembershipStatus !== 'Organizer(host)') {
            return res.status(403).json({ message: 'Unauthorized' });
        }
    }


    // Update membership status
    targetUserMembership.status = status;
    // console.log(targetUserMembership.status);
    await targetUserMembership.save();

    return res.status(200).json({
        id: targetUserMembership.id,
        groupId: targetUserMembership.groupId,
        memberId: targetUserMembership.userId,
        status: targetUserMembership.status
    });
});



module.exports = router
