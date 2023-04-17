import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getOneGroup } from '../../store/groups';
// import GroupSummary from '../GroupSummary';
import './OneGroup.css'
import OpenModalButton from '../OpenModalButton';
import DeleteOpenModal from '../DeleteOpenModal';


//does not throw error when groupId doesn't exist, shows same thing

function OneGroup() { //call a restApi to retrieve this groupId (singleGroups, look at the groups store)
    //will fetch the groupId details, full page display of single group. whatever comes back in the payload, we'll show in the return
    const { groupId } = useParams();
    const dispatch = useDispatch();

    const singleGroup = useSelector((state) => state.groups.singleGroup);
    useEffect(() => {
        dispatch(getOneGroup(groupId));
    }, [dispatch, groupId]);
    console.log('events', singleGroup.groupEvents)

    function formatDate(dateString) {
        const date = new Date(dateString);
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const day = date.getDate();
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';

        hours = hours % 12;
        hours = hours ? hours : 12;

        return `${hours}:${minutes} ${ampm}`;
    }

    const sortedEvents = Array.isArray(singleGroup.groupEvents)
        ? singleGroup.groupEvents.sort((a, b) => {
            const aDate = new Date(a.startDate);
            const bDate = new Date(b.startDate);
            return aDate - bDate;
        })
        : [];
    console.log(sortedEvents);
    const upcomingEvents = sortedEvents.filter(event => new Date(event.startDate) >= new Date());
    const pastEvents = sortedEvents.filter(event => new Date(event.startDate) < new Date());

    const sessionUser = useSelector((state) => state.session.user);


    // return (
    //     <div className='group-detail-body'>
    //         <div className="section1-left-image">
    //             <p className='return-groups'>&lt;</p>
    //             <div> <NavLink to={"/groups"} className="group-groups-link">Groups</NavLink></div>
    //         </div>
    //         <div className='groupcontainer-card'>
    //             <img src={singleGroup.previewImage} />
    //             <section className='group-details-section1'>
    //                 <div className="section1-right">
    //                     <div class="section1-right-content">
    //                         <h1 className='group-name-right'>{singleGroup.name}</h1>
    //                         <div className='location'>{singleGroup.city}</div>
    //                         {/* <GroupSummary group={singleGroup} className="one-group-summary"></GroupSummary>
    //                 <p>Organized by {singleGroup.organizerName}</p> */}
    //                         <div className='event-num'>{singleGroup.events} events ·  {singleGroup.type}</div>
    //                         <div className='group-details-section2'>
    //                         </div>
    //                         <div className='organizer-name'>Organized by {singleGroup.organizerName}</div>
    //                         <div>{sessionUser && sessionUser.id !== singleGroup.organizerId && (
    //                             <button className="join-group-button" disabled={sessionUser.id === singleGroup.organizerId} onClick={() => alert('Feature coming soon')}
    //                             >Join this Group</button>
    //                         )}
    //                         </div>
    //                     </div>
    //                 </div>
    //                 {sessionUser && sessionUser.id === singleGroup.organizerId && (
    //                     <div className="section1-right-bottom">
    //                         <NavLink to={`/groups/${singleGroup.id}/create-event`} className="groups-create-event-link">
    //                             Create event
    //                         </NavLink>
    //                         <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">
    //                             Update
    //                         </NavLink>
    //                         <OpenModalButton buttonText="Delete" modalComponent={<DeleteOpenModal />} />
    //                     </div>
    //                 )}
    //                 {/* if session user && if group organizerId = userId} */}
    //                 {/* <div><NavLink to={`/groups/${singleGroup.id}/create-event`} className="groups-create-event-link">Create event</NavLink>
    //                 <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">Update</NavLink>
    //                 <OpenModalButton
    //                     buttonText="Delete"
    //                     modalComponent={<DeleteOpenModal />}
    //                 />
    //             </div>
    //         </section> */}
    //                 {/* <div className="section1-right-bottom">
    //                 <NavLink to={`/groups/${singleGroup.id}/create-event`} className="groups-create-event-link">
    //                     Create event
    //                 </NavLink>
    //                 <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">
    //                     Update
    //                 </NavLink>
    //                 <OpenModalButton buttonText="Delete" modalComponent={<DeleteOpenModal />} />
    //             </div> */}
    //             </section>
    //             <section className='group-detail-section3'>
    //                 <h1 className='organizer'>Organizer</h1>
    //                 <div>{singleGroup.organizerName}</div>
    //                 <h2>What we're about</h2>
    //                 <p>{singleGroup.about}</p>
    //             </section>
    //         </div>
    return (
        <div className='group-detail-body'>
            <div className="section1-left-image">
                <p className='return-groups'>&lt;</p>
                <div> <NavLink to={"/groups"} className="group-groups-link">Groups</NavLink></div>
            </div>
            <div className='groupcontainer-card'>
                <img src={singleGroup.previewImage} />
                <section className='group-details-section1'>
                    <h1 className='group-name-right'>{singleGroup.name}</h1>

                        <div class="section1-right-content">
                            <div className='location'>{singleGroup.city}, {singleGroup.state}</div>
                            <div className='event-num'>{singleGroup.events} events ·  {singleGroup.type}</div>
                            <div className='group-details-section2'>
                            </div>
                            <div className='organizer-name'>Organized by {singleGroup.organizerName}</div>
                            <div>{sessionUser && sessionUser.id !== singleGroup.organizerId && (
                                <button className="join-group-button" disabled={sessionUser.id === singleGroup.organizerId} onClick={() => alert('Feature coming soon')}
                                >Join this Group</button>
                            )}
            
                        </div>
                    </div>
                    <div className='user-buttons-create'>
                        {sessionUser && sessionUser.id === singleGroup.organizerId && (
                            <div className="section1-right-bottom">
                                <NavLink to={`/groups/${singleGroup.id}/create-event`} className="groups-create-event-link">
                                    Create event
                                </NavLink>
                                <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">
                                    Update
                                </NavLink>
                                <OpenModalButton buttonText="Delete" modalComponent={<DeleteOpenModal />} />
                            </div>
                        )}
                    </div>
                </section>
            </div>
            <section className='group-detail-section3'>
                <h1 className='organizer'>Organizer</h1>
                <div className='org'>{singleGroup.organizerName}</div>
                <h2>What we're about</h2>
                <p>{singleGroup.about}</p>
            </section>
            <div className='events-group'>
                <section className='group-detail-section4'>
                    <h2>Upcoming Events ({upcomingEvents.length})</h2>
                    {Array.isArray(upcomingEvents) && upcomingEvents.map((event) => (
                        <NavLink
                            to={`/groups/${event.groupId}/events/${event.id}`}
                        >
                            <div key={event.id} className="event-card-groups">
                                {/* <h3>{event.name}</h3>
                        <div>{event.location}</div>
                        Render other event properties here */}
                                <img src={event.previewImage} alt="Event" />
                                <div className="event-info">
                                    <div className="event-date-time">
                                        <span>{formatDate(event.startDate)}</span>
                                        <span> · </span>
                                        <span>{formatTime(event.startDate)}</span>
                                    </div>
                                    <h3>{event.name}</h3>
                                    <p className="location">{event.city}</p>
                                    <p className="description">{event.description}</p>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                    {/* </section> */}
                    {/* <section className='group-detail-section5'> */}
                    {/* {pastEvents.length > 0 ? (
                        <h2>Past Events</h2>
                    {Array.isArray(pastEvents) && pastEvents.map((event) => (
                            <div key={event.id} className="event-card-groups">
                                <img src={event.previewImage} alt="Event" />
                                <div className="event-info">
                                    <div className="event-date-time">
                                        <span>{formatDate(event.startDate)}</span>
                                        <span> · </span>
                                        <span>{formatTime(event.startDate)}</span>
                                    </div>
                                    <h3>{event.name}</h3>
                                    <p className="location">{event.city}</p>
                                    <p className="description">{event.description}</p>
                                </div>
                            </div>
                        ))}
                    ) : null} */}
                    {pastEvents.length > 0 ? (
                        <>
                            <h2>Past Events ({pastEvents.length})</h2>
                            {pastEvents.map((event) => (
                                <NavLink
                                    to={`/groups/${event.groupId}/events/${event.id}`}
                                >
                                    <div key={event.id} className="event-card-groups">
                                        <img src={event.previewImage} alt="Event" />
                                        <div className="event-info">
                                            <div className="event-date-time">
                                                <span>{formatDate(event.startDate)}</span>
                                                <span> · </span>
                                                <span>{formatTime(event.startDate)}</span>
                                            </div>
                                            <h3>{event.name}</h3>
                                            <p className="location">{event.city}</p>
                                            <p className="description">{event.description}</p>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </>
                    ) : null}
                </section>
            </div>
        </div >
    );
}


export default OneGroup;
