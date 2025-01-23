/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import Block from "@/componets/Block/Block";

/** 
 * Ten interfejs musi zgadzać się z kolejnością i nazwami 
 * zwracanymi przez endpoint /api/posts
 */
type Post = {
  id: number;
  category: string[];        // text[]
  title: string;
  content: string;
  image_urls: string[];      // text[]
  author: string;
  reading_time: number;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Pobierz max 8 postów (posortowanych desc)
    const fetchPosts = async () => {
      try {
        const params = new URLSearchParams({
          limit: "8",
          order: "desc",
        });
        const res = await fetch(`/api/posts?${params}`, { method: "GET" });
        if (!res.ok) {
          throw new Error("Błąd podczas pobierania postów");
        }
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (error) {
        console.error("fetchPosts error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Ekran ładowania
  if (loading) {
    return (
      <main className={styles.mainContainer}>
        <p style={{ textAlign: "center", padding: "2rem" }}>Wczytywanie...</p>
      </main>
    );
  }

  // Brak postów
  if (posts.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Brak artykułów do wyświetlenia.
        </p>
      </main>
    );
  }

  // Pierwszy post to "Hero"
  const heroPost = posts[0];
  // Kolejne 2 (jeśli istnieją) to "pinned"
  const pinnedPosts = posts.slice(1, 3);
  // Reszta to "najnowsze"
  const latestPosts = posts.slice(0);

  /**
   * Zwraca URLa do głównego obrazka (pierwszego w tablicy `image_urls`).
   * Jeśli brak jakichkolwiek obrazków, używamy "/uploads/standard.png"
   */
  function getMainImageUrl(post: Post): string {
    if (post.image_urls && post.image_urls.length > 0) {
      return post.image_urls[0]; // pierwszy element z tablicy
    }
    return "/uploads/standard.png";
  }

  return (
    <main className={styles.mainContainer}>
      {/* ========== SEKCJA HERO ========== */}
      <section className={styles.heroSection}>
        <img
          src={getMainImageUrl(heroPost)}
          alt={`Miniatura artykułu ${heroPost.title}`}
          className={styles.heroBackground}
        />

        <div className={styles.heroContent}>
          <Block borderRadius="var(--border-radius-one)" />
          <div className={styles.heroContentContainer}>
            <h1 className={styles.heroTitle}>{heroPost.title}</h1>
            <p className={styles.heroDescription}>
              {/* Wyświetlamy fragment treści, np. 120 znaków */}
              {heroPost.content.slice(0, 120)}...
            </p>
            <button className={styles.heroButton}>Czytaj więcej</button>
          </div>
        </div>

        <div className={styles.heroCategories}>
          {/* Wyświetlamy tablicę kategorii jako małe "badge" */}
          {heroPost.category.map((cat, idx) => (
            <span key={idx} className={styles.heroCategory}>
              <Block borderRadius="var(--border-radius-two)" />
              {cat}
            </span>
          ))}
        </div>
      </section>

      {/* ========== SEARCH BAR ========== */}
      <section className={styles.searchSection}>
        <div className={styles.searchBar}>
          <div className={styles.searchInputWrapper}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Wyszukaj artykuły..."
              className={styles.searchInput}
            />
          </div>
          <button className={styles.searchButton}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
            Szukaj
          </button>
        </div>
        {/* Możesz dodać filtry kategorii lub dynamiczne wyszukiwanie */}
      </section>

      {/* ========== SEKCJA PRZYPINANE I NAJNOWSZE WPISY ========== */}
      <section className={styles.pinnedLatestSection}>
        {/* Przypięte */}
        <div className={styles.pinnedContainer}>
          <h2 className={styles.pinnedTitle}>Przypięte artykuły</h2>
          <div className={styles.pinnedArticleContainer}>
            {pinnedPosts.length === 0 && (
              <p>Brak przypiętych artykułów</p>
            )}
            {pinnedPosts.map((post) => (
              <div key={post.id} className={styles.pinnedArticle}>
                <Block borderRadius="var(--border-radius-two)" />
                <img
                  src={getMainImageUrl(post)}
                  alt={post.title}
                  className={styles.pinnedBackground}
                />
                <div className={styles.pinnedArticleContent}>
                  <div className={styles.pinnedInfo}>
                    <span className={styles.pinnedLabel}>
                      <Block borderRadius="50%" />
                      <FontAwesomeIcon icon={faThumbtack} />
                    </span>
                    <h3 className={styles.pinnedArticleTitle}>{post.title}</h3>
                    <p className={styles.pinnedArticleDesc}>
                      {post.content.slice(0, 80)}...
                    </p>
                    <a href="#" className={styles.readMoreBtn}>
                      Czytaj więcej &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Najnowsze */}
        <div className={styles.latestContainer}>
          <h2 className={styles.latestTitle}>Najnowsze artykuły</h2>
          <div className={styles.latestGrid}>
            {latestPosts.length === 0 && <p>Brak dodatkowych artykułów</p>}
            {latestPosts.map((post) => (
              <div key={post.id} className={styles.latestCard}>
                <Block borderRadius="var(--border-radius-two)" />
                <div className={styles.latestCardContent}>
                  <img
                    src={getMainImageUrl(post)}
                    alt={post.title}
                    className={styles.latestThumb}
                  />
                  <div className={styles.latestContent}>
                    <h3 className={styles.latestTitleCard}>{post.title}</h3>
                    <p className={styles.latestDescCard}>
                      {post.content.slice(0, 60)}...
                    </p>
                    <a href="#" className={styles.readMoreBtn}>
                      Czytaj więcej &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className={styles.hrHome} />

      {/* ========== SEKCJA "O BLOGU" ========== */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>O blogu</h2>
          <p className={styles.aboutParagraph}>
            Ten blog powstał z pasji do tworzenia stron i aplikacji internetowych...
          </p>
          <p className={styles.aboutParagraph}>
            Wierzymy, że technologia powinna być narzędziem...
          </p>
          <blockquote className={styles.aboutQuote}>
            „Technologia powinna być narzędziem, a nie przeszkodą”
          </blockquote>
        </div>
        <div className={styles.aboutImage}>
          {/* Dodaj własną ilustrację/zdjęcie */}
        </div>
      </section>

      <hr className={styles.hrHome} />

      {/* ========== SEKCJA STATYSTYK (opcjonalna) ========== */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)" />
            <div className={styles.statBoxContent}>
              <div className={styles.statValue}>+100</div>
              <div className={styles.statLabel}>Artykułów</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)" />
            <div className={styles.statBoxContent}>
              <div className={styles.statValue}>10 000+</div>
              <div className={styles.statLabel}>Czytelników miesięcznie</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)" />
            <div className={styles.statBoxContent}>
              <div className={styles.statValue}>5 lat</div>
              <div className={styles.statLabel}>Tworzenia treści</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
