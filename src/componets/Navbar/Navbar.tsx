"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './Navbar.module.css';
import Block from '@/componets/Block/Block';

export default function Navbar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const navbarRef = useRef<HTMLDivElement>(null);

  const toggleNavbar = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
      setIsExpanded(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div 
      ref={navbarRef} 
      className={`${styles.navbar} ${isExpanded ? styles.expanded : styles.collapsed}`}
    >
      <Block>
        {!isExpanded && (
          <span
            className={styles.box_shadow_onOff}
            onClick={toggleNavbar}
          >
            ▸
          </span>
        )}
      </Block>
    </div>
  );
}
