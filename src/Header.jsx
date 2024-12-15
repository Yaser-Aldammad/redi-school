import React, { useContext, useEffect } from "react";
import { AppContext } from "./App";

const Header = () => {
  const { theme, setTheme, setSearchTerm } = useContext(AppContext);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <header className="header">
      <h1>Twitter Clone</h1>
      <input
        type="text"
        placeholder="Search tweets..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={toggleTheme}>
        Switch to {theme === "light" ? "Dark" : "Light"} Mode
      </button>
    </header>
  );
};

export default Header;
