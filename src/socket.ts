import { io, Socket } from "socket.io-client";

let socket: Socket<any> | null = null;

export const createSocket = () => {
  if (socket) return socket;

  socket = io(import.meta.env.VITE_SOCKET_ORIGIN, {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionDelay: 1000,
  });

  return socket;
};

export const getSocket = () => {
  return socket ?? createSocket();
};

export const destroySocket = () => {
  socket?.removeAllListeners();
  socket?.disconnect();
  socket = null;
};
