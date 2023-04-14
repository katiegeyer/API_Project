
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import GroupSummary from '../GroupSummary';
import { NavLink } from 'react-router-dom';
import './Groups.css';

function GroupList() {
  const dispatch = useDispatch();
  let groups = useSelector((state) => state.groups.allGroups);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);
  console.log(groups)

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
        <NavLink to={"/events"} className="groups-event-link">
          Events
        </NavLink>
        <NavLink to={"/groups"} className="groups-groups-link">
          Groups
        </NavLink>
      </h1>
      <h2>Groups in SpeakUp</h2>
      <div className="group-list-container">
        {groups &&
          Object.values(groups).map((group) => (
            <div key={group.id} className="group-card">
              <NavLink
                to={`/group/${group.id}`}
                className="landing-page-section3-link"
              >
                <img src={group.previewImage} alt="Group" />
                <div className='groups-section1'>
                  <GroupSummary group={group}></GroupSummary>
                  <div>
                    <span className='events-number'>{group.events} events</span>
                    <span className='group-type'>{group.type}</span>
                  </div>
                </div>
              </NavLink>
            </div>
          ))}
      </div>
    </div >
  );
}

export default GroupList;
