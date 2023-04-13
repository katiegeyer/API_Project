import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateGroup } from '../../store/groups';
import { NavLink } from 'react-router-dom';

const GroupForm = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        location: '',
        name: '',
        description: '',
        groupType: '',
        privacy: '',
        imageUrl: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(createNewGroup(formData));
    };
    return (
        <form onSubmit={handleSubmit}>
            /* SECTION 1 */
            <div className="section">
                <h2>BECOME AN ORGANIZER</h2>
                <p>We'll walk you through a few steps to build your local community</p>
            </div>

            /* SECTION 2 */
            <div className="section">
                <h2>First, set your group's location.</h2>
                <p>Meetup groups meet locally, in person and online. We'll connect you with people in your area, and more can join you online.</p>
                <input
                    type="text"
                    name="location"
                    placeholder="Enter your group's location"
                    value={formData.location}
                    onChange={handleChange}
                />
            </div>

            /* SECTION 3 */
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
            </div>

            {/* SECTION 4 */}
            <div className="section">
                <h2>Now describe what your group will be about</h2>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1, What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <textarea
                    name="description"
                    placeholder="Describe your group"
                    value={formData.description}
                    onChange={handleChange}
                />
            </div>

            {/* SECTION 5 */}
            <div className="section">
                <label htmlFor="type">Is this an in-person or online group?</label>
                <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    placeholder="Please select one">
                    <option value="in person">In Person</option>
                    <option value="online">Online</option>
                </select>

                <label htmlFor="privacy">Is this group private or public?</label>
                <select
                    name="privacy"
                    value={formData.privacy}
                    onChange={handleChange}
                    placeholder="Please select one">
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                <label htmlFor="imageUrl">Please add an image URL for your group below:</label>
                <input
                    type="text"
                    name="imageUrl"
                    placeholder="Image URL"
                    value={formData.imageUrl}
                    onChange={handleChange}
                />
            </div>

            /* SECTION 6 */
            <div className="section">
                <button type="submit">Create Group</button>
            </div>
        </form>
    )
}

export default GroupForm;
