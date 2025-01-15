"use client";

import { useState } from "react";
import styles from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Block from "@/componets/Block/Block";

interface SearchBarProps {
    isVisible: boolean;
    onClose: () => void;
}

export default function SearchBar({ isVisible, onClose }: SearchBarProps) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.searchWindow}>
        <Block/>
        <div className={styles.content}>
        <input
            type="text"
            placeholder="Search..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={handleSearchChange}
        />
        <button className={styles.closeButton} onClick={onClose}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
        </div>
        </div>
    );
}
