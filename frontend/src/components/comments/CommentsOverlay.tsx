import { useState, useEffect } from 'react';

type Comment = {
  id: number;
  user: string;
  text: string;
  isOwn?: boolean;
};

type CommentsOverlayProps = {
  isOpen: boolean;
  postId: number;
  onClose: () => void;
};

const API_BASE_URL = "http://localhost:9090";

const randomComments: Comment[] = [
  { id: 1, user: "Peter Š.", text: "Úplne súhlasím, toto je presne ten problém, o ktorom som hovoril." },
  { id: 2, user: "Mária K.", text: "Mne sa to stalo minulý semester, stačilo napísať na študijné." },
  { id: 3, user: "Jakub L.", text: "To sa fakt nikdy nepoučia? 😂" },
  { id: 4, user: "Anonym", text: "Neviete niekto, či je toto povinné aj pre externistov?" },
  { id: 5, user: "Lucia M.", text: "Skvelý post, vďaka za info! Pomohlo mi to sa zorientovať." },
  { id: 6, user: "Andrej T.", text: "Toto v skutočnosti funguje inak, pozri si smernicu dekana 2/2023." },
  { id: 7, user: "Simona H.", text: "Niekto na pivo po prednáške, aby sme to rozdýchali? 🍺" },
];

function CommentsOverlay({ isOpen, postId, onClose }: CommentsOverlayProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      const count = Math.floor(Math.random() * 3) + 3;
      const shuffled = [...randomComments].sort(() => 0.5 - Math.random());
      setComments(shuffled.slice(0, count));
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setComments((prev) => [...prev, { user: "Ja", text: newComment.trim(), isOwn: true }]);
    setNewComment("");
  };

  const handleEditSave = (index: number) => {
    if (!editText.trim()) return;
    setComments((prev) =>
      prev.map((c, i) => (i === index ? { ...c, text: editText.trim() } : c))
    );
    setEditingIndex(null);
    setEditText("");
  };

  if (!isOpen) return null;

  return (
    <div className="comments-backdrop" onClick={onClose}>
      <div className="comments-window" onClick={(e) => e.stopPropagation()}>
        <div className="comments-header">
          <h2>Komentáre</h2>
          <button className="comments-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="comments-body">
          {comments.map((comment, index) => (
            <div key={index} className="comment-item">
              <div className="comment-item-header">
                <h4>{comment.user}</h4>
                {comment.isOwn && editingIndex !== index && (
                  <button
                    className="comment-edit-btn"
                    onClick={() => {
                      setEditingIndex(index);
                      setEditText(comment.text);
                    }}
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>
                )}
              </div>
              {editingIndex === index ? (
                <div className="comment-edit-area">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={3}
                  />
                  <div className="comment-edit-actions">
                    <button className="comment-edit-cancel" onClick={() => setEditingIndex(null)}>
                      Zrušiť
                    </button>
                    <button className="comment-edit-save" onClick={() => handleEditSave(index)}>
                      Uložiť
                    </button>
                  </div>
                </div>
              ) : (
                <p>{comment.text}</p>
              )}
            </div>
          ))}
        </div>

        <div className="comments-input-area">
          <textarea
            placeholder="Napísať komentár..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={2}
          />
          <button className="comments-submit-btn" onClick={handleSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </div>  
  );
}

export default CommentsOverlay;
