// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { getUserEvents } from '../../store/events';
// import { NavLink } from 'react-router-dom';
// // import './Events.css';

// function UserEvents() {
//     const dispatch = useDispatch();

//     const userId = useSelector((state) => state.session.user.id);
//     const allGroups = useSelector((state) => Object.values(state.groups.allGroups));
//     const userGroups = allGroups.filter((group) => group.organizerId === userId);
//     const events = useSelector((state) => Object.values(state.events.allEvents));

//     useEffect(() => {
//         dispatch(getUserEvents());
//     }, [dispatch]);

//     const userGroupEvents = events.filter((event) =>
//         userGroups.some((group) => group.id === event.groupId)
//     );

//     function formatDate(dateString) {
//         // const date = new Date(dateString);
//         // const month = String(date.getMonth() + 1).padStart(2, '0');
//         // const day = String(date.getDate()).padStart(2, '0');
//         // const year = date.getFullYear();

//         // return `${month}-${day}-${year}`;
//         const date = new Date(dateString);
//         const monthNames = [
//             "January", "February", "March", "April", "May", "June",
//             "July", "August", "September", "October", "November", "December"
//         ];
//         const day = date.getDate();
//         const month = monthNames[date.getMonth()];
//         const year = date.getFullYear();

//         return `${month} ${day}, ${year}`;
//     };
//     function formatTime(dateString) {
//         // const date = new Date(dateString);
//         // const hours = String(date.getHours()).padStart(2, '0');
//         // const minutes = String(date.getMinutes()).padStart(2, '0');

//         // return `${hours}:${minutes}`;
//         const date = new Date(dateString);
//         let hours = date.getHours();
//         const minutes = String(date.getMinutes()).padStart(2, '0');
//         const ampm = hours >= 12 ? 'PM' : 'AM';

//         hours = hours % 12;
//         hours = hours ? hours : 12; // If the hours is 0, change it to 12

//         return `${hours}:${minutes} ${ampm}`;
//     };


//     // Add formatDate and formatTime functions here

//     return (
//         <div className='body'>
//             <div className='section1'>
//                 <h1 className='events-section1-links'>
//                     <NavLink to={"/events"} className="events-events-link">
//                         Events
//                     </NavLink>
//                     <NavLink to={"/groups"} className="events-groups-link">
//                         Groups
//                     </NavLink>
//                 </h1>
//                 <h2>Your Group Events</h2>
//             </div>
//             <div className="event-list-container">
//                 {userGroupEvents.map((event) => (
//                     <div key={event.id} className="event-card">
//                         <NavLink
//                             to={`/groups/${event.groupId}/events/${event.id}`}
//                             className="section2-link"
//                         >
//                             <div className='events-section2-top'>
//                                 <img src={event.previewImage} alt="Event" />
//                                 <div className='event-summary'>
//                                     <div className='date-time'>
//                                         <span className='date'>{formatDate(`${event.startDate}`)}</span>
//                                         <span> · </span>
//                                         <span className='time'>{formatTime(`${event.startDate}`)}</span>
//                                     </div>
//                                     <h1 className='event-name'>{`${event.name}`}</h1>
//                                     <h2 className='event-location'>{`${event.city},${event.state}`}</h2>
//                                 </div>
//                             </div>
//                             <div className='event-about'>{`${event.description}`}</div>
//                         </NavLink>
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default UserEvents;
