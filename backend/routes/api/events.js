const express = require('express');
const router = express.Router();
const { Op, Sequelize } = require('sequelize');
const bcrypt = require('bcryptjs');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User, Group, Membership, Venue, GroupImage, Event, Attendance, EventImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const group = require('../../db/models/group');
const user = require('../../db/models/user');
const venue = require('../../db/models/venue');
const { Router } = require('express');

//Get all events

router.get('/', handleValidationErrors, async (req, res, next) => {
    const events = await Event.findAll({
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
})

//Get details of an Event specified by its id



router.get('/:eventId', handleValidationErrors, async (req, res, next) => {
    const event = await Event.findByPk(req.params.eventId, {
        attributes: ['id', 'name', 'description', 'type', 'capacity', 'price', 'startDate', 'endDate'],
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'private', 'city', 'state']
            },
            {
                model: Venue,
                attributes: ['id', 'address', 'city', 'state', 'lat', 'lng']
            }
        ]
    });

    if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
    }

    const prepEvent = async (event) => {
        const numAttending = await Attendance.count({
            where: {
                eventId: event.id,
                status: 'Attending'
            }
        });
        const eventImage = await EventImage.findAll({
            where: {
                eventId: event.id
            },
            attributes: {
                exclude: ['eventId']
            }
        });
        return {
            id: event.id,
            groupId: event.Group.id,
            venueId: event.Venue.id,
            name: event.name,
            description: event.description,
            type: event.type,
            capacity: event.capacity,
            price: event.price,
            startDate: event.startDate,
            endDate: event.endDate,
            numAttending,
            Group: event.Group,
            Venue: event.Venue,
            EventImages: eventImage
        };
    };

    prepEvent(event).then(data => res.status(200).json(data));
});




router.post('/:eventId/images', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;

    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
    }
    const group = await Group.findOne({ where: { organizerId: user.id, id: event.groupId } });

    // Find the membership
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: 'Co-host'
        },
    });

    if (!group && !membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    };
    // Check if the user is attending the event
    const attendance = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId,
            status: 'Attending'
        },
        attributes: ['id', 'eventId', 'userId', 'status', 'createdAt', 'updatedAt']
    });

    if (!attendance) {
        return res.status(403).json({ message: "User is not attending this event" });
    }

    const { url, preview } = req.body;
    const image = await EventImage.create({
        url,
        preview,
        eventId
    });
    console.log('Created image', image.toJSON());
    return res.status(200).json({
        id: image.id,
        url: image.url,
        preview: image.preview
    });
})

//edit an event by id

router.put('/:eventId', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { eventId } = req.params;
    const { user } = req;
    const {
        venueId, name, type, capacity, price, description, startDate, endDate
    } = req.body;
    const event = await Event.findOne({
        where: {
            id: eventId,
        },
    });
    if (!event) {
        return res.status(404).json({
            message: "Event couldn't be found",
        });
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    };
    const updatedEvent = await event.update({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
    });
    const resBody = {
        id: event.id,
        groupId: event.groupId,
        venueId: updatedEvent.venueId,
        name: updatedEvent.name,
        type: updatedEvent.type,
        capacity: updatedEvent.capacity,
        price: updatedEvent.price,
        description: updatedEvent.description,
        startDate: updatedEvent.startDate,
        endDate: updatedEvent.endDate
    }

    return res.status(200).json(resBody); //ALLOWING FOR ANY USER TO MAKE CHANGES
});

//delete an event
router.delete('/:eventId', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const event = await Event.findByPk(req.params.eventId);
    if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
    };
    const group = await Group.findOne({ where: { organizerId: user.id } });
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: group.id,
            status: 'Co-host'
        },
    })
    if (user.id !== group.organizerId && membership.status !== 'Co-host') {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }
    await event.destroy();
    return res.status(200).json({ message: "Successfully deleted" });
});


// Get all Attendees of an Event specified by its id
router.get('/:eventId/attendees', handleValidationErrors, async (req, res) => {
    const { user } = req;
    const { eventId } = req.params;

    const attendees = await Event.findByPk(eventId, {

        include: [
            {
                model: Attendance,
                attributes: ['userId', 'status'],
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    }
                ]
            },
        ],
    });

    if (!attendees) {
        return res.status(404).json({ message: "Event couldn't be found" });
    }

    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: attendees.groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        const filteredAttendees = attendees.Attendances.filter(attendance =>
            attendance.status === 'Attending' || attendance.status === 'Waitlist'
        );
        return res.status(200).json({
            Attendees: filteredAttendees.map(attendance => ({
                id: attendance.User.id,
                firstName: attendance.User.firstName,
                lastName: attendance.User.lastName,
                Attendance: {
                    status: attendance.status
                }
            }))
        });
    }
    return res.status(200).json({
        Attendees: attendees.Attendances.map(attendance => ({
            id: attendance.User.id,
            firstName: attendance.User.firstName,
            lastName: attendance.User.lastName,
            Attendance: {
                status: attendance.status
            }
        }))
    });
});

//request attendance

router.post('/:eventId/attendance', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;

    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" });
    }
    const attendance = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
        },
        attributes: ['id', 'eventId', 'userId', 'status']
    })
    if (!attendance) {
        const newAttendance = await Attendance.create({
            userId: user.id,
            eventId,
            status: 'Pending'
        })
        return res.status(200).json({
            userId: newAttendance.userId,
            status: newAttendance.status
        })
    }
    if (attendance.status === 'Pending') {
        return res.status(400).json({ message: "Attendance has already been requested" })
    }
    if (attendance.status === 'Attending')
        return res.status(400).json({ message: "User is already an attendee of the event" })
});

//change attendance status

router.put('/:eventId/attendance', requireAuth, handleValidationErrors, async (req, res, next) => {

    const { user } = req;
    const { eventId } = req.params;
    const { userId, status } = req.body;

    if (status === 'Pending') {
        return res.status(400).json({ message: "Cannot change an attendance status to pending" })
    }
    const event = await Event.findByPk(eventId);
    if (!event) {
        return res.status(404).json({ message: "Event couldn't be found" })
    }

    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            groupId: event.groupId,
            status: { [Op.in]: ['Organizer(host)', 'Co-host'] }
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "User is not authorized to perform this action" });
    }


    const attendance = await Attendance.findOne({
        attributes: ['id', 'eventId', 'userId', 'status'],
        where: {
            eventId,
            userId: userId
        }
    })

    if (!attendance) {
        return res.status(404).json({ message: "Attendance record couldn't be found" });
    }

    attendance.status = status;
    await attendance.save();

    return res.status(200).json({
        id: attendance.id,
        eventId: attendance.eventId,
        userId: attendance.userId,
        status: attendance.status

    })

});

//delete an attendance

router.delete('/:eventId/attendance', requireAuth, handleValidationErrors, async (req, res, next) => {
    const { user } = req;
    const { eventId } = req.params;
    const attendance = await Attendance.findOne({
        where: {
            userId: user.id,
            eventId
        },
        attributes: ['id', 'eventId', 'userId', 'status', 'createdAt', 'updatedAt']
    });
    if (!attendance) {
        return res.status(404).json({ message: "Attendance does not exist for this User" })
    }
    const membership = await Membership.findOne({
        where: {
            userId: user.id,
            status: 'Organizer(host)'
        },
    })
    if (!membership) {
        return res.status(403).json({ message: "Only the User or organizer may delete an Attendance" });
    }

    await attendance.destroy();
    return res.status(200).json({ message: "Successfully deleted attendance from event" });
});

//QUERY FILTERS

router.get('/', handleValidationErrors, async (req, res) => {
    let { name, type, startDate, page, size } = req.query;

    page = parseInt(page);
    size = parseInt(size);

    if (Number.isNaN(page)) page = 1;
    if (Number.isNaN(size)) size = 20;
    if (size > 20) size = 20;

    const where = {};

    if (name) {
        where.name = name;
    }

    if (type) {
        if (type === 'Online' || type === 'In Person') {
            where.type = type;
        } else {
            res.status(400);
            return res.json({
                errors: [
                    { message: "Type must be 'Online' or 'In Person'" }
                ]
            });
        }
    }

    if (startDate) {
        if (!isNaN(Date.parse(startDate))) {
            where.startDate = startDate;
        } else {
            res.status(400);
            return res.json({
                errors: [
                    { message: 'Start date must be a valid datetime' }
                ]
            });
        }
    }

    const events = await Event.findAll({
        where,
        limit: size,
        offset: (page - 1) * size,
        include: [
            {
                model: Group,
                attributes: ['id', 'name', 'city', 'state'],
            },
            {
                model: Venue,
                attributes: ['id', 'city', 'state'],
            },
        ],
    });

    return res.json({
        Events: events,
        page,
        size,
    });
});



module.exports = router
