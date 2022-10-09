module.exports = {
  receiveRoomJoin: function(data, socket, roomData, io){
    // Join Room and create it if it doesn't already exist
    // check if room exists in data.rooms'
    let room = data.rooms.find(room => room.name == roomData.room);
    if (room != undefined){
      // find user in data.users.session by socket.id
      let user = data.users.find(user => user.session.id === socket.id);
      room.AddUser(user);
      user.room = room;
    }
  },

  receiveRoomCreate: function(data, socket, roomData, io){
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
  }
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
    };

    
    this.updateLoop = setInterval(this.update, this.interval);
  };
  interval = 500;
  updateLoop;

  update = () => {

    // Check that all users are still connected (Done for every phase)
    // Look at all the users and see if they are all active
    // if they are not active, then they are tagged
    // loop through all the users and check if they are active
    this.STATE.playerStates.forEach((playerState, index) => {
      if (playerState.user.session == null){
        // if they are not active, then they are tagged
        this.STATE.playerStates.splice(index, 1);
      }
    });

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

  initializePlayerStates = (numTaggers) => {
    // Set all players to be taggable
    this.STATE.playerStates.forEach((player) => {
      player.isTaggable = true;
      player.visibility = this.STATE.taggableVisibility;
    });

    let randomIndex = Math.floor(Math.random() * this.STATE.playerStates.length);
    this.STATE.playerStates[randomIndex].isTagger = true;
    this.STATE.playerStates[randomIndex].isTaggable = false;
    this.STATE.playerStates[randomIndex].visbility = this.STATE.taggerVisibility;
  };

  startGame = gameType => {

    // Set the game mode
    let gameFramework = Room.gameModes.classic;
    if (gameType == 'infection'){ 
      gameFramework = Room.gameModes.infection;
    }

    this.STATE = {
      ...this.STATE,
      ...gameFramework,
    }

    // Go tot the next phase
    this.NextPhase();

  }

 
  // Basic game modes
  static gameModes = {
    // Classic game mode
    classic: {
      taggerVisibility: 0.5,
      taggableVisibility: 0.7,
      initialize: function() {
        // Set the tagger
        this.initializePlayerStates(1);
        // Set the start Time
        this.STATE.startTime = Date.now();
        this.STATE.gameTime = 10 * 60 * 1000;
      },
      endState: function() {
        // Check if enough time has passed
    
        return Date.now() - this.STATE.startTime > gameTime;

      },
      tagBehavior: function(tagged, tagger) {

        // Make the tagged player the tagger
        tagged.isTagger = true;
        tagger.isTagger = false;

        // Set the tagger's visibility
        tagger.visibility = 0;
        tagged.visibility = this.STATE.taggerVisibility;

        // Make the tagger not taggable
        tagger.isTaggable = false;
        tagged.isTaggable = false;

        // Make the tagger taggable in 5 seconds
        setTimeout(() => {
          tagger.isTaggable = true;
          tagger.visibility = this.STATE.taggableVisibility;
        }, 5000);

      }
    },
    infection: {
      taggerVisibility: 1,
      taggableVisibility: 0.4,
      initialize: function() {
        // Set the tagger
        this.initializePlayerStates(1);
        // Set the start Time
        this.STATE.startTime = Date.now();
      },
      endState: function() {
        
        // Check if there is only one taggable player left
        return this.STATE.playerStates.filter((player) => player.isTaggable).length == 1;
        

      },
      tagBehavior: function(tagged, tagger) {
        // Make the tagged player a tagger
        tagged.isTagger = true;
        
        // Set the tagger's visibility
        tagged.visibility = this.STATE.taggerVisibility;
      }

      
    }
}



  
};




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