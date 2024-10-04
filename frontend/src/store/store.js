import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import submitComissionProofReducer from "./slices/submitComissionProofSlice"

export const store = configureStore({
    reducer: {
        user: userReducer,
        submitComissionProof:submitComissionProofReducer
    }
})