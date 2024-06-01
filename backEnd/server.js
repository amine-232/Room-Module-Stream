const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const webrtc = require("wrtc"); // Ensure you have 'wrtc' package installed

const socketIO = require("socket.io");
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "http://localhost:8081",
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:8081", methods: ["POST", "GET"] }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const rooms = new Map();

io.on("connection", (socket) => {
  console.log("New client connected");

  socket.on("createRoom", (roomName, callback) => {
    const roomId = Date.now().toString();
    const room = {
      name: roomName,
      users: new Map(),
      messages: [],
      streams: new Map(),
      isStreaming: false, // Add streaming status
      creatorId: socket.id,
      moderators: new Set([socket.id]),
    };
    rooms.set(roomId, room);
    callback({
      id: roomId,
      name: roomName,
      creatorId: socket.id,
      moderators: Array.from(room.moderators),
    });
    io.emit("roomsUpdated", Array.from(rooms.entries()));
  });

  socket.on("startStreaming", async ({ sdp, roomId }) => {
    const room = rooms.get(roomId);
    if (room && !room.isStreaming) {
      room.isStreaming = true;
      const peer = new webrtc.RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
      });

      peer.ontrack = (e) => handleTrackEvent(e, room);
      const desc = new webrtc.RTCSessionDescription(sdp);
      await peer.setRemoteDescription(desc);
      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);
      socket.emit("streamAnswer", { sdp: peer.localDescription });
    }
  });

  socket.on("consume", async ({ roomId, roomUserId, sdp }) => {
    const room = rooms.get(roomId);
    if (!room) {
      console.log("Room not found:", roomId);
      return;
    }

    const peer = new webrtc.RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.stunprotocol.org" }],
    });

    const desc = new webrtc.RTCSessionDescription(sdp);
    await peer.setRemoteDescription(desc);

    if (room.streams.size > 0) {
      room.streams.forEach((stream) => {
        stream.getTracks().forEach((track) => peer.addTrack(track, stream));
      });
    } else {
      console.log("Stream not found in room:", roomId);
    }

    const answer = await peer.createAnswer();
    await peer.setLocalDescription(answer);

    socket.emit("consume-answer", { sdp: peer.localDescription });
  });

  function handleTrackEvent(e, room) {
    const senderStream = e.streams[0];
    room.streams.set(room, e.streams[0]);
    room.isStreaming = true;
    io.emit("new-stream", { room, senderStream });
  }

  socket.on("getRooms", () => {
    io.emit("roomsUpdated", Array.from(rooms.entries()));
  });

  socket.on("joinRoom", (roomId, username) => {
    const userId = socket.id;
    const room = rooms.get(roomId);
    if (room) {
      room.users.set(userId, { id: userId, username });
      socket.join(roomId);
      io.to(roomId).emit("roomUsers", {
        users: Array.from(room.users.values()),
        creatorId: room.creatorId,
        moderators: Array.from(room.moderators),
      });
    }
  });

  socket.on("leaveRoom", (roomId) => {
    const userId = socket.id;
    const room = rooms.get(roomId);
    if (room && room.users.has(userId)) {
      room.users.delete(userId);
      socket.leave(roomId);
      io.to(roomId).emit("roomUsers", {
        users: Array.from(room.users.values()),
        creatorId: room.creatorId,
        moderators: Array.from(room.moderators),
      });
    }
  });

  socket.on("message", ({ roomId, message }) => {
    const userId = socket.id;
    const room = rooms.get(roomId);
    if (room) {
      const msg = { username: `User${userId}`, message };
      room.messages.push(msg);
      io.to(roomId).emit("message", msg);
    }
  });

  socket.on("closeRoom", (roomId) => {
    const room = rooms.get(roomId);
    if (room && room.creatorId === socket.id) {
      rooms.delete(roomId);
      io.emit("roomsUpdated", Array.from(rooms.entries()));
    }
  });

  socket.on("addModerator", (roomId, userId) => {
    const room = rooms.get(roomId);
    if (room && room.creatorId === socket.id) {
      room.moderators.add(userId);
      io.to(roomId).emit("roomUsers", {
        users: Array.from(room.users.values()),
        creatorId: room.creatorId,
        moderators: Array.from(room.moderators),
      });
    }
  });

  socket.on("removeModerator", (roomId, userId) => {
    const room = rooms.get(roomId);
    if (room && room.creatorId === socket.id) {
      room.moderators.delete(userId);
      io.to(roomId).emit("roomUsers", {
        users: Array.from(room.users.values()),
        creatorId: room.creatorId,
        moderators: Array.from(room.moderators),
      });
    }
  });

  socket.on("kickUser", (roomId, userId) => {
    const room = rooms.get(roomId);
    if (
      room &&
      (room.creatorId === socket.id || room.moderators.has(socket.id))
    ) {
      if (userId !== room.creatorId) {
        room.users.delete(userId);
        io.to(userId).emit("kicked", roomId);
        socket.to(roomId).emit("roomUsers", {
          users: Array.from(room.users.values()),
          creatorId: room.creatorId,
          moderators: Array.from(room.moderators),
        });
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    rooms.forEach((room, roomId) => {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        io.to(roomId).emit("roomUsers", {
          users: Array.from(room.users.values()),
          creatorId: room.creatorId,
          moderators: Array.from(room.moderators),
        });
      }
    });
  });
});

server.listen(4000, () => {
  console.log("Server is running on http://localhost:3000");
});
