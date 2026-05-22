// src/components/comments/CommentsOverlay.tsx
import { useState, useEffect } from 'react';

type Comment = {
  user: string;
  text: string;
};

type CommentsOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

const randomComments: Comment[] = [
  { user: "Peter Š.", text: "Úplne súhlasím, toto je presne ten problém, o ktorom som hovoril." },
  { user: "Mária K.", text: "Mne sa to stalo minulý semester, stačilo napísať na študijné." },
  { user: "Jakub L.", text: "To sa fakt nikdy nepoučia? 😂" },
  { user: "Anonym", text: "Neviete niekto, či je toto povinné aj pre externistov?" },
  { user: "Lucia M.", text: "Skvelý post, vďaka za info! Pomohlo mi to sa zorientovať." },
  { user: "Andrej T.", text: "Toto v skutočnosti funguje inak, pozri si smernicu dekana 2/2023." },
  { user: "Simona H.", text: "Niekto na pivo po prednáške, aby sme to rozdýchali? 🍺" },
];

function CommentsOverlay({ isOpen, onClose }: CommentsOverlayProps) {
  const [comments, setComments] = useState<Comment[]>([]);

  // Pri každom otvorení vygenerujeme nové náhodné komentáre (ako v script.js)
  useEffect(() => {
    if (isOpen) {
      const count = Math.floor(Math.random() * 3) + 3; // 3 až 5 komentárov
      const shuffled = [...randomComments].sort(() => 0.5 - Math.random());
      setComments(shuffled.slice(0, count));
    }
  }, [isOpen]);

  // Zavrieť pri kliknutí na Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="comments-overlay active" 
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose(); // klik na pozadie = zavrieť
      }}
    >
      <div className="comments-content" onClick={(e) => e.stopPropagation()}>
        <h2>Komentáre</h2>
        
        {comments.map((comment, index) => (
          <div key={index} className="comment-item">
            <h4>{comment.user}</h4>
            <p>{comment.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentsOverlay;