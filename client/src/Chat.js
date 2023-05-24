import React, { useEffect, useState } from "react";
import ScrollToBottom from "react-scroll-to-bottom";

function Chat(props) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState(JSON.parse(props.chats));


  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        "sessionID": parseInt(props.room),
        "username": props.username,
        "message": currentMessage,
        "timeStamp": Date.now()
      };
      console.log(messageData)
      await props.socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    props.socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
  }, [props.socket]);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>محادثة غرفة رقم {props.room}</p>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((messageContent) => {
            console.log(messageContent)
            return (
              <div
                className="message"
                id={props.username === messageContent.username ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{messageContent.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{new Date(messageContent.timeStamp).getFullYear()+"/"+(new Date(messageContent.timeStamp).getMonth() +1)+"/"+new Date(messageContent.timeStamp).getDate() +" "+new Date(messageContent.timeStamp).getHours()+ ":" + new Date(messageContent.timeStamp).getMinutes()}</p>
                    <p id="author">{messageContent.username}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          value={currentMessage}
          placeholder="اكتب هنا"
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
