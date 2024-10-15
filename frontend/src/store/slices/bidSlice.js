import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import {getAuctionItemDetails} from "./auctionSlice"

const bidSlice = createSlice({
  name: "bid",
  initialState: {
    loading: false,
  },
  reducers: {
    placeBidRequest(state, action) {
      state.loading = true;
    },
    placeBidSuccess(state, action) {
      state.loading = false;
    },
    placeBidFailed(state, action) {
      state.loading = false;
    },
  },
});

export const placeBid = (id, data) => async (dispatch) => {
  dispatch(bidSlice.actions.placeBidRequest());
  try {
    const response = await axios.post(
      `http://localhost:3000/api/v1/bids/place-bid/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bidSlice.actions.placeBidSuccess());
    dispatch(getAuctionItemDetails(id));
    toast.success(response.data.data.message);
  } catch (error) {
    dispatch(bidSlice.actions.placeBidFailed());
    toast.error(error.response.data.message);
  }
};

export default bidSlice.reducer;
