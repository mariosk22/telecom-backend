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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    if (isOpen && postId) {
      fetch(`${API_BASE_URL}/posts/${postId}/comments`)
          .then((res) => res.json())
          .then((data) => {
            setComments(data.map((c: any) => ({
              id: c.id,
              user: c.nickname ?? c.user ?? "Anonym",
              text: c.content ?? c.text ?? "",
            })));
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
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  const handleSubmit = async () => {
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
        user: created.nickname ?? created.user ?? "Ja",
        text: created.content ?? created.text ?? newComment.trim(),
        isOwn: true,
      }]);
      setNewComment("");
    } catch {
      return;
    }
  };

  const handleEditSave = (id: number) => {
    if (!editText.trim()) return;
    setComments((prev) =>
        prev.map((c) => (c.id === id ? { ...c, text: editText.trim() } : c))
    );
    setEditingId(null);
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
            {comments.length === 0 && (
                <p style={{ color: "var(--text-dim)", textAlign: "center" }}>Zatiaľ žiadne komentáre</p>
            )}
            {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-item-header">
                    <h4>{comment.user}</h4>
                    {comment.isOwn && editingId !== comment.id && (
                        <button
                            className="comment-edit-btn"
                            onClick={() => { setEditingId(comment.id); setEditText(comment.text); }}
                        >
                          <i className="fa-solid fa-pen"></i>
                        </button>
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
                          <button className="comment-edit-cancel" onClick={() => setEditingId(null)}>
                            Zrušiť
                          </button>
                          <button className="comment-edit-save" onClick={() => handleEditSave(comment.id)}>
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