import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { getOneGroup } from '../../store/groups';

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
            {singleGroup ? (
                <>
                    <h1>{singleGroup.name}</h1>
                    {/* Render other group properties here */}
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}


export default OneGroup;
