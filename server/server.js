import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import leadRoutes from './routes/leads.js';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'https://crmdatabaseclient.onrender.com', // your React app origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/leads', leadRoutes);

// WebSocket connections
io.on('connection', (socket) => {
  console.log('🔌 New client connected');

  socket.on('updateNotes', () => {
    io.emit('notesUpdated');
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected');
  });
});

// Base route to check if backend is live
app.get('/', (req, res) => {
  res.send('Backend server is live');
});

// Serve React build files in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../client/build')));





const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server is live on http://localhost:${PORT}`);
});
