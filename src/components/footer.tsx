"use client";

import Link from "next/link";
import {
  Zap,
  Github,
  ExternalLink,
  Instagram,
  Mail,
  Heart,
  FileText,
  Users,
  Sparkles,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

const quickLinks = [
  { href: "/about", label: "About Us", icon: Users },
  { href: "/thanks", label: "Thanks To", icon: Heart },
  { href: "/tos", label: "Terms of Service", icon: FileText },
  { href: "/credits", label: "Credits", icon: Sparkles },
];

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="size-4">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.59-1.62v9.14a5.67 5.67 0 1 1-5.67-5.67h.27V12.2a3.33 3.33 0 1 0 .27 6.6V4.81a7.27 7.27 0 0 0 7.27 0v1.88a4.83 4.83 0 0 1-3.59 0z" />
    </svg>
  );
}

// Social links now use URLs from siteConfig
const socialLinks = [
  {
    href: siteConfig.githubUrl,
    label: "GitHub",
    color: "#18181b",
  },
  {
    href: siteConfig.instagramUrl,
    label: "Instagram",
    color: "#e4405f",
  },
  {
    href: siteConfig.tiktokUrl,
    label: "TikTok",
    color: "#000000",
  },
  {
    href: siteConfig.emailUrl,
    label: "Email",
    color: "#ea580c",
  },
];

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case "GitHub":
      return <Github className="size-4" />;
    case "Instagram":
      return <Instagram className="size-4" />;
    case "TikTok":
      return <TikTokIcon />;
    case "Email":
      return <Mail className="size-4" />;
    default:
      return null;
  }
}

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ borderTop: "2px solid var(--neo-border-color)" }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Top row: Brand + Quick Links + Sosmed */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="size-5 text-orange-500" />
              <span className="font-mono font-bold text-lg">
                {siteConfig.siteName}
              </span>
            </div>
            <p
              className="font-mono text-xs leading-relaxed"
              style={{ color: "var(--neo-muted-text)" }}
            >
              {siteConfig.tagline}. Host files, shorten URLs, download media,
              chat with AI, all in one place.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs flex items-center gap-2 transition-colors hover:text-orange-500"
                      style={{ color: "var(--neo-muted-text)" }}
                    >
                      <Icon className="size-3.5 shrink-0" />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h4 className="font-mono font-bold text-sm mb-3 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
              Social Media
            </h4>
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="neo-btn flex items-center gap-2 px-3 py-2 font-mono text-xs bg-[var(--neo-card-bg)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-all"
                >
                  <SocialIcon label={social.label} />
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="mb-6"
          style={{ borderBottom: "1px dashed var(--neo-border-color)" }}
        />

        {/* Bottom row: Copyright + GitHub link */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="font-mono text-xs"
            style={{ color: "var(--neo-muted-text)" }}
          >
            &copy; {new Date().getFullYear()} {siteConfig.authorName}. Built with{" "}
            <span className="text-orange-500">&#9829;</span> and open source.
          </p>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="neo-btn flex items-center gap-2 px-3 py-1.5 font-mono text-xs bg-[var(--neo-card-bg)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_var(--neo-shadow-color)] transition-all"
          >
            <Github className="size-3.5" />
            Source Code
            <ExternalLink className="size-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
