import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const scale = Number(formData.get("scale")) || 2;

    if (!file) {
      return NextResponse.json({ error: "File gambar diperlukan." }, { status: 400 });
    }

    if (![2, 4].includes(scale)) {
      return NextResponse.json({ error: "Scale harus 2 atau 4." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalSize = buffer.length;

    // Get original dimensions
    const meta = await sharp(buffer).metadata();
    const origWidth = meta.width || 1;
    const origHeight = meta.height || 1;
    const newWidth = origWidth * scale;
    const newHeight = origHeight * scale;

    // Upscale using sharp with high-quality interpolation
    const outputBuffer = await sharp(buffer, { ignoreIcc: true })
      .resize(newWidth, newHeight, {
        kernel: "lanczos3", // Best quality interpolation
        withoutEnlargement: false,
      })
      .jpeg({ quality: 95 })
      .toBuffer();

    const compressedSize = outputBuffer.length;
    const base64 = outputBuffer.toString("base64");

    return NextResponse.json({
      image: `data:image/jpeg;base64,${base64}`,
      originalWidth: origWidth,
      originalHeight: origHeight,
      newWidth,
      newHeight,
      scale,
      originalSize,
      newSize: compressedSize,
    });
  } catch (error: unknown) {
    console.error("Upscaler error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal upscale gambar: ${msg}` },
      { status: 500 }
    );
  }
}
