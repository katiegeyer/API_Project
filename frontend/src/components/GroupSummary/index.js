import React from 'react';
import "./GroupSummary.css";

function GroupSummary({
    group
}) {

    return (
        <div>
            <div>
                <div className='group-location'>{`${group.city},${group.state}`}</div>
                <div>{group.about}</div>
                {/* number of events?! */}
                <div>{group.type}</div>
            </div>
        </div>
    );
}

export default GroupSummary;
