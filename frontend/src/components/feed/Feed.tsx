import { useState, useEffect } from "react";
import Post from "./Post";
import { posts } from "../../data/posts";
import { ScrollButtons } from "../scroll-buttons";
import CommentsOverlay from "../comments/CommentsOverlay";

function Feed() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const handleScrollUp = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleScrollDown = () => {
    if (currentIndex < posts.length - 1) setCurrentIndex((prev) => prev + 1);
  };

  const handlePostClick = (index: number) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const activePost = document.querySelector(".post.active");
    if (activePost) {
      activePost.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        e.preventDefault();
        handleScrollUp();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        handleScrollDown();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <>
      <main className="feed">
        {posts.map((post, index) => (
          <Post
            key={post.id}
            {...post}
            isActive={index === currentIndex}
            onClick={() => handlePostClick(index)}
            onCommentClick={() => setIsCommentsOpen(true)}
          />
        ))}
      </main>

      <ScrollButtons onUp={handleScrollUp} onDown={handleScrollDown} />

      <CommentsOverlay
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />
    </>
  );
}

export default Feed;