var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var users= [], connectedUsers = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
  connectedUsers.push(socket);
  console.log('Connected: %s socket is connected', connectedUsers.length);

  // Send Message
  socket.on('send message', function(data){
    io.sockets.emit('new message', {msg:data, username:socket.username});
  });

  // Disconnect 
  socket.on('disconnect', function(){
  	  // if(!socket.username) return;
  	  users.splice(users.indexOf(socket.username), 1);
  	  updateUsernames();
	  connectedUsers.splice(connectedUsers.indexOf(socket), 1);
	  console.log('Disconnected: %s sockets are still connected', connectedUsers.length);
  });

  // New User
  socket.on('new user', function(data, callback){
  	callback(true);
  	socket.username = data;
  	users.push(socket.username);
  	updateUsernames();
  });

  function updateUsernames(){
  	io.sockets.emit('get users', users);
  }

});

http.listen(3000, function(){
  console.log('listening on *:3000');
});
