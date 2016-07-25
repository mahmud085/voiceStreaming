var mediaRecorder;
var socket = io();
$('#start').click(function(){
		navigator.mediaDevices.getUserMedia = (navigator.getUserMedia ||
     											navigator.webkitGetUserMedia ||
      											navigator.mozGetUserMedia|| 
      											navigator.msGetUserMedia);
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
	        socket.emit('voice', blob);
	    };

	    // Start recording
	    mediaRecorder.start();

	});
});
$('#stop').click(function(){
	mediaRecorder.stop();
});