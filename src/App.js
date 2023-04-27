import React, { useState, useRef, useEffect } from 'react';
import {io} from 'socket.io-client';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import ss from 'socket.io-stream';
import './App.css';

const App = () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNjQzNzdjZDMwZTU1NDYwMWQ4YTAxYTM0IiwiaWF0IjoxNjgyMTkxOTIxLCJleHAiOjE2ODIxOTU1MjF9.t1jn27bWpilBpvyf3-5YKZiSXFGSPlH1xLSFm_3GmRY";

    const [recording, setRecording] = useState(false);

    const socketio = io(`ws://192.168.0.247:4001/chat/?token=${token}`,
    {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttemps: 2,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
  }
  );
  const socket = socketio.on('connect', () => {
    console.log('server connected');
  });

  socketio.on('disconnect', () => {
     console.log('server disconnected');
  });
     
    const startRecording = async () => {

        navigator.getUserMedia({
            audio: true
        }, function(stream) {
                recordAudio = RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm',
                sampleRate: 44100,
                desiredSampRate: 16000,
                
                recorderType: StereoAudioRecorder,
                numberOfAudioChannels: 1,


                //1)
                // get intervals based blobs
                // value in milliseconds
                // as you might not want to make detect calls every seconds
                timeSlice: 4000,

                //2)
                // as soon as the stream is available
                ondataavailable: function(blob) {
                    console.log('recording available here');
                    // 3
                    // making use of socket.io-stream for bi-directional
                    // streaming, create a stream
                    var stream = ss.createStream();
                    // stream directly to server
                    // it will be temp. stored locally
                    ss(socket).emit('stream-audio', stream, {
                        name: 'stream.wav', 
                        size: blob.size
                    });
                    // pipe the audio blob to the read stream
                    ss.createBlobReadStream(blob).pipe(stream);
                }
            });

            recordAudio.startRecording();
            setRecording(true);

        }, function(error) {
            console.error(JSON.stringify(error));
        });


    };

    const stopRecording = () => {
        setRecording(false);
    };

    return (
        <div>
          <button onClick={startRecording} disabled={recording}>Start recording</button>
          <button onClick={stopRecording} disabled={!recording}>Stop recording</button>
          <audio ref={audioPlayer} controls />
        </div>
      );



};

export default App;