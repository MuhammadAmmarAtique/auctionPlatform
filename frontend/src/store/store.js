import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import submitComissionProofReducer from "./slices/submitComissionProofSlice";
import auctionReducer from "./slices/auctionSlice";
import bidReducer from "./slices/bidSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    submitComissionProof: submitComissionProofReducer,
    auction:auctionReducer,
    bid:bidReducer
  },
});
