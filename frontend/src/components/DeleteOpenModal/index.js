import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { deleteGroupById } from "../../store/groups";
import { useModal } from "../../context/Modal";


export default function DeleteOpenModal() {
    const dispatch = useDispatch();
    const singleGroup = useSelector((state) => state.groups.singleGroup);
    const history = useHistory()
    const { closeModal } = useModal();

    const handleDelete = () => {
        return dispatch(deleteGroupById(singleGroup.id))
            .then(() => {
                history.push("/groups")
                closeModal();
            })
    }
    const handleNo = () => {
        closeModal();
    }
    return (
        <>
            <h1>Are you sure you would like to delete this group? hi</h1>
            <h2>{singleGroup.name}</h2>
            <div>
                <button onClick={handleDelete}>Yes</button>
            </div>
            <div>
                <button onClick={handleNo}>No</button>
            </div>
        </>
    )
}


//since we already grabbed all groups - instead of asking redux to ask for one specific group, that action should be responsible for going through current list and looking for one that has current id.  (redundant request)
