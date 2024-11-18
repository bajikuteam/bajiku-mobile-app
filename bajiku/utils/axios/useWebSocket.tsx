import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// const SOCKET_URL = 'http://192.168.1.107:5000'; 
const SOCKET_URL = 'https://backend-server-quhu.onrender.com';  



export const useWebSocket = () => {
  const [socket, setSocket] = useState<Socket | null>(null); 

  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return { socket };
};
