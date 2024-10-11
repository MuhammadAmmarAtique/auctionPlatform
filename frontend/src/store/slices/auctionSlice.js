import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    loading: false,
    itemDetail: {},
    auctionDetail: {},
    auctionBidders: {},
    myAuctions: [],
    allAuctions: [],
  },
  reducers: {
    // #1 Get All Auction items Reducers
    getAllAuctionItemsRequest(state,action){
        state.loading = true
    },
    getAllAuctionItemsSuccess(state,action){
        state.loading = false
        state.allAuctions = action.payload
    },
    getAllAuctionItemsFailed(state,action){
        state.loading = false
    },
    // 2) reducer for clearing errors/ Reset slice
    clearAllErrors(state, action) {
        state.loading = false,
        state.itemDetail = state.itemDetail,
        state.auctionDetail = state.auctionDetail,
        state.auctionBidders = state.auctionBidders;
        state.myAuctions = state.myAuctions;
        state.allAuctions = state.allAuctions;
    }
},
});

export const getAllAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getAllAuctionItemsRequest());
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/auctions/get-All-Auction-Items",
      {
        withCredentials: true,
      }
    );
    dispatch(auctionSlice.actions.getAllAuctionItemsSuccess(response.data.data));
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemsFailed());
    console.log(error.response.data.message);
    dispatch(auctionSlice.actions.clearAllErrors());
  }
};

export default auctionSlice.reducer;
