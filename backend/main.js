// Create express app with socket.io
const express = require('express');
const app = express();
const server = require('http').Server(app);
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

// Basic get request
// Allow cors
app.use(cors({origin: true}));
app.get('/', (req, res) => {
    // Send data as json
    res.json(data);
});


// Data Storage
const data = {
    users: [],
    sessions: [],
    rooms: [],
    connections: 0
};



// Socket.io connection
io.on('connection', (socket) => {
    // Recieve New Users
    // newConnData = {phone: "##########"}
    socket.on('newConnection', function(newConnData){
        if (newConnData != null) {
            console.log("Connected to user: " + socket.id);
            data.connections++;
            data.sessions.push({
                id: socket.id,
                user: null,
                lastPolled: Date.now()
            });
        }
    });

    // Process Polling
    socket.on('poll', function(){
        // find client with id of socket.id
        let client = data.sessions.find(client => client.id == socket.id);

        client.lastPolled = Date.now();
    });

    // Recieve Login
    socket.on('login', function(loginData){
        console.log("Logging in...")
        // find client with id of socket.id
        let client = data.sessions.find(client => client.id == socket.id);

        // Login the client
        return login(client, loginData.phone);
    });

    // Recieve Signup
    socket.on('signup', signUpData => recieveSignUp(socket, signUpData));
    
});

// Listen on port 3000
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});
