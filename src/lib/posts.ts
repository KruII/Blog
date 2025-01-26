// lib/posts.ts
import pool from "./db";

/** Typ posta zgodny z Twoją tabelą w bazie */
export interface Post {
    id: number;
    category: string[];
    title: string;
    content: string;
    image_urls: string[];
    author: string;
    reading_time: number;
    created_at: string;
    url: string;
    pinned: boolean;
}

/** Funkcja pobierająca wszystkie posty (posortowane malejąco po dacie) */
export async function getAllPosts(): Promise<Post[]> {
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

/**
 * Funkcja z możliwością filtrów (search, category, sort, paginacja).
 * Używaj jej zarówno w API, jak i w komponencie serwerowym.
 */
export async function getFilteredPosts(params: {
    search?: string;
    category?: string;
    limit?: number;
    skip?: number;
    sortBy?: "created_at" | "title" | "category";
    order?: "asc" | "desc";
}): Promise<Post[]> {
    const {
        search = "",
        category = "",
        limit = 10,
        skip = 0,
        sortBy = "created_at",
        order = "desc",
    } = params;

    // Ustalenie bezpiecznych parametrów sortowania
    const allowedSortBy = ["created_at", "title", "category"] as const;
    const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
    const safeOrder = order === "asc" ? "asc" : "desc";

    let whereClause = "WHERE 1=1";
    const values: unknown[] = [];
    let paramIndex = 1;

    // Filtr po kategorii (kolumna category to text[])
    if (category) {
        whereClause += ` AND category @> ARRAY[$${paramIndex}]::text[]`;
        values.push(category);
        paramIndex++;
    }

    // Filtr po tytule lub treści (case-insensitive)
    if (search) {
        whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex + 1})`;
        values.push(`%${search}%`, `%${search}%`);
        paramIndex += 2;
    }

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
        ${whereClause}
        ORDER BY ${safeSortBy} ${safeOrder}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, skip);

    const { rows } = await pool.query(query, values);
    return rows;
}

/** Funkcja do tworzenia nowego posta */
export async function createPost(data: {
    title: string;
    content: string;
    category?: string[];
    image_urls?: string[];
    author?: string;
    reading_time?: number;
    url?: string;
    pinned?: boolean;
    }): Promise<Post> {
    const {
        title,
        content,
        category = [],
        image_urls = [],
        author = "Admin",
        reading_time = 5,
        url = "",
        pinned = false,
    } = data;

    const query = `
        INSERT INTO posts (title, content, category, image_urls, author, reading_time, url, pinned)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING
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
    `;
    const values = [title, content, category, image_urls, author, reading_time, url, pinned];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

/**
 * Pobiera pojedynczy post na podstawie pola 'url'.
 * Zwraca obiekt Post lub null, jeśli nie znaleziono.
 */
export async function getPostByUrl(url: string): Promise<Post | null> {
    try {
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
            WHERE url = $1
            LIMIT 1
        `;
        const { rows } = await pool.query(query, [url]);
    
        if (rows.length === 0) {
            return null;
        }
        return rows[0];
    } catch (error) {
        console.error("Błąd podczas pobierania posta z bazy:", error);
        return null;
    }
}