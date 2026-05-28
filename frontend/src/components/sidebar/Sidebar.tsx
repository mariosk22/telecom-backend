// src/components/sidebar/Sidebar.tsx
import { useState, useEffect } from "react";

type SidebarItem = {
  name: string;
  avatar?: string; // URL obrázka (teraz z /images/, neskôr z backendu)
  icon?: string; // pre "Others" kategóriu
};

type Category = {
  title: string;
  icon: string;
  items: SidebarItem[];
};

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="logo">Student<span>Connect</span></div>
    </aside>
  );
}

export default Sidebar;
