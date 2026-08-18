"use client";

import { Users, Code2, Heart, Zap, Globe, Shield } from "lucide-react";
import { siteConfig } from "@/lib/config";

const team = [
  {
    name: "FaaNrky",
    role: "Founder & Lead Developer",
    description:
      "Pembangun utama TaoSite. Mengarsiteki seluruh sistem dari frontend hingga API integration, dengan visi membuat tools gratis yang bisa diakses siapa saja tanpa biaya.",
    icon: Code2,
    color: "#f97316",
  },
  {
    name: "Taosite",
    role: "Organization",
    description:
      "Tim kecil yang berdedikasi untuk membangun proyek open-source dan tools gratis bagi komunitas. Fokus pada efisiensi, keamanan, dan pengalaman pengguna yang menyenangkan.",
    icon: Users,
    color: "#8b5cf6",
  },
];

const values = [
  {
    title: "Gratis Selamanya",
    description:
      "Semua fitur di Taosite sepenuhnya gratis. Kami memanfaatkan infrastruktur yang sudah ada seperti Thinkcetre untuk hosting dan penyimpanan, sehingga tidak ada biaya server yang dibebankan ke pengguna.",
    icon: Zap,
    color: "#f97316",
  },
  {
    title: "Privasi Utama",
    description:
      "Kami tidak melacak aktivitas pengguna, tidak menyimpan log personal, dan tidak memerlukan login untuk menggunakan fitur utama. Data kamu tetap milikmu.",
    icon: Shield,
    color: "#10b981",
  },
  {
    title: "Akses Global",
    description:
      "TaoSite dirancang untuk bisa diakses dari mana saja di dunia. Dengan CDN yang terdistribusi dan arsitektur ringan, setiap fitur dimuat dengan cepat tanpa memandang lokasi.",
    icon: Globe,
    color: "#3b82f6",
  },
  {
    title: "Dibangun dengan Cinta",
    description:
      "Setiap piksel, setiap baris kode, dan setiap fitur dibangun dengan perhatian terhadap detail. Kami percaya bahwa tools yang baik harus terasa menyenangkan untuk digunakan.",
    icon: Heart,
    color: "#e11d48",
  },
];

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center neo-border rounded-xl p-4 bg-violet-50 dark:bg-violet-950 mb-4">
          <Users className="size-8 text-violet-600" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-mono font-bold mb-2">
          About Us
        </h1>
        <p className="font-mono text-sm" style={{ color: "var(--neo-muted-text)" }}>
          Kenali lebih dekat siapa kami dan mengapa TaoSite dibuat.
        </p>
      </div>

      {/* Story */}
      <div className="neo-card p-5 sm:p-6 mb-8">
        <h2 className="font-mono font-bold text-base mb-3 flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-500" />
          Cerita Kami
        </h2>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--neo-muted-text)" }}>
          {siteConfig.siteName} lahir dari sebuah kebutuhan sederhana: mengakses tools digital yang berguna
          tanpa harus membayar, mendaftar, atau menavigasi iklan yang mengganggu. Kami percaya bahwa
          utilitas dasar seperti hosting file, memperpendek URL, mengunduh media, dan berbicara dengan AI
          seharusnya bisa diakses oleh siapa saja tanpa syarat.
        </p>
        <p className="text-sm leading-relaxed mb-3" style={{ color: "var(--neo-muted-text)" }}>
          Dengan memanfaatkan Server sebagai backend (untuk file hosting, dan untuk database),
          dan API publik untuk fitur AI dan downloader, kami berhasil membangun sebuah platform yang
          sepenuhnya beroperasi tanpa biaya server. Tidak ada database berbayar, tidak ada cloud storage,
          dan tidak ada subscription hanya kode yang efisien dan infrastruktur cerdas.
        </p>
        <p className="text-sm leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>
          Desain Neobrutalism yang kami gunakan bukan hanya estetika ini adalah pernyataan bahwa
          fungsionalitas tidak perlu terlihat membosankan. Border tebal, shadow keras, dan tipografi
          monospace menciptakan pengalaman yang memorable dan menyenangkan.
        </p>
      </div>

      {/* Team */}
      <div className="mb-8">
        <h2 className="font-mono font-bold text-base mb-4 text-center">Tim</h2>
        <div className="space-y-4">
          {team.map((member) => {
            const Icon = member.icon;
            return (
              <div key={member.name} className="neo-card p-5">
                <div className="flex items-start gap-4">
                  <div
                    className="neo-border rounded-lg p-3 shrink-0"
                    style={{ backgroundColor: `${member.color}15` }}
                  >
                    <Icon className="size-5" style={{ color: member.color }} />
                  </div>
                  <div>
                    <h3 className="font-mono font-bold text-sm">{member.name}</h3>
                    <p className="font-mono text-xs mb-2" style={{ color: "var(--neo-muted-text)" }}>
                      {member.role}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>
                      {member.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Values */}
      <div>
        <h2 className="font-mono font-bold text-base mb-4 text-center">Nilai-Nilai Kami</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {values.map((value) => {
            const Icon = value.icon;
            return (
              <div key={value.title} className="neo-card p-5 text-center">
                <div
                  className="neo-border rounded-lg p-2.5 inline-flex mb-3"
                  style={{ backgroundColor: `${value.color}15` }}
                >
                  <Icon className="size-5" style={{ color: value.color }} />
                </div>
                <h3 className="font-mono font-bold text-sm mb-2">{value.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--neo-muted-text)" }}>
                  {value.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
