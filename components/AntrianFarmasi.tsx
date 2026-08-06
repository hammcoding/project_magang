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
  status: 'ready' | 'preparing';
  statusText: string;
  estTime: string;
  orderTime: string;
  processTime: string;
  totalQueue: number;
  currentSeq: number;
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
    currentNum: 'F-020',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: '09:35 , 04-10-2026',
    orderTime: '09:30 , 04-10-2026',
    processTime: '09:33 , 04-10-2026',
    totalQueue: 28,
    currentSeq: 20,
  },
  {
    id: 'far-2',
    code: 'racik',
    counterName: 'Loket 2 - Racikan Khusus',
    catName: 'Resep Racikan',
    currentNum: 'R-018',
    status: 'preparing',
    statusText: 'Proses Penyiapan Obat',
    estTime: '09:45 , 04-10-2026',
    orderTime: '09:15 , 04-10-2026',
    processTime: '09:30 , 04-10-2026',
    totalQueue: 30,
    currentSeq: 18,
  },
  {
    id: 'far-3',
    code: 'bpjs',
    counterName: 'Loket 3 - BPJS Rawat Jalan',
    catName: 'Farmasi BPJS Kesehatan',
    currentNum: 'B-105',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: '08:40 , 04-10-2026',
    orderTime: '08:15 , 04-10-2026',
    processTime: '08:30 , 04-10-2026',
    totalQueue: 115,
    currentSeq: 105,
  },
  {
    id: 'far-4',
    code: 'umum',
    counterName: 'Loket 4 - Pasien Umum & Asuransi',
    catName: 'Farmasi Umum',
    currentNum: 'U-022',
    status: 'ready',
    statusText: 'Siap Diambil',
    estTime: '09:15 , 04-10-2026',
    orderTime: '08:50 , 04-10-2026',
    processTime: '09:05 , 04-10-2026',
    totalQueue: 27,
    currentSeq: 22,
  },
];

// ============================================================================
// TICKET CHECK MODAL COMPONENT (MATCHING EXACT USER SCREENSHOT DESIGN 2)
// ============================================================================
function TicketModal({
  isOpen,
  prefilledTicket,
  onClose,
  farmasiData,
}: {
  isOpen: boolean;
  prefilledTicket: string;
  onClose: () => void;
  farmasiData: FarmasiItem[];
}) {
  const [ticketInput, setTicketInput] = useState('');
  const [matchedItem, setMatchedItem] = useState<FarmasiItem | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const performSearch = useCallback(
    (code: string) => {
      const rawCode = code.trim().toUpperCase();
      setHasSearched(true);

      if (!rawCode) {
        setMatchedItem(null);
        return;
      }

      // Try exact match or partial match (e.g. F-20 matching F-020)
      const match = farmasiData.find((f) => {
        const itemNum = f.currentNum.toUpperCase();
        if (itemNum === rawCode) return true;
        // Normalize single digit e.g. F-20 vs F-020
        const normalizedInput = rawCode.replace(/([A-Z])-?0*(\d+)/, '$1-$2');
        const normalizedItem = itemNum.replace(/([A-Z])-?0*(\d+)/, '$1-$2');
        return normalizedInput === normalizedItem;
      });

      setMatchedItem(match || null);
    },
    [farmasiData]
  );

  useEffect(() => {
    if (isOpen) {
      if (prefilledTicket) {
        setTicketInput(prefilledTicket);
        performSearch(prefilledTicket);
      } else {
        setTicketInput('');
        setMatchedItem(null);
        setHasSearched(false);
      }
    } else {
      setTicketInput('');
      setMatchedItem(null);
      setHasSearched(false);
    }
  }, [isOpen, prefilledTicket, performSearch]);

  if (!isOpen) return null;

  const currentItem = matchedItem;
  const remainingCount = currentItem
    ? Math.max(0, currentItem.totalQueue - currentItem.currentSeq)
    : 8;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[540px] overflow-hidden rounded-[28px] bg-white shadow-2xl transition-all">
        {/* Top Header Section */}
        <div className="p-6 pb-4 text-center">
          <h3 className="text-xl sm:text-2xl font-extrabold text-[#1B2A4A]">
            Cek Status Resep Obat Farmasi
          </h3>
          <p className="mt-1 text-xs sm:text-sm font-semibold text-gray-400">
            Pelayanan Instalasi Farmasi RS Mitra Siaga
          </p>
        </div>

        <div className="h-[1px] w-full bg-gray-100"></div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Search Bar Input (Shown when opened from top button or to re-search) */}
          {!prefilledTicket && (
            <div className="mb-5 flex flex-col sm:flex-row gap-2.5">
              <input
                type="text"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') performSearch(ticketInput);
                }}
                placeholder="Masukkan Nomor Antrian (misal: F-20, R-18, B-105)"
                autoComplete="off"
                className="flex-1 rounded-xl border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-800 outline-none focus:border-[#0584c0] focus:ring-2 focus:ring-[#0584c0]/20"
              />
              <button
                onClick={() => performSearch(ticketInput)}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#27a8df] px-5 py-2.5 text-sm font-extrabold text-white hover:bg-[#0584c0] transition-colors"
              >
                <i className="fa-solid fa-magnifying-glass"></i> Cek Tiket
              </button>
            </div>
          )}

          {/* Initial Prompt (when opened via top button before user searches) */}
          {!prefilledTicket && !hasSearched && (
            <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-blue-100 bg-[#F0F7FC] p-6 text-center shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#B7E0F7] text-[#27a8df]">
                <i className="fa-solid fa-circle-info text-2xl"></i>
              </div>
              <p className="max-w-[420px] text-sm font-semibold leading-relaxed text-[#152B4D]">
                Masukkan nomor antrian atau resep obat Anda pada kolom di atas, lalu klik tombol <strong className="text-[#0584c0]">Cek Tiket</strong> untuk melihat status pemrosesan.
              </p>
            </div>
          )}

          {/* Not Found Alert (when user searches a number that does not exist) */}
          {!prefilledTicket && hasSearched && !matchedItem && (
            <div className="flex flex-col items-center justify-center gap-2.5 rounded-2xl border border-red-200 bg-red-50/70 p-6 text-center shadow-xs">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                <i className="fa-solid fa-triangle-exclamation text-2xl"></i>
              </div>
              <h4 className="text-base font-extrabold text-red-700">
                Nomor Antrian Tidak Ditemukan
              </h4>
              <p className="max-w-[400px] text-xs sm:text-sm font-semibold leading-relaxed text-gray-700">
                Nomor antrian &quot;<strong className="text-red-600">{ticketInput}</strong>&quot; tidak ada dalam sistem antrian farmasi saat ini. Silakan periksa kembali nomor yang tertera pada struk Anda.
              </p>
            </div>
          )}

          {/* Result Card (Image 2 Design: shown when searched or prefilled from table row) */}
          {(prefilledTicket || hasSearched) && currentItem && (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-12 items-center">
              {/* Left Light Blue Card */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center rounded-2xl bg-[#B7E0F7] p-6 text-center shadow-xs">
                <span className="mb-2 text-xs font-bold text-[#1F5582]">
                  No. Antrian Sekarang
                </span>
                <span className="text-4xl font-black text-[#152B4D]">
                  {currentItem.currentNum}
                </span>
              </div>

              {/* Right Order Details */}
              <div className="sm:col-span-7 flex flex-col justify-center space-y-2">
                <h4 className="text-base font-extrabold text-[#1B2A4A] mb-1">
                  Detail Order
                </h4>

                <div className="space-y-1.5 text-xs sm:text-sm font-semibold text-[#152B4D]">
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Waktu Order</span>
                    <span className="font-bold">: {currentItem.orderTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Waktu Proses</span>
                    <span className="font-bold">: {currentItem.processTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700 font-medium">Estimasi Waktu</span>
                    <span className="font-bold">: {currentItem.estTime}</span>
                  </div>
                </div>

                {/* Sisa Antrian Pill */}
                <div className="pt-2">
                  <h4 className="text-base font-extrabold text-[#1B2A4A] mb-1">
                    Sisa Antrian
                  </h4>
                  <div className="w-full rounded-full bg-[#B7E0F7] py-2 text-center text-lg font-black text-[#152B4D]">
                    {remainingCount}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Red Kembali Button */}
        <div className="flex justify-center pb-6 pt-1">
          <button
            onClick={onClose}
            className="rounded-full bg-[#DC4B3E] px-10 py-2.5 text-sm font-extrabold tracking-wider text-white shadow-md hover:bg-[#c83b2e] transition-colors"
          >
            KEMBALI
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
  const [ticketModalOpen, setTicketModalOpen] = useState(false);
  const [prefilledTicket, setPrefilledTicket] = useState('');

  // Filter data
  const filteredData = farmasiData.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.code === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.counterName.toLowerCase().includes(q) ||
      item.catName.toLowerCase().includes(q) ||
      item.currentNum.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Open ticket modal with pre-filled number and auto search
  const openTicketWithNumber = (ticketNum: string) => {
    setPrefilledTicket(ticketNum);
    setTicketModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================================================================
          1. FILTER PANEL CONTAINER CARD
          ================================================================ */}
      <div className="rounded-lg border border-[#0584c0]/30 bg-white p-4 sm:p-5 shadow-sm">
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
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#0584c0] focus:ring-1 focus:ring-[#0584c0]"
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
              Cari No. Antrian
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
                placeholder="Ketik No. Tiket antrian..."
                autoComplete="off"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0584c0] focus:ring-1 focus:ring-[#0584c0]"
              />
            </div>
          </div>

          {/* Cek Status Resep Button */}
          <div className="flex gap-2.5">
            <button
              onClick={() => {
                setPrefilledTicket('');
                setTicketModalOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-md bg-[#27a8df] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0584c0] transition-colors w-full sm:w-auto justify-center shadow-xs"
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Cek Status Resep
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          2. PHARMACY QUEUE MONITOR CONTAINER CARDS LIST
          ================================================================ */}
      <div className="rounded-xl border border-[#0584c0] bg-white shadow-sm overflow-hidden">
        {/* Banner Header - Solid Blue */}
        <div className="bg-[#004A99] px-4 sm:px-6 py-4 text-center text-white">
          <h2 className="m-0 text-[17px] sm:text-[20px] font-bold tracking-wide">
            Antrian Pelayanan Instalasi Farmasi
          </h2>
        </div>

        {/* Container Cards Wrapper */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 bg-[#F8FAFC]">
          {/* Header Legend - White with thin blue top border */}
          <div className="hidden md:grid grid-cols-12 gap-4 rounded-lg border-t-2 border-t-[#004A99] border border-gray-200 bg-white px-5 py-3 text-[#004A99] font-bold text-[14px] shadow-xs">
            <div className="col-span-5">Loket Pelayanan</div>
            <div className="col-span-3">Kategori Resep</div>
            <div className="col-span-2 text-center">No. Antrian</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {/* Individual Queue Item Container Cards */}
          {filteredData.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
              Tidak ada antrian farmasi yang cocok dengan pencarian Anda.
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-xs hover:border-[#0584c0] hover:shadow-md transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
              >
                {/* Counter Name */}
                <div className="md:col-span-5 w-full">
                  <strong className="block text-[15px] font-bold text-gray-900">
                    {item.counterName}
                  </strong>
                </div>

                {/* Category */}
                <div className="md:col-span-3 w-full text-[13px] font-semibold text-[#0584c0]">
                  {item.catName}
                </div>

                {/* Queue Number Badge */}
                <div className="md:col-span-2 w-full flex items-center justify-between md:justify-center">
                  <span className="text-[12px] font-semibold text-gray-500 md:hidden">No. Antrian:</span>
                  <span className="inline-block rounded-lg border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-4 py-1.5 text-[17px] sm:text-[18px] font-extrabold text-[#004A99] shadow-xs">
                    {item.currentNum}
                  </span>
                </div>

                {/* Action Button */}
                <div className="md:col-span-2 w-full flex justify-end md:justify-center pt-2 md:pt-0 border-t md:border-0 border-gray-100">
                  <button
                    onClick={() => openTicketWithNumber(item.currentNum)}
                    className="w-full md:w-auto rounded-md bg-[#27a8df] px-4 py-2 text-[13px] font-bold text-white hover:bg-[#0584c0] transition-colors shadow-xs"
                  >
                    Cek Resep
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================================================================
          3. NOTICE ALERT CONTAINER CARD
          ================================================================ */}
      <div className="rounded-lg border-l-4 border-l-red-500 border border-gray-200 bg-red-50/60 p-4 shadow-xs text-[13px] sm:text-[15px] font-extrabold leading-relaxed text-gray-800">
        <span className="font-black text-red-600">PERHATIAN :</span>{' '}
        HARAP MEMPERHATIKAN NAMA DAN NOMOR RESEP SAAT DIPANGGIL DI LOKET
        FARMASI. PASTIKAN MEMBAWA STRUK REKAPAN APOTEK.
      </div>

      {/* ================================================================
          TICKET CHECK MODAL
          ================================================================ */}
      <TicketModal
        isOpen={ticketModalOpen}
        prefilledTicket={prefilledTicket}
        onClose={() => {
          setTicketModalOpen(false);
          setPrefilledTicket('');
        }}
        farmasiData={farmasiData}
      />
    </div>
  );
}
