import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }

    // Validação de limite (5MB)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Arquivo muito grande. O limite máximo é de 5MB." },
        { status: 400 }
      );
    }

    // Validação de tipo de imagem
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Apenas arquivos de imagem são permitidos." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitiza nome do arquivo
    const originalName = file.name || "imagem.jpg";
    const ext = path.extname(originalName) || ".jpg";
    const baseName = path
      .basename(originalName, ext)
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const finalFileName = `${baseName || "capa"}-${Date.now()}${ext}`;

    const uploadDir = path.join(process.cwd(), "public", "blog");
    await mkdir(uploadDir, { recursive: true });

    const filePath = path.join(uploadDir, finalFileName);
    await writeFile(filePath, buffer);

    const publicUrl = `/blog/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
    });
  } catch (error) {
    console.error("Erro no upload:", error);
    return NextResponse.json(
      { error: "Falha ao salvar imagem no servidor." },
      { status: 500 }
    );
  }
}
