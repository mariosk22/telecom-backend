import { useState, useEffect } from "react";
import CreatePostModal from "../create-post/CreatePostModal";

type NavbarProps = {
  onPostCreated?: () => void;
};

function Navbar({ onPostCreated }: NavbarProps) {
  const [isLight, setIsLight] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const nickname = localStorage.getItem("userNickname") ?? "";
  const name = localStorage.getItem("userName") ?? "";
  const email = localStorage.getItem("userEmail") ?? "";

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
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userNickname");
    localStorage.removeItem("userName");
    window.location.reload();
  };

  return (
      <>
        <nav className="navbar">
          <button
              className="create-post-btn"
              onClick={() => setIsCreatePostOpen(true)}
          >
            <i className="fa-solid fa-plus"></i>
            Pridať príspevok
          </button>

          <div className="nav-content">
            <form className="search-container">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                  className="search-input"
                  type="search"
                  placeholder="Hľadať problém..."
              />
            </form>
          </div>

          <div className="navbar-right">
            <button className="theme-toggle-btn" onClick={toggleTheme}>
              <i className={`fa-solid ${isLight ? "fa-sun" : "fa-moon"}`}></i>
            </button>

            <div className="profile-wrapper">
              <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname || email}`}
                  alt="profil"
                  className="profile-avatar"
                  onClick={() => setIsProfileOpen((prev) => !prev)}
              />
              {isProfileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-header">
                      <img
                          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${nickname || email}`}
                          alt="profil"
                      />
                      <div>
                        <p className="profile-name">{name || nickname || email}</p>
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
            onPostCreated={() => {
              setIsCreatePostOpen(false);
              if (onPostCreated) onPostCreated();
            }}
        />
      </>
  );
}

export default Navbar;