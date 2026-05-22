// src/components/messages/MsgToggle.tsx
import { useState } from 'react';
import MessagesWindow from './MessagesWindow';

function MsgToggle() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleWindow = () => {
    setIsOpen(!isOpen);
  };

  const closeWindow = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button 
        className="msg-toggle" 
        onClick={toggleWindow}
        style={{ display: isOpen ? 'none' : 'flex' }}
      >
        <i className="fa-regular fa-comment-dots"></i>
        <span>Messages</span>
      </button>

      <MessagesWindow isOpen={isOpen} onClose={closeWindow} />
    </>
  );
}

export default MsgToggle;