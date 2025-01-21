"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./Navbar.module.css";
import Block from "@/componets/Block/Block";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import SearchBar from "@/componets/SearchBar/SearchBar";

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [dynamicHeight, setDynamicHeight] = useState(60); // Dynamiczna wysokość ustawiana po stronie klienta
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
  }, []);

  // Ustaw dynamicHeight po stronie klienta
  useEffect(() => {
    const buttonsList = [
      { label: "Home", icon: faHouse, isActive: false, onClick: () => (window.location.href = "/") },
      { label: "Search", icon: faMagnifyingGlass, isActive: isSearchActive, onClick: toggleSearch },
    ];
    setDynamicHeight(60 + buttonsList.length * 135);
  }, [isSearchActive]);

  const buttonsList = [
    { label: "Home", icon: faHouse, isActive: false, onClick: () => (window.location.href = "/") },
    { label: "Search", icon: faMagnifyingGlass, isActive: isSearchActive, onClick: toggleSearch },
  ];

  const sampleData = ["First"];

  return (
    <>
      <div
        ref={navbarRef}
        className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.collapsed}`}
        style={{ height: `${dynamicHeight}px` }} // Używamy dynamicHeight po stronie klienta
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
      </div>
      <SearchBar isVisible={isSearchActive} data={sampleData} />
    </>
  );
}
