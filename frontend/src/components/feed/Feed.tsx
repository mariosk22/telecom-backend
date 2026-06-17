import { useState, useEffect } from "react";
import Post from "./Post";
import { ScrollButtons } from "../scroll-buttons";
import CommentsOverlay from "../comments/CommentsOverlay";

type PostType = {
  id: number;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  user: string;
  avatar: string;
  time: string;
};

type FeedProps = {
  onRegisterRefresh?: (fn: () => void) => void;
  onStats?: (s: { posts: number; likes: number; comments: number }) => void;
};

const API_BASE_URL = "http://localhost:9090";

function Feed({ onRegisterRefresh, onStats }: FeedProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, {
        headers: {
          ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      const mapped: PostType[] = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        content: p.content,
        image: p.image,
        likes: p.likes ?? 0,
        comments: p.comments ?? 0,
        user: p.nickname ?? p.user?.nickname ?? p.user?.email ?? "Anonym",
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nickname ?? p.user?.nickname ?? p.id}`,
        time: p.createdAt ? new Date(p.createdAt).toLocaleDateString("sk-SK") : "",
      }));
      setPosts(mapped);
      if (onStats) {
        onStats({
          posts: mapped.length,
          likes: mapped.reduce((sum, p) => sum + (p.likes || 0), 0),
          comments: mapped.reduce((sum, p) => sum + (p.comments || 0), 0),
        });
      }
    } catch {
      return;
    }
  };

  useEffect(() => {
    fetchPosts();
    if (onRegisterRefresh) onRegisterRefresh(fetchPosts);
  }, []);

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
      activePost.scrollIntoView({ behavior: "smooth", block: "center" });
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
  }, [currentIndex, posts]);

  if (posts.length === 0) {
    return (
        <main className="feed">
          <p style={{ color: "var(--text-dim)", textAlign: "center", marginTop: "100px" }}>
            Zatiaľ žiadne príspevky
          </p>
        </main>
    );
  }

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
            postId={posts[currentIndex]?.id}
            onClose={() => setIsCommentsOpen(false)}
        />
      </>
  );
}

export default Feed;
