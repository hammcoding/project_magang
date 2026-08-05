'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface FarmasiItem {
  id: string;
  code: string;
  counterName: string;
  catName: string;
  currentNum: string;
  patientName: string;
  status: 'ready' | 'preparing';
  statusText: string;
  estTime: string;
}

// ============================================================================
// DUMMY DATA - Replace with API fetch in production
// ============================================================================
const initialFarmasiData: FarmasiItem[] = [
  {
    id: 'far-1',
    code: 'non-racik',
    counterName: 'Loket 1 - Obat Jadi (Non-Racik)',
    catName: 'Resep Non-Racikan',
    currentNum: 'F-042',
    patientName: 'Ibu Suryani',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: 'Siap Sekarang',
  },
  {
    id: 'far-2',
    code: 'racik',
    counterName: 'Loket 2 - Racikan Khusus',
    catName: 'Resep Racikan',
    currentNum: 'R-018',
    patientName: 'Bp. Bambang Purwanto',
    status: 'preparing',
    statusText: 'Proses Penyiapan Obat',
    estTime: '~ 10-15 Menit',
  },
  {
    id: 'far-3',
    code: 'bpjs',
    counterName: 'Loket 3 - BPJS Rawat Jalan',
    catName: 'Farmasi BPJS Kesehatan',
    currentNum: 'B-105',
    patientName: 'Ibu Siti Rahayu',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: 'Siap Sekarang',
  },
  {
    id: 'far-4',
    code: 'umum',
    counterName: 'Loket 4 - Pasien Umum & Asuransi',
    catName: 'Farmasi Umum',
    currentNum: 'U-022',
    patientName: 'Sdr. Kevin Pratama',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: 'Siap Sekarang',
  },
];

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
function FarmasiStatusBadge({ status }: { status: string }) {
  if (status === 'ready') {
    return (
      <span className="inline-block rounded border border-green-300 bg-green-50 px-2.5 py-1 text-xs font-bold text-green-800">
        Siap Diambil
      </span>
    );
  }
  return (
    <span className="inline-block rounded border border-yellow-300 bg-yellow-50 px-2.5 py-1 text-xs font-bold text-yellow-800">
      Proses Penyiapan
    </span>
  );
}

// ============================================================================
// TICKET CHECK MODAL COMPONENT
// ============================================================================
function TicketModal({
  isOpen,
  onClose,
  farmasiData,
}: {
  isOpen: boolean;
  onClose: () => void;
  farmasiData: FarmasiItem[];
}) {
  const [ticketInput, setTicketInput] = useState('');
  const [searchResult, setSearchResult] = useState<React.ReactNode | null>(
    null
  );

  const performSearch = useCallback(
    (code: string) => {
      const searchCode = code.toUpperCase().trim();
      if (!searchCode) {
        setSearchResult(
          <div className="rounded p-2.5 text-red-500">
            Masukkan nomor resep Anda.
          </div>
        );
        return;
      }

      const match = farmasiData.find(
        (f) => f.currentNum.toUpperCase() === searchCode
      );

      if (match) {
        setSearchResult(
          <div className="rounded border-l-4 border-[#004A99] bg-gray-100 p-3.5">
            <h4 className="font-bold text-[#004A99]">
              Resep No. {match.currentNum}
            </h4>
            <p>
              <strong>Pasien:</strong> {match.patientName}
            </p>
            <p>
              <strong>Loket:</strong> {match.counterName}
            </p>
            <p>
              <strong>Status:</strong> {match.statusText}
            </p>
          </div>
        );
      } else {
        setSearchResult(
          <div className="rounded border-l-4 border-yellow-500 bg-yellow-50 p-3.5">
            <p>
              Nomor Tiket &quot;{searchCode}&quot; sedang berada dalam urutan
              proses apotek.
            </p>
          </div>
        );
      }
    },
    [farmasiData]
  );

  // Pre-fill search when opened with a ticket number
  useEffect(() => {
    if (!isOpen) {
      setTicketInput('');
      setSearchResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#004A99] px-4 sm:px-5 py-3 sm:py-4 text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold">
              Cek Status Resep Obat Farmasi
            </h3>
            <span className="text-xs text-blue-200">
              Pelayanan Instalasi Farmasi RSU Mitra Siaga
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-2xl text-white hover:text-gray-300"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5">
          <div className="mb-4 flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={ticketInput}
              onChange={(e) => setTicketInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') performSearch(ticketInput);
              }}
              placeholder="Masukkan Kode Resep (misal: R-018 atau F-042)"
              autoComplete="off"
              className="flex-1 rounded border border-gray-300 px-2.5 py-2.5 text-sm"
            />
            <button
              onClick={() => performSearch(ticketInput)}
              className="flex items-center justify-center gap-1.5 rounded bg-[#0584c0] px-4 py-2.5 font-bold text-white hover:bg-[#004A99] transition-colors text-sm"
            >
              <i className="fa-solid fa-magnifying-glass"></i> Cek Tiket
            </button>
          </div>
          {searchResult && <div>{searchResult}</div>}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-5 py-3">
          <button
            onClick={onClose}
            className="rounded bg-gray-400 px-4 py-2 text-sm font-bold text-white hover:bg-gray-500"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT: ANTRIAN FARMASI
// ============================================================================
export default function AntrianFarmasi() {
  const [farmasiData] = useState<FarmasiItem[]>(initialFarmasiData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [prefilledTicket, setPrefilledTicket] = useState('');

  // Summary stats
  const statPreparing = 12;
  const statReady = 8;
  const statDone = 64;

  // Auto-refresh countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // TODO: Fetch fresh data from API here
          return 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter data
  const filteredData = farmasiData.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.code === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.counterName.toLowerCase().includes(q) ||
      item.catName.toLowerCase().includes(q) ||
      item.currentNum.toLowerCase().includes(q) ||
      item.patientName.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Open ticket modal with pre-filled number
  const openTicketWithNumber = (ticketNum: string) => {
    setPrefilledTicket(ticketNum);
    setTicketModalOpen(true);
  };

  return (
    <section className="w-full">
      {/* ================================================================
          PHARMACY SUMMARY COUNTER WIDGETS
          ================================================================ */}
      <div className="mb-4 sm:mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Sedang Penyiapan */}
        <div className="flex items-center rounded-md border border-gray-300 border-l-4 border-l-amber-600 bg-white px-4 sm:px-6 py-3 sm:py-4">
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold leading-tight text-[#004A99]">
              {statPreparing}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500">
              Sedang Penyiapan / Diracik
            </span>
          </div>
        </div>

        {/* Siap Diambil */}
        <div className="flex items-center rounded-md border border-gray-300 border-l-4 border-l-green-700 bg-white px-4 sm:px-6 py-3 sm:py-4">
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold leading-tight text-[#004A99]">
              {statReady}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500">
              Siap Diambil di Loket
            </span>
          </div>
        </div>

        {/* Resep Selesai */}
        <div className="flex items-center rounded-md border border-gray-300 border-l-4 border-l-[#004A99] bg-white px-4 sm:px-6 py-3 sm:py-4">
          <div>
            <span className="block text-2xl sm:text-3xl font-extrabold leading-tight text-[#004A99]">
              {statDone}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-gray-500">
              Resep Selesai Hari Ini
            </span>
          </div>
        </div>
      </div>

      {/* ================================================================
          FILTER PANEL
          ================================================================ */}
      <div className="mb-4 sm:mb-6 rounded-md border border-gray-300 bg-white p-3 sm:p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-3 sm:gap-5">
          {/* Category Dropdown */}
          <div className="flex min-w-0 sm:min-w-[240px] flex-1 flex-col gap-1.5">
            <label
              htmlFor="farmasiSelect"
              className="text-sm font-semibold text-gray-900"
            >
              Pilih Layanan Farmasi
            </label>
            <select
              id="farmasiSelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded border border-gray-400 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#0584c0]"
            >
              <option value="all">Antrian Farmasi (Semua Loket)</option>
              <option value="non-racik">
                Loket 1 - Obat Jadi (Non-Racik)
              </option>
              <option value="racik">Loket 2 - Resep Racikan</option>
              <option value="bpjs">Loket 3 - Farmasi BPJS Rawat Jalan</option>
              <option value="umum">
                Loket 4 - Farmasi Umum &amp; Asuransi
              </option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex min-w-0 sm:min-w-[240px] flex-1 flex-col gap-1.5">
            <label
              htmlFor="farmasiSearchInput"
              className="text-sm font-semibold text-gray-900"
            >
              Cari No. Resep / Nama Pasien
            </label>
            <div className="relative flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 h-4 w-4 text-[#0584c0]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                id="farmasiSearchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik No. Tiket atau Nama Pasien..."
                autoComplete="off"
                className="w-full rounded border border-gray-400 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0584c0]"
              />
            </div>
          </div>

          {/* Cek Status Resep Button */}
          <div className="flex gap-2.5">
            <button
              onClick={() => setTicketModalOpen(true)}
              className="inline-flex items-center gap-2 rounded bg-[#daa732] px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-[#c49427] transition-colors w-full sm:w-auto justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Cek Status Resep
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          PHARMACY QUEUE MONITOR TABLE CONTAINER CARD
          ================================================================ */}
      <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg border border-[#0584c0] bg-white shadow-md">
        {/* Banner Header */}
        <div className="bg-[#058446] px-4 sm:px-5 py-3 sm:py-3.5 text-center text-white">
          <h2 className="m-0 text-[17px] sm:text-[20px] font-bold">
            Antrian Pelayanan Instalasi Farmasi
          </h2>
        </div>

        {/* Table - Desktop */}
        <div className="w-full overflow-x-auto bg-white hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#0584c0]">
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Loket Pelayanan
                </th>
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Kategori Resep
                </th>
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Nomor Antrian Dipanggil
                </th>
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Nama Pasien
                </th>
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Status Pengerjaan
                </th>
                <th className="border-r border-[#0584c0] bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Estimasi Ambil
                </th>
                <th className="bg-[#0584c0] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-8 text-center text-[14px] text-gray-400"
                  >
                    Tidak ada antrian farmasi yang cocok.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#0584c0]/40 transition-colors hover:bg-blue-50/50"
                  >
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle text-[15px] font-bold">
                      {item.counterName}
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle text-[13px] font-semibold text-[#0584c0]">
                      {item.catName}
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle">
                      <span className="inline-block rounded-md border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-3.5 py-1.5 text-[18px] font-extrabold text-[#004A99]">
                        {item.currentNum}
                      </span>
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle text-[15px] font-bold">
                      {item.patientName}
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle">
                      <FarmasiStatusBadge status={item.status} />
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle text-[13px]">
                      <i className="fa-regular fa-clock text-[#0584c0] mr-1"></i>
                      {item.estTime}
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <button
                        onClick={() => openTicketWithNumber(item.currentNum)}
                        className="rounded bg-[#27a8df] px-3 py-1.5 text-[13px] font-bold text-white hover:bg-[#0584c0]"
                      >
                        Cek Resep
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden">
          {filteredData.length === 0 ? (
            <div className="px-4 py-8 text-center text-[14px] text-gray-400">
              Tidak ada antrian farmasi yang cocok.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-blue-50/30 transition-colors"
                >
                  {/* Loket Name & Status */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <strong className="text-[14px] font-bold text-gray-900">
                      {item.counterName}
                    </strong>
                    <FarmasiStatusBadge status={item.status} />
                  </div>

                  {/* Category */}
                  <p className="text-[12px] font-semibold text-[#0584c0] mb-2">
                    {item.catName}
                  </p>

                  {/* Patient + Queue Number */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-[13px] font-bold text-gray-800">
                        <i className="fa-solid fa-user text-[#0584c0] mr-1"></i>
                        {item.patientName}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-0.5">
                        <i className="fa-regular fa-clock text-[#0584c0] mr-1"></i>
                        {item.estTime}
                      </p>
                    </div>
                    <span className="inline-block rounded-md border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-3 py-1 text-[16px] font-extrabold text-[#004A99]">
                      {item.currentNum}
                    </span>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => openTicketWithNumber(item.currentNum)}
                    className="w-full rounded bg-[#27a8df] px-3 py-2 text-[13px] font-bold text-white hover:bg-[#0584c0] transition-colors"
                  >
                    Cek Resep
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="bg-white px-4 sm:px-5 py-3 text-[13px] sm:text-[14px] text-gray-500">
          <p>
            Klik pada loket pelayanan untuk mengecek status pemrosesan resep
            obat Anda
          </p>
          <p>Antrian online ini diperbaharui otomatis setiap 60 detik.</p>
        </div>
      </div>

      {/* ================================================================
          NOTICE ALERT
          ================================================================ */}
      <div className="mt-4 sm:mt-6 text-[13px] sm:text-[15px] font-extrabold leading-relaxed">
        <span className="font-black text-red-500">PERHATIAN :</span>{' '}
        HARAP MEMPERHATIKAN NAMA DAN NOMOR RESEP SAAT DIPANGGIL DI LOKET
        FARMASI. PASTIKAN MEMBAWA STRUK REKAPAN APOTEK.
      </div>

      {/* ================================================================
          TICKET CHECK MODAL
          ================================================================ */}
      <TicketModal
        isOpen={ticketModalOpen}
        onClose={() => setTicketModalOpen(false)}
        farmasiData={farmasiData}
      />
    </section>
  );
}
