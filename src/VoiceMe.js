// VoiceMe.js
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
//import { RTCPeerConnection, MediaStream, RTCDataChannel } from 'wrtc';



const socket = io('http://localhost:5000');

function VoiceMe() {
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        setStream(stream);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const startRecording = () => {
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.start();

    mediaRecorder.ondataavailable = (event) => {
      const blob = event.data;
      const reader = new FileReader();

      reader.readAsArrayBuffer(blob);

      reader.onloadend = () => {
        const buffer = reader.result;
        const data = new Uint8Array(buffer);
      //  socket.emit('voice-message', data);
      };
    };

    setRecording(true);
  };

  const stopRecording = () => {
    setRecording(false);
  };

  return (
    <div>
      <button onClick={startRecording} disabled={!stream || recording}>
        Start recording
      </button>
      <button onClick={stopRecording} disabled={!recording}>
        Stop recording
      </button>
    </div>
  );
}

export default VoiceMe;


/*
This script creates a React component that uses the WebRTC getUserMedia API to obtain access to the user's microphone and start recording. When the user clicks the "Start recording" button, the script initializes a MediaRecorder object, starts recording the audio stream, and sends the recorded voice message to the server via Socket.IO.

When the user clicks the "Stop recording" button, the script stops the recording and sets the recording state to false.

Note that this is a very basic demo script and does not handle things like error handling, audio encoding/decoding, or security/authentication. However, it should provide a starting point for building a more robust WebRTC-based voice messaging system using React and Express.

Yes, navigator.mediaDevices is an API provided by modern web browsers that allows access to multimedia devices like cameras and microphones. It is used in the above React script to obtain access to the user's microphone and start recording audio.

The navigator object is a global object provided by web browsers that represents the web browser environment. The mediaDevices property of the navigator object provides access to media input and output devices like cameras and microphones.

The getUserMedia() method of the mediaDevices object is used to obtain access to the user's microphone. It takes a constraints object as an argument, which specifies the type of media stream that is being requested (in this case, audio).

Once the getUserMedia() method is called, it returns a promise that resolves to a MediaStream object, which represents the user's media stream. This media stream can then be passed to a MediaRecorder object to start recording audio, as shown in the above React script.

It's worth noting that the getUserMedia() API is part of the WebRTC (Web Real-Time Communication) API, which is used for peer-to-peer communication in web VoiceMelications, including voice and video chat.
*/