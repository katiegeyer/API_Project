import React, { useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getOneGroup } from '../../store/groups';
import GroupSummary from '../GroupSummary';
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

    return (
        <div>
            <section className='group-details-section1'>
                <div className="section1-left-image">
                    <div>&lt; <NavLink to={"/groups"} className="groups-groups-link">Groups</NavLink></div>
                    <img src="https://static.boredpanda.com/blog/wp-content/uploads/2019/12/guy-protesting-randon-things-dudewithsign-1-13-5df09bdd2244f__700.jpg" />
                </div>
                <div className="section1-right">
                    <GroupSummary group={singleGroup} className="one-group-summary"></GroupSummary>
                    <p>Organized by {singleGroup.organizerName}</p>
                </div>
                <div>
                    {/*if not organizer*/}
                    <button className="join-group-button">Join this Group</button>
                </div>
                {/* if session user && if group organizerId = userId} */}
                <div><NavLink to={"/create-event"} className="groups-create-event-link">Create event</NavLink>
                    <NavLink to={`/${singleGroup.id}/update-group`} className="groups-create-event-link">Update</NavLink>
                    <OpenModalButton
                        buttonText="Delete"
                        modalComponent={<DeleteOpenModal />}
                    />
                </div>
            </section>
            <section className='group-details-section2'>
                <h1>Organizer</h1>
                <h2>!OrganizerName!</h2>
            </section>
            <section className='group-detail-section3'>
                <h1>What we're about</h1>
                <p>{singleGroup.about}</p>
            </section>
            <section className='group-detail-section4'>
                <h2>Upcoming Events  {singleGroup.events} </h2>
            </section>
            <section className='group-detail-section5'>
                <h2>{singleGroup.previewImage} Past Events !!!numbers of past events, most recent on top!!</h2>
            </section>
        </div >
    );
}


export default OneGroup;
