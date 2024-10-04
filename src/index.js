// src/server.js

const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { startTradingBot, stopTradingBot } = require('./bot');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));

// Create an HTTP server and attach Socket.IO
const server = http.createServer(app);
const io = new Server(server);

// Socket event to start trading
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('startTrading', () => {
        startTradingBot(io); // Start the trading bot when requested
    });

    socket.on('stopTrading', () => {
        stopTradingBot(); // Stop the trading bot if needed
    });
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
