import { useState, useEffect } from "react";
import CreatePostModal from "../create-post/CreatePostModal";

function Navbar() {
  const [activeTab, setActiveTab] = useState<"local" | "global">("local");
  const [isLight, setIsLight] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

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
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
              alt="profil"
              className="profile-avatar"
              onClick={() => setIsProfileOpen((prev) => !prev)}
            />
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                    alt="profil"
                  />
                  <div>
                    <p className="profile-name">Meno Priezvisko</p>
                    <p className="profile-email">email@example.com</p>
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
      />
    </>
  );
}

export default Navbar;