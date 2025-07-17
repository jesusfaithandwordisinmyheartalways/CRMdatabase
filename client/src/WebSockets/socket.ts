import { io } from 'socket.io-client';

export const socket = io('https://crmdatabaseserver.onrender.com', { transports: ['websocket'] });
