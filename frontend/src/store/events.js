import { csrfFetch } from './csrf';

// Action types
const LOAD_EVENTS = 'events/loadEvents';
const LOAD_ONE_EVENT = 'events/oneEvent';
const CREATE_EVENT = 'events/createEvent';
const LOAD_ORGANIZER_EVENTS = 'events/organizerEvent';
const DELETE_EVENT = 'events/deleteEvent';
// const STORE_USER_DATA = 'events/userData'

// POJO action creators
export const loadEventsAction = (events) => ({
    type: LOAD_EVENTS,
    payload: { Events: events },
});

export const loadOneEventAction = (event) => ({
    type: LOAD_ONE_EVENT,
    event,
});

export const createEventAction = (newEvent) => ({
    type: CREATE_EVENT,
    newEvent,
});

export const loadOrganizerEventAction = (events) => ({
    type: LOAD_ORGANIZER_EVENTS,
    events,
});

export const deleteEventAction = (eventId) => ({
    type: DELETE_EVENT,
    eventId,
});

// export const foreignUserData = (organizer) => ({
//   type: STORE_USER_DATA,
//   organizer,
// })

// Thunks

export const getEvents = () => async (dispatch) => {
    const response = await csrfFetch("/api/events");
    const data = await response.json();
    if (response.ok) {
        await dispatch(loadEventsAction(data));
        return data;
    }
};

export const getOneEvent = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`);
    const data = await response.json();
    if (response.ok) {
        await dispatch(loadOneEventAction(data));
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

export const getUserEvents = () => async (dispatch) => {
    const response = await csrfFetch('/api/events/current');
    const data = await response.json();
    if (response.ok) {
        dispatch(loadOrganizerEventAction(data));
        return data;
    }
};

export const createNewEvent = (eventData) => async (dispatch) => {
    const response = await csrfFetch('/api/events', {
        method: 'POST',
        body: JSON.stringify(eventData),
    });
    const data = await response.json();
    if (response.ok) {
        dispatch(createEventAction(data));
        return data;
    };
};

export const deleteEventById = (eventId) => async (dispatch) => {
    const response = await csrfFetch(`/api/events/${eventId}`, {
        method: 'DELETE',
    });
    if (response.ok) {
        dispatch(deleteEventAction(eventId));
    }
};

// Reducer
const initialState = {
    allEvents: {},
    singleEvent: {},
};

const eventsReducer = (state = initialState, action) => {
    // console.log("action", action);
    // console.log("type", type);
    let newState;

    if (!action || !action.type) {
        return state;
    }

    switch (action.type) {
        case LOAD_EVENTS: {
            const allEvents = {};
            console.log('action', action.payload.Events)
            action.payload.Events.forEach((event) => {
                allEvents[event.id] = event;
            });
            return {
                ...state,
                allEvents,
            };
        }
        case LOAD_ONE_EVENT: {
            newState = {
                ...state,
                singleEvent: action.event,
            };
            return newState;
        }
        case CREATE_EVENT: {
            newState = {
                ...state,
                allEvents: {
                    ...state.allEvents,
                    [action.newEvent.id]: action.newEvent,
                },
            };
            return newState;
        }
        case LOAD_ORGANIZER_EVENTS: {
            const organizerEvents = {};
            action.events.forEach((event) => {
                organizerEvents[event.id] = event;
            });
            return {
                ...state,
                allEvents: {
                    ...organizerEvents,
                },
            };
        }
        case DELETE_EVENT: {
            const { [action.eventId]: deletedEvent, ...restOfEvents } = state.allEvents;
            return {
                ...state,
                allEvents: restOfEvents,
            };
        }
        default:
            return state;
    }
};

export default eventsReducer;
