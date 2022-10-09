module.exports = {
  receiveRoomJoin: function(data, socket, roomData, io){
    // Join Room and create it if it doesn't already exist
    // check if room exists in data.rooms'
    let room = data.rooms.find(room => room.name == roomData.room);
    if (room == undefined){
      // create room
      room = new Room(roomData.room, io);
      data.rooms.push(room);
    }

    // find user in data.users.session by socket.id
    let user = data.users.find(user => user.session.id === socket.id);
    room.AddUser(user);
    user.room = room;
  },
}

class Room {
  PHASES = {
    LOBBY: 0,
    GAME: 1,
    END: 2,
  }
  

  /**
   * Giant state variable with references to all the player data
   * Contains: phase, 
   */
  STATE;
  
  constructor(roomName, io){
    this.name = roomName;
    this.io = io;

    this.STATE = {
      // user reference, isTagger, isTaggable, Visible (0-1)
      playerStates: [],
      phase: this.PHASES.LOBBY,
      endState: function() {
        
      },
      initialize: function() {

      }
    };
    this.updateLoop = setInterval(this.update, this.interval);
  };
  interval = 500;
  updateLoop;

  update = () => {

    // Check that all users are still connected (Done for every phase)

    // Switch on the phase
    switch (this.STATE.phase) {
      case this.PHASES.LOBBY:
        // Check if all users are ready
        // If all users are ready, start the game
        if (this.STATE.playerStates.length > 1 && this.STATE.playerStates.every((player) => player.isReady)) {
          this.NextPhase();
        }
        break;
      case this.PHASES.GAME:
        // Check if the end game state has been reached
        if (this.STATE.endState()) {
          this.NextPhase();
        }
        break;
      case this.PHASES.END:



        break;
      default:
        break;
    }
    
    // Update all states according to game state rules

    // SYNC - Emit an updated state to each of the clients
    
    this.syncUserState();
  };

  NextPhase = () => {
    this.STATE.phase = (this.STATE.phase + 1) % this.PHASES.length;
    switch (this.STATE.phase) {
      case this.PHASES.LOBBY:
        
        break;
      case this.PHASES.GAME:
        // Start the game
        this.STATE.initialize();
        break;
      case this.PHASES.END:


        break;
      default:
        break;
    }
  };

  syncUserState = () => {
    // loop through all users and io emit to them the stat
    
    this.STATE.playerStates.forEach((user) => {
      this.io.to(user.user.session.id).emit('state', stringify(this.STATE));
    });
    
  };
  
  AddUser = (user) => {
    // If they do not join at phase 0, they are spectators
    let isTagger = false, isTaggable = false, visibility = 1;

    if (this.STATE.phase != 0) {
      visibility = 0;
    }

    // Update this.state
    this.STATE.playerStates.push({user, isTagger, isTaggable, visibility});
  };
  
  closeRoom = () => {
    // close room
    this.io.to("this.name").emit("leaveRoom");
  };
};



// Basic game modes
const gameModes = {
  // Classic game mode
  classic: {
    initialize: function() {
      // Set the tagger
      this.setRandomTagger();
      // Set the start Time
      this.startTime = Date.now();
    },
    endState: function() {
      // Check

    }


  },
  infection: {
    initialize: function() {
      // Set the tagger
      this.setRandomTagger();
    },
    endState: function() {
      // Check if there is only one taggable player left
      

    }
    
  }
}

function stringify(state) {
  return JSON.stringify(state, (key, value) => {
    if (key === 'session') {
      return value.id;
    } else if (key === 'room'){
      return value.name;
    }
    return value;
  });

}