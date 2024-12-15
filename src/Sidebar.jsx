import React from "react";

const Sidebar = ({ collapsed, toggleSidebar, isMobile }) => {
  const menuItems = [
    { name: "Home", icon: "🏠" },
    { name: "Explore", icon: "🔍" },
    { name: "Notifications", icon: "🔔" },
    { name: "Messages", icon: "✉️" },
    { name: "Profile", icon: "👤" },
    { name: "Settings", icon: "⚙️" },
  ];

  return (
    <>
      {isMobile && (
        <button className="burger-menu" onClick={toggleSidebar}>
          {collapsed ? "☰" : "✖"}
        </button>
      )}
      <aside
        className={`sidebar ${isMobile && collapsed ? "mobile-hidden" : ""} ${
          collapsed ? "collapsed" : ""
        }`}
      >
        {!isMobile && (
          <button onClick={toggleSidebar} className="toggle-button">
            {collapsed ? "☰" : "⇦ Collapse"}
          </button>
        )}
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
    </>
  );
};

export default Sidebar;
