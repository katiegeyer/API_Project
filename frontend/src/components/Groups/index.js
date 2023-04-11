
import React, { useEffect, Tooltip } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import groupsReducer from '../../store/groups';

function GroupList() {
  const dispatch = useDispatch();
  const groups = useSelector((state) => state.groups.allGroups);

  useEffect(() => {
    dispatch(groupsReducer());
  }, [dispatch]);

  return (
    <div>
      <h1>All Groups</h1>
      {Object.values(groups).map((group) => (
        <div key={group.id}>
          <h2>{group.name}</h2>
          {/* Render other group properties here */}
        </div>
      ))}
    </div>
  );
}

export default GroupList;
