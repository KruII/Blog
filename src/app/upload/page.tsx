"use client";

import { useState } from "react";

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);

  // Lista dozwolonych rozszerzeń
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Pobieramy rozszerzenie pliku
      const fileExtension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();

      // Sprawdzamy, czy rozszerzenie jest na liście dozwolonych
      if (!allowedExtensions.includes(fileExtension)) {
        alert("Nieobsługiwany typ pliku. Dozwolone są tylko pliki JPG, PNG i WEBP.");
        e.target.value = ""; // Czyścimy pole pliku
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Wybierz plik przed przesłaniem!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus("Plik został pomyślnie przesłany.");
      } else {
        setUploadStatus("Wystąpił błąd podczas przesyłania pliku.");
      }
    } catch (error) {
      console.error("Błąd:", error);
      setUploadStatus("Wystąpił błąd podczas przesyłania pliku.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Prześlij plik</h1>
      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp" // Ograniczamy rozszerzenia już na poziomie HTML
        onChange={handleFileChange}
      />
      <button onClick={handleUpload} style={{ marginLeft: "1rem" }}>
        Prześlij
      </button>
      {uploadStatus && <p>{uploadStatus}</p>}
    </div>
  );
}
