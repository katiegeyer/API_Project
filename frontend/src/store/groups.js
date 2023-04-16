import { csrfFetch } from './csrf';

// Action types
const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_ONE_GROUP = 'groups/oneGroup';
const CREATE_GROUP = 'groups/createGroup';
const EDIT_GROUP = 'groups/editGroup';
const LOAD_ORGANIZER_GROUP = 'groups/organizerGroup';
const DELETE_GROUP = 'groups/deleteGroup';
// const STORE_USER_DATA = 'groups/userData'

// POJO action creators
export const loadGroupsAction = (groups) => ({
  type: LOAD_GROUPS,
  payload: groups,
});

export const loadOneGroupAction = (group) => ({
  type: LOAD_ONE_GROUP,
  group,
});

export const createGroupAction = (newGroup) => ({
  type: CREATE_GROUP,
  newGroup,
});

export const editGroupAction = (group) => ({
  type: EDIT_GROUP,
  group,
});

export const loadOrganizerGroupAction = (groups) => ({
  type: LOAD_ORGANIZER_GROUP,
  payload: groups,
});

export const deleteGroupAction = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

// export const foreignUserData = (organizer) => ({
//   type: STORE_USER_DATA,
//   organizer,
// })

// Thunks
console.log(csrfFetch("/api/groups"))
export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch("/api/groups");
  const data = await response.json();
  if (response.ok) {
    await dispatch(loadGroupsAction(data));
    return data;
  }
};

export const getOneGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const data = await response.json();
  if (response.ok) {
    await dispatch(loadOneGroupAction(data));
    // console.log('data', data);
    // const res = await fetch(`/api/users/${data.organizerId}`)
    // console.log(res);
    // const foreignData = await response.json();
    // if (res.ok) {
    //   await dispatch(foreignUserData(foreignData));
    //   return foreignData
    // }
    // console.log(data)
    return data;
  };
};

export const getUserGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups/current');
  const data = await response.json();
  if (response.ok) {
    dispatch(loadOrganizerGroupAction(data));
    return data;
  }
};

export const createNewGroup = (groupData) => async (dispatch) => {
  const response = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
  const data = await response.json();
  if (response.ok) {
    dispatch(createGroupAction(data));
    return data;
  };
};

export const updateGroup = (groupId, updatedGroup) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: updatedGroup.name,
      about: updatedGroup.about,
      type: updatedGroup.type,
      private: updatedGroup.private,
      city: updatedGroup.city,
      state: updatedGroup.state,
      id: updatedGroup.id
    }),
  });
  if (response.ok) {
    const data = await response.json();
    dispatch(editGroupAction(data));
    return data;
  }
};

export const deleteGroupById = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });
  if (response.ok) {
    dispatch(deleteGroupAction(groupId));
  }
};

// Reducer
const initialState = {
  allGroups: {},
  singleGroup: {},
};

const groupsReducer = (state = initialState, action) => {
  // console.log("action", action);
  // console.log("type", type);
  let newState;

  if (!action || !action.type) {
    return state;
  }

  switch (action.type) {
    case LOAD_GROUPS: {
      const allGroups = {};
      action.payload.Groups.forEach((group) => {
        allGroups[group.id] = group;
      });
      return {
        ...state,
        allGroups,
      };
    }
    case LOAD_ONE_GROUP: {
      newState = {
        ...state,
        singleGroup: action.group,
      };
      return newState;
    }
    case CREATE_GROUP: {
      newState = {
        ...state,
        allGroups: {
          ...state.allGroups,
          [action.newGroup.id]: action.newGroup,
        },
      };
      return newState;
    }
    case EDIT_GROUP: {
      newState = {
        ...state,
        singleGroup: {
          ...state.singleGroup,
        },
      };
      newState[action.group.id] = action.group;
      return newState;
    }
    case LOAD_ORGANIZER_GROUP: {
      const organizerGroups = {};
      action.payload.Groups.forEach((group) => {
        organizerGroups[group.id] = group;
      });
      return {
        ...state,
        allGroups: {
          ...organizerGroups,
        },
      };
    }
    case DELETE_GROUP: {
      const { [action.groupId]: deletedGroup, ...restOfGroups } = state.allGroups;
      return {
        ...state,
        allGroups: restOfGroups,
      };
    }
    default:
      return state;
  }
};

export default groupsReducer;

// state shape reference
// store = {
//     groups: {
//         allGroups: {
//             [groupId]: {
//                 groupData,
//             },
//             optionalOrderedList: [],
//         },
//         singleGroup: {
//             groupData,
//             GroupImages: [imagesData],
//             Organizer: {
//                 organizerData,
//             },
//             Venues: [venuesData],
//         },
//     },
// };
