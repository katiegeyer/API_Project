import React from 'react';
import "./GroupSummary.css";

function GroupSummary({
    group
}) {

    return (
        <div>
            <div>
                <h1 className='group-name'>{`${group.name}`}</h1>
                <h2 className='group-location'>{`${group.city},${group.state}`}</h2>
                <div className='group-about'>{group.about}</div>
            </div>
        </div>
    );
}

export default GroupSummary;
