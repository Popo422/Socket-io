const { instrument } = require("@socket.io/admin-ui");
const io = require("socket.io")(3000, {
  cors: {
    origin: [
      "http://localhost:5174",
      "http://localhost:5173",
      "https://admin.socket.io",
      "https://admin.socket.io/",
      "http://admin.socket.io",
    ],
    credentials: true,
  },
});

// const userIo = io.off("/user")

io.on("connection", (socket) => {
  console.log(socket.id);
  socket.on("join-room", (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });
  socket.on("customEvent", (message, room) => {
    if (room === "") {
      socket.broadcast.emit("received", message, "received");
    } else {
      socket.to(room).emit("received", message, "received");
    }
  });
});

io.timeout(5000).emit("my-event", (err) => {
  if (err) {
    console.log(err);
  }
});

instrument(io, { auth: false });
