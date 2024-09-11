import { app } from "./app.js";
import { dbConnection } from "./database/index.js";
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

dbConnection()
.then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server successfully started on port ${process.env.PORT}`);
  });
})
.catch((err)=> console.log("Error during database Connection! ", err))
