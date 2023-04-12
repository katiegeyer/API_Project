import React from 'react';
import { Route, Routes, Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'

function OneGroup(props) { //call a restApi to retrieve this groupId (singleGroups, look at the groups store)
    //will fetch the groupId details, full page display of single group. whatever comes back in the payload, we'll show in the return
    const params = useParams();
    console.log('hello', params.groupId);
    return (
        <div>Hello</div>
    )
}

export default OneGroup;
