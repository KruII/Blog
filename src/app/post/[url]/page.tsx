/* eslint-disable @next/next/no-img-element */
import pool from "@/lib/db"; // Połączenie z bazą danych
import styles from "../PostDetails.module.css";

type Post = {
  id: number;
  title: string;
  content: string;
  category: string[];
  image_urls: string[];
  author: string;
  reading_time: number;
  created_at: string;
  url: string;
};

async function fetchPost(url: string): Promise<Post | null> {
  try {
    const query = `
      SELECT id, title, content, category, image_urls, author, reading_time, created_at, url
      FROM posts
      WHERE url = $1
    `;
    const { rows } = await pool.query(query, [url]);

    if (rows.length === 0) {
      return null; // Jeśli brak wyników, zwróć null
    }

    return rows[0];
  } catch (error) {
    console.error("Błąd podczas pobierania postu:", error);
    return null; // W razie błędu zwróć null
  }
}

export default async function PostPage({ params }: { params: { url: string } }) {
  const post = await fetchPost(params.url);

  if (!post) {
    return (
      <main className={styles.errorContainer}>
        <h1>404 - Post nie znaleziony</h1>
        <p>Nie możemy znaleźć artykułu o podanym adresie.</p>
      </main>
    );
  }

  return (
    <main className={styles.postContainer}>
      {/* Hero - Obrazek */}
      <section className={styles.hero}>
        <img
          src={post.image_urls[0] || "/uploads/standard.png"}
          alt={`Obrazek dla ${post.title}`}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <p className={styles.postAuthor}>Autor: {post.author}</p>
          <p className={styles.postMeta}>
            Kategorie: {post.category.join(", ")} | Czas czytania: {post.reading_time} min
          </p>
        </div>
      </section>

      {/* Treść artykułu */}
      <article className={styles.content}>
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </article>
    </main>
  );
}
