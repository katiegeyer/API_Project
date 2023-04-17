import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { deleteEventById } from "../../store/events";
import { useModal } from "../../context/Modal";


export default function DeleteEvent() {
    const dispatch = useDispatch();
    // const { groupId } = useParams();
    // const { eventId } = useParams();
    const singleEvent = useSelector((state) => state.events.singleEvent);
    // const singleEvent = useSelector((state) => state.events.singleEvent[eventId]);
    console.log('singleEvent', singleEvent)
    const history = useHistory()
    const { closeModal } = useModal();

    const handleDelete = () => {
        console.log('singleEvent', singleEvent);
        return dispatch(deleteEventById(singleEvent.id))
            .then(() => {
                history.push("/events")
                closeModal();
            })
    }
    const handleNo = () => {
        closeModal();
    }

    return (
        <>
            <h1>Are you sure you would like to delete this event?</h1>
            <h2>{singleEvent.name}</h2>
            <div>
                <button className='delete' onClick={handleDelete}>Yes</button>
            </div>
            <div>
                <button className='delete' onClick={handleNo}>No</button>
            </div>
        </>
    )
}
// export default function DeleteEvent() {
//     const dispatch = useDispatch();
//     const { eventId, groupId } = useParams();
//     const singleEvent = useSelector((state) => state.events.allEvents[eventId]);
//     const history = useHistory();
//     const { closeModal } = useModal();

//     const handleDelete = () => {
//         return dispatch(deleteEventById(eventId, groupId)) // Pass the eventId and groupId here
//             .then(() => {
//                 history.push("/events");
//                 closeModal();
//             });
//     };

//     const handleNo = () => {
//         closeModal();
//     };

//     console.log(singleEvent);

//     return (
//         <>
//             <h1>Are you sure you would like to delete this group?</h1>
//             <h2>{singleEvent.name}</h2>
//             <div>
//                 <button onClick={handleDelete}>Yes</button>
//             </div>
//             <div>
//                 <button onClick={handleNo}>No</button>
//             </div>
//         </>
//     );
// }
