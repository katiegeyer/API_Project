import React from 'react';



function EventSummary({
    event
}) {
    function formatDate(dateString) {
        const date = new Date(dateString);
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();

        return `${month}/${day}/${year}`;
    };
    function formatTime(dateString) {
        const date = new Date(dateString);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${hours}:${minutes}`;
    }

    return (
        <div>
            <div>
                <div>
                    <span className='date'>{formatDate(`${event.startDate}`)}</span>
                    <span className='time'>{formatTime(`${event.startDate}`)}</span>
                </div>
                <h1 className='event-name'>{`${event.name}`}</h1>
                <h2 className='event-location'>{`${event.city},${event.state}`}</h2>
                <div className='event-about'>{`${event.description}`}</div>
            </div>
        </div>
    );
}

export default EventSummary;
