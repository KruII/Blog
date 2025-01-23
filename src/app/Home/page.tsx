/* eslint-disable @next/next/no-img-element */
"use client";
import React from "react";
import styles from "./Home.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import Block from "@/componets/Block/Block";

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      {/** ========== SEKCJA HERO ========== */}
      <section className={styles.heroSection}>

        <img
          src={`/uploads/standard.png`}
          alt="Miniatura najnowszego artykułu"
          className={styles.heroBackground}
        />

        <div className={styles.heroContent}>
          <Block borderRadius="var(--border-radius-one)"/>
          <div className={styles.heroContentContainer}>
          <h1 className={styles.heroTitle}>Najnowszy wpis na blogu</h1>
          <p className={styles.heroDescription}>
            Krótki opis (2-3 zdania) dotyczący najnowszego artykułu. Dowiedz się,
            jak tworzyć nowoczesne aplikacje frontendowe z wykorzystaniem
            React, Next.js i TypeScript!
          </p>
          <button className={styles.heroButton}>Czytaj więcej</button>
          </div>
        </div>
        <div className={styles.heroCategories}>
          <div className={styles.heroCategory}><Block borderRadius="var(--border-radius-two)"/>Frontend</div>
          <span className={styles.heroCategory}><Block borderRadius="var(--border-radius-two)"/>Frontend</span>
        </div>
      </section>

    {/** ========== SEARCH BAR ========== */}
    <section className={styles.searchSection}>
      <div className={styles.searchBar}>
        {/* Kontener inputu i ikony */}
        <div className={styles.searchInputWrapper}>
          {/* Ikona FontAwesome (lupa) */}
          <FontAwesomeIcon icon={faMagnifyingGlass} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Wyszukaj artykuły..."
            className={styles.searchInput}
          />
        </div>

        {/* Przycisk z ikoną lupy i tekstem */}
        <button className={styles.searchButton}>
        <FontAwesomeIcon icon={faMagnifyingGlass}/>
          Szukaj
        </button>
      </div>

      {/* Filtry kategorii */}
      {/* <div className={styles.filterContainer}>
        <span className={`${styles.filterOption} active`}>Wszystkie</span>
        <span className={styles.filterOption}>Frontend</span>
        <span className={styles.filterOption}>Backend</span>
        <span className={styles.filterOption}>UX/UI</span>
      </div> */}
    </section>


      {/** ========== SEKCJA PRZYPINANE I NAJNOWSZE WPISY ========== */}
      <section className={styles.pinnedLatestSection}>
        {/* Przypięte wpisy (2-3) */}
        <div className={styles.pinnedContainer}>
          <h2 className={styles.pinnedTitle}>Przypięte artykuły</h2>
          {/* Przykładowe przypięte wpisy */}
          <div className={styles.pinnedArticleContainer}>
            <div className={styles.pinnedArticle}>
              <Block borderRadius="var(--border-radius-two)"/>
              <img
                src={`/uploads/standard.png`}
                alt=""
                className={styles.pinnedBackground}
              />
              <div className={styles.pinnedArticleContent}>
                <div className={styles.pinnedInfo}>
                  <span className={styles.pinnedLabel}><Block borderRadius="50%"/><FontAwesomeIcon icon={faThumbtack} /></span>
                  <h3 className={styles.pinnedArticleTitle}>
                    Poradnik React dla Początkujących
                  </h3>
                  <p className={styles.pinnedArticleDesc}>
                    Krótki opis przypiętego artykułu, aby zachęcić do czytania.
                  </p>
                  <a href="#" className={styles.readMoreBtn}>
                    Czytaj więcej &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.pinnedArticle}>
              <Block borderRadius="var(--border-radius-two)"/>
              <img
                src={`/uploads/standard.png`}
                alt=""
                className={styles.pinnedBackground}
              />
              <div className={styles.pinnedArticleContent}>
                <div className={styles.pinnedInfo}>
                  <span className={styles.pinnedLabel}><Block borderRadius="50%"/><FontAwesomeIcon icon={faThumbtack} /></span>
                  <h3 className={styles.pinnedArticleTitle}>
                    Jak ogarnąć TypeScript?
                  </h3>
                  <p className={styles.pinnedArticleDesc}>
                    Kilka wskazówek dotyczących konfiguracji i używania TS w projekcie.
                  </p>
                  <a href="#" className={styles.readMoreBtn}>
                    Czytaj więcej &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Najnowsze wpisy w formie grid/slider */}
        <div className={styles.latestContainer}>
          <h2 className={styles.latestTitle}>Najnowsze artykuły</h2>
          <div className={styles.latestGrid}>
            {/* Przykładowe kafelki */}
            <div className={styles.latestCard}>
            <Block borderRadius="var(--border-radius-two)"/>
              <div className={styles.latestCardContent}>
                <img
                    src={`/uploads/standard.png`}
                    alt=""
                    className={styles.latestThumb}
                />
                <div className={styles.latestContent}>
                  <h3 className={styles.latestTitleCard}>Wstęp do Next.js 13</h3>
                  <p className={styles.latestDescCard}>
                    Kilka słów o najnowszej wersji frameworka Next.js...
                  </p>
                  <a href="#" className={styles.readMoreBtn}>
                    Czytaj więcej &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.latestCard}>
            <Block borderRadius="var(--border-radius-two)"/>
            <div className={styles.latestCardContent}>
                <img
                    src={`/uploads/standard.png`}
                    alt=""
                    className={styles.latestThumb}
                />
                <div className={styles.latestContent}>
                  <h3 className={styles.latestTitleCard}>Testy w React</h3>
                  <p className={styles.latestDescCard}>
                    Przegląd popularnych bibliotek do testowania i najlepsze praktyki...
                  </p>
                  <a href="#" className={styles.readMoreBtn}>
                    Czytaj więcej &rarr;
                  </a>
                </div>
              </div>
            </div>

            <div className={styles.latestCard}>
            <Block borderRadius="var(--border-radius-two)"/>
            <div className={styles.latestCardContent}>
                <img
                    src={`/uploads/standard.png`}
                    alt=""
                    className={styles.latestThumb}
                />
                <div className={styles.latestContent}>
                  <h3 className={styles.latestTitleCard}>Refaktoryzacja kodu</h3>
                  <p className={styles.latestDescCard}>
                    Jak skutecznie ulepszać istniejący projekt, nie psując niczego?
                  </p>
                  <a href="#" className={styles.readMoreBtn}>
                    Czytaj więcej &rarr;
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <hr className={styles.hrHome} />

      {/** ========== SEKCJA "O BLOGU" ========== */}
      <section className={styles.aboutSection}>
        <div className={styles.aboutContent}>
          <h2 className={styles.aboutTitle}>O blogu</h2>
          <p className={styles.aboutParagraph}>
            Ten blog powstał z pasji do tworzenia stron i aplikacji internetowych.
            Poruszamy tutaj tematy związane z frontendem, backendem, UX/UI
            oraz narzędziami wspierającymi programistów. Dzięki regularnym
            publikacjom znajdziesz tutaj wiele praktycznych porad, tutoriali
            oraz ciekawych dyskusji.
          </p>
          <p className={styles.aboutParagraph}>
            Wierzymy, że technologia powinna być narzędziem, a nie przeszkodą
            w realizacji projektów. Cieszymy się, że możemy dzielić się naszą
            wiedzą i doświadczeniem z innymi pasjonatami.
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

      {/** ========== SEKCJA STATYSTYK (opcjonalna) ========== */}
      <section className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)"/>
            <div className={styles.statBoxContent}>
              <div className={styles.statValue}>+100</div>
              <div className={styles.statLabel}>Artykułów</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)"/>
            <div className={styles.statBoxContent}>
              <div className={styles.statValue}>10 000+</div>
              <div className={styles.statLabel}>Czytelników miesięcznie</div>
            </div>
          </div>
          <div className={styles.statBox}>
            <Block borderRadius="var(--border-radius-two)"/>
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
