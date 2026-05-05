// src/components/feed/Post.tsx
import { useState } from "react";

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
  onMouseEnter?: () => void;
};

function Post({
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
  onMouseEnter,
}: PostProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <article
      className={`post ${isActive ? "active" : ""}`}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
    >
      <div className="post-header">
        <div className="user-info">
          <img src={avatar} alt="profile" className="img-profile" />
          <div>
            <h3>{user}</h3>
            <span>{time}</span>
          </div>
        </div>
        <button className="btn-follow">Follow</button>
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
          <button className="action-btn">
            <i className="fa-regular fa-comment"></i> {comments}
          </button>
          <button className="action-btn">
            <i className="fa-regular fa-paper-plane"></i>
          </button>
        </div>
        <i className="fa-regular fa-bookmark"></i>
      </div>
    </article>
  );
}

export default Post;
