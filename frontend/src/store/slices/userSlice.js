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

export const logout = () => async (dispatch) => {
  try {
    const response = await axios.post("http://localhost:3000/api/v1/users/logout", { withCredentials: true });
    dispatch(userSlice.actions.logoutSuccess());
    toast.success(response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(userSlice.actions.logoutFailed());
    toast.success(error.response.data.message);
    dispatch(userSlice.actions.clearAllErrors());
  }
};

export default userSlice.reducer;
