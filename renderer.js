// This example uses MediaRecorder to record from an audio and video stream, and uses the
// resulting blob as a source for a video element.
//
// The relevant functions in use are:
//
// navigator.mediaDevices.getUserMedia -> to get the video & audio stream from user
// MediaRecorder (constructor) -> create MediaRecorder instance for a stream
// MediaRecorder.ondataavailable -> event to listen to when the recording is ready
// MediaRecorder.start -> start recording
// MediaRecorder.stop -> stop recording (this will generate a blob of data)
// URL.createObjectURL -> to create a URL from a blob, which we use as video src
var can = document.querySelector("canvas")
var recordButton, stopButton, recorder, liveStream;
const { writeFileSync } = require('fs')
const os = require('os')
var ctx = can.getContext('2d')
var liveVideo = document.getElementById('live');
recordButton = document.getElementById('record');
stopButton = document.getElementById('stop');
var startTime = Date.now()
var endTime = 0
function loop () {
	ctx.drawImage(liveVideo,0 ,0)
	ctx.fillStyle = 'blue';
	ctx.font = "60px Arial";
	ctx.fillText("Hello World", 100, 150);
	endTime = Date.now()
	// console.log('spend time:', endTime - startTime)
	startTime = endTime
	requestAnimationFrame(loop, 1000/60)
}
window.onload = function () {

  // get video & audio stream from user
  navigator.mediaDevices.getUserMedia({video: {
	frameRate: { ideal: 60, max: 60 }
  }})
  .then(function (stream) {
    liveStream = stream;
    // liveVideo.src = URL.createObjectURL(stream);
    liveVideo.srcObject = stream;
    liveVideo.play();
    recordButton.disabled = false;
    recordButton.addEventListener('click', startRecording);
    stopButton.addEventListener('click', stopRecording);
    loop()
  });
};

function startRecording() {
	var canStream = can.captureStream(60)
  recorder = new MediaRecorder(canStream);
  // recorder = new MediaRecorder(liveStream);

  recorder.addEventListener('dataavailable', onRecordingReady);

  recordButton.disabled = true;
  stopButton.disabled = false;

  recorder.start();
}

function stopRecording() {
  recordButton.disabled = false;
  stopButton.disabled = true;

  // Stopping the recorder will eventually trigger the 'dataavailable' event and we can complete the recording process
  recorder.stop();
}

async function onRecordingReady(e) {
  var video = document.getElementById('recording');
  // e.data contains a blob representing the recording
  var blob = new Blob([e.data], { type: 'video/webm' })
  const buffer = Buffer.from(await blob.arrayBuffer())
  var videosFolder = os.homedir().replace(/\\/g,'/') + '/videos/'
  var d = new Date()
  var streamFileName = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + "-" + d.getHours() + "-" + d.getMinutes() + "-" + d.getSeconds()
  var filePath = videosFolder + '/' + streamFileName + '111.webm'
  writeFileSync(filePath, buffer, {flag: 'a+'});
  video.src = URL.createObjectURL(e.data);
  video.play();
}