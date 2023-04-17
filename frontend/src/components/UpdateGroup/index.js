import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { updateGroup } from '../../store/groups';
import { useParams, useHistory } from 'react-router-dom';
// import { getOneGroup } from '../../stockre/groups';


const GroupUpdate = () => {
    const history = useHistory();
    const { groupId } = useParams();
    const dispatch = useDispatch();

    const singleGroup = useSelector((state) => state.groups.singleGroup);

    const [formData, setFormData] = useState({
        city: `${singleGroup.city}`,
        state: `${singleGroup.state}`,
        name: `${singleGroup.name}`,
        about: `${singleGroup.about}`,
        type: `${singleGroup.type}`,
        private: `${singleGroup.private}`,
        previewImage: `${singleGroup.previewImage}`,
    });
    console.log(singleGroup)


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        const newValue = value === "private";

        setFormData({ ...formData, [name]: newValue });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedGroup = await dispatch(updateGroup(groupId, formData));
        // console.log(updatedGroup.id)
        if (updatedGroup) {
            history.push(`/group/${groupId}`);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='group-form'>
            <div className="section">
                <h2>Update Your Group</h2>
                <p>We'll walk you through a few steps to update your Group</p>
            </div>

            <div className="section">
                <h2>First, set your group's location.</h2>
                <p>Meetup groups meet locally, In person and online. We'll connect you with people in your area, and more can join you online.</p>
                <input
                    type="text"
                    name="city"
                    // placeholder={`${singleGroup.city}`}
                    value={formData.city}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="state"
                    placeholder={`${singleGroup.state}`}
                    value={formData.state}
                    onChange={handleChange}
                />
            </div>
            <div className="section">
                <h2>What will your group's name be?</h2>
                <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
                <input
                    type="text"
                    name="name"
                    placeholder={`${singleGroup.name}`}
                    value={formData.name}
                    onChange={handleChange}
                />
            </div>

            {/* SECTION 4 */}
            <div className="section">
                <h2>Now describe what your group will be about</h2>
                <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1, What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
                <textarea
                    name="about"
                    placeholder={formData.about === '' ? singleGroup.about : 'Describe your group here..'}
                    value={formData.about}
                    onChange={handleChange}
                />
            </div>
            <div className="section">
                <label htmlFor="type">Is this an In person or online group?</label>
                <select name="type" value={formData.type} onChange={handleChange}>
                    {/* <option></option> */}
                    <option value="In person">In person</option>
                    <option value="Online">Online</option>
                </select>

                <label htmlFor="private">Is this group private or public?</label>
                <select name="private" value={formData.private ? 'private' : 'public'} onChange={handleChange1}>
                    {/* <option></option> */}
                    <option value="public">Public</option>
                    <option value="private">Private</option>
                </select>

                <label htmlFor="previewImage">Please add an image URL for your group below:</label>
                <input
                    type="text"
                    name="previewImage"
                    placeholder={`${singleGroup.previewImage}`}
                    value={formData.previewImage}
                    onChange={handleChange}
                />
            </div>
            <div className="section">
                <button type="submit">Update Group</button>
            </div>
        </form>
    )
}

export default GroupUpdate;


// const GroupForm = () => {
//     const history = useHistory();
//     const { groupId } = useParams();
//     const dispatch = useDispatch();
//     console.log('groupId', groupId)

//     const singleGroup = useSelector((state) => state.groups.singleGroup);
//     useEffect(() => {
//         dispatch(updateGroup(groupId));
//     }, [dispatch, groupId]);

//     const [formData, setFormData] = useState({
//         city: `${singleGroup.city}`,
//         state: '',
//         name: '',
//         about: '',
//         type: `${singleGroup.type}`,
//         private: `${singleGroup.private}`,
//         imageUrl: '',
//     });
//     console.log(singleGroup)


//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };


//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         const updatedGroup = await dispatch(updateGroup(groupId, formData));
//         if (updatedGroup) {
//             history.push(`/group/${singleGroup.id}`);
//         }
//     };


//     return (
//         <form onSubmit={handleSubmit}>
//             /* SECTION 1 */
//             <div className="section">
//                 <h2>Update Your Group</h2>
//                 <p>We'll walk you through a few steps to update your Group</p>
//             </div>

//             /* SECTION 2 */
//             <div className="section">
//                 <h2>First, set your group's location.</h2>
//                 <p>Meetup groups meet locally, In person and online. We'll connect you with people in your area, and more can join you online.</p>
//                 <input
//                     type="text"
//                     name="city"
//                     placeholder={`${singleGroup.city}`}
//                     value={formData.city}
//                     onChange={handleChange}
//                 />
//                 <input
//                     type="text"
//                     name="state"
//                     placeholder={`${singleGroup.state}`}
//                     value={formData.state}
//                     onChange={handleChange}
//                 />
//             </div>

//             /* SECTION 3 */
//             <div className="section">
//                 <h2>What will your group's name be?</h2>
//                 <p>Choose a name that will give people a clear idea of what the group is about. Feel free to get creative! You can edit this later if you change your mind.</p>
//                 <input
//                     type="text"
//                     name="name"
//                     placeholder={`${singleGroup.name}`}
//                     value={formData.name}
//                     onChange={handleChange}
//                 />
//             </div>

//             {/* SECTION 4 */}
//             <div className="section">
//                 <h2>Now describe what your group will be about</h2>
//                 <p>People will see this when we promote your group, but you'll be able to add to it later, too. 1, What's the purpose of the group? 2. Who should join? 3. What will you do at your events?</p>
//                 <textarea
//                     name="about"
//                     placeholder={formData.about === '' ? singleGroup.about : 'Describe your group here..'}
//                     value={formData.about}
//                     onChange={handleChange}
//                 />
//             </div>

//             {/* SECTION 5 */}
//             <div className="section">
//                 <label htmlFor="type">Is this an In person or online group?</label>
//                 <select name="type" value={formData.type} onChange={handleChange}>
//                     <option></option>
//                     <option value="In person">In person</option>
//                     <option value="Online">Online</option>
//                 </select>

//                 <label htmlFor="private">Is this group private or public?</label>
//                 <select name="private" value={formData.private ? 'private' : 'public'} onChange={handleChange}>
//                     <option></option>
//                     <option value="public">Public</option>
//                     <option value="private">Private</option>
//                 </select>

//                 <label htmlFor="imageUrl">Please add an image URL for your group below:</label>
//                 <input
//                     type="text"
//                     name="imageUrl"
//                     placeholder="Image URL"
//                     value={formData.imageUrl}
//                     onChange={handleChange}
//                 />
//             </div>

//             /* SECTION 6 */
//             <div className="section">
//                 <button type="submit">Create Group</button>
//             </div>
//         </form>
//     )
// }

// export default GroupForm;
