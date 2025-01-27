"use client"
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [readingTime, setReadingTime] = useState(0);
  const [categories, setCategories] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [url, setUrl] = useState("");
  const [pinned, setPinned] = useState(false);

  const handleEditorChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMarkdown(event.target.value);
    calculateReadingTime(event.target.value);
  };

  const calculateReadingTime = (content: string) => {
    const wordsPerMinute = 200; // Average reading speed
    const words = content.split(" ").length;
    setReadingTime(Math.ceil(words / wordsPerMinute));
  };

  const handleSave = async () => {
    try {
      const response = await fetch("/api/saveMarkdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: markdown,
          author,
          reading_time: readingTime,
          category: categories ? categories.split(",").map((cat) => cat.trim()) : [],
          image_urls: imageUrls ? imageUrls.split(",").map((url) => url.trim()) : [],
          url,
          pinned,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      alert("Content saved successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to save content. Please try again.");
    }
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ textAlign: "center", marginBottom: "1rem" }}>Markdown Editor</h1>

      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", backgroundColor: "#000", }}
      />
      <input
        type="text"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Author"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", backgroundColor: "#000", }}
      />
      <textarea
        value={markdown}
        onChange={handleEditorChange}
        placeholder="Write your Markdown content here..."
        style={{ width: "100%", height: "300px", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", fontFamily: "monospace", backgroundColor: "#000", }}
      ></textarea>
      <input
        type="text"
        value={categories}
        onChange={(e) => setCategories(e.target.value)}
        placeholder="Categories (comma-separated)"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", backgroundColor: "#000", }}
      />
      <input
        type="text"
        value={imageUrls}
        onChange={(e) => setImageUrls(e.target.value)}
        placeholder="Image URLs (comma-separated)"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", backgroundColor: "#000", }}
      />
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
        style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", fontSize: "1rem", backgroundColor: "#000", }}
      />
      <label style={{ display: "block", marginBottom: "1rem" }}>
        <input
          type="checkbox"
          checked={pinned}
          onChange={(e) => setPinned(e.target.checked)}
          style={{ marginRight: "0.5rem" }}
        />
        Pinned
      </label>

      <button
        onClick={handleSave}
        style={{
          marginTop: "1rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#0070f3",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Save Content
      </button>

      <div style={{ marginTop: "2rem" }}>
        <h2>Preview</h2>
        <div
          style={{
            padding: "1rem",
            border: "1px solid #ddd",
            borderRadius: "5px",
            backgroundColor: "#000",
          }}
        >
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
