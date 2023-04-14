import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewEvent } from '../../store/events';
import { useHistory } from 'react-router-dom';

const EventForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        name: '',
        type: '',
        private: '',
        price: '',
        startDate: '',
        endDate: '',
        previewImage: '',
        description: ''
    });

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


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(createNewGroup(formData));
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const modifiedFormData = {
            ...formData,
            private: formData.private === 'private' ? true : false,
        };
        const createdEvent = await dispatch(createNewEvent(modifiedFormData));
        console.log('created event:', createdEvent)
        if (createdEvent) {
            history.push(`/event/${createdEvent.id}`);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            {/* SECTION 1 */}
            <div className="section">
                <h1>CREATE AN EVENT FOR groupname</h1>
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
            </div>

            {/* SECTION 3 */}
            <div className="section">
                <label htmlFor="type">Is this an in-person or online event?</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="" selected disabled>Please select one</option>
                    <option value="In-Person">In-Person</option>
                    <option value="Online">Online</option>
                </select>

                <label htmlFor="private">Is this group private or public?</label>
                <select name="private" value={formData.private} onChange={handleChange}>
                    <option value="" selected disabled>Please select one</option>
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>
                <div>What is the price of your event?</div>
                <input
                    type="number"
                    name="price"
                    placeholder="0"
                    value={formData.price}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="startDate">Start Date:</label>
                <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                />
                <label htmlFor="startTime">Start Time:</label>
                <input
                    type="time"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                />
            </div>
            <div>
                <label htmlFor="endDate">End Date:</label>
                <input
                    type="date"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                />
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
            </div>


            <div className="section">
                <h2>Please describe your event:</h2>
                <textarea
                    name="about"
                    placeholder="Please include at least 30 characters"
                    value={formData.about}
                    onChange={handleChange}
                />
            </div>

            {/* SECTION 5 */}
            <div className="section">
                <label htmlFor="previewImage">Please add an image URL for your event below:</label>
                <input
                    type="text"
                    name="previewImage"
                    placeholder="Image URL"
                    value={formData.previewImage}
                    onChange={handleChange}
                />
            </div>

            /* SECTION 6 */
            <div className="section">
                <button type="submit">Create Event</button>
            </div>
        </form>
    )


}
export default EventForm;
