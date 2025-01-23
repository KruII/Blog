import styles from "./Footer.module.css";

// Jeśli używasz Font Awesome w postaci komponentów
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebookF, faTwitter, faGithub } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  return (
    <footer className={styles.footerContainer}>
      {/* Górna część stopki z kolumnami (linki, info, social media, newsletter) */}
      <div className={styles.footerContent}>
        
        {/* Kolumna 1: Linki */}
        <div className={styles.footerColumn}>
          <h2 className={styles.footerColumnTitle}>Nawigacja</h2>
          <ul className={styles.footerLinkList}>
            <li>
              <a href="#" className={styles.footerLink}>Strona Główna</a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>O Blogu</a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>Kontakt</a>
            </li>
            <li>
              <a href="#" className={styles.footerLink}>Polityka Prywatności</a>
            </li>
          </ul>
        </div>

        {/* Kolumna 2: Informacje / O nas */}
        <div className={styles.footerColumn}>
          <h2 className={styles.footerColumnTitle}>Informacje</h2>
          <p style={{ fontSize: "var(--font-size-xs)" }}>
            Nasz blog to miejsce, w którym dzielimy się wiedzą na temat
            programowania, designu oraz nowych technologii. Staramy się,
            aby każda publikacja była inspirująca i pomocna.
          </p>
          <div className={styles.socialIcons}>
            <span className={styles.socialIcon}>
              <FontAwesomeIcon icon={faFacebookF} />
            </span>
            <span className={styles.socialIcon}>
              <FontAwesomeIcon icon={faTwitter} />
            </span>
            <span className={styles.socialIcon}>
              <FontAwesomeIcon icon={faGithub} />
            </span>
          </div>
        </div>

        {/* Kolumna 3: Newsletter / Subskrypcja */}
        <div className={styles.footerColumn}>
          <h2 className={styles.footerColumnTitle}>Zapisz się</h2>
          <p style={{ fontSize: "var(--font-size-xs)" }}>
            Dołącz do naszego newslettera, aby otrzymywać najnowsze artykuły i
            poradniki prosto na swoją skrzynkę mailową.
          </p>
          <form className={styles.newsletterForm}>
            <div>
              <input
                type="email"
                placeholder="Twój adres e-mail"
                className={styles.newsletterInput}
              />
            </div>
            <button type="submit" className={styles.newsletterButton}>
              Subskrybuj <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </form>
        </div>
      </div>

      {/* Linia dzieląca */}
      <hr className={styles.footerDivider} />

      {/* Dolna belka stopki */}
      <div className={styles.bottomFooter}>
        <div className={styles.bottomFooterLeft}>
          <span>© {new Date().getFullYear()} Blog. Wszelkie prawa zastrzeżone.</span>
        </div>
        <div className={styles.bottomFooterRight}>
          <span className={styles.footerBadge}>Wersja 1.0</span>
          <span style={{ fontSize: "var(--font-size-xxs)" }}>
            | Kontakt: <FontAwesomeIcon icon={faEnvelope} /> blog@kruii.com
          </span>
        </div>
      </div>
    </footer>
  );
}
