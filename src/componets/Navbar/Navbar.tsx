"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Block from "@/componets/Block/Block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faUser, faBars, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "@/componets/SearchBar/SearchBar"; // Import SearchBar

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);
  

  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  const toggleSearch = () => {
    setIsSearchActive((prev) => !prev);
  };
  

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      toggleNavbar();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buttonsList = [
    { label: "Home", icon: faHouse, isActive: false, onClick: ()=>window.location.href = "/"},
    { label: "Search", icon: faMagnifyingGlass, isActive: isSearchActive, onClick: toggleSearch },
    { label: "User", icon: faUser, isActive: false },
    { label: "Option", icon: faBars, isActive: false },
  ];

  const dynamicHeight = 60 + buttonsList.length * 135;

  const sampleData = ["Home", "Dashboard", "Posts", "Archive", "Profile"];

  return (
    <>
    <div
      ref={navbarRef}
      className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.collapsed}`}
      style={{ height: `${dynamicHeight}px` }}
    >
      <Block>
        {!isExpanded && (
          <span className={styles.box_shadow_onOff} onClick={toggleNavbar}>
            ▸
          </span>
        )}
      </Block>
      <div className={styles.content}>
        {buttonsList.map((button, index) => (
            <div key={index} className={styles.buttonWrapper}>
            <button
              className={`${styles.button} ${button.isActive ? styles.isActive : ""}`}
              onClick={button.onClick}
              type="button"
            >
              <FontAwesomeIcon icon={button.icon} />
            </button>
            <span className={styles.tooltip}>{button.label}</span>
          </div>
        ))}
      </div>

      {/* SearchBar Component */}
    </div>
    <SearchBar isVisible={isSearchActive} data={sampleData} />
    </>
  );
}
