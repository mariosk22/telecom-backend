// src/components/messages/MessagesWindow.tsx
import { useState, useEffect } from 'react';

type Message = {
  id: number;
  avatar: string;
  userName: string;
  lastMsg: string;
  time: string;
};

type MessagesWindowProps = {
  isOpen: boolean;
  onClose: () => void;
};

function MessagesWindow({ isOpen, onClose }: MessagesWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  // ← Tu neskôr nahradíš fake dáta skutočným fetch-om z backendu
  useEffect(() => {
    if (!isOpen) return;

    const fakeMessages: Message[] = [
      {
        id: 1,
        avatar: "/images/img-01.jpeg",
        userName: "User 1",
        lastMsg: "bla bla bla bla bla",
        time: "14:02",
      },
      {
        id: 2,
        avatar: "/images/img-02.jpg",
        userName: "User 2",
        lastMsg: "bla bla bla bla bla",
        time: "12:30",
      },
      {
        id: 3,
        avatar: "/images/img-01.jpeg",
        userName: "User 3",
        lastMsg: "bla bla bla bla bla",
        time: "Včera",
      },
      {
        id: 4,
        avatar: "/images/img-02.jpg",
        userName: "User 4",
        lastMsg: "bla bla bla bla bla",
        time: "Včera",
      },
      {
        id: 5,
        avatar: "/images/img-01.jpeg",
        userName: "User 5",
        lastMsg: "bla bla bla bla bla",
        time: "Pondelok",
      },
    ];

    setMessages(fakeMessages);
    setLoading(false);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`msg-window ${isOpen ? 'active' : ''}`}>
      <div className="msg-header">
        <h4>Správy</h4>
        <i 
          className="fa-solid fa-chevron-down" 
          onClick={onClose}
          style={{ cursor: 'pointer' }}
        ></i>
      </div>

      <div className="msg-body">
        {loading ? (
          <p>Načítavam správy...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className="msg-user">
              <img src={msg.avatar} alt={msg.userName} />
              <div className="user-text">
                <p className="user-name">{msg.userName}</p>
                <p className="last-msg">{msg.lastMsg}</p>
              </div>
              <span className="msg-time">{msg.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default MessagesWindow;