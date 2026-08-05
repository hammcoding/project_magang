import Link from 'next/link';
import AntrianFarmasi from '../../components/AntrianFarmasi';

export default function AntrianFarmasiPage() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 sm:px-5 pb-8 sm:pb-12 pt-5 sm:pt-8">
      {/* 5 Connected Segmented Tabs Navigation (Matching mitrasiaga.co.id) */}
      <div className="mb-5 sm:mb-8">
        <div className="flex overflow-x-auto rounded border border-gray-300 bg-white shadow-xs">
          <Link
            href="/antrian-poliklinik"
            className="flex-1 min-w-[100px] sm:min-w-[160px] px-2 sm:px-4 py-2.5 sm:py-3.5 text-center text-[12px] sm:text-[15px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[#004A99] border-r border-gray-300 no-underline whitespace-nowrap"
          >
            Artikel Kesehatan
          </Link>
          <Link
            href="/antrian-poliklinik"
            className="flex-1 min-w-[100px] sm:min-w-[160px] px-2 sm:px-4 py-2.5 sm:py-3.5 text-center text-[12px] sm:text-[15px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[#004A99] border-r border-gray-300 no-underline whitespace-nowrap"
          >
            Promosi
          </Link>
          <Link
            href="/antrian-poliklinik"
            className="flex-1 min-w-[100px] sm:min-w-[160px] px-2 sm:px-4 py-2.5 sm:py-3.5 text-center text-[12px] sm:text-[15px] font-bold text-gray-500 hover:bg-gray-50 hover:text-[#004A99] border-r border-gray-300 no-underline whitespace-nowrap"
          >
            Kegiatan Sosial
          </Link>
          <Link
            href="/antrian-poliklinik"
            className="flex-1 min-w-[100px] sm:min-w-[160px] px-2 sm:px-4 py-2.5 sm:py-3.5 text-center text-[12px] sm:text-[15px] font-bold text-gray-600 hover:bg-gray-50 hover:text-[#004A99] border-r border-gray-300 no-underline whitespace-nowrap"
          >
            Antrian Poliklinik
          </Link>
          <Link
            href="/antrian-farmasi"
            className="flex-1 min-w-[100px] sm:min-w-[160px] px-2 sm:px-4 py-2.5 sm:py-3.5 text-center text-[12px] sm:text-[15px] font-bold text-[#004A99] bg-white border-b-2 border-[#004A99] no-underline whitespace-nowrap"
          >
            Antrian Farmasi
          </Link>
        </div>
      </div>

      {/* Main Farmasi Component */}
      <AntrianFarmasi />

      {/* Banner Mobile JKN BPJS */}
      <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row flex-wrap items-start sm:items-center justify-between gap-4 sm:gap-5 rounded-lg bg-gradient-to-br from-[#004A99] to-[#0584c0] p-5 sm:p-8 text-white">
        <div className="self-start rounded bg-[#daa732] px-2.5 py-1 text-[11px] sm:text-[12px] font-extrabold text-gray-900">
          LAYANAN DIGITAL BPJS
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="mb-1.5 text-[17px] sm:text-[20px] font-bold">
            Ambil Nomor Antrean Poliklinik &amp; Farmasi Tanpa Antre di Rumah Sakit
          </h3>
          <p className="text-[13px] sm:text-[14px] opacity-90">
            Gunakan aplikasi <strong>Mobile JKN</strong> untuk mendaftar antrean
            rawat jalan RSU Mitra Siaga Tegal secara praktis dan langsung
            mendapatkan nomor panggilan.
          </p>
        </div>
        <a
          href="https://bpjs-kesehatan.go.id/user-manual-mobile-jkn/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 whitespace-nowrap rounded bg-white px-4 sm:px-5 py-2.5 sm:py-3 text-[13px] sm:text-[14px] font-extrabold text-[#004A99] hover:bg-yellow-100 transition-colors no-underline w-full sm:w-auto justify-center"
        >
          <i className="fa-solid fa-circle-info text-[#004A99]"></i> Petunjuk Mobile JKN
        </a>
      </div>
    </div>
  );
}
