import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import { getUserId } from 'apis/constant.js';
import { urls } from 'apis/urls.js';

const baseUrl = urls.base;

const ChatBox = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([
    { text: 'Welcome! How can I help you today?', sender: 'bot' },
  ]);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: 'Welcome! How can I help you today?', sender: 'bot' },
    ]);
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: userInput, sender: 'user' },
    ]);

    try {
    const userId = getUserId();
      const response = await fetch(
        `${baseUrl}/ai/get-product-quantity?userId=${userId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: userInput }),
        }
      );
      const data = await response.json();

      if (response.ok) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `The quantity of product ${data.product} is ${data.quantity}`,
            sender: 'bot',
          },
        ]);
      } else {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: `${data.message}`,
            sender: 'bot',
          },
        ]);
      }
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: 'Unable to fetch product data.',
          sender: 'bot',
        },
      ]);
    }

    setUserInput(''); 
  };

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
    autoResize(event.target);
  };

  const handlePaste = (event) => {
    setUserInput(event.target.value);
    autoResize(event.target);
  };

  const autoResize = (textarea) => {
    textarea.style.height = 'auto';
    const maxHeight = 7 * parseFloat(getComputedStyle(textarea).lineHeight);
    if (textarea.scrollHeight > maxHeight) {
      textarea.style.height = `${maxHeight}px`;
      textarea.style.overflowY = 'scroll';
    } else {
      textarea.style.height = `${textarea.scrollHeight}px`;
      textarea.style.overflowY = 'hidden';
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage(event);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input-box">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={userInput}
          onChange={handleInputChange}
          onPaste={handlePaste}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          rows="3"
        />
        <button className="send-button" onClick={handleSendMessage}>
          <SendRoundedIcon sx={{ color: '#2196f3' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
