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
      <span className="inline-block rounded px-2.5 py-1 text-xs font-bold border border-green-300 bg-green-50 text-green-800">
        Siap Diambil
      </span>
    );
  }
  return (
    <span className="inline-block rounded px-2.5 py-1 text-xs font-bold border border-yellow-300 bg-yellow-50 text-yellow-800">
      Proses Penyiapan
    </span>
  );
}

// ============================================================================
// TICKET CHECK MODAL COMPONENT
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
  const [searchResult, setSearchResult] = useState<React.ReactNode | null>(
    null
  );

  const performSearch = useCallback(
    (code: string) => {
      const searchCode = code.toUpperCase().trim();
      if (!searchCode) {
        setSearchResult(
          <div className="rounded p-2.5 text-red-500 font-semibold text-sm">
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
          <div className="rounded-lg border-l-4 border-[#004A99] border border-gray-200 bg-gray-50 p-4 text-sm">
            <div className="flex items-center justify-between mb-3 border-b border-gray-200 pb-2">
              <h4 className="font-bold text-[#004A99] text-base sm:text-lg">
                <i className="fa-solid fa-receipt text-[#0584c0] mr-2"></i>
                Resep No. {match.currentNum}
              </h4>
              <FarmasiStatusBadge status={match.status} />
            </div>

            <div className="space-y-2 text-gray-800 text-[14px]">
              <p className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500 font-medium">Nama Pasien:</span>
                <strong className="text-[#004A99]">{match.patientName}</strong>
              </p>
              <p className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500 font-medium">Loket Pelayanan:</span>
                <span className="font-bold">{match.counterName}</span>
              </p>
              <p className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500 font-medium">Kategori Resep:</span>
                <span className="font-semibold text-[#0584c0]">{match.catName}</span>
              </p>
              <p className="flex justify-between border-b border-gray-100 pb-1.5">
                <span className="text-gray-500 font-medium">Status Pengerjaan:</span>
                <span className="font-bold text-green-700">{match.statusText}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-500 font-medium">Estimasi Pengambilan:</span>
                <span className="font-bold text-[#004A99]">
                  <i className="fa-regular fa-clock text-[#0584c0] mr-1"></i>
                  {match.estTime}
                </span>
              </p>
            </div>
          </div>
        );
      } else {
        setSearchResult(
          <div className="rounded-lg border-l-4 border-yellow-500 border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
            <p className="font-bold mb-1">
              <i className="fa-solid fa-circle-info text-yellow-600 mr-1.5"></i>
              Informasi Resep
            </p>
            <p>
              Nomor Tiket &quot;<strong>{searchCode}</strong>&quot; sedang dalam proses persiapan di apotek. Silakan menunggu pemanggilan di lokasi.
            </p>
          </div>
        );
      }
    },
    [farmasiData]
  );

  // Auto search when prefilledTicket is passed on open
  useEffect(() => {
    if (isOpen) {
      if (prefilledTicket) {
        setTicketInput(prefilledTicket);
        performSearch(prefilledTicket);
      } else {
        setTicketInput('');
        setSearchResult(null);
      }
    } else {
      setTicketInput('');
      setSearchResult(null);
    }
  }, [isOpen, prefilledTicket, performSearch]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header Container */}
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

        {/* Body Container */}
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
              className="flex-1 rounded-md border border-gray-300 px-3 py-2.5 text-sm outline-none focus:border-[#0584c0] focus:ring-1 focus:ring-[#0584c0]"
            />
            <button
              onClick={() => performSearch(ticketInput)}
              className="flex items-center justify-center gap-1.5 rounded-md bg-[#0584c0] px-4 py-2.5 font-bold text-white hover:bg-[#004A99] transition-colors text-sm"
            >
              <i className="fa-solid fa-magnifying-glass"></i> Cek Tiket
            </button>
          </div>
          {searchResult && <div>{searchResult}</div>}
        </div>

        {/* Footer Container */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-5 py-3 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-gray-400 px-4 py-2 text-sm font-bold text-white hover:bg-gray-500 transition-colors"
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

  // Open ticket modal with pre-filled number and auto search
  const openTicketWithNumber = (ticketNum: string) => {
    setPrefilledTicket(ticketNum);
    setTicketModalOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* ================================================================
          1. PHARMACY SUMMARY COUNTER WIDGET CONTAINERS
          ================================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Sedang Penyiapan */}
        <div className="flex items-center rounded-lg border border-gray-200 border-l-4 border-l-amber-600 bg-white px-4 sm:px-6 py-4 shadow-sm">
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
        <div className="flex items-center rounded-lg border border-gray-200 border-l-4 border-l-green-600 bg-white px-4 sm:px-6 py-4 shadow-sm">
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
        <div className="flex items-center rounded-lg border border-gray-200 border-l-4 border-l-[#004A99] bg-white px-4 sm:px-6 py-4 shadow-sm">
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
          2. FILTER PANEL CONTAINER CARD
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
              className="inline-flex items-center gap-2 rounded-md bg-[#daa732] px-4 py-2.5 text-sm font-bold text-gray-900 hover:bg-[#c49427] transition-colors w-full sm:w-auto justify-center shadow-xs"
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
          3. PHARMACY QUEUE MONITOR CONTAINER CARDS LIST (BOXED CONTAINER TABLE)
          ================================================================ */}
      <div className="rounded-xl border border-[#0584c0] bg-white shadow-sm overflow-hidden">
        {/* Banner Header Container */}
        <div className="bg-[#058446] px-4 sm:px-6 py-4 text-center text-white">
          <h2 className="m-0 text-[17px] sm:text-[20px] font-bold tracking-wide">
            Antrian Pelayanan Instalasi Farmasi
          </h2>
        </div>

        {/* Container Cards Wrapper */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 bg-[#F8FAFC]">
          {/* Header Legend Card Container (Desktop) */}
          <div className="hidden md:grid grid-cols-12 gap-4 rounded-lg bg-[#0584c0] px-5 py-3.5 text-white font-semibold text-[14px]">
            <div className="col-span-3">Loket Pelayanan</div>
            <div className="col-span-2">Kategori Resep</div>
            <div className="col-span-2 text-center">Nomor Antrian Dipanggil</div>
            <div className="col-span-2">Nama Pasien</div>
            <div className="col-span-2 text-center">Status &amp; Estimasi</div>
            <div className="col-span-1 text-center">Aksi</div>
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
                <div className="md:col-span-3 w-full">
                  <strong className="block text-[15px] font-bold text-gray-900">
                    {item.counterName}
                  </strong>
                </div>

                {/* Category */}
                <div className="md:col-span-2 w-full text-[13px] font-semibold text-[#0584c0]">
                  {item.catName}
                </div>

                {/* Queue Number Badge */}
                <div className="md:col-span-2 w-full flex items-center justify-between md:justify-center">
                  <span className="text-[12px] font-semibold text-gray-500 md:hidden">No. Antrian:</span>
                  <span className="inline-block rounded-lg border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-4 py-1.5 text-[17px] sm:text-[18px] font-extrabold text-[#004A99] shadow-xs">
                    {item.currentNum}
                  </span>
                </div>

                {/* Patient Name */}
                <div className="md:col-span-2 w-full text-[14px] sm:text-[15px] font-bold text-gray-800">
                  <i className="fa-solid fa-user text-[#0584c0] mr-1.5 md:hidden"></i>
                  {item.patientName}
                </div>

                {/* Status & Estimasi */}
                <div className="md:col-span-2 w-full flex flex-col items-start md:items-center gap-1">
                  <FarmasiStatusBadge status={item.status} />
                  <span className="text-[12px] text-gray-500">
                    <i className="fa-regular fa-clock text-[#0584c0] mr-1"></i>
                    {item.estTime}
                  </span>
                </div>

                {/* Action Button */}
                <div className="md:col-span-1 w-full flex justify-end md:justify-center pt-2 md:pt-0 border-t md:border-0 border-gray-100">
                  <button
                    onClick={() => openTicketWithNumber(item.currentNum)}
                    className="w-full md:w-auto rounded-md bg-[#27a8df] px-3.5 py-2 text-[13px] font-bold text-white hover:bg-[#0584c0] transition-colors shadow-xs"
                  >
                    Cek Resep
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footnote Container */}
        <div className="border-t border-gray-200 bg-gray-50 px-4 sm:px-5 py-3 text-[13px] sm:text-[14px] text-gray-500">
          <p>
            Klik tombol Cek Resep pada masing-masing kartu untuk mengecek status pemrosesan resep obat Anda.
          </p>
          <p>Antrian online ini diperbaharui otomatis setiap 60 detik.</p>
        </div>
      </div>

      {/* ================================================================
          4. NOTICE ALERT CONTAINER CARD
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
