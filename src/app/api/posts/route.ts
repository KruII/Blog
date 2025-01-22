import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // Importujemy plik z połączeniem do bazy

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

        let whereClause = "WHERE 1=1";
        const values: unknown[] = [];
        let paramIndex = 1;

        if (category) {
            whereClause += ` AND category = $${paramIndex}`;
            values.push(category);
            paramIndex++;
        }

        if (search) {
            whereClause += ` AND (title ILIKE $${paramIndex} OR content ILIKE $${paramIndex + 1})`;
            values.push(`%${search}%`, `%${search}%`);
            paramIndex += 2;
        }

        // id: integer; title: text; content: text; category: text[]; author: text; reading_time: integer; created_at: timestamp without time zone;
        const query = `
            SELECT id, title, content, category, author, reading_time, created_at
            FROM posts
            ${whereClause}
            ORDER BY ${safeSortBy} ${safeOrder}
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        values.push(limit, skip);

        const { rows } = await pool.query(query, values);
        return NextResponse.json(rows);
    } catch (error: unknown) {
        console.error("GET /api/posts error:", error);
        return new NextResponse("Database error", { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { title, content, category } = body;

            if (!title || !content) {
            return new NextResponse("Missing title or content", { status: 400 });
        }

        const query = `
            INSERT INTO posts (title, content, category)
            VALUES ($1, $2, $3)
            RETURNING id, title, content, category, created_at
        `;
        const values = [title, content, category || ""];

        const { rows } = await pool.query(query, values);
        const newPost = rows[0];

        return NextResponse.json(newPost, { status: 201 });
    } catch (error: unknown) {
        console.error("POST /api/posts error:", error);
        return new NextResponse("Could not create post", { status: 500 });
    }
}
