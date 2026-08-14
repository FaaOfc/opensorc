"use client";

import { FileText, Shield, AlertTriangle, Scale, Ban, RefreshCw } from "lucide-react";
import { siteConfig } from "@/lib/config";

const sections = [
  {
    title: "1. Penerimaan Ketentuan",
    content:
      "Dengan mengakses atau menggunakan TaoSite, kamu menyetujui untuk terikat oleh Ketentuan Layanan ini. Jika kamu tidak setuju dengan bagian manapun dari ketentuan ini, kamu tidak diperkenankan menggunakan layanan ini. Ketentuan ini berlaku untuk semua pengunjung dan pengguna, baik yang terdaftar maupun tidak.",
    icon: Scale,
    color: "#f97316",
  },
  {
    title: "2. Deskripsi Layanan",
    content:
      `TaoSite adalah platform web multi-fungsi yang menyediakan tools gratis termasuk namun tidak terbatas pada: CDN file hosting, URL shortener, social media downloader (TikTok, Instagram, Facebook), AI chat dengan berbagai model, AI waifu roleplay, dan AI image generator. Semua fitur disediakan "sebagaimana adanya" (as-is) tanpa jaminan apapun. Kami berhak mengubah, membatasi, atau menghentikan fitur layanan kapan saja tanpa pemberitahuan terlebih dahulu.`,
    icon: FileText,
    color: "#3b82f6",
  },
  {
    title: "3. Penggunaan yang Diperbolehkan",
    content:
      "Kamu diperkenankan menggunakan TaoSite untuk tujuan yang sah dan sesuai hukum. Kamu setuju untuk tidak menggunakan layanan ini untuk: (a) mendistribusikan konten yang melanggar hukum, mengandung malware, atau bersifat ilegal; (b) melakukan spamming, scraping berlebihan, atau aktivitas yang merusak ketersediaan layanan bagi pengguna lain; (c) mencoba mengakses sistem secara tidak sah atau mengeksploitasi kerentanan keamanan; (d) mengotomatisasi penggunaan layanan tanpa izin tertulis; (e) menggunakan layanan dengan cara yang melanggar hak kekayaan intelektual pihak ketiga.",
    icon: Shield,
    color: "#10b981",
  },
  {
    title: "4. Penggunaan yang Dilarang",
    content:
      "Berikut adalah daftar aktivitas yang secara tegas dilarang saat menggunakan TaoSite: Mengupload konten yang melanggar hukum Indonesia atau yurisdiksi yang berlaku. Menggunakan AI features untuk menghasilkan konten yang bersifat menipu, memfitnah, atau merugikan pihak lain. Melakukan brute-force, DDoS, atau serangan lain terhadap server atau API yang digunakan. Menggunakan downloader untuk mengunduh konten yang dilindungi hak cipta tanpa izin pemilik. Membuat akun otomatis atau bot yang mengakses layanan secara massal.",
    icon: Ban,
    color: "#e11d48",
  },
  {
    title: "5. Konten Pengguna",
    content:
      "Untuk fitur CDN hosting, kamu bertanggung jawab penuh terhadap konten yang diupload. Kami tidak memoderasi konten secara aktif, namun berhak menghapus file yang melanggar ketentuan ini jika ditemukan. Untuk fitur AI, output yang dihasilkan adalah milikmu, namun kamu bertanggung jawab atas penggunaannya. Kami tidak menjamin keakuratan, kesesuaian, atau keamanan dari output AI.",
    icon: AlertTriangle,
    color: "#f59e0b",
  },
  {
    title: "6. Batasan Tanggung Jawab",
    content:
      `TaoSite dan ${siteConfig.authorName} tidak bertanggung jawab atas kerugian apapun yang timbul dari penggunaan layanan ini, termasuk namun tidak terbatas pada: kerugian data, kerugian bisnis, gangguan layanan, atau kerugian tidak langsung lainnya. Layanan ini disediakan tanpa jaminan apapun, baik tersurat maupun tersirat. Kami tidak menjamin bahwa layanan akan selalu tersedia, bebas error, atau aman dari ancaman.`,
    icon: Shield,
    color: "#8b5cf6",
  },
  {
    title: "7. Perubahan Ketentuan",
    content:
      "Kami berhak mengubah Ketentuan Layanan ini kapan saja. Perubahan akan berlaku segera setelah dipublikasikan di halaman ini. Kamu disarankan untuk meninjau halaman ini secara berkala. Penggunaan layanan yang berkelanjutan setelah perubahan berlaku dianggap sebagai penerimaan terhadap ketentuan yang diperbarui.",
    icon: RefreshCw,
    color: "#6366f1",
  },
];

export default function TosPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-orange-50 dark:bg-orange-950 mb-4">
          <FileText className="size-8 text-orange-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          Terms of Service
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Ketentuan layanan yang berlaku saat menggunakan {siteConfig.siteName}.
        </p>
        <p className="font-mono text-xs mt-2" style={{ color: "var(--neo-muted-text)" }}>
          Terakhir diperbarui: 14 Agustus 2026
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-5">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="neo-card p-5 sm:p-6">
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="neo-border rounded-lg p-2 shrink-0"
                  style={{ backgroundColor: `${section.color}15` }}
                >
                  <Icon className="size-4" style={{ color: section.color }} />
                </div>
                <h2 className="font-mono font-bold text-sm pt-1">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>
                {section.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Acknowledgment */}
      <div className="neo-card p-5 mt-8 text-center">
        <p className="font-mono text-sm mb-1" style={{ color: "var(--neo-muted-text)" }}>
          Dengan menggunakan {siteConfig.siteName}, kamu dianggap telah membaca dan menyetujui
          seluruh ketentuan di atas.
        </p>
        <p className="font-mono text-xs" style={{ color: "var(--neo-muted-text)" }}>
          Jika ada pertanyaan, hubungi kami melalui footer di bawah halaman ini.
        </p>
      </div>
    </div>
  );
}
