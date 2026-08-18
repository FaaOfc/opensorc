import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { promisify } from "util";
import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";

const execFileAsync = promisify(execFile);

export async function POST(request: NextRequest) {
  try {
    const { text, voice, speed, format } = await request.json();

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Teks diperlukan untuk diubah ke suara." },
        { status: 400 }
      );
    }

    if (text.length > 5000) {
      return NextResponse.json(
        { error: "Teks terlalu panjang. Maksimal 5000 karakter." },
        { status: 400 }
      );
    }

    const selectedVoice = voice || "tongtong";
    const selectedSpeed = speed || 1.0;
    const selectedFormat = format || "mp3";

    // Create temp output path
    const tmpDir = "/tmp/nefu-tts";
    await fs.mkdir(tmpDir, { recursive: true });
    const outputPath = path.join(tmpDir, `${randomUUID()}.${selectedFormat}`);

    // Call z-ai-web-dev-sdk CLI
    const { stderr } = await execFileAsync(
      "npx",
      [
        "z-ai-web-dev-sdk",
        "tts",
        "--input", text.trim(),
        "--output", outputPath,
        "--voice", selectedVoice,
        "--speed", String(selectedSpeed),
        "--format", selectedFormat,
      ],
      { timeout: 60000 }
    );

    if (stderr && stderr.includes("Error")) {
      console.error("TTS CLI stderr:", stderr);
    }

    // Read the generated audio file
    const audioBuffer = await fs.readFile(outputPath);
    const base64 = audioBuffer.toString("base64");

    // Clean up temp file
    await fs.unlink(outputPath).catch(() => {});

    const mimeTypes: Record<string, string> = {
      wav: "audio/wav",
      mp3: "audio/mpeg",
      pcm: "audio/pcm",
    };

    const mimeType = mimeTypes[selectedFormat] || "audio/mpeg";

    return NextResponse.json({
      audio: `data:${mimeType};base64,${base64}`,
      format: selectedFormat,
    });
  } catch (error: unknown) {
    console.error("TTS error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: `Gagal membuat audio: ${msg}` },
      { status: 500 }
    );
  }
}
