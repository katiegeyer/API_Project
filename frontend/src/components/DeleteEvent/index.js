import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteEventById } from "../../store/events";
import { useModal } from "../../context/Modal";


export default function DeleteEvent () {
    const dispatch = useDispatch();
    const singleEvent = useSelector((state) => state.events.singleEvent);
    const history = useHistory()
    const { closeModal } = useModal();

    const handleDelete = () => {
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
            <h1>Are you sure you would like to delete this group?</h1>
            <h2>{singleEvent.name}</h2>
            <div>
                <button onClick={handleDelete}>Yes</button>
            </div>
            <div>
                <button onClick={handleNo}>No</button>
            </div>
        </>
    )
}
