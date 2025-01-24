// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getFilteredPosts, createPost } from "@/lib/posts";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const skip = parseInt(searchParams.get("skip") || "0", 10);
    const sortBy = searchParams.get("sortBy") || "created_at";
    const order = searchParams.get("order") || "desc";

    // Korzystamy z naszej wspólnej funkcji
    const posts = await getFilteredPosts({
      search,
      category,
      limit,
      skip,
      // tu musimy rzutować, bo sortBy i order to stringi
      sortBy: sortBy as "created_at" | "title" | "category",
      order: order as "asc" | "desc",
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.error("GET /api/posts error:", error);
    return new NextResponse("Database error", { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content } = body;

    if (!title || !content) {
      return new NextResponse("Missing title or content", { status: 400 });
    }

    // Tworzymy nowy post
    const newPost = await createPost(body);
    return NextResponse.json(newPost, { status: 201 });
  } catch (error) {
    console.error("POST /api/posts error:", error);
    return new NextResponse("Could not create post", { status: 500 });
  }
}
