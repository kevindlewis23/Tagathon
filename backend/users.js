// Live Data Polling
const maxInterval = 10000;
const pollInterval = 2000;

let clientPolling = setInterval(() => {
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

function removeClient(client){
    console.log("Removed client: " + client.name);
    // Remove this session from the user if it exists
    data.sessions.splice(data.sessions.indexOf(client), 1);

}

// User functions
function addUser(session, phoneNumber, name) {
    data.users.push({
        phone: phoneNumber,
        session: session.id,
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
function login(session, phoneNumber) {
    // Check if user exists
    let user = data.users.find(user => user.phone === phoneNumber);
    if (user == undefined) {
        // If user does not exist, return an error
        return {error: "User does not exist"};

    } else {
        // Add the session to the user
        user.session = session.id;
        // Associate the user with the session
        session.user = user.phone;
    } 
}

// Sign up
function signup(session, phoneNumber, name) {
    // Check if user exists
    let user = data.users.find(user => user.phone === phoneNumber);
    if (user == undefined) {
        // If user does not exist, add the user
        addUser(session, phoneNumber, name);
        session.user = phoneNumber;
        
    } else {
        // If user exists, return an error
        return {error: "User already exists"};
        
    }
}





function recieveSignUp(socket, signupData) {
    console.log("Signing up User: " + signupData.name);

    // find client with id of socket.id
    let client = data.sessions.find(client => client.id == socket.id);

    // Signup the client
    return signup(client, signupData.phone, signupData.name);
}