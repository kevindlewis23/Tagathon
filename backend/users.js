// Live Data Polling
const maxInterval = 10000;
const pollInterval = 2000;




// Getters for users and session
function getUser(data, phoneNumber) {
    return data.users.find(user => user.phone === phoneNumber);
}

function getSession(data, id) {
    return data.sessions.find(session => session.id === id);
}



function removeClient(client){
    console.log("Removed client: " + client.name);
    // Remove this session from the user if it exists
    data.sessions.splice(data.sessions.indexOf(client), 1);

}

// User functions
function addUser(data, session, phoneNumber, name) {
    data.users.push({
        phone: phoneNumber,
        session: session,
        name: name,
        room: null,
        gps: {x: null, y: null},
    });
}

// Remove user by phone number
function removeUser(phoneNumber) {
    data.users.splice(data.users.indexOf(phoneNumber), 1);
}

// Login
function login(data, session, phoneNumber) {
    // Check if user exists
    let user = getUser(data, phoneNumber);
    if (user == undefined) {
        // If user does not exist, return an error
        return {error: "User does not exist"};

    } else {
        // Add the session to the user
        user.session = session.id;
        // Associate the user with the session
        session.user = user;
    } 
}

// Sign up
function signup(data, session, phoneNumber, name) {
    // Check if user exists
    let user = getUser(data, phoneNumber);
    if (user == undefined) {
        // If user does not exist, add the user
        addUser(data, session, phoneNumber, name);
        session.user = data.users[data.users.length - 1];
        
    } else {
        // If user exists, return an error
        return {error: "User already exists"};
        
    }
}





// Export functions
module.exports = {
     receiveLogin: function(data, socket, loginData) {
        console.log("Logging in...")
        // find client with id of socket.id
        let client = getSession(socket.id);

        // Login the client
        return login(data, client, loginData.phone);
    },
     recieveSignUp: function(data, socket, signupData) {
        console.log("Signing up User: " + signupData.name);

        // find client with id of socket.id
        let client = getSession(data, socket.id);

        // Signup the client
        return signup(data, client, signupData.phone, signupData.name);
    },
     receivePoll: function(data, socket){
        // find client with id of socket.id
        let client = getSession(data, socket.id);

        client.lastPolled = Date.now();

    },

    receiveNewConnection: function(data, socket) {
        console.log("Connected to user: " + socket.id);
        data.connections++;
        data.sessions.push({
            id: socket.id,
            user: null,
            lastPolled: Date.now()
        });
    },

    setupPolling: function(io, data) {
        setInterval(() => {
            // loop through each client
            data.sessions.forEach(client => {
                // Poll the client
                pollClient(client);
        
                // Check if client has responded
                if (Date.now() - client.lastPolled > maxInterval) {
                    // if client has not polled in 10 seconds, remove them from the data
                    removeClient(client);
                }
            });
                
        }, pollInterval);
        
        // Session functions
        function pollClient(client) {
            // emit poll to client by socket.id
            io.to(client.id).emit('poll');
            //console.log("polled client");
        }
    }        
};