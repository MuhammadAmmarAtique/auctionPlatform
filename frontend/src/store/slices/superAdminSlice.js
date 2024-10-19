import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { getUserAuctionItems, getAllAuctionItems } from "./auctionSlice";

const superAdminSlice = createSlice({
  name: "superAdmin",
  initialState: {
    loading: false,
    AllPaymentProofs : []
  },
  reducers: {
    // #1 Delete Auction item reducers
    deleteAuctionItemRequest(state, action) {
      state.loading = true;
    },
    deleteAuctionItemSuccess(state, action) {
      state.loading = false;
    },
    deleteAuctionItemFailed(state, action) {
      state.loading = false;
    },
    // #2 Get All payment Proofs reducers
    getAllPaymentProofsRequest(state, action) {
      state.loading = true;
    },
    getAllPaymentProofsSuccess(state, action) {
      state.loading = false;
      state.AllPaymentProofs = action.payload;
    },
    getAllPaymentProofsFailed(state, action) {
      state.loading = false;
    },
    //reducer for clearing errors/ Reset slice
    clearAllErrors(state, action) {
      state.loading = false;
    },
  },
});

export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(superAdminSlice.actions.deleteAuctionItemRequest());
  try {
    const response = axios.delete(
      `http://localhost:3000/api/v1/superAdmins/deleteAuctionItem/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(superAdminSlice.actions.deleteAuctionItemSuccess());
    dispatch(getUserAuctionItems());
    dispatch(getAllAuctionItems());
    toast.success(response.data.message);
    dispatch(superAdminSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(superAdminSlice.actions.deleteAuctionItemFailed());
    toast.error(error.response.data.message);
    dispatch(superAdminSlice.actions.clearAllErrors());
  }
};

export const getAllPaymentProofs = () => async (dispatch) => {
  dispatch(superAdminSlice.actions.getAllPaymentProofsRequest());
  try {
    const response = axios.delete(
      `http://localhost:3000/api/v1/superAdmins/getAllPaymentProofs`,
      {
        withCredentials: true,
      }
    );
    dispatch(superAdminSlice.actions.getAllPaymentProofsSuccess(response.data.data));
    toast.success(response.data.message);
    dispatch(superAdminSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(superAdminSlice.actions.getAllPaymentProofsFailed());
    toast.error(error.response.data.message);
    dispatch(superAdminSlice.actions.clearAllErrors());
  }
};

export default superAdminSlice.reducer;
