// import React, { useEffect } from 'react';
// import { NavLink } from 'react-router-dom';
// import { useDispatch, useSelector } from 'react-redux'
// import { getUserGroups } from '../../store/groups';


// function UserGroup() {
//     const dispatch = useDispatch();

//     const userId = useSelector((state) => state.session.user.id);
//     const allGroups = useSelector((state) => Object.values(state.groups.allGroups));
//     const userGroups = allGroups.filter((group) => group.organizerId === userId);
//     useEffect(() => {
//         dispatch(getUserGroups());
//     }, [dispatch]);

//     return (
//         <div className='user-groups-container'>
//             <h1>Your Groups</h1>
//             <section className='user-groups'>
//                 {userGroups.map((group) => (
//                     <div key={group.id} className='user-group'>
//                         <div className='group-image'>
//                             <img src={group.previewImage} alt={group.name} />
//                         </div>
//                         <div className='group-details'>
//                             <h2 className='group-name'>
//                                 <NavLink to={`/groups/${group.id}`} className="group-link">
//                                     {group.name}
//                                 </NavLink>
//                             </h2>
//                             <p className='location'>{group.city}</p>
//                             <div className='group-actions'>
//                                 <NavLink to={`/groups/${group.id}/create-event`} className="groups-create-event-link">
//                                     Create event
//                                 </NavLink>
//                                 <NavLink to={`/groups/${group.id}/update-group`} className="groups-update-group-link">
//                                     Update
//                                 </NavLink>
//                             </div>
//                         </div>
//                     </div>
//                 ))}
//             </section>
//         </div>
//     );
// }

// export default UserGroup;

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getUserGroups } from '../../store/groups';
import { NavLink } from 'react-router-dom';
// import './Groups.css';

function UserGroup() {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.session.user.id);
    const allGroups = useSelector((state) => Object.values(state.groups.allGroups));
    const userGroups = allGroups.filter((group) => group.organizerId === userId);
    useEffect(() => {
        dispatch(getUserGroups());
    }, [dispatch]);

    return (
        <div className='body'>
            <div className='groups-section1'>
                <h1>
                    <NavLink to={"/events"} className="groups-event-link">
                        Events
                    </NavLink>
                    <NavLink to={"/groups"} className="groups-groups-link">
                        Groups
                    </NavLink>
                </h1>
                <h2>Your Groups</h2>
            </div>
            <div className="group-list-container">
                {userGroups.map((group) => (
                    <div key={group.id} className="group-card">
                        <NavLink
                            to={`/group/${group.id}`}
                            className="landing-page-section3-link"
                        >
                            <img src={group.previewImage} alt="Group" />
                            <div className='groups-section2'>
                                <h3>{group.name}</h3>
                                <p className='location'>{group.city}</p>
                                <div>
                                    {group.numMembers > 1 ? (
                                        <span className='events-number'>{group.numMembers} members</span>) : (
                                        <span className='events-number'>{group.numMembers} member</span>
                                    )}
                                    <span className='group-type'>{group.type}</span>
                                </div>
                            </div>
                        </NavLink>
                        <div className='group-actions'>
                            <NavLink to={`/groups/${group.id}/create-event`} className="groups-create-event-link">
                                Create event
                            </NavLink>
                            <NavLink to={`/groups/${group.id}/update-group`} className="groups-update-group-link">
                                Update
                            </NavLink>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default UserGroup;
