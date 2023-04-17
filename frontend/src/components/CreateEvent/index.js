import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { createNewEvent } from '../../store/events';
import { useHistory } from 'react-router-dom';
import { getOneGroup } from '../../store/groups';
import { getOneEvent } from '../../store/events';
import './CreateEvent.css';
import moment from 'moment';

const EventForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { groupId } = useParams();
    const { eventId } = useParams();

    const singleGroup = useSelector((state) => state.groups.singleGroup);
    useEffect(() => {
        dispatch(getOneGroup(groupId));
    }, [dispatch, groupId]);

    const event = useSelector((state) => state.events.singleEvent);

    useEffect(() => {
        if (eventId) {
            dispatch(getOneEvent(eventId));
        }
    }, [dispatch, eventId]);

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        private: '',
        price: '',
        capacity: '',
        // startDate: '',
        // endDate: '',
        startDateTime: '',
        endDateTime: '',
        previewImage: '',
        description: '',
    });

    // useEffect(() => {
    //     if (event) {
    //         setFormData({
    //             name: event.name,
    //             type: event.type,
    //             private: event.private,
    //             price: event.price,
    //             capacity: event.capacity,
    //             startDate: event.startDate,
    //             endDate: event.endDate,
    //             previewImage: event.previewImage,
    //             description: event.description,
    //         });
    //     }
    // }, [event]);

    const [validationErrors, setValidationErrors] = useState({});

    //need to combine city and state, parse location
    //potential code for modified handlesubmit
    /*    const [city, state] = formData.location.split(',').map((item) => item.trim());

    const modifiedFormData = {
        ...formData,
        city,
        state,
        private: formData.private === 'private' ? true : false,
    };
    delete modifiedFormData.location;
    */

    const validateForm = () => {
        const errors = {};

        if (!formData.name) errors.name = "Name is required";
        if (!formData.type) errors.type = "Event Type is required";
        if (!formData.private) errors.private = "Visibility type is required";
        if (!formData.price) errors.price = "Price is required";
        if (!formData.capacity) errors.capacity = "Capacity is required";
        if (!formData.startDateTime)
            errors.start = "Event start is required";
        if (new Date(formData.startDateTime) <= new Date())
            errors.start = "Start date must be in the future";
        if (!formData.endDateTime)
            errors.end = "Event end is required";
        if (new Date(formData.startDateTime) >= new Date(formData.endDateTime)) {
            errors.date = "End date and time must be after start date and time";
        }
        if (
            !formData.previewImage.match(
                /\.(png|jpg|jpeg)$/i
            )
        )
            errors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";
        if (!formData.description || formData.description.length < 30)
            errors.description = "Description must be at least 30 characters long";

        return errors;
    };
    //     setFormErrors(errors);
    //     return Object.keys(errors).length === 0;
    // };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevFormData) => {
            let updatedFormData = { ...prevFormData, [name]: value };
            if (name === 'startDate' || name === 'startTime') {
                updatedFormData.startDateTime = `${updatedFormData.startDate}T${updatedFormData.startTime}`;
            }
            if (name === 'endDate' || name === 'endTime') {
                updatedFormData.endDateTime = `${updatedFormData.endDate}T${updatedFormData.endTime}`;
            }
            return updatedFormData;
        });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(createNewGroup(formData));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        // const startDate = moment(`${formData.startDate}T${formData.startTime}`).format("MMMM D, YYYY, h:mm A");
        // const endDate = moment(`${formData.endDate}T${formData.endTime}`).format("MMMM D, YYYY, h:mm A");
        const startDate = moment(formData.startDateTime).format("MMMM D, YYYY, h:mm A");
        const endDate = moment(formData.endDateTime).format("MMMM D, YYYY, h:mm A");
        if (Object.keys(errors).length === 0) {
            const modifiedFormData = {
                ...formData,
                startDate,
                endDate,
                private: formData.private === 'private' ? true : false,
            };
            const createdEvent = await dispatch(createNewEvent(modifiedFormData, groupId));
            if (createdEvent) {
                history.push(`/groups/${groupId}/events/${createdEvent.id}`);
            }
        } else {
            setValidationErrors(errors);
        }
    };


    return (
        <div className='event-form'>
            <form onSubmit={handleSubmit}>
                {/* SECTION 1 */}
                <div className="section">
                    {/* <h1>CREATE AN EVENT FOR {`${singleGroup.name}`}</h1> */}
                </div>

                {/* SECTION 2 */}
                <div className="section">
                    <h2>What is the name of your event?</h2>
                    <input
                        type="text"
                        name="name"
                        placeholder="Event Name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {validationErrors.name && (
                        <p className="error-message">{validationErrors.name}</p>
                    )}
                </div>

                {/* SECTION 3 */}
                <div className="section">
                    <label htmlFor="type">Is this an In person or online event?</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="" selected disabled>Please select one</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    {validationErrors.type && (
                        <p className="error-message">{validationErrors.type}</p>
                    )}

                    <label htmlFor="private">Is this group private or public?</label>
                    <select name="private" value={formData.private} onChange={handleChange}>
                        <option value="" selected disabled>Please select one</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    {validationErrors.private && (
                        <p className="error-message">{validationErrors.private}</p>
                    )}
                    <div>What is the maximum number of attendees for your event?</div>
                    <input
                        type="number"
                        name="capacity"
                        placeholder="0"
                        value={formData.capacity}
                        onChange={handleChange}
                    />
                    {validationErrors.capacity && (
                        <p className="error-message">{validationErrors.capacity}</p>
                    )}
                    <div>What is the price of your event?</div>
                    <input
                        type="number"
                        name="price"
                        placeholder="0"
                        value={formData.price}
                        onChange={handleChange}
                    />
                    {validationErrors.price && (
                        <p className="error-message">{validationErrors.price}</p>
                    )}
                </div>
                <label htmlFor="startDateTime">When does your event start?</label>
                <input
                    type="datetime-local"
                    id="startDateTime"
                    name="startDateTime"
                    value={formData.startDateTime}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY, HH/mm AM"
                />
                {validationErrors.start && (
                    <p className="error-message">{validationErrors.start}</p>
                )}
                {/* <div>
                    <label htmlFor="startDate">Start Date:</label>
                    <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                    />
                    {validationErrors.start && (
                        <p className="error-message">{validationErrors.start}</p>
                    )}
                    <label htmlFor="startTime">Start Time:</label>
                    <input
                        type="time"
                        id="startTime"
                        name="startTime"
                        value={formData.startTime}
                        onChange={handleChange}
                    />
                    {validationErrors.start && (
                        <p className="error-message">{validationErrors.start}</p>
                    )}
                </div> */}
                {/* <div>
                    <label htmlFor="endDate">End Date:</label>
                    <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                    />
                    {validationErrors.end && (
                        <p className="error-message">{validationErrors.end}</p>
                    )}
                    {validationErrors.date && (
                        <p className="error-message">{validationErrors.date}</p>
                    )}
                </div>
                <div>
                    <label htmlFor="endTime">End Time:</label>
                    <input
                        type="time"
                        id="endTime"
                        name="endTime"
                        value={formData.endTime}
                        onChange={handleChange}
                    />
                    {validationErrors.end && (
                        <p className="error-message">{validationErrors.end}</p>
                    )}
                </div> */}
                <label htmlFor="endDateTime">When does your event end?</label>
                <input
                    type="datetime-local"
                    id="endDateTime"
                    name="endDateTime"
                    value={formData.endDateTime}
                    onChange={handleChange}
                    placeholder="MM/DD/YYYY, HH/mm AM"
                />
                {validationErrors.end && (
                    <p className="error-message">{validationErrors.end}</p>
                )}
                {validationErrors.date && (
                    <p className="error-message">{validationErrors.date}</p>
                )}

                <div className="section">
                    <h2>Please describe your event:</h2>
                    <textarea
                        name="description"
                        placeholder="Please include at least 30 characters"
                        value={formData.description}
                        onChange={handleChange}
                    />
                    {validationErrors.about && (
                        <p className="error-message">{validationErrors.about}</p>
                    )}
                </div>
                <div className="section">
                    <label htmlFor="previewImage">Please add an image URL for your event below:</label>
                    <input
                        type="text"
                        name="previewImage"
                        placeholder="Image URL"
                        value={formData.previewImage}
                        onChange={handleChange}
                    />
                    {validationErrors.previewImage && (
                        <p className="error-message">{validationErrors.previewImage}</p>
                    )}
                </div>
                <div className="section">
                    <button type="submit">Create Event</button>
                </div>
            </form>
        </div>

    )


}
export default EventForm;
