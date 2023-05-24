import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("https://api-qfxsxjjz5q-ww.a.run.app");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [chats, setChats] = useState("")
  const [counter,setCounter] = useState(0)

  const joinRoom = () => {
    if (username !== "" && room !== "" && parseInt(room) <1000000000 && parseInt(room) > 0 &&  parseInt(room).toString() === room) {
      socket.emit("join_room", room);
    }
  };
  socket.on("All-masseges",(data)=>{
    setChats(data);
    if(counter===0){
      setShowChat(true);
      setCounter(counter+1)
    }
      
  })

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>انضم الى محادثة</h3>
          <input
            type="text"
            placeholder="اسم المستخدم"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && joinRoom();
            }}
          />
          <input
            type="text"
            placeholder="غرفة رقم"
            onChange={(event) => {
              setRoom(event.target.value);
            }}
            onKeyPress={(event) => {
              event.key === "Enter" && joinRoom();
            }}
          />
          <button onClick={joinRoom}>انضم لغرفة</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} chats= {chats}  />
      )}
    </div>
  );
}

export default App;
