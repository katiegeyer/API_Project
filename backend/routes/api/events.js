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


router.get('/', async (req, res, next) => {
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



router.get('/:eventId', async (req, res, next) => {
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

module.exports = router
