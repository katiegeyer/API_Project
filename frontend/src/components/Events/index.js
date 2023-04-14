
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getEvents } from '../../store/events';
import { NavLink } from 'react-router-dom';
import EventSummary from '../EventSummary';
import { getOneGroup } from '../../store/groups';
import './Events.css';

function EventList() {
    const dispatch = useDispatch();
    const { groupId } = useParams();
    let events = useSelector((state) => state.events.allEvents);

    const singleGroup = useSelector((state) => state.groups.singleGroup);
    useEffect(() => {
        dispatch(getOneGroup(groupId));
    }, [dispatch, groupId]);

    useEffect(() => {
        dispatch(getEvents());
    }, [dispatch]);
    console.log(events)



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
                                to={`/groups/${singleGroup.id}/events/${event.id}`}
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
