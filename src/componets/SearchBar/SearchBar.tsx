"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import styles from "./SearchBar.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import Block from "@/componets/Block/Block";
import React from "react";

interface SearchBarProps {
    isVisible: boolean;
    data: string[]; // Tablica danych do wyszukiwania
}

export default function SearchBar({ isVisible, data }: SearchBarProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const resultsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const clearExistingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    useEffect(() => {
        clearExistingTimeout();

        if (isVisible) {
            setShouldRender(true);
            timeoutRef.current = setTimeout(() => {
                setIsAnimating(true);
                timeoutRef.current = null;
            }, 10);
        } else {
            setIsAnimating(false);
            timeoutRef.current = setTimeout(() => {
                setShouldRender(false);
                timeoutRef.current = null;
            }, 300);
        }

        return () => clearExistingTimeout();
    }, [isVisible]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const results = data.filter((item) =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(results);
            setSelectedIndex(-1);
        } else {
            setFilteredData([]);
        }
    }, [searchQuery, data]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!filteredData.length) return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prevIndex) =>
                prevIndex < filteredData.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : prevIndex
            );
        } else if (e.key === "Enter" && selectedIndex >= 0) {
            router.push(`/items/${filteredData[selectedIndex]}`);
        }
    };

    const handleSearch = () => {
        if (searchQuery.length > 0) {
            router.push(`/Search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleResultClick = (item: string) => {
        router.push(`/Posts/${item}`);
    };

    const handleMouseEnter = (index: number) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        const resultsElement = resultsRef.current;
        if (resultsElement) {
            if (filteredData.length > 0 && isVisible) {
                resultsElement.style.height = `${filteredData.length*40+10}px`;
                resultsElement.style.opacity = "1";
            } else {
                resultsElement.style.height = "0px";
                resultsElement.style.opacity = "0";
            }
        }
    }, [filteredData, isVisible]);

    if (!shouldRender) return null;

    return (
        <div
            className={`${styles.searchWindow} ${
                isAnimating ? styles.searchWindowIn : styles.searchWindowOut
            }`}
            tabIndex={0}
            onKeyDown={handleKeyDown}
        >
            <Block />
            <div className={styles.content}>
                <input
                    type="text"
                    placeholder="Search..."
                    className={styles.searchInput}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className={styles.searchButton} onClick={handleSearch}>
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                </button>
            </div>
            <div
                ref={resultsRef}
                className={`${styles.results} ${
                    filteredData.length === 0 ? styles.hidden : ""
                }`}
            >
                <Block borderRadius="var(--border-radius-two)" />
                {filteredData.map((item, index) => (
                    <React.Fragment key={item}> {/* Użycie `item` jako klucza */}
                    <div
                        className={`${styles.resultItem} ${
                            index === selectedIndex ? styles.selected : ""
                        }`}
                        onClick={() => handleResultClick(item)}
                        onMouseEnter={() => handleMouseEnter(index)}
                    >
                        {item}
                    </div>
                    {index < filteredData.length - 1 && <hr />} {/* Renderuj <hr /> tylko między elementami */}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
