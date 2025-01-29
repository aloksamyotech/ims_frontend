import React, { useState, useRef, useEffect } from 'react';
import './chat.css';
import AIIcon from 'assets/images/ai-icon.png';
import SendIcon from '@mui/icons-material/Send';
import { chatbotApi } from 'apis/common.js';
import { getUserId } from 'apis/constant.js';

const ChatBox = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([{ text: 'Welcome! How can I help you today?', sender: 'bot' }]);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    setMessages((prevMessages) => [...prevMessages, { text: 'Welcome! How can I help you today?', sender: 'bot' }]);
  }, []);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (!userInput.trim()) return;

    setMessages((prevMessages) => [...prevMessages, { text: userInput, sender: 'user' }]);
    setUserInput('');

    setIsLoading(true);

    setTimeout(async () => {
      const userId = getUserId();
      try {
        const response = await chatbotApi(`/user/ai/report`, {
          method: 'POST',
          data: { text: userInput }
        });

        console.log(response);

        setIsLoading(false);

       
        if (response?.success && response?.message) {
          setMessages((prevMessages) => [...prevMessages, { text: response.data.response, sender: 'bot' }]);
        } else {
          setMessages((prevMessages) => [...prevMessages, { text: response?.message || 'Unable to fetch product data.', sender: 'bot' }]);
        }
      } catch (error) {
        setIsLoading(false);
        setMessages((prevMessages) => [...prevMessages, { text: 'Unable to fetch product data.', sender: 'bot' }]);
      }
    }, 1500);
  };

  const handleInputChange = (event) => {
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
      event.preventDefault();
      handleSendMessage(event);
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-container">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
            {message.sender === 'user' ? (
              <div className="message-content">{message.text}</div>
            ) : (
              <div className="message-content">
                <img alt="Bot" src={AIIcon} style={{ width: 24, height: 24, marginRight: '10px' }} />
                {message.text}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="message bot-message">
            <div className="message-content">
              <img alt="Bot" src={AIIcon} style={{ width: 24, height: 24, marginRight: '10px' }} />
              <span className="loading-dots"></span>
            </div>
          </div>
        )}
      </div>
      <div className="chat-input-wrapper">
        <textarea
          ref={textareaRef}
          className="chat-input"
          value={userInput}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Type your message..."
          rows="3"
        />
        <button className="send-button" onClick={handleSendMessage}>
          <SendIcon sx={{ color: '#2196f3' }} />
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
