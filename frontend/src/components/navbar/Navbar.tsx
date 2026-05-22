// src/components/navbar/Navbar.tsx
import { useState } from "react";

function Navbar() {
  const [activeTab, setActiveTab] = useState<"local" | "global">("local");

  return (
    <>
      {/* Local / Global tabs */}
      <div className="category">
        <div
          className={`category-local ${activeTab === "local" ? "active" : ""}`}
          onClick={() => setActiveTab("local")}
        >
          Local
        </div>
        <div
          className={`category-global ${activeTab === "global" ? "active" : ""}`}
          onClick={() => setActiveTab("global")}
        >
          Global
        </div>
      </div>

      {/* Search bar */}
      <nav className="navbar">
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
      </nav>
    </>
  );
}

export default Navbar;
