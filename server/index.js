const express = require("express");
const app = express();
const server = require("http").createServer(app);
const ip = require('ip');
const origin = [
  "http://localhost",
  "http://10.0.0.122"
];

const io = require("socket.io")(server, {
  cors: {
    origin: true,
    credentials: true,
  },
  allowEIO3: true,
});
require("dotenv").config({path:"./config.env"});

let ROOMS = [];
const users = {};
io.on("connection", (socket) => {
  if (ROOMS) {
    socket.emit("receive-rooms", ROOMS);
  }
  console.log(socket.id);
  socket.data.rooms = ROOMS;

  socket.on("create-room", (data) => {
    if (ROOMS.length < 300) {
      data.createAt = Date.now();
      let randomInt;
      for (let i = 0; i < 10; i++) {
        randomInt = Math.round(Math.random());
      }
      data.firstPlayer = randomInt;
      ROOMS.push(data);
      //console.log(ROOMS);
      io.emit("receive-rooms", ROOMS);
    }
  });

  socket.on("get-rooms-data", (cb) => {
    cb(ROOMS);
  });

  socket.on("change-username", (data, callback) => {
    if (users[data.name]) {
      callback("users already in use! please pick a different username");
    } else {
      users[data.name] = data;
      callback("200");
    }
  });

  socket.on("remove-player", (data) => {
    if (users[data.name] && users[data.name].id == data.id) {
      console.log(users);
      delete users[data.name];
    }
  });

  socket.on("join-room", (roomID, user, cb) => {
    const room = io.sockets.adapter.rooms.get(roomID) || { size: 0 };
    if (socket.rooms.size < 2) {
      if (room.size < 2) {
        ROOMS.forEach((room, i) => {
          if (room.id == roomID && !room.players[user.id]) {
            room.players[user.id] = user;
            cb(null, room.players);
            socket.to(roomID).emit("update-room", room);
            socket.join(roomID);
            socket.emit("join-room", room, i);
          }
        });
      } else {
        cb("room is full!", null);
      }

      
    } else {
      cb("you're already connected to a room!", null);
    }
  });

  socket.on("exit-room", (roomID, user) => {
    ROOMS.map((room) => {
      if (room.id == roomID) {
        delete room.players[user.id];
        socket.leave(room.id);
        socket.to(roomID).emit("update-room", room);;
        io.emit("receive-rooms", ROOMS);
      }
    });
  });

  socket.on("reconnect-room", (roomID, user, cb) => {
    const index = ROOMS.findIndex((room) => {
      return room.id == roomID;
    });

    if (ROOMS[index]&& ROOMS[index].players) {
      ROOMS[index].players[user.id] = user;
    }
    const tempRoom = ROOMS[index];
    try{delete tempRoom["creatAt"];}catch{}
    socket.join(roomID);
    socket.to(roomID).emit("update-room", tempRoom);
    cb(null, tempRoom);
  });

  socket.on("update-board-data", (roomID, currentPlayer,board)=>{
    const index = ROOMS.findIndex((room) => {return room.id == roomID});
    ROOMS[index].board = board;
    ROOMS[index].firstPlayer = currentPlayer == 0? 1:0;
    if(isBoardFull(board)){
      io.to(roomID).emit("end-game-room",board,"TIE");
      ROOMS.splice(index,1);
    }
    const winner=calculateWinner(board)
    if(winner != null){
      io.to(roomID).emit("end-game-room",board,winner);
      ROOMS.splice(index,1);
    }else{
      socket.to(roomID).emit("update-board-data",currentPlayer,board);
    }
  });

  socket.on('leave-room',(roomID)=>{
    socket.leave(roomID);
  })

  setInterval(() => {
    ROOMS = ROOMS.filter((room) => {
      return (
        room.createAt + 30000 > Date.now() ||
        Object.keys(room.players).length > 0
      );
    });
    io.emit("receive-rooms", ROOMS);
  }, 30000);
});

function isBoardFull(board){
  let isFull = true;
  board.map((position) => {
    if(position == null){
      isFull = false;
    }
  });
  return isFull;
}

function calculateWinner(board) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      if(board[a] == "X") 
        return 0;
      return 1;
    }
  }
  return null;
}

server.listen(process.env.PORT, () => {
  console.log(ip.address());
  console.log("listening on port " + process.env.PORT);
});
