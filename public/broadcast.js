var mediaRecorder;
var socket = io();
var cr;
$(function(){
	socket.on('connect', function(){
		    // call the server-side function 'adduser' and send one parameter (value of prompt)
	socket.emit('adduser1', prompt("What's your name?"));
	});
});
$('#start').click(function(){
	prompt("What's your name?");
	var constraints = { audio: true };
	navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    mediaRecorder = new MediaRecorder(mediaStream);
    mediaRecorder.onstart = function(e) {
        this.chunks = [];
    };
    mediaRecorder.ondataavailable = function(e) {
        this.chunks.push(e.data);
    };
    mediaRecorder.onstop = function(e) {
        var blob = new Blob(this.chunks, { 'type' : 'audio/ogg; codecs=opus' });
        console.log("socket room : ",cr);
        socket.emit('voice', blob);
    };

    // Start recording
    mediaRecorder.start();

	});
});
$('#stop').click(function(){
	mediaRecorder.stop();
});