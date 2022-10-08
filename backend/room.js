module.exports= {
  recieveRoomJoin: function(data, socket, roomData){
    // Join Room and create it if it doesn't already exist
    // check if room exists in data.rooms
    if (data.rooms.indexOf(data.room) === -1){
      // create room
      data.rooms.push(new Room(roomData.room));
    }
  },



    closeRoom: function() {
      // close room
      io.to("this.name").emit("leaveRoom");
    }
  }