// Site configuration — customize these values
export const siteConfig = {
  siteName: "TaoSite",
  authorName: "Hutao's Husband",
  tagline: "Super-efficient multifunction web app",
  description:
    "A personal project for file hosting and URL shortening, powered by GitHub as a free database and storage backend.",
  profilePicture: "https://cdn.nefyu.my.id/csy1.jpg",
  profileBanner: "https://cdn.nefyu.my.id/cgxl.png",
  backgroundImage: "https://cdn.nefyu.my.id/1lsq.webp",
  githubUrl: "https://github.com/alip-jmbd/NefuSite",
  // Social media URLs — update these to your real accounts
  instagramUrl: "https://instagram.com/fnrkyy",
  tiktokUrl: "https://tiktok.com/@_xcrazykillerx_",
  emailUrl: "mailto:faanrky@gmail.com",
};

// Feature descriptions for the homepage
export const features = [
  {
    id: "cdn",
    title: "CDN Hosting",
    subtitle: "Host any file, any mimetype",
    description:
      "Upload images, videos, documents, executables — anything. Your files are stored on GitHub and served through your own domain with proper MIME types. Supports drag & drop uploads with instant shareable URLs.",
    icon: "upload-cloud" as const,
    color: "#f97316",
    details: [
      "Supports all MIME types",
      "Drag & drop file upload",
      "Random 4-char filenames",
      "GitHub as free storage backend",
      "Proxied through your domain",
    ],
  },
  {
    id: "shorturl",
    title: "URL Shortener",
    subtitle: "Shorten any URL instantly",
    description:
      "Transform long, unwieldy URLs into short, shareable links. Optionally customize your short codes for branded links. All mappings stored securely in a GitHub Gist — zero cost, zero maintenance.",
    icon: "link" as const,
    color: "#10b981",
    details: [
      "Custom short codes (optional)",
      "Random code generation",
      "GitHub Gist as database",
      "Instant 302 redirects",
      "Collision-safe code generation",
    ],
  },
  {
    id: "github-powered",
    title: "GitHub Powered",
    subtitle: "Zero cost infrastructure",
    description:
      "No database, no cloud storage, no hosting fees. NefuSite uses GitHub's free tier as both a file storage system (repos) and a URL database (gists). Deploy once and forget about infrastructure.",
    icon: "github" as const,
    color: "#8b5cf6",
    details: [
      "No database needed",
      "No hosting fees",
      "GitHub API for storage",
      "Gist for URL mappings",
      "Repo for CDN files",
    ],
  },
  {
    id: "neobrutalism",
    title: "Neobrutalism UI",
    subtitle: "Bold, functional design",
    description:
      "Clean monospace typography, hard shadow buttons, and 2px black borders create a distinctive, memorable interface that prioritizes clarity and usability over decoration.",
    icon: "palette" as const,
    color: "#ec4899",
    details: [
      "Hard offset box shadows",
      "2px black borders",
      "Monospace typography",
      "Press-in button effect",
      "Smooth section transitions",
    ],
  },
];
