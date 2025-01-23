/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faThumbtack } from "@fortawesome/free-solid-svg-icons";

// IMPORT STYLI I KOMPONENTU BLOCK
import styles from "./Home.module.css";   // dostosuj ścieżkę, jeśli trzymasz style inaczej
import Block from "@/componets/Block/Block"; // dostosuj ścieżkę
import pool from "@/lib/db";             // połączenie do PostgreSQL

// Typ posta zgodny z tabelą w bazie
interface Post {
  id: number;
  category: string[];        
  title: string;
  content: string;
  image_urls: string[];      
  author: string;
  reading_time: number;
  created_at: string;        // timestamp w bazie
  url: string;               // link do artykułu
  pinned: boolean;           // kolumna pinned (boolean)
}

/** Ile najnowszych artykułów wyświetlamy */
const LATEST_LIMIT = 6;

/** Funkcja serwerowa – pobiera posty bezpośrednio z bazy */
async function getPostsFromDB(): Promise<Post[]> {
  // Zapytanie zwraca wszystkie kolumny, posortowane malejąco po dacie
  const query = `
    SELECT 
      id,
      category,
      title,
      content,
      image_urls,
      author,
      reading_time,
      created_at,
      url,
      pinned
    FROM posts
    ORDER BY created_at DESC
  `;
  
  const { rows } = await pool.query(query);
  return rows;
}

/** Główny komponent strony (Server Component) */
export default async function Home() {
  // 1. Pobieramy posty bezpośrednio z bazy
  const posts = await getPostsFromDB();

  // 2. Jeśli brak postów, możemy wyświetlić placeholder
  if (!posts || posts.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Brak artykułów do wyświetlenia.
        </p>
      </main>
    );
  }

  // 3. Hero = pierwszy post w posortowanej tablicy (najnowszy)
  const heroPost = posts[0];

  // 4. Przypięte – pomijając hero
  const pinnedPosts = posts.filter(post => post.pinned);

  // 5. Najnowsze (ograniczone do LATEST_LIMIT, bez hero i bez pinned)
  const latestPosts = posts
    .filter(post => post.id !== heroPost.id && !post.pinned)
    .slice(0, LATEST_LIMIT);

  /** Zwraca URL pierwszego obrazka z `image_urls` lub /uploads/standard.png, jeśli brak */
  function getMainImageUrl(post: Post) {
    if (post.image_urls && post.image_urls.length > 0) {
      return post.image_urls[0];
    }
    return "/uploads/standard.png";
  }

  return (
    <main className={styles.mainContainer}>
      {/* ========== SEKCJA HERO (pierwszy = najnowszy) ========== */}
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
              {heroPost.content.slice(0, 120)}...
            </p>
            <a href={`/post/${heroPost.url}`} className={styles.heroButton}>
              Czytaj więcej
            </a>
          </div>
        </div>

        {/* Kategorie w hero, np. w formie badge'y */}
        <div className={styles.heroCategories}>
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
      </section>

      {/* ========== SEKCJA PRZYPINANE I NAJNOWSZE WPISY ========== */}
      <section className={styles.pinnedLatestSection}>
        {/* Przypięte */}
        <div className={styles.pinnedContainer}>
          <h2 className={styles.pinnedTitle}>Przypięte artykuły</h2>
          <div className={styles.pinnedArticleContainer}>
            {pinnedPosts.length === 0 && <p>Brak przypiętych artykułów</p>}
            {pinnedPosts.map(post => (
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
                    <a href={`/post/${post.url}`} className={styles.readMoreBtn}>
                      Czytaj więcej &rarr;
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Najnowsze (limit = 3) */}
        <div className={styles.latestContainer}>
          <h2 className={styles.latestTitle}>Najnowsze artykuły</h2>
          <div className={styles.latestGrid}>
            {latestPosts.length === 0 && <p>Brak dodatkowych artykułów</p>}
            {latestPosts.map(post => (
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
                    <a href={`/post/${post.url}`} className={styles.readMoreBtn}>
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
          {/* Ilustracja/zdjęcie, jeśli chcesz */}
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
