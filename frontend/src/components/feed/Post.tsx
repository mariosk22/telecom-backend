import { useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090";

type PostProps = {
  id: number;
  user: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
  isActive?: boolean;
  onClick?: () => void;
  onCommentClick?: () => void;
};

function Post({
  id,
  user,
  avatar,
  time,
  title,
  content,
  image,
  likes: initialLikes,
  comments,
  liked: initialLiked = false,
  isActive = false,
  onClick,
  onCommentClick,
}: PostProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikes((prev) => prev + (newLiked ? 1 : -1));
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/posts/${id}/likes`, {
        method: newLiked ? "POST" : "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!response.ok) {
        setLiked(!newLiked);
        setLikes((prev) => prev + (newLiked ? -1 : 1));
      }
    } catch {
      setLiked(!newLiked);
      setLikes((prev) => prev + (newLiked ? -1 : 1));
    }
  };

  return (
    <article
      className={`post ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="post-header">
        <div className="user-info">
          <img src={avatar} alt="profile" className="img-profile" />
          <div>
            <h3>{user}</h3>
            <span>{time}</span>
          </div>
        </div>
      </div>

      <div className="post-content">
        <h2>{title}</h2>
        <p>{content}</p>
        {image && (
          <div className="post-image">
            <img src={image} alt="" />
          </div>
        )}
      </div>

      <div className="post-footer">
        <div className="interactions">
          <button
            className={`action-btn heart ${liked ? "liked" : ""}`}
            onClick={(e) => {
              e.stopPropagation();
              handleLike();
            }}
          >
            <i className={`fa-${liked ? "solid" : "regular"} fa-heart`}></i>{" "}
            {likes}
          </button>
          <button
            className="action-btn"
            onClick={(e) => {
              e.stopPropagation();
              onCommentClick?.();
            }}
          >
            <i className="fa-regular fa-comment"></i> {comments}
          </button>
        </div>
      </div>
    </article>
  );
}

export default Post;