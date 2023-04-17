import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNewGroup } from '../../store/groups';
import { useHistory } from 'react-router-dom';
import './createGroup.css'

const GroupForm = () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [formData, setFormData] = useState({
        city: '',
        state: '',
        name: '',
        about: '',
        type: '',
        private: '',
        previewImage: '',
    });
    const [formErrors, setFormErrors] = useState({});


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

        // Name validation
        if (!formData.name.trim()) {
            errors.name = 'Name is required.';
        }

        // Location validation
        if (!formData.city.trim() || !formData.state.trim()) {
            errors.location = 'Location is required.';
        }

        // Description validation
        if (formData.about.trim().length < 30) {
            errors.about = 'Description must be at least 30 characters long.';
        }

        // Group Type validation
        if (!formData.type) {
            errors.type = 'Group Type is required.';
        }

        // Visibility validation
        if (!formData.private) {
            errors.private = 'Visibility type is required.';
        }

        // Image URL validation
        const imageURLPattern = /\.(jpe?g|png)$/i;
        if (!imageURLPattern.test(formData.previewImage.trim())) {
            errors.previewImage = 'Image URL must end in .png, .jpg, or .jpeg';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     dispatch(createNewGroup(formData));
    // };

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     const modifiedFormData = {
    //         ...formData,
    //         private: formData.private === 'private' ? true : false,
    //     };
    //     const createdGroup = await dispatch(createNewGroup(modifiedFormData));
    //     console.log('created group:', createdGroup)
    //     if (createdGroup) {
    //         history.push(`/group/${createdGroup.id}`);
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        const modifiedFormData = {
            ...formData,
            private: formData.private === 'private' ? true : false,
        };
        const createdGroup = await dispatch(createNewGroup(modifiedFormData));
        console.log('created group:', createdGroup);
        if (createdGroup) {
            history.push(`/group/${createdGroup.id}`);
        }
    };




    return (

        <div className='group-form'>
            <form onSubmit={handleSubmit}>
                <div className="section">
                    <h2>BECOME AN ORGANIZER</h2>
                    <p>We'll walk you through a few steps to build your local community</p>
                </div>
                <div className="section">
                    <h2>First, set your group's location.</h2>
                    <p>Meetup groups meet locally, In person and online. We'll connect you with people in your area, and more can join you online.</p>
                    <input
                        type="text"
                        name="city"
                        placeholder="Enter your group's city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    {formErrors.location && (
                        <div className="error">{formErrors.location}</div>
                    )}
                    <input
                        type="text"
                        name="state"
                        placeholder="Enter your group's state"
                        value={formData.state}
                        onChange={handleChange}
                    />
                    {formErrors.location && (
                        <div className="error">{formErrors.location}</div>
                    )}
                </div>
                <div className="section">
                    <h2>What will your group's name be?</h2>
                    <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                    <input
                        type="text"
                        name="name"
                        placeholder="Enter your group's name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {formErrors.name && (
                        <div className="error">{formErrors.name}</div>
                    )}
                </div>
                <div className="section">
                    <h2>Now describe what your group will be about</h2>
                    <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1, What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                    <textarea
                        name="about"
                        placeholder="Describe your group"
                        value={formData.about}
                        onChange={handleChange}
                    />
                    {formErrors.about && (
                        <div className="error">{formErrors.about}</div>
                    )}
                </div>
                <div className="section">
                    <label htmlFor="type">Is this an In person or online group?</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                        <option value="" selected disabled>Please select one</option>
                        <option value="In person">In person</option>
                        <option value="Online">Online</option>
                    </select>
                    {formErrors.type && (
                        <div className="error">{formErrors.type}</div>
                    )}

                    <label htmlFor="private">Is this group private or public?</label>
                    <select name="private" value={formData.private} onChange={handleChange}>
                        <option value="" selected disabled>Please select one</option>
                        <option value="public">Public</option>
                        <option value="private">Private</option>
                    </select>
                    {formErrors.private && (
                        <div className="error">{formErrors.private}</div>
                    )}

                    <label htmlFor="previewImage">Please add an image URL for your group below:</label>
                    <input
                        type="text"
                        name="previewImage"
                        placeholder="Image URL"
                        value={formData.previewImage}
                        onChange={handleChange}
                    />
                    {formErrors.previewImage && (
                        <div className="error">{formErrors.previewImage}</div>
                    )}
                </div>
                <div className="section">
                    <button type="submit">Create Group</button>
                </div>
            </form>
        </div>
    )
}

export default GroupForm;
