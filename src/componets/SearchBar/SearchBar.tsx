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
    data: string[];
}

export default function SearchBar({ isVisible, data }: SearchBarProps) {
    const [shouldRender, setShouldRender] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");  // co wpisuje użytkownik
    const [filteredData, setFilteredData] = useState<string[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(-1); // -1 = brak wyboru z listy
    const [tempQuery, setTempQuery] = useState("");        // co jest aktualnie wyświetlane w polu
    const router = useRouter();
    
    // Referencje
    const resultsRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Funkcja czyszcząca timeout
    const clearExistingTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
        }
    };

    // Animacje wejścia/wyjścia
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

    // Filtrowanie danych
    useEffect(() => {
        if (searchQuery.length > 0) {
            const results = data.filter((item) =>
                item.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredData(results);
        } else {
            setFilteredData([]);
        }
        // Gdy wpisuje użytkownik, resetujemy indeks na -1
        setSelectedIndex(-1);
    }, [searchQuery, data]);

    // Synchronizacja tempQuery z aktualnym stanem
    // Jeśli selectedIndex = -1 => wyświetlamy to, co wpisał użytkownik
    // W przeciwnym razie => wyświetlamy element z listy
    useEffect(() => {
        if (selectedIndex === -1) {
            setTempQuery(searchQuery);
        } else {
            setTempQuery(filteredData[selectedIndex] ?? "");
        }
    }, [selectedIndex, searchQuery, filteredData]);

    // Ustawienie wysokości i widoczności kontenera z wynikami
    useEffect(() => {
        const resultsElement = resultsRef.current;
        if (resultsElement) {
            if (filteredData.length > 0 && isVisible) {
                resultsElement.style.height = `${filteredData.length * 40 + 10}px`;
                resultsElement.style.opacity = "1";
            } else {
                resultsElement.style.height = "0px";
                resultsElement.style.opacity = "0";
            }
        }
    }, [filteredData, isVisible]);

    // Zawsze ustawiamy kursor na końcu tempQuery
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
            const length = tempQuery.length;
            // Ustaw kursor na końcu
            inputRef.current.setSelectionRange(length, length);
        }
    }, [tempQuery]);

    // Obsługa klawiszy
    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!filteredData.length && e.key !== "Enter") return;

        if (e.key === "ArrowDown") {
            setSelectedIndex((prevIndex) => {
                // Jeśli jesteśmy na końcu listy, przechodzimy do -1 (powrót do wpisu użytkownika)
                const newIndex = prevIndex >= filteredData.length - 1 ? -1 : prevIndex + 1;
                return newIndex;
            });
        } else if (e.key === "ArrowUp") {
            setSelectedIndex((prevIndex) => {
                // Jeśli jesteśmy na -1, przechodzimy na koniec listy
                const newIndex = prevIndex <= -1 ? filteredData.length - 1 : prevIndex - 1;
                return newIndex;
            });
        } else if (e.key === "Enter") {
            // Gdy wciśnięto Enter
            if (selectedIndex >= 0) {
                // Jeśli wybrano element z listy
                router.push(`/Posts/${filteredData[selectedIndex]}`);
            } else {
                // Jeśli -1 => szukamy tego, co wpisał użytkownik
                if (searchQuery.length > 0) {
                    router.push(`/Search?query=${encodeURIComponent(searchQuery)}`);
                }
            }
        }
    };

    // Kliknięcie w wynik
    const handleResultClick = (item: string) => {
        router.push(`/Posts/${item}`);
    };

    // Najechanie myszą na wynik
    const handleMouseEnter = (index: number) => {
        setSelectedIndex(index);
    };

    // Przycisk szukania (ikona lupy)
    const handleSearch = () => {
        if (searchQuery.length > 0) {
            router.push(`/Search?query=${encodeURIComponent(searchQuery)}`);
        }
    };

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
                    ref={inputRef}
                    type="text"
                    placeholder="Search..."
                    className={styles.searchInput}
                    value={tempQuery}
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
                    <React.Fragment key={item}>
                        <div
                            className={`${styles.resultItem} ${
                                index === selectedIndex ? styles.selected : ""
                            }`}
                            onClick={() => handleResultClick(item)}
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            {item}
                        </div>
                        {index < filteredData.length - 1 && <hr />}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
