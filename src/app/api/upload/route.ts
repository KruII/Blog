import { NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  try {
    const data = await request.formData();
    const file = data.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "Brak pliku w żądaniu." },
        { status: 400 }
      );
    }

    // Lista dozwolonych typów MIME
    const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

    // Walidacja MIME
    if (!allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: "Nieobsługiwany typ pliku. Dozwolone są tylko obrazy (JPG, PNG, WEBP)." },
        { status: 400 }
      );
    }

    // Generowanie nazwy pliku z unikalnym prefiksem
    const ext = path.extname(file.name); // Rozszerzenie pliku
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
    const filePath = path.join(process.cwd(), "public/uploads", uniqueName);

    // Zapis pliku
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    return NextResponse.json({ success: true, filePath: `/uploads/${uniqueName}` });
  } catch (error) {
    console.error("Błąd podczas zapisywania pliku:", error);
    return NextResponse.json(
      { success: false, message: "Wystąpił błąd podczas zapisywania pliku." },
      { status: 500 }
    );
  }
}
