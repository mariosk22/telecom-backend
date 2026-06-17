import { useState, useEffect, useMemo } from "react";
import Post from "./Post";
import { ScrollButtons } from "../scroll-buttons";
import CommentsOverlay from "../comments/CommentsOverlay";

type PostType = {
  id: number;
  title: string;
  content: string;
  image?: string;
  likes: number;
  liked: boolean;
  comments: number;
  user: string;
  avatar: string;
  time: string;
};

type FeedProps = {
  onRegisterRefresh?: (fn: () => void) => void;
  searchQuery?: string;
};

const API_BASE_URL = "http://localhost:9090";

function Feed({ onRegisterRefresh, searchQuery = "" }: FeedProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const fetchPosts = async () => {
    const token = localStorage.getItem("token");
    const authHeaders: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {};
    try {
      const response = await fetch(`${API_BASE_URL}/posts`, { headers: authHeaders });
      if (!response.ok) return;
      const data = await response.json();
      // pre každý príspevok dotiahni reálny stav lajkov (count + či ho lajkol prihlásený používateľ)
      const mapped: PostType[] = await Promise.all(
        data.map(async (p: any) => {
          let likes = p.likes ?? 0;
          let liked = false;
          try {
            const likeRes = await fetch(`${API_BASE_URL}/posts/${p.id}/likes`, { headers: authHeaders });
            if (likeRes.ok) {
              const status = await likeRes.json();
              likes = status.count ?? likes;
              liked = !!status.liked;
            }
          } catch {
            // ponecháme východiskové hodnoty z výpisu príspevkov
          }
          return {
            id: p.id,
            title: p.title,
            content: p.content,
            image: p.image,
            likes,
            liked,
            comments: p.comments ?? 0,
            user: p.nickname ?? "Anonym",
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.nickname ?? p.id}`,
            time: p.createdAt ? new Date(p.createdAt).toLocaleDateString("sk-SK") : "",
          };
        })
      );
      setPosts(mapped);
    } catch {
      return;
    }
  };

  useEffect(() => {
    fetchPosts();
    if (onRegisterRefresh) onRegisterRefresh(fetchPosts);
  }, []);

  // filtrovanie podľa hľadaného výrazu (nadpis alebo obsah)
  const filteredPosts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return posts;
    return posts.filter(
      (p) => p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q)
    );
  }, [posts, searchQuery]);

  // pri zmene hľadania zacni od prvého výsledku
  useEffect(() => {
    setCurrentIndex(0);
  }, [searchQuery]);

  // udrž počet komentárov na príspevku v synchronizácii s overlayom
  const adjustCommentCount = (postId: number, delta: number) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: Math.max(0, p.comments + delta) } : p
      )
    );
  };

  const handleScrollUp = () => {
    if (currentIndex > 0) setCurrentIndex((prev) => prev - 1);
  };

  const handleScrollDown = () => {
    if (currentIndex < filteredPosts.length - 1) setCurrentIndex((prev) => prev + 1);
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
  }, [currentIndex, filteredPosts]);

  if (filteredPosts.length === 0) {
    return (
        <main className="feed">
          <p style={{ color: "var(--text-dim)", textAlign: "center", marginTop: "100px" }}>
            {posts.length === 0 ? "Zatiaľ žiadne príspevky" : "Nič sa nenašlo"}
          </p>
        </main>
    );
  }

  const activePostId = filteredPosts[currentIndex]?.id;

  return (
      <>
        <main className="feed">
          {filteredPosts.map((post, index) => (
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
            postId={activePostId}
            onClose={() => setIsCommentsOpen(false)}
            onCountChange={(delta) => {
              if (activePostId != null) adjustCommentCount(activePostId, delta);
            }}
        />
      </>
  );
}

export default Feed;