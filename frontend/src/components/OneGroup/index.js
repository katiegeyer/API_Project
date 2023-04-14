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


    // // return JSON.stringify(singleGroup);
    // function formatDate(dateString) {
    //     const date = new Date(dateString);
    //     const month = String(date.getMonth() + 1).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    //     const year = date.getFullYear();

    //     return `${month}/${day}/${year}`;
    // };
    // let startDay = formatDate(singleGroup.events.startDate);
    // let endDay = formatDate(singleGroup.events.endDate);

    // function formatTime(dateString) {
    //     const date = new Date(dateString);
    //     const hours = String(date.getHours()).padStart(2, '0');
    //     const minutes = String(date.getMinutes()).padStart(2, '0');

    //     return `${hours}:${minutes}`;
    // }

    // let startTime = formatTime(singleGroup.events.startDate);
    // let endTime = formatTime(singleGroup.events.endDate);

    return (
        <div>
            <section className='group-details-section1'>
                <div className="section1-left-image">
                    <div>&lt; <NavLink to={"/groups"} className="groups-groups-link">Groups</NavLink></div>
                    <img src={singleGroup.previewImage} />
                </div>
                <div className="section1-right">
                    <h1 className='group-name-right'>{singleGroup.name}</h1>
                    <div className='location'>{singleGroup.city}</div>
                    {/* <GroupSummary group={singleGroup} className="one-group-summary"></GroupSummary>
                    <p>Organized by {singleGroup.organizerName}</p> */}
                </div>
                <div>
                    {/*if not organizer*/}
                    <button className="join-group-button">Join this Group</button>
                </div>
                {/* if session user && if group organizerId = userId} */}
                <div><NavLink to={`/groups/${singleGroup.id}/create-event`} className="groups-create-event-link">Create event</NavLink>
                    <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">Update</NavLink>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteOpenModal />}
                    />
                </div>
            </section>
            <section className='group-details-section2'>
                <h1>Organizer</h1>
                <h2>{singleGroup.organizerName}</h2>
            </section>
            <section className='group-detail-section3'>
                <h1>What we're about</h1>
                <p>{singleGroup.about}</p>
            </section>
            <section className='group-detail-section4'>
                <h2>Upcoming Events</h2>
                {Array.isArray(singleGroup.groupEvents) && Object.values(singleGroup.groupEvents).map((event) => (
                    <div key={event.id}>
                        <h3>{event.name}</h3>
                        {/* Render other event properties here */}
                    </div>
                ))}
            </section>
        </div >
    );
}


export default OneGroup;
