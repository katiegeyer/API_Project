/* eslint-disable default-param-last */
import { csrfFetch } from './csrf';

// Action types
const LOAD_GROUPS = 'groups/loadGroups';
const LOAD_ONE_GROUP = 'groups/oneGroup';
const CREATE_GROUP = 'groups/createGroup';
const EDIT_GROUP = 'groups/editGroup';
const LOAD_ORGANIZER_GROUP = 'groups/organizerGroup';
const DELETE_GROUP = 'groups/deleteGroup';

// POJO action creators
const loadGroupsAction = (groups) => ({
  type: LOAD_GROUPS,
  groups,
});

const loadOneGroupAction = (group) => ({
  type: LOAD_ONE_GROUP,
  group,
});

const createGroupAction = (newGroup) => ({
  type: CREATE_GROUP,
  group,
});

const editGroupAction = (group) => ({
  type: EDIT_GROUP,
  group,
});

const loadOrganizerGroupAction = (groups) => ({
  type: LOAD_ORGANIZER_GROUP,
  groups,
});

const deleteGroupAction = (groupId) => ({
  type: DELETE_GROUP,
  groupId,
});

// Thunks
export const getGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups');
  const data = await response.json();
  dispatch(loadGroupsAction(data));
  return response;
};

export const getOneGroup = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`);
  const group = await response.json();
  dispatch(loadOneGroupAction(group));
};

export const getUserGroups = () => async (dispatch) => {
  const response = await csrfFetch('/api/groups/current');
  const groups = await response.json();
  dispatch(loadOrganizerGroupAction(groups.Groups));
};

export const createNewGroup = (groupData) => async (dispatch) => {
  const response = await csrfFetch('/api/groups', {
    method: 'POST',
    body: JSON.stringify(groupData),
  });
  const newGroup = await response.json();
  dispatch(createGroupAction(newGroup));
};

export const updateGroup = (groupId, groupData) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'PUT',
    body: JSON.stringify(groupData),
  });
  const updatedGroup = await response.json();
  dispatch(editGroupAction(updatedGroup));
};

export const deleteGroupById = (groupId) => async (dispatch) => {
  const response = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE',
  });
  const deletedGroup = await response.json();
  dispatch(deleteGroupAction(deletedGroup.id));
};

// Reducer
const initialState = {
  allGroups: {},
  singleGroup: {
    groupData: {},
    GroupImages: [],
    Organizer: {},
    Venues: [],
  },
};

const groupsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD_GROUPS: {
    //   const allGroups = {};
    //   action.groups.forEach((group) => {
    //     allGroups[group.id] = group;
    //   });
    //   return {
    //     ...state,
    //     allGroups,
    //   };
        newState = Object.assign({}, state);
        newState = {...action.payload.Groups};
        return newState;
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
          [action.group.id]: action.group,
        },
      };
      return newState;
    }
    case EDIT_GROUP: {
      newState = {
        ...state,
        allGroups: {
          ...state.allGroups,
          [action.group.id]: action.group,
        },
      };
      return newState;
    }
    case LOAD_ORGANIZER_GROUP: {
      const organizerGroups = {};
      action.groups.forEach((group) => {
        organizerGroups[group.id] = group;
      });
      return {
        ...state,
        allGroups: {
          ...state.allGroups,
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
