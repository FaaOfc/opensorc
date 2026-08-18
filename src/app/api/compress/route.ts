import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const quality = Number(formData.get("quality")) || 80;
    const width = formData.get("width") ? Number(formData.get("width")) : undefined;
    const height = formData.get("height") ? Number(formData.get("height")) : undefined;
    const format = (formData.get("format") as string) || "original";

    if (!file) {
      return NextResponse.json({ error: "File diperlukan." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const originalSize = buffer.length;

    let pipeline = sharp(buffer);

    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width || undefined, height || undefined, {
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    // Output format & quality
    let outputBuffer: Buffer;
    let contentType: string;

    if (format === "jpeg" || format === "jpg") {
      outputBuffer = await pipeline.jpeg({ quality }).toBuffer();
      contentType = "image/jpeg";
    } else if (format === "png") {
      outputBuffer = await pipeline.png({ quality: Math.round(quality / 10) }).toBuffer();
      contentType = "image/png";
    } else if (format === "webp") {
      outputBuffer = await pipeline.webp({ quality }).toBuffer();
      contentType = "image/webp";
    } else {
      // Keep original format
      const meta = await sharp(buffer).metadata();
      const fmt = meta.format || "jpeg";
      if (fmt === "png") {
        outputBuffer = await pipeline.png({ quality: Math.round(quality / 10) }).toBuffer();
        contentType = "image/png";
      } else if (fmt === "webp") {
        outputBuffer = await pipeline.webp({ quality }).toBuffer();
        contentType = "image/webp";
      } else {
        outputBuffer = await pipeline.jpeg({ quality }).toBuffer();
        contentType = "image/jpeg";
      }
    }

    const compressedSize = outputBuffer.length;
    const savings = Math.round((1 - compressedSize / originalSize) * 100);

    const base64 = outputBuffer.toString("base64");

    return NextResponse.json({
      image: `data:${contentType};base64,${base64}`,
      originalSize,
      compressedSize,
      savings,
      contentType,
    });
  } catch (error: unknown) {
    console.error("Compress error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal memproses gambar: ${msg}` },
      { status: 500 }
    );
  }
}
