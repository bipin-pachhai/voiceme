// import React, { useState, useRef, useEffect } from 'react';
// import {io} from 'socket.io-client';
// const App = () => {

//   const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoiNjQzNzdjZDMwZTU1NDYwMWQ4YTAxYTM0IiwiaWF0IjoxNjgyMTkxOTIxLCJleHAiOjE2ODIxOTU1MjF9.t1jn27bWpilBpvyf3-5YKZiSXFGSPlH1xLSFm_3GmRY"
// //`ws://192.168.0.247:4001/chat/?${token}`
//   const [recording, setRecording] = useState(false);
//   const [audioChunks, setAudioChunks] = useState([]);
//   let [mediaRecorder, setMediaRecorder] = useState(null); // Store the MediaRecorder instance in state
//   const audioStream = useRef(null);
//   const audioPlayer = useRef(null);
//   let socket = useRef(null);


//   const startRecording = async () => {
//     // setAudioChunks([]);
//     const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
//     audioStream.current = stream;
//     let recorder = new MediaRecorder(stream);
//     recorder.addEventListener('dataavailable', event => {
//       setAudioChunks(prev => [...prev, event.data]);
//     });
//     recorder.start();
//     setMediaRecorder(recorder); // Store the MediaRecorder instance in state
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     audioStream.current.getTracks().forEach(track => track.stop());
//     if (!mediaRecorder) {
//       return;
//     }
//     mediaRecorder.stop(); // Call the stop() method on the MediaRecorder instance stored in state
//     setRecording(false);
//    // const socket;
//    if(audioChunks.length <= 0)
//    {
//     return;
//    }
//     mediaRecorder.onstop = () => {
//       const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
//      // setAudioChunks([]);
//       //socket = new WebSocket(`ws://192.168.0.247:4001/chat/`);
//       socket = io(`ws://192.168.0.247:4001/chat/?token=${token}`,
//         {
//           reconnectionDelay: 1000,
//           reconnection: true,
//           reconnectionAttemps: 2,
//           transports: ['websocket'],
//           agent: false,
//           upgrade: false,
//           rejectUnauthorized: false
//       }
//       );
      
//       socket.binaryType = 'blob';
//       socket.on('connect', () => {
//         console.log('connected');
//         socket.emit('message', audioBlob);
//         setAudioChunks([]);
//       });
//       socket.on('message', (message) => {
//         // console.log("server sent:", message);
//          const audioBlob = message;
//          const audioURL = URL.createObjectURL(audioBlob);
//          audioPlayer.current.src = audioURL;
//          audioPlayer.current.play();
//       });
//       socket.on('disconnect', () => {
//         console.log('disconnected');
//       });

//       /*
//             socket.onopen = () => {
//         console.log('WebSocket connection established');
//         //socket.send("Hello Server!");
//         socket.send(audioBlob);
//         setAudioChunks([]);
//         // send/receive messages here
//       };


//     socket.onmessage = (message) => {
//       // console.log("server sent:", message);
//        const audioBlob = message.data;
//        const audioURL = URL.createObjectURL(audioBlob);
//        audioPlayer.current.src = audioURL;
//        audioPlayer.current.play();
//      };
//      socket.onclose = () => {
//        console.log('WebSocket connection closed');
//      };

      
//       */

//     };




//     /*
//     websocket.addEventListener('open', () => {
//       websocket.send(audioBlob);
//     });
//     websocket.addEventListener('message', event => {
//       const audioBlob = event.data;
//       const audioURL = URL.createObjectURL(audioBlob);
//       audioPlayer.current.src = audioURL;
//       audioPlayer.current.play();
//     });
//     websocket.addEventListener('close', () => {
//       URL.revokeObjectURL(audioPlayer.current.src);
//     });
//     websocket.close();
//     */
//   };


//   return (
//     <div>
//       <button onClick={startRecording} disabled={recording}>Start recording</button>
//       <button onClick={stopRecording} disabled={!recording}>Stop recording</button>
//       <audio ref={audioPlayer} controls />
//     </div>
//   );
// };

// export default App;







// /* 
// import React, { useEffect, useState } from 'react';
// import {
//   Navbar,
//   NavbarBrand,
//   UncontrolledTooltip
// } from 'reactstrap';
// import useWebSocket, { ReadyState } from 'react-use-websocket';
// import { DefaultEditor } from 'react-simple-wysiwyg';
// import Avatar from 'react-avatar';

// import './App.css';

// //http://192.168.0.247:4001/
// const WS_URL = 'ws://192.168.0.247:4001/';

// function isUserEvent(message) {
//   let evt = JSON.parse(message.data);
//   return evt.type === 'userevent';
// }

// function isDocumentEvent(message) {
//   let evt = JSON.parse(message.data);
//   return evt.type === 'contentchange';
// }

// function App() {
//   const [username, setUsername] = useState('');
//   const { sendJsonMessage, readyState } = useWebSocket(WS_URL, {
//     onOpen: () => {
//       console.log('WebSocket connection established.');
//     },
//     share: true,
//     filter: () => false,
//     retryOnError: true,
//     shouldReconnect: () => true
//   });

//   useEffect(() => {
//     if(username && readyState === ReadyState.OPEN) {
//       sendJsonMessage({
//         username,
//         type: 'userevent'
//       });
//     }
//   }, [username, sendJsonMessage, readyState]);

//   return (
//     <>
//       <Navbar color="light" light>
//         <NavbarBrand href="/">Real-time document editor</NavbarBrand>
//       </Navbar>
//       <div className="container-fluid">
//         {username ? <EditorSection/>
//             : <LoginSection onLogin={setUsername}/> }
//       </div>
//     </>
//   );
// }

// function LoginSection({ onLogin }) {
//   const [username, setUsername] = useState('');
//   useWebSocket(WS_URL, {
//     share: true,
//     filter: () => false
//   });
//   function logInUser() {
//     if(!username.trim()) {
//       return;
//     }
//     onLogin && onLogin(username);
//   }

//   return (
//     <div className="account">
//       <div className="account__wrapper">
//         <div className="account__card">
//           <div className="account__profile">
//             <p className="account__name">Hello, user!</p>
//             <p className="account__sub">Join to edit the document</p>
//           </div>
//           <input name="username" onInput={(e) => setUsername(e.target.value)} className="form-control" />
//           <button
//             type="button"
//             onClick={() => logInUser()}
//             className="btn btn-primary account__btn">Join</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// function History() {
//   console.log('history');
//   const { lastJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isUserEvent
//   });
//   const activities = lastJsonMessage?.data.userActivity || [];
//   return (
//     <ul>
//       {activities.map((activity, index) => <li key={`activity-${index}`}>{activity}</li>)}
//     </ul>
//   );
// }

// function Users() {
//   const { lastJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isUserEvent
//   });
//   const users = Object.values(lastJsonMessage?.data.users || {});
//   return users.map(user => (
//     <div key={user.username}>
//       <span id={user.username} className="userInfo" key={user.username}>
//         <Avatar name={user.username} size={40} round="20px"/>
//       </span>
//       <UncontrolledTooltip placement="top" target={user.username}>
//         {user.username}
//       </UncontrolledTooltip>
//     </div>
//   ));
// }

// function EditorSection() {
//   return (
//     <div className="main-content">
//       <div className="document-holder">
//         <div className="currentusers">
//           <Users/>
//         </div>
//         <Document/>
//       </div>
//       <div className="history-holder">
//         <History/>
//       </div>
//     </div>
//   );
// }

// function Document() {
//   const { lastJsonMessage, sendJsonMessage } = useWebSocket(WS_URL, {
//     share: true,
//     filter: isDocumentEvent
//   });

//   let html = lastJsonMessage?.data.editorContent || '';

//   function handleHtmlChange(e) {
//     sendJsonMessage({
//       type: 'contentchange',
//       content: e.target.value
//     });
//   }

//   return (
//     <DefaultEditor value={html} onChange={handleHtmlChange} />
//   );
// }

// export default App;



// import React, { useEffect } from 'react';

// function App() {
//   const [stream, setStream] = useState(null);
//   const [recording, setRecording] = useState(false);

//   const startRecording = () => {
//     const mediaRecorder = new MediaRecorder(stream);

//     mediaRecorder.start();

//     mediaRecorder.ondataavailable = (event) => {
//       const blob = event.data;
//       const reader = new FileReader();

//       reader.readAsArrayBuffer(blob);

//       reader.onloadend = () => {
//         const buffer = reader.result;
//         const data = new Uint8Array(buffer);
//       //  socket.emit('voice-message', data);
//       };
//     };

//     setRecording(true);
//   };

//   const stopRecording = () => {
//     setRecording(false);
//   };



//   const token =  "HFSFKJSHSGKJHSGKJJLG";
//   //`wss://example.com/socket?token=${token}`
//   useEffect(() => {
//     const socket = new WebSocket(`ws://192.168.0.247:4001/chat/?${token}`);

//     socket.onopen = () => {
//       console.log('WebSocket connection established');
//       socket.send("Hello Server!");
//       // send/receive messages here
//     };
//     socket.onmessage = (message) => {
//       console.log("server sent:", message);
//     };
//     socket.onclose = () => {
//       console.log('WebSocket connection closed');
//     };


//     return () => {
//       socket.close();
//     };
//   }, []);

//   return (
//     // render your app here
//     <div>
//     <div>
//       <button onClick={startRecording} disabled={!stream || recording}>
//         Start recording
//       </button>
//       <button onClick={stopRecording} disabled={!recording}>
//         Stop recording
//       </button>
//     </div>
//     </div>
//   );
// }

// export default App;


// */
