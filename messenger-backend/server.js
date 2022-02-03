var app = require("express")();
var http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
});
var cors = require("cors");

app.use(cors());
app.get("/", (req, res) => res.send("hello!"));

// CREATE CONNECION WITH CLIENT
let id = 0;
io.on("connection", (socket) => {
  id++;
  console.log(`Connected. User No.:${id}`);

  // RECEIVE MESSAGES FROM A CLIENT
  socket.on("message", (msg) => {
    socket.broadcast.emit("message-broadcast", msg);
  });
});

http.listen(3000, () => {
  console.log("listening on *:3000");
});
