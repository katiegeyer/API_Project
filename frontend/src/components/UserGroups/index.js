import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getUserGroups } from '../../store/groups';


function UserGroup() {
    const dispatch = useDispatch();

    const userId = useSelector((state) => state.session.user.id);
    const allGroups = useSelector((state) => Object.values(state.groups.allGroups));
    const userGroups = allGroups.filter((group) => group.organizerId === userId);

    useEffect(() => {
        dispatch(getUserGroups());
    }, [dispatch]);

    return (
        <div className='user-groups-container'>
            <h1>Your Groups</h1>
            <section className='user-groups'>
                {userGroups.map((group) => (
                    <div key={group.id} className='user-group'>
                        <div className='group-image'>
                            <img src={group.previewImage} alt={group.name} />
                        </div>
                        <div className='group-details'>
                            <h2 className='group-name'>
                                <NavLink to={`/groups/${group.id}`} className="group-link">
                                    {group.name}
                                </NavLink>
                            </h2>
                            <p className='location'>{group.city}</p>
                            <div className='group-actions'>
                                <NavLink to={`/groups/${group.id}/create-event`} className="groups-create-event-link">
                                    Create event
                                </NavLink>
                                <NavLink to={`/groups/${group.id}/update-group`} className="groups-update-group-link">
                                    Update
                                </NavLink>
                            </div>
                        </div>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default UserGroup;
