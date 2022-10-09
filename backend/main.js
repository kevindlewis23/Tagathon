// Create express app with socket.io
const express = require('express');
const app = express();
const server = require('http').Server(app);
var util = require('util')
// Create socket io with cors
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    },
    transports: ['websocket', 'polling']
});
const cors = require('cors');

const port = 3000 || process.env.PORT;


// Session and users
const users = require('./users.js');
const rooms = require('./room.js');


// Basic get request
// Allow cors
app.use(cors({origin: true}));
app.get('/', (req, res) => {
    // Send data as json
    // Set the header to json
    res.setHeader('Content-Type', 'application/json');
    res.send(util.inspect(data));
});


// Data Storage
const data = {
    users: [],
    sessions: [],
    rooms: [],
    connections: 0
};

users.setupPolling(io, data);

// Socket.io connection
io.on('connection', (socket) => {
    // Recieve New Users
    // newConnData = {phone: "##########"}
    socket.on('newConnection', () =>  users.receiveNewConnection(data, socket));

    // Process Polling
    socket.on('poll', () => users.receivePoll(data, socket));


    // Recieve Login
    socket.on('login', loginData => users.receiveLogin(data, socket, loginData));

    // Recieve Signup
    socket.on('signup', signUpData => users.recieveSignUp(data, socket, signUpData));

    // Recieve Room Join Request
    socket.on('joinRoom', roomData => rooms.receiveRoomJoin(data, socket, roomData, io));

    // Recieve Room Create Request
    socket.on('createRoom', roomData => rooms.receiveRoomCreate(data, socket, roomData, io));

    // Receive location update
    socket.on('updateLocation', locationData => users.receiveLocationUpdate(data, socket, locationData));

    // Receive a tag
    socket.on('tag', tagData => rooms.receiveTag(data, socket, tagData));
    
});

// Listen on port 3000
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});

