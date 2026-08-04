import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Media & Informasi - RSU Mitra Siaga Tegal",
  description:
    "Portal Resmi Monitoring System Antrian Online Poliklinik & Farmasi RSU Mitra Siaga Tegal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head>
        {/* Font Awesome Icons CDN for authentic enterprise UI */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-screen bg-white text-[#17202A] text-[14px]">
        {/* ================================================================
            HEADER / NAVBAR (Matching mitrasiaga.co.id font sizing)
            ================================================================ */}
        <header className="sticky top-0 z-50 border-b-2 border-blue-100 bg-white shadow-[0_2px_10px_rgba(0,74,153,0.05)]">
          <div className="mx-auto flex h-[75px] max-w-[1200px] items-center justify-between px-5">
            {/* Logo & Brand */}
            <a href="/" className="flex items-center gap-3 no-underline">
              <div className="flex h-11 w-12 items-center justify-center rounded-lg bg-white">
                <svg
                  width="46"
                  height="42"
                  viewBox="0 0 160 140"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M20 100L55 35L80 75L65 100H20Z" fill="#1BA345" />
                  <path d="M60 100L95 35L140 100H95Z" fill="#0D5C91" />
                  <path d="M50 100L75 55L90 80L78 100H50Z" fill="#2ED068" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-[20px] font-extrabold leading-tight tracking-wide text-[#004A99]">
                  MITRA SIAGA
                </span>
                <span className="text-[11px] font-bold tracking-widest text-[#0584c0]">
                  Rumah Sakit - Melayani Dengan Ketulusan Hati
                </span>
              </div>
            </a>

            {/* Navigation Links */}
            <nav className="hidden md:block">
              <ul className="flex list-none gap-7">
                <li>
                  <a
                    href="#"
                    className="text-[14px] font-bold text-gray-600 no-underline transition-colors hover:text-[#004A99]"
                  >
                    Beranda
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] font-bold text-gray-600 no-underline transition-colors hover:text-[#004A99]"
                  >
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] font-bold text-gray-600 no-underline transition-colors hover:text-[#004A99]"
                  >
                    Cabang
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] font-bold text-gray-600 no-underline transition-colors hover:text-[#004A99]"
                  >
                    Reservasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="relative border-b-[3.5px] border-[#004A99] pb-[24px] text-[14px] font-bold text-[#004A99] no-underline"
                  >
                    Media & Informasi
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-[14px] font-bold text-gray-600 no-underline transition-colors hover:text-[#004A99]"
                  >
                    Kontak
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        {/* ================================================================
            PAGE TITLE & BREADCRUMB BANNER
            ================================================================ */}
        <section
          className="border-b border-gray-200 py-6"
          style={{
            backgroundColor: "#F1F5F9",
            backgroundImage: "radial-gradient(#CBD5E1 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        >
          <div className="mx-auto max-w-[1200px] px-5">
            <div className="mb-2 flex items-center gap-2 text-[14px] text-[#0584c0]">
              <a href="#" className="text-[#0584c0] no-underline">
                <i className="fa-solid fa-house"></i>
              </a>
              <span className="text-[12px] text-gray-400">›</span>
              <span className="font-semibold text-[#0584c0]">
                Media & Informasi
              </span>
            </div>
            <h1 className="text-[32px] font-extrabold tracking-tight text-[#004A99]">
              Media & Informasi
            </h1>
          </div>
        </section>

        {/* ================================================================
            MAIN CONTENT
            ================================================================ */}
        <main className="bg-white">{children}</main>

        {/* ================================================================
            FOOTER (Matching mitrasiaga.co.id font sizing)
            ================================================================ */}
        <footer className="bg-[#0D5C91] py-6 text-[14px] text-white">
          <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-5 px-5">
            <p className="m-0 font-medium opacity-95 text-[14px]">
              © 2026 RS Mitra Siaga. All rights reserved.
            </p>
            <div className="flex items-center gap-5">
              <span className="font-bold text-white text-[14px]">Link Terkait</span>
              <div className="flex items-center gap-4">
                <a
                  href="https://kemkes.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[14px] text-white/90 no-underline transition-opacity hover:text-white hover:underline"
                >
                  <i className="fa-solid fa-hospital text-blue-200"></i> Kementerian Kesehatan
                </a>
                <a
                  href="https://bpjs-kesehatan.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[14px] text-white/90 no-underline transition-opacity hover:text-white hover:underline"
                >
                  <i className="fa-solid fa-heart-pulse text-green-300"></i> BPJS Kesehatan
                </a>
                <a
                  href="https://bpjsketenagakerjaan.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-[14px] text-white/90 no-underline transition-opacity hover:text-white hover:underline"
                >
                  <i className="fa-solid fa-building-shield text-blue-200"></i> BPJS Ketenagakerjaan
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
