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
    userAuctions: [],
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
    //  #2 Get User Auction items Reducers
    getUserAuctionItemsRequest(state,action){
       state.loading= true;
    },
    getUserAuctionItemsSuccess(state,action){
      state.loading = false;
      state.userAuctions = action.payload;
    },
    getUserAuctionItemsFailed(state,action){
      state.loading = false;
    },
    //  #3 Get Auction item Details Reducers
    getAuctionItemDetailsRequest(state,action){
      state.loading = true;
    },
    getAuctionItemDetailsSuccess(state,action){
      state.loading = false;
      state.auctionDetail = action.payload.auctionItemDetails;
      state.auctionBidders = action.payload.bidders;
    },
    getAuctionItemDetailsFailed(state,action){
      state.loading = false;
      state.auctionDetail = {};
    },
    //reducer for clearing errors/ Reset slice
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

export const getUserAuctionItems = () => async (dispatch) => {
  dispatch(auctionSlice.actions.getUserAuctionItemsRequest());
  try {
    const response = await axios.get(
      "http://localhost:3000/api/v1/auctions/getuserAuctionItems",
      { withCredentials: true }
    );
    dispatch(
      auctionSlice.actions.getUserAuctionItemsSuccess(response.data.data)
    );
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.getUserAuctionItemsFailed());
    console.log(error.response.data.message);
    dispatch(auctionSlice.actions.clearAllErrors());
  }
};

export const getAuctionItemDetails = (id) => async (dispatch) => {
 dispatch(auctionSlice.actions.getAuctionItemDetailsRequest())
 try {
  const response = axios.get(`http://localhost:3000/api/v1/auctions/getAuctionItemDetails/${id}`, {withCredentials: true})
  dispatch(auctionSlice.actions.getAllAuctionItemsSuccess(response.data.data));
  dispatch(auctionSlice.actions.clearAllErrors());

 } catch (error) {
  dispatch(auctionSlice.actions.getAllAuctionItemsFailed());
  dispatch(auctionSlice.actions.clearAllErrors());
  console.log(error.response.data.message);
 }
}

export default auctionSlice.reducer;
