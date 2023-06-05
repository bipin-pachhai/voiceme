import React, { useState, useRef, useEffect } from 'react';
import { io } from 'socket.io-client';
import { createStream, emitStream } from 'socket.io-stream';
import RecordRTC, { StereoAudioRecorder } from 'recordrtc';
import './App.css';

const App = () => {
  const token = "hh";
  const [recording, setRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);

  const audioPlayer = useRef(null);
  const recordAudio = useRef(null);
  const socketio = useRef(null);

  useEffect(() => {
    socketio.current = io('ws://localhost:4001/chat/?token=${token}', {
      reconnectionDelay: 1000,
      reconnection: true,
      reconnectionAttempts: 2,
      transports: ['websocket'],
      agent: false,
      upgrade: false,
      rejectUnauthorized: false
    });

    socketio.current.on('connect', () => {
      console.log('server connected');
    });

    socketio.current.on('disconnect', () => {
      console.log('server disconnected');
    });

    socketio.current.on('output', (data) => {
      console.log('received from server');
      console.log(data);
      if (data) {
        const blob = new Blob([data], { type: 'audio/wav' });
        setAudioBlob(blob);

        audioPlayer.current.src = URL.createObjectURL(blob);
        audioPlayer.current.play();
      }
    });

    return () => {
      socketio.current.disconnect();
    };
  }, []);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      recordAudio.current = RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/webm',
        sampleRate: 44100,
        desiredSampRate: 16000,
        recorderType: StereoAudioRecorder,
        numberOfAudioChannels: 1,
        timeSlice: 4000,
        ondataavailable: function (blob) {
          const stream = createStream();
          emitStream(socketio.current, 'stream-audio', stream, {
            name: 'stream.wav',
            size: blob.size
          });
          stream.write(blob);
        }
      });

      recordAudio.current.startRecording();
      setRecording(true);
    } catch (error) {
      console.error(JSON.stringify(error));
    }
  };

  const stopRecording = () => {
    recordAudio.current.stopRecording((audioURL) => {
      const blob = recordAudio.current.getBlob();
      setAudioBlob(blob);

      audioPlayer.current.src = audioURL;
      audioPlayer.current.play();

      setRecording(false);
    });
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
