// src/components/sidebar/Sidebar.tsx
import { useState, useEffect } from 'react';

type SidebarItem = {
  name: string;
  avatar?: string;      // URL obrázka (teraz z /images/, neskôr z backendu)
  icon?: string;        // pre "Others" kategóriu
};

type Category = {
  title: string;
  icon: string;
  items: SidebarItem[];
};

function Sidebar() {
  const [openCategories, setOpenCategories] = useState<string[]>(['School', 'Friends']);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // ← Tu neskôr nahradíš fake dáta skutočným fetch-om z backendu
  useEffect(() => {
    const loadSidebarData = async () => {
      // Zatiaľ fake dáta (funguje rovnako ako v HTML)
      setCategories([
        {
          title: 'School',
          icon: 'fa-graduation-cap',
          items: [
            { name: 'Roland Onofrej', avatar: '/images/img-09.png' },
            { name: 'Robert Galik', avatar: '/images/img-08.jpg' },
            { name: 'Rachel Saraková', avatar: '/images/img-13.jfif' },
          ],
        },
        {
          title: 'Friends',
          icon: 'fa-user-group',
          items: [
            { name: 'Pear Juice Gaming', avatar: '/images/img-05.jpg' },
            { name: 'Mgr. Alex Babják', avatar: '/images/img-12.jfif' },
            { name: 'Ján Novák', avatar: '/images/img-02.jpg' },
          ],
        },
        {
          title: 'Others',
          icon: 'fa-ellipsis',
          items: [
            { name: 'Events', icon: 'fa-calendar-days' },
            { name: 'Marketplace', icon: 'fa-store' },
            { name: 'Nastavenia', icon: 'fa-gears' },
          ],
        },
      ]);
      setLoading(false);
    };

    loadSidebarData();
  }, []);

  if (loading) {
    return <aside className="sidebar">Načítavam sidebar...</aside>;
  }

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) =>
      prev.includes(title)
        ? prev.filter((cat) => cat !== title)
        : [...prev, title]
    );
  };

  return (
    <aside className="sidebar">
      <div className="logo">
        Student<span>Connect</span>
      </div>

      <div className="sidebar-content">
        {categories.map((category) => {
          const isOpen = openCategories.includes(category.title);

          return (
            <div
              key={category.title}
              className={`sidebar-category ${isOpen ? 'active' : ''}`}
            >
              <div
                className="category-header"
                onClick={() => toggleCategory(category.title)}
              >
                <span>
                  <i className={`fa-solid ${category.icon}`} />
                  {category.title}
                </span>
                <i className="fa-solid fa-chevron-down chevron" />
              </div>

              <div className="category-items">
                {category.items.map((item, index) => (
                  <div key={index} className="sidebar-item">
                    {item.avatar ? (
                      <img src={item.avatar} alt={item.name} />
                    ) : (
                      <i className={`fa-solid ${item.icon}`} />
                    )}
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default Sidebar;