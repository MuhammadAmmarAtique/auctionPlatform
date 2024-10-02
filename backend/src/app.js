import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";
import {auctionEndedCron} from "./automation/auctionEndedCron.js"
import {verifyComissionCron} from "./automation/verifyComissionCron.js"
import errorHandler from "./middlewares/errorHandler.js"

const app = express();
app.use(cors({
   origin: process.env.CORS_ORIGIN, // Frontend origin
   credentials: true, // Allow credentials (cookies, headers)
   }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);
// routers import
import healthcheckRouter from "./routers/healthcheck.router.js";
import userRouter from "./routers/user.router.js";
import auctionRouter from "./routers/auction.router.js";
import bidRouter from "./routers/bid.router.js";
import commissionProofRouter from "./routers/commissionProof.router.js";
import superAdminRouter from "./routers/superAdmin.router.js";


// routers declaration
app.use("/api/v1/healthcheck",healthcheckRouter)
app.use("/api/v1/users",userRouter)
app.use("/api/v1/auctions",auctionRouter)
app.use("/api/v1/bids",bidRouter)
app.use("/api/v1/comissionProofs",commissionProofRouter)
app.use("/api/v1/superAdmins",superAdminRouter)

// Crons
auctionEndedCron.start();
verifyComissionCron.start();

// errorHandler middleware
app.use(errorHandler);


export { app };
