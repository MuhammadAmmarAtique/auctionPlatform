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
    //signup reducers
    signupRequest(state,action){
      state.loading = true,
      state.isAuthenticated = false,
      state.user =  {}
    },
    signupSuccess(state,action){
      state.loading = false,
      state.isAuthenticated = true,
      state.user =  action.payload.user
    },
    signupFailed(state,action){
      state.loading = false,
      state.isAuthenticated = false,
      state.user = {}
    },
    //logout reducers
    logoutSuccess(state, action) {
      state.isAuthenticated = false,
      state.user = {};
    },
    logoutFailed(state, action) {
      state.loading = false,
      state.isAuthenticated = state.isAuthenticated,
      state.user = state.user;
    },
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
      data,
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
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3000/api/v1/users/logout", { withCredentials: true });
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.error(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export default userSlice.reducer;
