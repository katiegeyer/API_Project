
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getEvents } from '../../store/events';
import { NavLink } from 'react-router-dom';
import EventSummary from '../EventSummary';
import './Events.css';

function EventList() {
    const dispatch = useDispatch();
    let events = useSelector((state) => state.events.allEvents);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);
    console.log(events)

    // useEffect(() => {
    //   dispatch(getOneGroup(groupId));
    // }, [dispatch, groupId]);


    //Need to learn how to connect number of group's events to frontend!!

    //   return (
    //     <div>
    //       <h1><NavLink to={"/events"} className="groups-event-link">Events</NavLink>
    //         <NavLink to={"/groups"} className="groups-groups-link">Groups</NavLink></h1>
    //       <h2>Groups in SpeakUp</h2>
    //       {groups && Object.values(groups).map((group) => (
    //         <div key={group.id} className="group-card">
    //           <NavLink to={`/group/${group.id}`} className="landing-page-section3-link">
    //             <img src={group.previewImage} />
    //             <GroupSummary group={group}></GroupSummary>
    //           </NavLink>
    //         </div>
    //       ))}
    //     </div>
    //   );
    // }

    return (
        <div>
            <h1 className='groups-section1'>
                <NavLink to={"/groups"} className="events-groups-link">
                    Groups
                </NavLink>
                <NavLink to={"/events"} className="events-events-link">
                    Events
                </NavLink>
            </h1>
            <h2>Events in SpeakUp</h2>
            <div className="event-list-container">
                {events &&
                    Object.values(events).map((event) => (
                        <div key={event.id} className="event-card">
                            <NavLink
                                to={`/event/${event.id}`}
                                className="section3-link"
                            >
                                <img src={event.previewImage} alt="Event" />
                                <div className='events-section1'>
                                    <EventSummary event={event}></EventSummary>
                                </div>
                            </NavLink>
                        </div>
                    ))}
            </div>
        </div >
    );
}

export default EventList;
