var express = require('express');
var app = new express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var log = require('log'),
	log = new log('debug');

var port = process.env.PORT || 3000;

app.use(express.static(__dirname +'/public'));

app.get('/',function(req,res){
	console.log("here");
	res.redirect('home.html');
});
var usernames = {};
var rooms = ['public','private','general'];
var cr = {};
io.on('connection',function(socket){
	socket.on('adduser',function(username){
		// store the username in the socket session for this client
		socket.username = username;
		// store the room name in the socket session for this client
		socket.room = 'public';
		// add the client's username to the global list
		usernames[username] = username;
		// send client to room 1
		socket.join('public');
		// echo to client they've connected
		//socket.emit('updatechat', 'SERVER', 'you have connected to channel public');
		// echo to room 1 that a person has connected to their room
		io.sockets.in('public').emit('updatechat', 'SERVER', username + ' has joined this channel',socket.room);
		socket.emit('updaterooms', rooms, 'public');
	});
	socket.on('switchRoom', function(newroom){
		// sent message to OLD room
		io.sockets.in(socket.room).emit('updatechat', 'SERVER', socket.username+' has left this channel',socket.room);
		// leave the current room (stored in session)
		socket.leave(socket.room);
		// join new room, received as function parameter
		socket.join(newroom);
		socket.room = newroom;
		cr.name = socket.room;
		console.log("socket 3",socket.room);
		io.sockets.in(newroom).emit('updatechat', 'SERVER', socket.username+' has joined this channel',socket.room);
		socket.emit('updaterooms', rooms, newroom);
	});
	socket.on('addRoom',function(room){
		rooms.push(room);
	});
	socket.on('voice',function(blob,room){
		console.log("socket ",room);
		//socket.broadcast.emit('voice',blob);
		io.sockets.in(room).emit('voice',blob);
	});
});

http.listen(port,function(){
	console.log("Server running at port ",port);
}); 
