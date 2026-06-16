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
