import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const auctionSlice = createSlice({
  name: "auction",
  initialState: {
    loading: false,
    auctionItemDetail: {},
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
      state.auctionItemDetail = action.payload.auctionItemDetails;
      state.auctionBidders = action.payload.bidders;
    },
    getAuctionItemDetailsFailed(state,action){
      state.loading = false;
      state.auctionItemDetail = {};
    },
    // #4 Add new Auction Item Reducers
    addNewAuctionItemRequest(state,action){
      state.loading = true;
    },
    addNewAuctionItemSuccess(state,action){
      state.loading = false;
    },
    addNewAuctionItemFailed(state,action){
      state.loading = false;
    },
    // #5 Republish Auction item reducers
    republishAuctionItemRequest(state,action){
      state.loading = true;
    },
    republishAuctionItemSuccess(state,action){
      state.loading = false;
    },
    republishAuctionItemFailed(state,action){
      state.loading = true;
    },
    // #6 Delete Auction item reducers
    deleteAuctionItemRequest(state,action){
      state.loading = true;
    },
    deleteAuctionItemSuccess(state,action){
      state.loading = false;
    },
    deleteAuctionItemFailed(state,action){
      state.loading = false;
    },
    //#7 reducer for clearing errors/ Reset slice
    clearAllErrors(state, action) {
        state.loading = false,
        state.auctionItemDetail = state.auctionItemDetail,
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
  dispatch(auctionSlice.actions.getAuctionItemDetailsRequest());
  try {
    const response = axios.get(
      `http://localhost:3000/api/v1/auctions/getAuctionItemDetails/${id}`,
      { withCredentials: true }
    );
    dispatch(
      auctionSlice.actions.getAllAuctionItemsSuccess(response.data.data)
    );
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.getAllAuctionItemsFailed());
    dispatch(auctionSlice.actions.clearAllErrors());
    console.log(error.response.data.message);
  }
};

export const addNewAuctionItem = (data) => async (dispatch) => {
  dispatch(auctionSlice.actions.addNewAuctionItemRequest());
  try {
    const response = await axios.post(
      "http://localhost:3000/api/v1/auctions/add-new-auction-Item",
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    toast.success(response.data.data.message);
    dispatch(auctionSlice.actions.addNewAuctionItemSuccess());
    dispatch(getAllAuctionItems())
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.addNewAuctionItemFailed());
    toast.error(error.response.data.message);
    dispatch(auctionSlice.actions.clearAllErrors());
  }
};

export const republishAuctionItem = (id, data) => async (dispatch) => {
  dispatch(auctionSlice.actions.republishAuctionItemRequest());
  try {
    const response = axios.put(
      `http://localhost:3000/api/v1/auctions/republishAuctionItem/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(auctionSlice.actions.republishAuctionItemSuccess());
    toast.success(response.data.data.message);
    dispatch(getUserAuctionItems());
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.republishAuctionItemSuccess());
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.republishAuctionItemFailed());
    toast.error(error.response.data.message);
    dispatch(auctionSlice.actions.clearAllErrors());
  }
};

export const deleteAuctionItem = (id) => async (dispatch) => {
  dispatch(auctionSlice.actions.deleteAuctionItemRequest());
  try {
    const response = await axios.delete(
      `http://localhost:3000/api/v1/auctions/deleteAuctionItem/${id}`,
      {
        withCredentials: true,
      }
    );
    dispatch(auctionSlice.actions.deleteAuctionItemSuccess());
    toast.success(response.data.data.message);
    dispatch(getAllAuctionItems());
    dispatch(auctionSlice.actions.clearAllErrors());
  } catch (error) {
    dispatch(auctionSlice.actions.deleteAuctionItemFailed());
    toast.error(error.response.data.message);
    dispatch(auctionSlice.actions.clearAllErrors());
  }
};

export default auctionSlice.reducer;
