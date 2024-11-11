import React, { useState, useEffect } from "react";
import { database } from "../firebase";
import { ref, push, onValue, serverTimestamp } from "firebase/database";
import "bootstrap/dist/css/bootstrap.min.css";
import { marked } from "marked";

// Function to generate a unique chat ID based on sorted emails
const generateChatId = (user1Email, user2Email) => {
  const sanitizeEmail = (email) => email.replace(/\./g, "_"); // Replace '.' with '_'
  const users = [sanitizeEmail(user1Email), sanitizeEmail(user2Email)].sort(); // Sort the emails alphabetically
  return users.join("_"); // Return the sorted chat ID
};

const Chat = ({ user, contactUser }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (contactUser && user) {
      // Generate chat ID based on sanitized and sorted emails
      const chatId = generateChatId(user.email, contactUser.email);
      const messagesRef = ref(database, `messages/${chatId}`);

      // Fetch messages for the generated chat ID
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messageList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setMessages(messageList);
        }
      });
    }
  }, [contactUser, user]);

  const handleSendMessage = async () => {
    if (newMessage.trim() && user && contactUser) {
      try {
        // Generate chat ID for the conversation
        const chatId = generateChatId(user.email, contactUser.email);
        const messageRef = ref(database, `messages/${chatId}`);

        // Send the new message to the chat ID
        await push(messageRef, {
          text: newMessage,
          sender: user.email,
          recipient: contactUser.email,
          timestamp: serverTimestamp(),
        });

        setNewMessage(""); // Clear the message input after sending
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  // Function to get user initials
  const getInitials = (name) => {
    if (!name) return "";
    const names = name.split(" ");
    return names.map((n) => n.charAt(0).toUpperCase()).join("");
  };

  // Check if the user or contact user is not loaded
  if (!user || !contactUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h3 className="mt-4">Chat with {contactUser.name}</h3>
      <div
        className="chat-box border p-3 mb-3"
        style={{ height: "300px", overflowY: "scroll" }}
      >
        {messages.length === 0 ? (
          <div>No messages yet. Start the conversation!</div>
        ) : (
          messages.map((message) => {
            // Check if the message is from the sender or recipient
            const isSender = message.sender === user.email;

            return (
              <div
                key={message.id}
                className={`d-flex mb-2 ${
                  isSender ? "justify-content-end" : "justify-content-start"
                }`}
              >
                {/* If the user is the receiver, display image first */}
                {!isSender && (
                  <div className="d-flex align-items-start me-2">
                    {contactUser.photoURL ? (
                      <img
                        className="rounded-circle"
                        src={contactUser.photoURL}
                        alt={contactUser.name}
                        width="40"
                        height="40"
                      />
                    ) : (
                      <div
                        className="mx-2 bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "16px",
                          color: "white",
                        }}
                      >
                        {getInitials(contactUser.name)}
                      </div>
                    )}
                  </div>
                )}

                {/* Display message bubble */}
                <div
                  className={`p-2 rounded ${
                    isSender ? "bg-info text-dark" : "bg-dark text-white"
                  }`}
                  style={{ maxWidth: "60%", wordWrap: "break-word" }} // Adjust max width and word wrap
                >
                  <p className="mb-1 fw-bold">
                    <strong>
                      {isSender ? user.displayName : contactUser.name}
                    </strong>
                  </p>
                  <p
                    dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                  />
                </div>

                {/* If the user is the sender, display image last */}
                {isSender && (
                  <div className="d-flex align-items-start ms-2">
                    {user.photoURL ? (
                      <img
                        className="rounded-circle"
                        src={user.photoURL}
                        alt={user.name}
                        width="40"
                        height="40"
                      />
                    ) : (
                      <div
                        className="mx-2 bg-secondary rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          width: "40px",
                          height: "40px",
                          fontSize: "16px",
                          color: "white",
                        }}
                      >
                        {getInitials(user.name)}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button onClick={handleSendMessage} className="btn btn-primary">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
