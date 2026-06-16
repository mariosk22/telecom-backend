import React, { useState, useEffect } from "react";

type CreatePostModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
  };

  const handleSubmit = () => {
    onClose();
    setTitle("");
    setContent("");
    setImage(null);
  };

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

        <div className="modal-footer">
          <button className="modal-cancel-btn" onClick={onClose}>Zrušiť</button>
          <button className="modal-submit-btn" onClick={handleSubmit}>
            <i className="fa-solid fa-paper-plane"></i>
            Zverejniť
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreatePostModal;