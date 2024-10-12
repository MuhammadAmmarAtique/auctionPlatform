import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const userSlice = createSlice({
  name: "user",
  initialState: {
    loading: false,
    isAuthenticated: false,
    user: {},
    leaderboard: []
  },
  reducers: {
    // 1) signup reducers
    signupRequest(state,action){
      state.loading = true,
      state.isAuthenticated = false,
      state.user =  {}
    },
    signupSuccess(state,action){
      state.loading = false,
      state.isAuthenticated = true,
      state.user =  action.payload.data
    },
    signupFailed(state,action){
      state.loading = false,
      state.isAuthenticated = false,
      state.user = {}
    },
    // 2) login reducers
    loginRequest(state,action){
      state.loading = true,
      state.isAuthenticated = false
      state.user =  {}
    },
    loginSuccess(state,action){
      state.loading = false,
      state.isAuthenticated = true,
      state.user= action.payload.data
    },
    loginFailed(state,action){
      state.loading = false,
      state.isAuthenticated = false,
      state.user = {}
    },
    // 3) logout reducers
    logoutSuccess(state, action) {
      state.isAuthenticated = false,
      state.user = {};
    },
    logoutFailed(state, action) {
      state.loading = false,
      state.isAuthenticated = state.isAuthenticated,
      state.user = state.user;
    },
    //4) getUser reducers
    getUserRequest(state,action){
      state.loading = true,
      state.isAuthenticated = false
      state.user =  {}
    },
    getUserSuccess(state, action) {
      state.loading = false,
      state.isAuthenticated = true,
      state.user = action.payload;
    },
    getUserFailed(state, action) {
      state.loading = false,
      state.isAuthenticated = false,
      state.user = {};
    },
    // 5) fetchLeaderboard reducers
    fetchLeaderboardRequest(state, action) {
      state.loading = true;
      state.leaderboard = [];
    },
    fetchLeaderboardSuccess(state, action) {
      state.loading = false;
      state.leaderboard = action.payload;
    },
    fetchLeaderboardFailed(state, action) {
      state.loading = false;
      state.leaderboard = [];
    },
    // 6) reducer for clearing errors / Reset Slice
    clearAllErrors(state, action) {
      state.loading = false,
      state.isAuthenticated = state.isAuthenticated,
      state.user = state.user,
      state.leaderboard = state.leaderboard;
    }
  }
});

export const register = (data) => async (dispatch) => {
  dispatch(userSlice.actions.signupRequest());
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/register",
      data, // sending formdata in req body
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(userSlice.actions.signupSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.signupFailed());

  //  Check if there are multiple Mongoose validation errors generated by errorHandler middleware from the backend
  if (error.response && error.response.data.errors.length > 0) {
    // Loop through each error and display it using toast
    error.response.data.errors.forEach((errMessage) => {
      toast.error(errMessage);
    });
  } else {
    toast.error(error.response.data.message);
  }
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const login = (data) => async (dispatch) => {
  dispatch(userSlice.actions.loginRequest());
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/login",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(userSlice.actions.loginSuccess(response.data));
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.loginFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/users/logout", 
      {}, // sending empty req body
      { 
        withCredentials: true,
       }
      );
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

// getUser method Keep users logged in & get user data by using cookies  when the page reloads or browser reopen

export const getUser = () => async (dispatch) => {
  dispatch(userSlice.actions.getUserRequest());
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/users/get-user",
      {
        withCredentials: true,
      }
    );
    dispatch(userSlice.actions.getUserSuccess(response.data.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.getUserFailed());
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const fetchLeaderboard = () => async (dispatch) => {
  dispatch(userSlice.actions.fetchLeaderboardRequest());
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/users/fetch-Leaderboard",
      { withCredentials: true }
    );
    console.log("response: ", response.data.data);
    dispatch(userSlice.actions.fetchLeaderboardSuccess(response.data.data));
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.fetchLeaderboardFailed());
    dispatch(userSlice.actions.clearAllErrors());
    console.log(error.response.data.message);
  }
};

export default userSlice.reducer;
