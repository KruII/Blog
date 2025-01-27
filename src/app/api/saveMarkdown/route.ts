import { NextResponse } from "next/server";
import pool from "@/lib/db";
import MarkdownIt from "markdown-it";

// Funkcja konwertująca Markdown na JSON
function convertMarkdownToJson(markdown: string) {
  const md = new MarkdownIt();
  const tokens = md.parse(markdown, {});
  return tokens.map((token) => ({
    type: token.type,
    tag: token.tag || null,
    content: token.content || "",
    attrs: token.attrs || [],
    nesting: token.nesting || 0,
  }));
}

// Obsługa metody POST
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, content, author, reading_time, category, image_urls, url, pinned } = body;

    if (!title || !content || !author) {
      return NextResponse.json({ error: "Title, content, and author are required" }, { status: 400 });
    }

    // Konwersja Markdown na JSON
    const contentJson = convertMarkdownToJson(content);

    // SQL do wstawiania danych do bazy
    const query = `
      INSERT INTO posts (title, content, author, reading_time, category, image_urls, url, pinned, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING id;
    `;

    const values = [
      title,
      JSON.stringify(contentJson), // Zapisujemy JSON w bazie
      author,
      reading_time || 0,
      category || [],
      image_urls || [],
      url || "",
      pinned || false,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      message: "Content saved successfully",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json({ error: "Failed to save content" }, { status: 500 });
  }
}
