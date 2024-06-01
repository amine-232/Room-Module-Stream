import { update } from "firebase/database";
import { Children, createContext, useEffect, useState } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState();
  const [gusetRequest, setGuestRequest] = useState([]);
  const [room, setRoom] = useState();
  const [userList, setUserList] = useState(null);
  const [isGuest, setGuest] = useState();

  const newSocket = io("http://localhost:4000/");

  const values = {
    newSocket,
  };

  return (
    <SocketContext.Provider value={values}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
