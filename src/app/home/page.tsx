// app/page.tsx
/* eslint-disable @next/next/no-img-element */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faThumbtack } from "@fortawesome/free-solid-svg-icons";

// Importy styli i komponentów
import styles from "./Home.module.css";
import Block from "@/componets/Block/Block";

// Import wspólnej logiki do pobierania postów
import { getAllPosts, Post } from "@/lib/posts";

const LATEST_LIMIT = 6;


/**
 * Usuwa znaczniki HTML z podanego ciągu.
 * @param html - Surowy HTML.
 * @returns Czysty tekst.
 */
function stripHtmlTags(html: string): string {
  return html; // Usuwa wszystkie znaczniki HTML
}

/**
 * Przycina tekst do określonej liczby znaków, zachowując pełne słowa.
 * Dodaje "..." tylko wtedy, gdy tekst został przycięty.
 * 
 * @param text - Tekst wejściowy.
 * @param maxLength - Maksymalna długość tekstu.
 * @returns Przycięty tekst z zachowaniem pełnych słów.
 */
function truncateText(text: string, maxLength: number): string {
  // if (text.length <= maxLength) return text;

  // const truncated = text.slice(0, maxLength).trim();
  // const lastSpace = truncated.lastIndexOf(" ");

  // if (lastSpace === -1) {
  //   return `${truncated}...`;
  // }

  // return `${truncated.slice(0, lastSpace)}...`;
}

export default async function Home() {
  // 1. Pobieramy posty bezpośrednio z bazy (brak fetch – bezpośredni dostęp)
  const posts: Post[] = await getAllPosts();

  if (!posts || posts.length === 0) {
    return (
      <main className={styles.mainContainer}>
        <p style={{ textAlign: "center", padding: "2rem" }}>
          Brak artykułów do wyświetlenia.
        </p>
      </main>
    );
  }

  // 2. Hero = pierwszy (najnowszy)
  const heroPost = posts[0];

  // 3. Przypięte
  const pinnedPosts = posts.filter((post) => post.pinned);

  // 4. Najnowsze, pomijając hero i pinned
  const latestPosts = posts
    .filter((post) => post.id !== heroPost.id && !post.pinned)
    .slice(0, LATEST_LIMIT);

  /** Zwraca URL pierwszego obrazka lub obrazek domyślny */
  function getMainImageUrl(post: Post) {
    if (post.image_urls && post.image_urls.length > 0) {
      return post.image_urls[0];
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
              {truncateText(stripHtmlTags(heroPost.content), 120)}
            </p>
            <a href={`/post/${heroPost.url}`} className={styles.heroButton}>
              Czytaj więcej
            </a>
          </div>
        </div>

        {/* Kategorie w hero */}
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
            <FontAwesomeIcon
              icon={faMagnifyingGlass}
              className={styles.searchIcon}
            />
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
                      {truncateText(stripHtmlTags(post.content), 80)}
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

        {/* Najnowsze (limit = 6) */}
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
                      {truncateText(stripHtmlTags(post.content), 60)}
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
