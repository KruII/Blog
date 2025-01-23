import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Upewnij się, że ta ścieżka do Twojego pliku z konfiguracją PG jest poprawna

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);

    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Walidacja parametrów sortowania
    const allowedSortBy = ["created_at", "title", "category"];
    const safeSortBy = allowedSortBy.includes(sortBy) ? sortBy : "created_at";
    const safeOrder = order.toLowerCase() === "asc" ? "asc" : "desc";

    // Budujemy warunek WHERE
    let whereClause = "WHERE 1=1";
    const values: unknown[] = [];
    let paramIndex = 1;

    // Jeśli podano kategorię (jako pojedynczy string),
    // a 'category' jest tablicą text[] w bazie:
    if (category) {
      // operator @> sprawdza, czy tablica w kolumnie zawiera dany element
      whereClause += ` AND category @> ARRAY[$${paramIndex}]::text[]`;
      values.push(category);
      paramIndex++;
    }

    if (search) {
      whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex + 1})`;
      values.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    // Ważne: kolejność zwracanych kolumn: (id, category, title, content, image_urls, author, reading_time, created_at)
    const query = `
      SELECT
        id,
        category,
        title,
        content,
        image_urls,
        author,
        reading_time,
        created_at
      FROM posts
      ${whereClause}
      ORDER BY ${safeSortBy} ${safeOrder}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;

    values.push(limit, skip);

    const { rows } = await pool.query(query, values);

    return NextResponse.json(rows); // Zwracamy tablicę rekordów
  } catch (error: unknown) {
    console.error("GET /api/posts error:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Zwróć uwagę, że 'image_urls' to tablica text[] 
    // (np. ["https://example.com/img1.jpg", "https://example.com/img2.png"])
    const { title, content, category, image_urls, author, reading_time } = body;

    if (!title || !content) {
      return new NextResponse("Missing title or content", { status: 400 });
    }

    // Dla kolumny 'category' i 'image_urls' w formie tablicy text[],
    // musimy przekazać je w formie { ... } lub konwertować w Postgres
    // Najprościej zrobimy tak:
    // jesli 'category' to tablica, np. ["frontend","react"], 
    // to wystarczy przekazać bezpośrednio w node-postgres: 
    // VALUES ($1, $2, $3, $4, $5, $6)
    // i w bazie kolumny muszą mieć typ text[]
    const query = `
      INSERT INTO posts (title, content, category, image_urls, author, reading_time)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
        id,
        category,
        title,
        content,
        image_urls,
        author,
        reading_time,
        created_at
    `;
    const values = [
      title,
      content,
      category || "{}",      // jeśli brak kategorii, pusta tablica
      image_urls || "{}",    // jeśli brak obrazków, pusta tablica
      author || "Admin",
      reading_time || 5
    ];

    const { rows } = await pool.query(query, values);
    const newPost = rows[0];

    return NextResponse.json(newPost, { status: 201 });
  } catch (error: unknown) {
    console.error("POST /api/posts error:", error);
    return new NextResponse("Could not create post", { status: 500 });
  }
}
