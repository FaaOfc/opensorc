"use client";

import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="neo-card p-8 sm:p-12 max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-5 bg-amber-50 dark:bg-amber-950 mb-6">
          <FileQuestion className="size-10 text-amber-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-mono font-bold mb-2">
          404
        </h1>
        <h2 className="text-lg sm:text-xl font-mono font-semibold mb-3">
          Halaman Tidak Ditemukan
        </h2>
        <p className="font-mono text-sm mb-8" style={{ color: "var(--neo-muted-text)" }}>
          Halaman yang kamu cari tidak ada atau sudah dipindahkan.
        </p>

        {/* Back Button */}
        <Link
          href="/"
          className="neo-btn inline-flex items-center justify-center gap-2 px-6 py-3 font-mono font-medium text-sm bg-amber-500 text-white hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[5px_5px_0px_var(--neo-shadow-color)] transition-all"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>
      </div>
    </div>
  );
}
