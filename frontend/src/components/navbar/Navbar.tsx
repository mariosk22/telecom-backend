import { useState, useEffect, useRef } from "react";
import CreatePostModal from "../create-post/CreatePostModal";

type NavbarProps = {
  onPostCreated?: () => void;
  onLogout?: () => void;
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
};

function Navbar({ onPostCreated, onLogout, searchQuery = "", onSearchChange }: NavbarProps) {
  const [isLight, setIsLight] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const nickname = localStorage.getItem("userNickname") ?? "";
  const name = localStorage.getItem("userName") ?? "";
  const email = localStorage.getItem("userEmail") ?? "";
  // identita zobrazená vpravo hore – rovnaká ako autor na príspevku (nickname)
  const displayName = nickname || name || email;
  const avatarSeed = nickname || email;

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLightMode = savedTheme === "light";
    setIsLight(isLightMode);
    if (isLightMode) {
      document.body.classList.add("light-mode");
    } else {
      document.body.classList.remove("light-mode");
    }
  }, []);

  // zatvor profilové menu pri kliknutí mimo neho
  useEffect(() => {
    if (!isProfileOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isProfileOpen]);

  const toggleTheme = () => {
    const newIsLight = !isLight;
    setIsLight(newIsLight);
    if (newIsLight) {
      document.body.classList.add("light-mode");
      localStorage.setItem("theme", "light");
    } else {
      document.body.classList.remove("light-mode");
      localStorage.setItem("theme", "dark");
    }
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    onLogout?.();
  };

  return (
      <>
        <nav className="navbar">
          <div className="navbar-left">
            <div className="logo">Student<span>Connect</span></div>
            <button
                className="create-post-btn"
                onClick={() => setIsCreatePostOpen(true)}
            >
              <i className="fa-solid fa-plus"></i>
              <span className="create-post-label">Pridať príspevok</span>
            </button>
          </div>

          <div className="nav-content">
            <form className="search-container" onSubmit={(e) => e.preventDefault()}>
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                  className="search-input"
                  type="search"
                  placeholder="Hľadať problém..."
                  value={searchQuery}
                  onChange={(e) => onSearchChange?.(e.target.value)}
              />
            </form>
          </div>

          <div className="navbar-right">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <i className={`fa-solid ${isLight ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <div className="profile-wrapper" ref={profileRef}>
              <button
                  type="button"
                  className="profile-trigger"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
              >
                {displayName && (
                    <span className="profile-name-inline">{displayName}</span>
                )}
                <img
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                    alt="profil"
                    className="profile-avatar"
                />
              </button>
              {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${avatarSeed}`}
                          alt="profil"
                      />
                      <div>
                        <p className="profile-name">{displayName}</p>
                        <p className="profile-email">{email}</p>
                      </div>
                    </div>
                    <hr className="profile-divider" />
                    <button className="profile-logout-btn" onClick={handleLogout}>
                      <i className="fa-solid fa-right-from-bracket"></i>
                      Odhlásiť sa
                    </button>
                  </div>
            )}
          </div>
        </div>
      </nav>

      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
        onPostCreated={onPostCreated}
      />
    </>
  );
}

export default Navbar;
