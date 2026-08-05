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
  status: 'serving' | 'break' | 'preparing';
  statusText: string;
}

interface DetailModalData {
  item: PoliklinikItem;
  queueList: { num: string; status: string; time: string }[];
  nextNum: string;
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
    status: 'serving',
    statusText: 'Sedang Melayani',
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
    status: 'serving',
    statusText: 'Sedang Melayani',
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
    status: 'serving',
    statusText: 'Sedang Melayani',
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
    status: 'break',
    statusText: 'Istirahat / Sholat',
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
    status: 'serving',
    statusText: 'Sedang Melayani',
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
    status: 'serving',
    statusText: 'Sedang Melayani',
  },
];

// ============================================================================
// STATUS BADGE COMPONENT
// ============================================================================
function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    serving:
      'bg-green-50 text-green-800 border border-green-300',
    break:
      'bg-red-50 text-red-800 border border-red-300',
    preparing:
      'bg-yellow-50 text-yellow-800 border border-yellow-300',
  };

  const labels: Record<string, string> = {
    serving: 'Sedang Melayani',
    break: 'Istirahat / Sholat',
    preparing: 'Persiapan',
  };

  return (
    <span
      className={`inline-block rounded px-2.5 py-1 text-xs font-bold ${
        styles[status] || styles.preparing
      }`}
    >
      {labels[status] || 'Persiapan'}
    </span>
  );
}

// ============================================================================
// DETAIL MODAL COMPONENT
// ============================================================================
function DetailModal({
  data,
  onClose,
  onSimulateCall,
}: {
  data: DetailModalData | null;
  onClose: () => void;
  onSimulateCall: () => void;
}) {
  if (!data) return null;

  const { item, queueList, nextNum, remaining } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 sm:p-5"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-[620px] max-h-[90vh] overflow-y-auto overflow-hidden rounded-lg bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between bg-[#004A99] px-4 py-3 sm:px-5 sm:py-4 text-white">
          <div>
            <h3 className="text-base sm:text-lg font-bold">Antrian - {item.poliName}</h3>
            <span className="text-xs text-blue-200">{item.room}</span>
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
          {/* Doctor Profile */}
          <div className="mb-4 flex items-center gap-3 sm:gap-3.5 border-b border-gray-200 pb-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-blue-100 text-xl text-[#004A99] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="text-sm sm:text-base font-bold text-[#004A99] truncate">
                {item.docName}
              </h4>
              <p className="text-xs text-gray-500">
                <i className="fa-regular fa-clock text-[#0584c0] mr-1"></i> Jam Praktik: {item.schedule}
              </p>
              <span className="text-xs font-bold text-green-700">
                ● Sedang Melayani
              </span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-4 grid grid-cols-3 gap-2">
            <div className="rounded border border-[#0584c0] bg-blue-100 p-2 sm:p-2.5 text-center">
              <span className="block text-[0.65rem] sm:text-[0.7rem] text-gray-500">
                Sedang Dipanggil
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#004A99]">
                {item.currentNum}
              </span>
            </div>
            <div className="rounded border border-gray-300 bg-gray-50 p-2 sm:p-2.5 text-center">
              <span className="block text-[0.65rem] sm:text-[0.7rem] text-gray-500">
                Berikutnya
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#004A99]">
                {nextNum}
              </span>
            </div>
            <div className="rounded border border-gray-300 bg-gray-50 p-2 sm:p-2.5 text-center">
              <span className="block text-[0.65rem] sm:text-[0.7rem] text-gray-500">
                Sisa Antrian
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-[#004A99]">
                {remaining} Pasien
              </span>
            </div>
          </div>

          {/* Queue List Table */}
          <h5 className="mb-2.5 text-sm font-bold text-[#004A99]">
            <i className="fa-solid fa-list-check text-[#004A99] mr-1.5"></i> Daftar Panggilan Pasien
          </h5>
          <div className="max-h-52 overflow-y-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-3 py-2 text-left text-[#004A99]">
                    No. Antrian
                  </th>
                  <th className="px-3 py-2 text-left text-[#004A99]">
                    Status Panggilan
                  </th>
                  <th className="px-3 py-2 text-left text-[#004A99] hidden sm:table-cell">
                    Waktu Masuk
                  </th>
                </tr>
              </thead>
              <tbody>
                {queueList.map((q, i) => (
                  <tr key={i} className="border-b border-gray-200">
                    <td className="px-3 py-2 font-bold">{q.num}</td>
                    <td
                      className="px-3 py-2"
                      dangerouslySetInnerHTML={{ __html: q.status }}
                    />
                    <td className="px-3 py-2 hidden sm:table-cell">{q.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-between gap-2 border-t border-gray-200 bg-gray-50 px-4 sm:px-5 py-3">
          <button
            onClick={onSimulateCall}
            className="flex items-center justify-center gap-1.5 rounded bg-green-600 px-4 py-2 text-sm font-bold text-white hover:bg-green-700 transition-colors"
          >
            <i className="fa-solid fa-bullhorn"></i> Simulasi Panggil Antrian
          </button>
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
// MAIN COMPONENT: ANTRIAN POLIKLINIK
// ============================================================================
export default function AntrianPoliklinik() {
  const [poliklinikData, setPoliklinikData] = useState<PoliklinikItem[]>(
    initialPoliklinikData
  );
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [countdown, setCountdown] = useState(60);
  const [modalData, setModalData] = useState<DetailModalData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  // Open detail modal
  const openDetail = useCallback(
    (id: string) => {
      const item = poliklinikData.find((p) => p.id === id);
      if (!item) return;

      const nextNum = `${item.prefix}-${String(item.currentSeq + 1).padStart(3, '0')}`;
      const remaining = Math.max(0, item.totalQueue - item.currentSeq);

      const queueList: { num: string; status: string; time: string }[] = [];
      for (
        let i = 1;
        i <= Math.min(item.totalQueue, item.currentSeq + 5);
        i++
      ) {
        const numStr = `${item.prefix}-${String(i).padStart(3, '0')}`;
        let stText = '';
        if (i < item.currentSeq) {
          stText =
            '<span class="text-gray-500"><i class="fa-solid fa-circle-check text-green-600 mr-1"></i> Selesai Periksa</span>';
        } else if (i === item.currentSeq) {
          stText =
            '<strong class="text-[#004A99]"><i class="fa-solid fa-bullhorn text-[#0584c0] mr-1"></i> Sedang Dipanggil</strong>';
        } else {
          stText = '<span class="text-gray-400">Menunggu</span>';
        }
        queueList.push({
          num: numStr,
          status: stText,
          time:
            i <= item.currentSeq
              ? `09:${String(10 + i * 4).padStart(2, '0')} WIB`
              : '-',
        });
      }

      setModalData({ item, queueList, nextNum, remaining });
    },
    [poliklinikData]
  );

  // Simulate calling next queue number
  const simulateCall = useCallback(() => {
    if (!modalData) return;
    const { item } = modalData;

    setPoliklinikData((prev) =>
      prev.map((p) => {
        if (p.id === item.id && p.currentSeq < p.totalQueue) {
          const newSeq = p.currentSeq + 1;
          return {
            ...p,
            currentSeq: newSeq,
            currentNum: `${p.prefix}-${String(newSeq).padStart(3, '0')}`,
          };
        }
        return p;
      })
    );

    // Re-open modal with updated data after state update
    setTimeout(() => openDetail(item.id), 50);
  }, [modalData, openDetail]);

  // Manual refresh with animation
  const handleRefresh = () => {
    setIsRefreshing(true);
    setCountdown(60);
    // TODO: Fetch fresh data from API here
    // Remove spinning state after animation completes
    setTimeout(() => setIsRefreshing(false), 600);
  };

  return (
    <section className="w-full">
      {/* ================================================================
          FILTER PANEL
          ================================================================ */}
      <div className="mb-4 sm:mb-6 rounded-md border border-gray-300 bg-white p-3 sm:p-5 shadow-sm">
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
              className="rounded border border-gray-400 bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 outline-none focus:border-[#0584c0]"
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
                className="w-full rounded border border-gray-400 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#0584c0]"
              />
            </div>
          </div>

          {/* Refresh Button */}
          <div className="flex gap-2.5">
            <button
              onClick={handleRefresh}
              className="inline-flex items-center gap-2 rounded bg-[#0584c0] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#004A99] transition-colors w-full sm:w-auto justify-center"
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
          QUEUE MONITOR TABLE CONTAINER CARD
          ================================================================ */}
      <div className="mb-4 sm:mb-6 overflow-hidden rounded-lg border border-[#0584c0] bg-white shadow-md">
        {/* Banner Header */}
        <div className="bg-[#004A99] px-4 sm:px-5 py-3 sm:py-3.5 text-center text-white">
          <h2 className="m-0 text-[17px] sm:text-[20px] font-bold">
            Antrian Pemeriksaan Dokter Rawat Jalan
          </h2>
        </div>

        {/* Table - Desktop */}
        <div className="w-full overflow-x-auto bg-white hidden md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-[#0584c0]">
                <th className="border-r border-[#0584c0] bg-[#3B8296] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Ruang Pelayanan
                </th>
                <th className="border-r border-[#0584c0] bg-[#3B8296] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Spesialisasi / Dokter
                </th>
                <th className="border-r border-[#0584c0] bg-[#3B8296] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Nomor Antrian Sekarang
                </th>
                <th className="border-r border-[#0584c0] bg-[#3B8296] px-5 py-3.5 text-base font-semibold text-white">
                  Status Layanan
                </th>
                <th className="bg-[#3B8296] px-5 py-3.5 text-[15px] font-semibold text-white">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-[14px] text-gray-400"
                  >
                    Tidak ada data antrian poliklinik yang sesuai dengan
                    pencarian Anda.
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[#0584c0]/40 transition-colors hover:bg-blue-50/50"
                  >
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle">
                      <strong className="block text-[15px] text-[#004A99]">
                        {item.poliName}
                      </strong>
                      <span className="text-[13px] font-semibold text-gray-500">
                        {item.room}
                      </span>
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle text-[15px] font-bold">
                      {item.docName}
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle">
                      <span className="inline-block rounded-md border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-3.5 py-1.5 text-[18px] font-extrabold text-[#004A99]">
                        {item.currentNum}
                      </span>
                    </td>
                    <td className="border-r border-[#0584c0]/40 px-5 py-4 align-middle">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="px-5 py-4 align-middle">
                      <button
                        onClick={() => openDetail(item.id)}
                        className="rounded bg-[#27a8df] px-3 py-1.5 text-[13px] font-bold text-white hover:bg-[#0584c0]"
                      >
                        Detail
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
              Tidak ada data antrian poliklinik yang sesuai dengan pencarian Anda.
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredData.map((item) => (
                <div
                  key={item.id}
                  className="p-4 hover:bg-blue-50/30 transition-colors"
                >
                  {/* Poli Name & Room */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div>
                      <strong className="block text-[14px] text-[#004A99]">
                        {item.poliName}
                      </strong>
                      <span className="text-[12px] font-semibold text-gray-500">
                        {item.room}
                      </span>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>

                  {/* Doctor */}
                  <p className="text-[13px] font-bold text-gray-800 mb-3">
                    <i className="fa-solid fa-user-doctor text-[#0584c0] mr-1.5"></i>
                    {item.docName}
                  </p>

                  {/* Queue Number + Action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-gray-500">Antrian:</span>
                      <span className="inline-block rounded-md border-[1.5px] border-[#0584c0] bg-gradient-to-br from-blue-100 to-blue-50 px-3 py-1 text-[16px] font-extrabold text-[#004A99]">
                        {item.currentNum}
                      </span>
                    </div>
                    <button
                      onClick={() => openDetail(item.id)}
                      className="rounded bg-[#27a8df] px-3 py-1.5 text-[12px] font-bold text-white hover:bg-[#0584c0]"
                    >
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footnote */}
        <div className="bg-white px-4 sm:px-5 py-3 text-[13px] sm:text-[14px] text-gray-500">
          <p>Klik nama ruang / dokter untuk melihat detail antrian</p>
          <p>Antrian online ini diperbaharui otomatis setiap 60 detik.</p>
        </div>
      </div>

      {/* ================================================================
          NOTICE ALERT
          ================================================================ */}
      <div className="mt-4 sm:mt-6 text-[13px] sm:text-[15px] font-extrabold leading-relaxed">
        <span className="font-black text-red-500">PERHATIAN :</span>{' '}
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
          onSimulateCall={simulateCall}
        />
      )}
    </section>
  );
}
