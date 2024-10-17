import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const submitComissionProofSlice = createSlice({
  name: "submitComissionProof",
  initialState: {
    loading: false,
  },
  reducers: {
    submitComissionProofRequest(state, action) {
      state.loading = true;
    },
    submitComissionProofSuccess(state, action) {
      state.loading = false;
    },
    submitComissionProofFailed(state, action) {
      state.loading = false;
    },
  },
});

export const submitComissionProof = (data) => async (dispatch) => {
  dispatch(submitComissionProofSlice.actions.submitComissionProofRequest());
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/comissionProofs/proofOfComission",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    dispatch(submitComissionProofSlice.actions.submitComissionProofSuccess());
    toast.success(response.data.message);
    return response;
  } catch (error) {
    dispatch(submitComissionProofSlice.actions.submitComissionProofFailed());
    toast.error(error.response.data.message);
    return error; 
  }
};

export default submitComissionProofSlice.reducer;
