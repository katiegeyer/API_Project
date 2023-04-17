/* eslint-disable default-param-last */
import { csrfFetch } from './csrf';

const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

const setUser = (user) => ({
  type: SET_USER,
  payload: user,
});

const removeUser = () => ({
  type: REMOVE_USER,
});

export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const response = await csrfFetch('/api/session', {
    method: 'POST',
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

const initialState = { user: null };

// const initialState = {
//     user: {
//         id: null,
//         email: null,
//         username: null,
//         firstName: null,
//         lastName: null,
//         createdAt: null,
//         updatedAt: null,
//     },
// };

const sessionReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case SET_USER:
      newState = { ...state };
      newState.user = action.payload;
      return newState;
    case REMOVE_USER:
      newState = { ...state };
      newState.user = null;
      return newState;
    default:
      return state;
  }
};

export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch('/api/session');
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// export const signup = (user) => async (dispatch) => {
//   const {
//     username, firstName, lastName, email, password,
//   } = user;
//   const response = await csrfFetch('/api/users', {
//     method: 'POST',
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//     }),
//   });
//   if (!response.ok) {
//     const errorData = await response.json();
//     throw errorData;
//   }
//   const data = await response.json();
//   dispatch(setUser(data));
//   return response;
// };


// export const signup = (user) => async (dispatch) => {
//   try {
//     const {
//       username, firstName, lastName, email, password,
//     } = user;
//     const response = await csrfFetch('/api/users', {
//       method: 'POST',
//       body: JSON.stringify({
//         username,
//         firstName,
//         lastName,
//         email,
//         password,
//       }),
//     });
//     if (response.ok) {
//       const data = await response.json();
//       dispatch(setUser(data));
//       return response;
//     }
//   } catch (error) {
//       const errorData = await response.json();
//       throw errorData;
//     }
//   };


export const signup = (user) => async (dispatch) => {
  // try {
  const {
    username, firstName, lastName, email, password,
  } = user;
  let errors;
  const response = await csrfFetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),

  }).catch(async (e) => {
    return await e.json();
  });
  console.log('after fetch', response)

  if (response.ok) {
    const data = await response.json();
    dispatch(setUser(data));
    return response;
  } else {
    // const errorData = await response.json();
    // throw errorData;
    throw response;
  }
  // } catch (error) {
  //   error.then()
  //   console.log('catch', error.json());
  //   throw error;
  // }
};

export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};


// export const signup = (user) => async (dispatch) => {
//   const {
//     username, firstName, lastName, email, password,
//   } = user;

//   try {
//     const response = await csrfFetch('/api/users', {
//       method: 'POST',
//       body: JSON.stringify({
//         username,
//         firstName,
//         lastName,
//         email,
//         password,
//       }),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       console.log('Errors from backend:', errorData); // Log the errors from the backend
//       throw errorData;
//     }

//     const data = await response.json();
//     dispatch(setUser(data));
//     return { ok: true };
//   } catch (error) {
//     console.error('Error during signup:', error);
//     return { ok: false, errors: error.errors };
//   }
// };

// export const signup = (user) => async (dispatch) => {
//   const {
//     username, firstName, lastName, email, password,
//   } = user;
//   const response = await csrfFetch('/api/users', {
//     method: 'POST',
//     body: JSON.stringify({
//       username,
//       firstName,
//       lastName,
//       email,
//       password,
//     }),
//   });

//   if (!response.ok) {
//     const errorData = await response.json();
//     return { ok: false, errors: errorData.errors };
//   }

//   const data = await response.json();
//   dispatch(setUser(data));
//   return { ok: true };
// };



// export const logout = () => async (dispatch) => {
//   const response = await csrfFetch('/api/session', {
//     method: 'DELETE',
//   });
//   dispatch(removeUser());
//   return response;
// };

export default sessionReducer;
