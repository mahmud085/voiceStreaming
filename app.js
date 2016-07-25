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
})
io.on('connection',function(socket){
	socket.on('room',function(room){
		socket.join(room);
		socket.emit('join',room);
	});
	socket.on('voice',function(blob){
		//socket.broadcast.emit('voice',blob);
		io.sockets.in('audio').emit('voice',blob);
	});
});

http.listen(port,function(){
	console.log("Server running at port ",port);
}); 
