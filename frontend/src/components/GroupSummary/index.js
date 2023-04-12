import React from 'react';
import "./GroupSummary.css";

function GroupSummary({
    group
}) {

    return (
        <div>
            <div><img src="https://food.fnr.sndimg.com/content/dam/images/food/fullset/2021/02/05/Baked-Feta-Pasta-4_s4x3.jpg.rend.hgtvcom.616.493.suffix/1615916524567.jpeg" /></div>
            <div>
                <h2>{group.name}</h2>
                <div className='group-location'>{`${group.city},${group.state}`}</div>
                <div>{group.about}</div>
            </div>
        </div>
    );
}

export default GroupSummary;
