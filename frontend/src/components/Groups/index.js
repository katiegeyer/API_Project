
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getGroups } from '../../store/groups';
import GroupSummary from '../GroupSummary';
import { NavLink } from 'react-router-dom';
import './Groups.css'

function GroupList() {
  const dispatch = useDispatch();
  let groups = useSelector((state) => state.groups.allGroups);

  useEffect(() => {
    dispatch(getGroups());
  }, [dispatch]);


  return (
    <div>
      <h1>All Groups</h1>
      {groups && Object.values(groups).map((group) => (
        <div key={group.id} className="group-card">
          <NavLink to={`/group/${group.id}`} className="landing-page-section3-link">
            <GroupSummary group={group}></GroupSummary>
          </NavLink>
          {/* Render other group properties here */}
        </div>
      ))}
    </div>
  );
}



export default GroupList;
