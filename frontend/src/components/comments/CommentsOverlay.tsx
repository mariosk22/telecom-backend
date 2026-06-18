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
  onCountChange?: (delta: number) => void;
};

const API_BASE_URL = "http://localhost:9090";

function CommentsOverlay({ isOpen, postId, onClose, onCountChange }: CommentsOverlayProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isOpen && postId) {
      const myNickname = localStorage.getItem("userNickname");
      fetch(`${API_BASE_URL}/posts/${postId}/comments`)
          .then((res) => res.json())
          .then((data) => {
            setComments(data.map((c: any) => {
              const author = c.nickname ?? c.user ?? "Anonym";
              return {
                id: c.id,
                user: author,
                text: c.content ?? c.text ?? "",
                isOwn: myNickname != null && author === myNickname,
              };
            }));
          })
          .catch(() => setComments([]));
    }
  }, [isOpen, postId]);

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
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: newComment.trim() }),
      });
      if (!response.ok) return;
      const created = await response.json();
      setComments((prev) => [...prev, {
        id: created.id,
        user: created.nickname ?? "Ja",
        text: created.content ?? newComment.trim(),
        isOwn: true,
      }]);
      setNewComment("");
      onCountChange?.(1);
    } catch {
      return;
    }
  };

  const handleEditSave = async (id: number) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${postId}/comments/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!response.ok) return;
      const updated = await response.json();
      setComments((prev) =>
          prev.map((c) => (c.id === id ? { ...c, text: updated.content ?? updated.text ?? trimmed } : c))
      );
      setEditingId(null);
      setEditText("");
    } catch {
      return;
    }
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
            {comments.length === 0 && (
                <p style={{ color: "var(--text-dim)", textAlign: "center" }}>Zatiaľ žiadne komentáre</p>
            )}
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-item-header">
                    <h4>{comment.user}</h4>
                    {comment.isOwn && editingId !== comment.id && (
                        <div className="comment-item-actions">
                          <button
                              className="comment-edit-btn"
                              onClick={() => { setEditingId(comment.id); setEditText(comment.text); }}
                          >
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button
                              className="comment-delete-btn"
                              onClick={() => handleDelete(comment.id)}
                          >
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </div>
                    )}
                  </div>
                  {editingId === comment.id ? (
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
