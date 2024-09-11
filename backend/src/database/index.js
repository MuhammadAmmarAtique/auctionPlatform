import mongoose from "mongoose";
import { dbName } from "../constants.js";

export const dbConnection = async (params) => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.DATABASE_URL}/${dbName}`
    );
    console.log(
      "Database Connection successfull!",
      `DB HOST:: ${connectionInstance.connections[0].host}`
    );
  } catch (error) {
    console.log("Error during database Connection! ", error);
  }
};
