import React, { useState, useEffect } from "react";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const API_BASE_URL = "http://localhost:9090";
const MAX_IMAGE_BYTES = 2 * 1024 * 1024; // 2 MB

// načíta súbor obrázka ako base64 data URL (uloží sa do TEXT stĺpca a renderuje sa cez <img src>)
const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Nepodarilo sa načítať obrázok"));
    reader.readAsDataURL(file);
  });

function CreatePostModal({ isOpen, onClose, onPostCreated }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // meno autora – rovnaké ako vpravo hore (nickname), pod ktorým sa post zverejní
  const nickname = localStorage.getItem("userNickname") ?? "";

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_BYTES) {
      setError("Obrázok je príliš veľký (max. 2 MB).");
      e.target.value = "";
      return;
    }
    setError("");
    setImage(file);
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = async () => {
    setError("");
    if (!title.trim() || !content.trim()) {
      setError("Vyplňte nadpis aj obsah.");
      return;
    }
    setSubmitting(true);
    try {
      const imageData = image ? await fileToDataUrl(image) : undefined;
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
          ...(imageData ? { image: imageData } : {}),
        }),
      });
      if (!response.ok) {
        setError("Nepodarilo sa vytvoriť príspevok.");
        return;
      }
      setTitle("");
      setContent("");
      setImage(null);
      onClose();
      if (onPostCreated) onPostCreated();
    } catch {
      setError("Chyba pripojenia k serveru.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setError("");
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-window" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Nový príspevok</h2>
          <button className="modal-close-btn" onClick={onClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

          <div className="modal-body">
            {nickname && (
                <div className="modal-author">
                  <img
                      src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname}`}
                      alt="profil"
                  />
                  <span>Pridávate ako <strong>{nickname}</strong></span>
                </div>
            )}
            <div className="modal-field">
              <label>Nadpis</label>
              <input
                  type="text"
                  placeholder="Zadajte nadpis..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="modal-field">
              <label>Obsah</label>
              <textarea
                  placeholder="Opíšte problém..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
              />
            </div>
            <div className="modal-field">
              <label>Obrázok</label>
              {image ? (
                  <div className="modal-image-selected">
                    <i className="fa-solid fa-image"></i>
                    <span>{image.name}</span>
                    <button className="modal-image-remove" onClick={handleRemoveImage}>
                      <i className="fa-solid fa-xmark"></i>
                    </button>
                  </div>
              ) : (
                  <label className="modal-image-upload">
                    <i className="fa-solid fa-image"></i>
                    Nahrať obrázok
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: "none" }}
                    />
                  </label>
              )}
            </div>
          </div>

          {error && <p className="modal-error">{error}</p>}

          <div className="modal-footer">
            <button className="modal-cancel-btn" onClick={onClose} disabled={submitting}>Zrušiť</button>
            <button className="modal-submit-btn" onClick={handleSubmit} disabled={submitting}>
              <i className="fa-solid fa-paper-plane"></i>
              {submitting ? "Zverejňujem…" : "Zverejniť"}
            </button>
          </div>
        </div>
      </div>
  );
}

export default CreatePostModal;