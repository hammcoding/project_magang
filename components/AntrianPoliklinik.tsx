'use client';

import { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================
interface PoliklinikItem {
  id: string;
  code: string;
  poliName: string;
  room: string;
  docName: string;
  schedule: string;
  currentNum: string;
  prefix: string;
  currentSeq: number;
  totalQueue: number;
}

interface DetailModalData {
  item: PoliklinikItem;
  waitingList: { num: string; status: string; time: string }[];
  remaining: number;
}

// ============================================================================
// DUMMY DATA - Replace with API fetch in production
// ============================================================================
const initialPoliklinikData: PoliklinikItem[] = [
  {
    id: 'poli-1',
    code: 'mata',
    poliName: 'Poli Mata',
    room: 'Ruang 102 (Lantai 1)',
    docName: 'dr. H. Budi Santoso, Sp.M',
    schedule: '08.00 - 13.00 WIB',
    currentNum: 'M-014',
    prefix: 'M',
    currentSeq: 14,
    totalQueue: 22,
  },
  {
    id: 'poli-2',
    code: 'dalam',
    poliName: 'Poli Penyakit Dalam',
    room: 'Ruang 205 (Lantai 2)',
    docName: 'dr. Hendra Wijaya, Sp.PD-KGEH',
    schedule: '08.30 - 14.00 WIB',
    currentNum: 'D-028',
    prefix: 'D',
    currentSeq: 28,
    totalQueue: 35,
  },
  {
    id: 'poli-3',
    code: 'anak',
    poliName: 'Poli Anak & Tumbuh Kembang',
    room: 'Ruang 108 (Lantai 1)',
    docName: 'dr. Hj. Anisa Rahma, Sp.A, M.Sc',
    schedule: '09.00 - 13.00 WIB',
    currentNum: 'A-019',
    prefix: 'A',
    currentSeq: 19,
    totalQueue: 25,
  },
  {
    id: 'poli-4',
    code: 'saraf',
    poliName: 'Poli Saraf',
    room: 'Ruang 301 (Lantai 3)',
    docName: 'dr. Rahmat Hidayat, Sp.S',
    schedule: '08.00 - 12.00 WIB',
    currentNum: 'S-008',
    prefix: 'S',
    currentSeq: 8,
    totalQueue: 14,
  },
  {
    id: 'poli-5',
    code: 'gigi',
    poliName: 'Poli Gigi & Mulut',
    room: 'Ruang 105 (Lantai 1)',
    docName: 'drg. Maya Sari, Sp.KG',
    schedule: '08.00 - 14.00 WIB',
    currentNum: 'G-011',
    prefix: 'G',
    currentSeq: 11,
    totalQueue: 16,
  },
  {
    id: 'poli-6',
    code: 'jantung',
    poliName: 'Poli Jantung & Pembuluh Darah',
    room: 'Ruang 210 (Lantai 2)',
    docName: 'dr. Farhan Malik, Sp.JP, FIHA',
    schedule: '09.00 - 15.00 WIB',
    currentNum: 'J-006',
    prefix: 'J',
    currentSeq: 6,
    totalQueue: 18,
  },
];

// ============================================================================
// DETAIL MODAL COMPONENT (MATCHING EXACT USER SCREENSHOT DESIGN 1)
// ============================================================================
function DetailModal({
  data,
  onClose,
}: {
  data: DetailModalData | null;
  onClose: () => void;
}) {
  if (!data) return null;

  const { item, waitingList } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 sm:p-6"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[480px] overflow-hidden rounded-[24px] bg-white shadow-2xl transition-all">
        {/* Top Doctor Profile Section */}
        <div className="flex items-center gap-4 p-6 pb-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E5F1FB] text-[#3B78C2]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <h3 className="text-xl font-extrabold text-[#1B2A4A]">
              {item.docName}
            </h3>
            <p className="text-sm font-semibold text-gray-500">
              Jam praktik : {item.schedule}
            </p>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-extrabold text-[#27AE60]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#27AE60]"></span>
              SEDANG MELAYANI
            </div>
          </div>
        </div>

        {/* Middle Sedang Dipanggil Box */}
        <div className="flex justify-center">
          <div className="w-full max-w-[200px] bg-[#3B78C2] py-3 text-center text-white">
            <span className="block text-[11px] font-extrabold tracking-wider opacity-90">
              SEDANG DIPANGGIL
            </span>
            <span className="text-3xl font-black tracking-wide">
              {item.currentNum}
            </span>
          </div>
        </div>

        {/* Queue Table */}
        <div className="w-full">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-[#3B78C2] text-white">
                <th className="px-5 py-3 text-xs font-extrabold uppercase tracking-wide">
                  NO. ANTRIAN
                </th>
                <th className="px-5 py-3 text-xs font-extrabold uppercase tracking-wide">
                  STATUS PANGGILAN
                </th>
                <th className="px-5 py-3 text-xs font-extrabold uppercase tracking-wide">
                  WAKTU MASUK
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Row 1: Current Called */}
              <tr className="bg-white">
                <td className="px-5 py-3 font-extrabold text-[#1B2A4A]">
                  {item.currentNum}
                </td>
                <td className="px-5 py-3 font-extrabold text-[#3B78C2]">
                  <i className="fa-solid fa-volume-high mr-2 text-[#3B78C2]"></i>
                  Sedang diperiksa
                </td>
                <td className="px-5 py-3 font-bold text-gray-600">
                  09:10 WIB
                </td>
              </tr>
              {/* Waiting Rows */}
              {waitingList.map((q, i) => (
                <tr
                  key={i}
                  className={i % 2 === 1 ? 'bg-[#F8FAFC]' : 'bg-white'}
                >
                  <td className="px-5 py-3 font-extrabold text-[#1B2A4A]">
                    {q.num}
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-500">
                    Menunggu
                  </td>
                  <td className="px-5 py-3 font-semibold text-gray-400">-</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Red Kembali Button */}
        <div className="flex justify-center p-6 pt-5 pb-6">
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
// MAIN COMPONENT: ANTRIAN POLIKLINIK
// ============================================================================
export default function AntrianPoliklinik() {
  const [poliklinikData] = useState<PoliklinikItem[]>(initialPoliklinikData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalData, setModalData] = useState<DetailModalData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Filter data
  const filteredData = poliklinikData.filter((item) => {
    const matchesCat =
      selectedCategory === 'all' || item.code === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.docName.toLowerCase().includes(q) ||
      item.poliName.toLowerCase().includes(q) ||
      item.room.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  // Open detail modal - generate waiting queue numbers
  const openDetail = useCallback(
    (id: string) => {
      const item = poliklinikData.find((p) => p.id === id);
      if (!item) return;

      const remaining = Math.max(0, item.totalQueue - item.currentSeq);

      const waitingList: { num: string; status: string; time: string }[] = [];
      for (
        let i = item.currentSeq + 1;
        i <= Math.min(item.totalQueue, item.currentSeq + 5);
        i++
      ) {
        const numStr = `${item.prefix}${String(i).padStart(2, '0')}`;
        waitingList.push({ num: numStr, status: 'Menunggu', time: '-' });
      }

      setModalData({ item, waitingList, remaining });
    },
    [poliklinikData]
  );

  // Manual refresh with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
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
              htmlFor="poliSelect"
              className="text-sm font-semibold text-gray-900"
            >
              Pilih layanan
            </label>
            <select
              id="poliSelect"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#0584c0] focus:ring-1 focus:ring-[#0584c0]"
            >
              <option value="all">Antrian Rawat Jalan (Semua Poli)</option>
              <option value="mata">Antrian Poli Mata</option>
              <option value="dalam">Antrian Poli Penyakit Dalam</option>
              <option value="anak">Antrian Poli Anak</option>
              <option value="saraf">Antrian Poli Saraf</option>
              <option value="gigi">Antrian Poli Gigi &amp; Mulut</option>
              <option value="jantung">Antrian Poli Jantung</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex min-w-0 sm:min-w-[240px] flex-1 flex-col gap-1.5">
            <label
              htmlFor="poliSearchInput"
              className="text-sm font-semibold text-gray-900"
            >
              Cari Dokter / Ruangan
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
                id="poliSearchInput"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama dokter atau nama poli..."
                autoComplete="off"
                className="w-full rounded-md border border-gray-300 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0584c0] focus:ring-1 focus:ring-[#0584c0]"
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex gap-2.5">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded-md bg-[#0584c0] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#004A99] transition-colors w-full sm:w-auto justify-center shadow-xs"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 transition-transform ${isRefreshing ? 'animate-spin-refresh' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* ================================================================
          2. QUEUE MONITOR CONTAINER CARDS LIST
          ================================================================ */}
      <div className="rounded-xl border border-[#0584c0] bg-white shadow-sm overflow-hidden">
        {/* Banner Header - Solid Blue */}
        <div className="bg-[#004A99] px-4 sm:px-6 py-4 text-center text-white">
          <h2 className="m-0 text-[17px] sm:text-[20px] font-bold tracking-wide">
            Antrian Pemeriksaan Dokter Rawat Jalan
          </h2>
        </div>

        {/* Container Cards Wrapper */}
        <div className="p-4 sm:p-5 flex flex-col gap-3 bg-[#F8FAFC]">
          {/* Header Legend - White with thin blue top border */}
          <div className="hidden md:grid grid-cols-12 gap-4 rounded-lg border-t-2 border-t-[#004A99] border border-gray-200 bg-white px-5 py-3 text-[#004A99] font-bold text-[14px] shadow-xs">
            <div className="col-span-4">Ruang Pelayanan</div>
            <div className="col-span-4">Spesialisasi / Dokter</div>
            <div className="col-span-2 text-center">No. Antrian</div>
            <div className="col-span-2 text-center">Aksi</div>
          </div>

          {/* Individual Queue Item Cards */}
          {filteredData.length === 0 ? (
            <div className="rounded-lg border border-gray-200 bg-white p-8 text-center text-gray-400 text-sm">
              Tidak ada data antrian poliklinik yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            filteredData.map((item) => (
              <div
                key={item.id}
                className="rounded-lg border border-gray-200 bg-white p-4 sm:p-5 shadow-xs hover:border-[#0584c0] hover:shadow-md transition-all duration-200 flex flex-col md:grid md:grid-cols-12 gap-3 md:gap-4 items-start md:items-center"
              >
                {/* Poli Name & Room */}
                <div className="md:col-span-4 w-full">
                  <strong className="block text-[15px] font-bold text-[#004A99]">
                    {item.poliName}
                  </strong>
                  <span className="text-[13px] font-semibold text-gray-500">
                    {item.room}
                  </span>
                </div>

                {/* Doctor */}
                <div className="md:col-span-4 w-full text-[14px] sm:text-[15px] font-bold text-gray-800">
                  <i className="fa-solid fa-user-doctor text-[#0584c0] mr-1.5 md:hidden"></i>
                  {item.docName}
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
                    onClick={() => openDetail(item.id)}
                    className="w-full md:w-auto rounded-md bg-[#27a8df] px-5 py-2 text-[13px] font-bold text-white hover:bg-[#0584c0] transition-colors shadow-xs"
                  >
                    Detail
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
        JIKA NOMOR ANTRIAN ANDA SUDAH TERLEWATI, MAKA AKAN DIPANGGIL KEMBALI
        SETELAH 5 ANTRIAN BERIKUTNYA
      </div>

      {/* ================================================================
          DETAIL MODAL
          ================================================================ */}
      {modalData && (
        <DetailModal
          data={modalData}
          onClose={() => setModalData(null)}
        />
      )}
    </div>
  );
}
