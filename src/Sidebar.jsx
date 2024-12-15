import React from "react";

const Sidebar = ({ collapsed, toggleSidebar }) => {
  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Explore", icon: "🔍" },
    { name: "Notifications", icon: "🔔" },
    { name: "Messages", icon: "✉️" },
    { name: "Profile", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <button onClick={toggleSidebar} className="toggle-button">
        {collapsed ? "☰" : "⇦ Collapse"}
      </button>
      <nav>
        <ul className="menu">
          {menuItems.map((item, index) => (
            <li key={index} className="menu-item">
              <span className="menu-icon">{item.icon}</span>
              {!collapsed && <span className="menu-name">{item.name}</span>}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
