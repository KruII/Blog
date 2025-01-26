/* eslint-disable @next/next/no-img-element */
import styles from "../PostDetails.module.css";
import { getPostByUrl } from "@/lib/posts";
import Block from "@/componets/Block/Block";
import { sanitizePostContent } from "@/lib/sanitizer"; // Importujemy funkcję sanitizującą

export const dynamic = "force-dynamic";

export default async function PostPage({ params }: { params: { url: string } }) {
  // Wyciągamy URL z parametrów
  const { url } = await params;
  const post = await getPostByUrl(url);

  if (!post) {
    return (
      <main className={styles.errorContainer}>
        <h1>404 - Post nie znaleziony</h1>
        <p>Nie możemy znaleźć artykułu o podanym adresie.</p>
      </main>
    );
  }

  // Sanityzacja treści posta
  const safeContent = sanitizePostContent(post.content, ['example.com', 'cdn.example.com']);

  return (
    <main className={styles.postContainer}>
      <Block borderRadius="16px" />
      {/* Sekcja hero */}
      <section className={styles.hero}>
        <img
          src={post.image_urls[0] || "/uploads/standard.png"}
          alt={`Obrazek dla ${post.title}`}
          className={styles.heroImage}
        />
        <div className={styles.heroOverlay}>
          <h1 className={styles.postTitle}>{post.title}</h1>
        </div>
        <p className={styles.postAuthor}>Autor: {post.author}</p>
        <p className={styles.postMeta}>
          Kategorie: {post.category.join(", ")} | Czas czytania: {post.reading_time} min
        </p>
      </section>

      {/* Sekcja z treścią */}
      <article className={styles.content}>
        {/* Wyświetlamy sanityzowaną treść */}
        <div dangerouslySetInnerHTML={{ __html: safeContent }} />
      </article>
    </main>
  );
}
