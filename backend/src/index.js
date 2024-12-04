import http from "http";
import { Server } from "socket.io";
import { app } from "./app.js";
import { dbConnection } from "./database/index.js";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

// Create the server and Socket.IO instance
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

export { io };

dbConnection()
  .then(() => {
    // Start Express App
    app.listen(process.env.PORT, () => {
      console.log(`Express server running on port ${process.env.PORT}`);
    });

    // Start Http server
    server.listen(5000, () => {
      console.log("Socket.IO server running on port 5000");
    });
  })
  .catch((err) => console.log("Error during database connection:", err));
