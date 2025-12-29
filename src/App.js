import React, { useState, useEffect, useRef } from 'react';
import { 
  Save, Printer, PlusCircle, Search, FileText, 
  Calendar, Users, clipboard, Edit, Trash2, 
  CheckCircle, ChevronRight, Menu, X, Cloud, Loader, Download,
  Lock, LogOut, User, BarChart, Percent, Eye, PenTool, ShieldCheck, XCircle, AlertCircle
} from 'lucide-react';

// --- KONFIGURASI GOOGLE APPS SCRIPT ---
const WEB_APP_URL = "https://script.google.com/macros/s/AKfycbyHPtM_YdIs68O5a9X9V3Tion17pc8hBJ0xmPfxLQLwC12dqC-eJ2vxQXPk6wXDDtuRew/exec";

// --- TETAPAN PENGGUNA (USERS SETTING) ---
const USERS = [
  // --- SENARAI PENTADBIR ---
  { id: 'gb',    username: 'Marziah', name: 'Pn. Siti Marziah binti Mohd Yusoff',              role: 'admin', password: '123' },
  { id: 'pk1',   username: 'pk1',     name: 'En. Mohd Fadil bin Baharom (PK Pentadbiran)',     role: 'admin', password: '123' },
  { id: 'pkhem', username: 'pkhem',   name: 'Pn. Sashila binti Kasa (PK HEM)',                 role: 'admin', password: '123' },
  { id: 'pkko',  username: 'pkko',    name: 'En. Abdul Wafiy bin Mohammad Ruslee (PK Kokurikulum)', role: 'admin', password: '123' },
  { id: 'pkpk',  username: 'pkpk',    name: 'Pn. Siti Fatimah binti Sued (PK Pendidikan Khas)', role: 'admin', password: '123' },

  // --- SENARAI GURU ---
  { id: 'g01', username: 'rohana',    name: 'Pn. Rohana',               role: 'guru', password: '123' },
  { id: 'g02', username: 'norsaadah', name: 'Pn. Norsaadah',            role: 'guru', password: '123' },
  { id: 'g03', username: 'faiz',      name: 'En. Muhammad Faizzudin',   role: 'guru', password: '123' },
  { id: 'g04', username: 'talib',     name: 'En. Talib',                role: 'guru', password: '123' },
  { id: 'g05', username: 'fadzlina',  name: 'Cik Nur Fadzlina',         role: 'guru', password: '123' },
  { id: 'g06', username: 'rahmah',    name: 'Pn. Rahmah',               role: 'guru', password: '123' },
  { id: 'g07', username: 'suryanty',  name: 'Pn. Hjh. Suryanty',        role: 'guru', password: '123' },
  { id: 'g08', username: 'nori',      name: 'Cik Norizarina',           role: 'guru', password: '123' },
  { id: 'g09', username: 'ibad',      name: 'En. Muhammad Ibad Ikram',  role: 'guru', password: '123' },
  { id: 'g10', username: 'fariha',    name: 'Cik Fariha',               role: 'guru', password: '123' },
  { id: 'g11', username: 'syaza',     name: 'Cik Syaza Sofiya',         role: 'guru', password: '123' },
  { id: 'g12', username: 'dahlia',    name: 'Pn. Dahlia',               role: 'guru', password: '123' },
  { id: 'g13', username: 'juliana',   name: 'Pn. Noor Juliana',         role: 'guru', password: '123' },
  { id: 'g14', username: 'alizah',    name: 'Pn. Alizah',               role: 'guru', password: '123' },
  { id: 'g15', username: 'syahmi',    name: 'En. Muhammad Nur Syahmi',  role: 'guru', password: '123' },
  { id: 'g16', username: 'iman',      name: 'En. Nur Iman',             role: 'guru', password: '123' },
  { id: 'g17', username: 'huzaifah',  name: 'Pn. Huzaifah',             role: 'guru', password: '123' },
  { id: 'g18', username: 'aidah',     name: 'Pn. Nor Aidah',            role: 'guru', password: '123' },
  { id: 'g19', username: 'roslini',   name: 'Pn. Roslini',              role: 'guru', password: '123' },
  { id: 'g20', username: 'afrina',    name: 'Cik Afrina Faqihah',       role: 'guru', password: '123' },
  { id: 'g21', username: 'fatin',     name: 'Cik Fatin Nursyafiqah',    role: 'guru', password: '123' },
  { id: 'g22', username: 'arzailina', name: 'Pn. Norarzailina',         role: 'guru', password: '123' },
];

// --- HELPER FORMAT TARIKH (dd/mm/yyyy) ---
const formatDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.split('-');
  if (parts.length !== 3) return dateString;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
};

// --- HELPER WARNA PERATUS ---
const getPercentClass = (val) => {
  const num = parseFloat(val);
  return num >= 95 ? 'text-green-700 font-extrabold' : 'text-gray-900 font-bold';
};

// --- DATA CONTOH: LAPORAN BERTUGAS ---
const laporanContoh = {
  id: '1704067200000',
  type: 'bertugas',
  minggu: 1,
  tarikhMula: '2026-01-05',
  tarikhAkhir: '2026-01-09',
  guruBertugas: 'En. Muhammad Faizzudin, En. Talib, Cik Nur Fadzlina',
  disediakanOleh: 'En. Muhammad Faizzudin',
  createdBy: 'g03', 
  laporanHarian: {
    Isnin: { hadirMurid: '95%', hadirGuru: '45/45', disiplin: 'Tiada', kebersihan: 'Baik', aktiviti: 'Perhimpunan Rasmi Mingguan', catatan: 'Perhimpunan berjalan lancar.' },
    Selasa: { hadirMurid: '94%', hadirGuru: '44/45', disiplin: 'Lewat (3 orang)', kebersihan: 'Sederhana (Kantin)', aktiviti: 'Program Nilam', catatan: 'Guru Besar tiada (Mesyuarat PPD).' },
    Rabu: { hadirMurid: '96%', hadirGuru: '45/45', disiplin: 'Tiada', kebersihan: 'Baik', aktiviti: 'Kokurikulum Unit Beruniform', catatan: 'Cuaca hujan sebelah petang.' },
    Khamis: { hadirMurid: '93%', hadirGuru: '43/45', disiplin: 'Tiada', kebersihan: 'Baik', aktiviti: 'Bacaan Yasin', catatan: 'Persediaan Sukan Tahunan.' },
    Jumaat: { hadirMurid: '90%', hadirGuru: '40/45', disiplin: 'Tiada', kebersihan: 'Sangat Baik', aktiviti: 'Solat Hajat', catatan: 'Cuti peristiwa esok.' },
  },
  rumusan: {
    isu: 'Kebersihan kantin pada waktu rehat agak kurang memuaskan pada hari Selasa.',
    tindakan: 'Telah dimaklumkan kepada pengusaha kantin dan pengawas bertugas.',
    cadangan: 'Menambah bilangan tong sampah di kawasan laluan pelajar.',
    pengesah: 'Pn. Sashila binti Kasa (PK HEM)',
    tarikhSah: '2026-01-09',
    isSigned: true // Status Pengesahan
  },
  statusSync: 'local' 
};

// --- DATA CONTOH: LAPORAN KEHADIRAN (5 HARI) ---
const kehadiranContoh = {
  id: '1704067900000',
  type: 'kehadiran',
  minggu: 1,
  tarikhMula: '2026-01-05',
  tarikhAkhir: '2026-01-09',
  disediakanOleh: 'Pn. Rohana',
  createdBy: 'g01',
  kelasData: [
    { id: 100, namaKelas: 'Pra Intelek', lelaki: 10, perempuan: 10, hIsnin: 18, hSelasa: 19, hRabu: 20, hKhamis: 18, hJumaat: 15 },
    { id: 1, namaKelas: '1 Cemerlang', lelaki: 15, perempuan: 15, hIsnin: 29, hSelasa: 29, hRabu: 30, hKhamis: 28, hJumaat: 29 }, 
    { id: 2, namaKelas: '1 Gemilang',  lelaki: 14, perempuan: 16, hIsnin: 28, hSelasa: 29, hRabu: 30, hKhamis: 28, hJumaat: 25 },
    { id: 3, namaKelas: '2 Cemerlang', lelaki: 12, perempuan: 13, hIsnin: 24, hSelasa: 25, hRabu: 25, hKhamis: 24, hJumaat: 23 },
    { id: 4, namaKelas: '2 Gemilang',  lelaki: 15, perempuan: 15, hIsnin: 28, hSelasa: 29, hRabu: 30, hKhamis: 28, hJumaat: 25 },
    { id: 5, namaKelas: '3 Cemerlang', lelaki: 10, perempuan: 10, hIsnin: 19, hSelasa: 20, hRabu: 20, hKhamis: 19, hJumaat: 18 },
  ],
  pengesah: '',
  isSigned: false, // Belum disahkan
  statusSync: 'local'
};

// --- KOMPONEN UTAMA ---

export default function App() {
  // State Authentication
  const [currentUser, setCurrentUser] = useState(null);
  
  // State App
  const [activeModule, setActiveModule] = useState('bertugas'); // 'bertugas' or 'kehadiran'
  const [view, setView] = useState('dashboard'); 
  const [laporanList, setLaporanList] = useState([laporanContoh]);
  const [kehadiranList, setKehadiranList] = useState([kehadiranContoh]);
  
  const [currentLaporan, setCurrentLaporan] = useState(null);
  const [currentKehadiran, setCurrentKehadiran] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load data & Session on mount
  useEffect(() => {
    // Load Laporan Bertugas
    const savedData = localStorage.getItem('skuj_laporan_2026');
    if (savedData) setLaporanList(JSON.parse(savedData));

    // Load Laporan Kehadiran
    const savedKehadiran = localStorage.getItem('skuj_kehadiran_2026');
    if (savedKehadiran) setKehadiranList(JSON.parse(savedKehadiran));
    
    // Load Session User
    const savedUser = localStorage.getItem('skuj_user_session');
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

  // Save data to LocalStorage whenever lists change
  useEffect(() => {
    localStorage.setItem('skuj_laporan_2026', JSON.stringify(laporanList));
  }, [laporanList]);

  useEffect(() => {
    localStorage.setItem('skuj_kehadiran_2026', JSON.stringify(kehadiranList));
  }, [kehadiranList]);

  // --- AUTH HANDLERS ---
  const handleLogin = (user) => {
    setCurrentUser(user);
    localStorage.setItem('skuj_user_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('skuj_user_session');
    setView('dashboard');
  };

  // --- CLOUD SYNC ---
  const syncToCloud = async (data, type) => {
    const updateStatusFn = type === 'bertugas' ? updateLaporanStatus : updateKehadiranStatus;
    
    updateStatusFn(data.id, 'syncing');
    try {
      await fetch(WEB_APP_URL, {
        method: 'POST',
        mode: 'no-cors', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      updateStatusFn(data.id, 'synced');
      alert(`Data Minggu ${data.minggu} berjaya dihantar ke Google Sheet!`);
    } catch (error) {
      console.error("Ralat hantar:", error);
      updateStatusFn(data.id, 'error');
      alert("Gagal menyambung ke server. Sila semak internet anda.");
    }
  };

  const updateLaporanStatus = (id, status) => {
    setLaporanList(prev => prev.map(item => item.id === id ? { ...item, statusSync: status } : item));
    if (currentLaporan && currentLaporan.id === id) setCurrentLaporan(prev => ({ ...prev, statusSync: status }));
  };

  const updateKehadiranStatus = (id, status) => {
    setKehadiranList(prev => prev.map(item => item.id === id ? { ...item, statusSync: status } : item));
    if (currentKehadiran && currentKehadiran.id === id) setCurrentKehadiran(prev => ({ ...prev, statusSync: status }));
  };

  // --- CRUD HANDLERS (BERTUGAS) ---
  const handleNewLaporan = () => {
    const template = {
      id: Date.now().toString(), type: 'bertugas', minggu: '', tarikhMula: '', tarikhAkhir: '',
      guruBertugas: '', disediakanOleh: currentUser.name, createdBy: currentUser.id,
      laporanHarian: {
        Isnin: { hadirMurid: '', hadirGuru: '', disiplin: '', kebersihan: '', aktiviti: '', catatan: '' },
        Selasa: { hadirMurid: '', hadirGuru: '', disiplin: '', kebersihan: '', aktiviti: '', catatan: '' },
        Rabu: { hadirMurid: '', hadirGuru: '', disiplin: '', kebersihan: '', aktiviti: '', catatan: '' },
        Khamis: { hadirMurid: '', hadirGuru: '', disiplin: '', kebersihan: '', aktiviti: '', catatan: '' },
        Jumaat: { hadirMurid: '', hadirGuru: '', disiplin: '', kebersihan: '', aktiviti: '', catatan: '' },
      },
      rumusan: { isu: '', tindakan: '', cadangan: '', pengesah: '', tarikhSah: '', isSigned: false },
      statusSync: 'local'
    };
    setCurrentLaporan(template);
    setView('form');
  };

  const handleEditLaporan = (laporan) => {
    if (currentUser.role !== 'admin' && laporan.createdBy !== currentUser.id) {
      alert("Akses dinafikan: Hanya pencipta laporan boleh menyunting."); return;
    }
    setCurrentLaporan({...laporan}); setView('form');
  };

  const saveLaporan = (data) => {
    const index = laporanList.findIndex(l => l.id === data.id);
    let updatedList = [...laporanList];
    // Preserve fields
    const dataToSave = { 
        ...data, 
        statusSync: 'local', 
        createdBy: data.createdBy || currentUser.id, 
        disediakanOleh: data.disediakanOleh || currentUser.name
    };
    if (index >= 0) updatedList[index] = dataToSave; else updatedList.push(dataToSave);
    setLaporanList(updatedList);
    if(window.confirm("Simpan ke Google Sheet?")) syncToCloud(dataToSave, 'bertugas');
    setView('dashboard');
  };

  // --- CRUD HANDLERS (KEHADIRAN) ---
  const handleNewKehadiran = () => {
    const defaultClasses = [
        { id: 100, namaKelas: 'Pra Intelek', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 1, namaKelas: '1 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 2, namaKelas: '1 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 3, namaKelas: '2 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 4, namaKelas: '2 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 5, namaKelas: '3 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 6, namaKelas: '3 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 7, namaKelas: '4 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 8, namaKelas: '4 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 9, namaKelas: '5 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 10, namaKelas: '5 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 11, namaKelas: '6 Cemerlang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
        { id: 12, namaKelas: '6 Gemilang', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 },
    ];

    const template = {
      id: Date.now().toString(), type: 'kehadiran', minggu: '', tarikhMula: '', tarikhAkhir: '',
      disediakanOleh: currentUser.name, createdBy: currentUser.id,
      kelasData: defaultClasses,
      pengesah: '', isSigned: false, statusSync: 'local'
    };
    setCurrentKehadiran(template);
    setView('form');
  };

  const handleEditKehadiran = (kehadiran) => {
    if (currentUser.role !== 'admin' && kehadiran.createdBy !== currentUser.id) {
      alert("Akses dinafikan: Hanya pencipta laporan boleh menyunting."); return;
    }
    setCurrentKehadiran({...kehadiran}); setView('form');
  };

  const saveKehadiran = (data) => {
    const index = kehadiranList.findIndex(k => k.id === data.id);
    let updatedList = [...kehadiranList];
    const dataToSave = { ...data, statusSync: 'local', createdBy: data.createdBy || currentUser.id, disediakanOleh: data.disediakanOleh || currentUser.name };
    if (index >= 0) updatedList[index] = dataToSave; else updatedList.push(dataToSave);
    setKehadiranList(updatedList);
    if(window.confirm("Simpan ke Google Sheet?")) syncToCloud(dataToSave, 'kehadiran');
    setView('dashboard');
  };

  // Generic Delete
  const handleDelete = (id, createdBy, type) => {
    if (currentUser.role !== 'admin' && createdBy !== currentUser.id) {
      alert("Maaf, anda tidak boleh memadam laporan guru lain."); return;
    }
    if(window.confirm("Adakah anda pasti mahu memadam laporan ini?")) {
      if(type === 'bertugas') setLaporanList(laporanList.filter(l => l.id !== id));
      else setKehadiranList(kehadiranList.filter(k => k.id !== id));
    }
  };

  if (!currentUser) return <LoginScreen onLogin={handleLogin} users={USERS} />;

  const filteredLaporan = laporanList.filter(l => l.guruBertugas.toLowerCase().includes(searchTerm.toLowerCase()) || l.minggu.toString().includes(searchTerm));
  const filteredKehadiran = kehadiranList.filter(k => k.disediakanOleh.toLowerCase().includes(searchTerm.toLowerCase()) || k.minggu.toString().includes(searchTerm));

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <nav className="bg-indigo-900 text-white shadow-lg print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden p-2 rounded hover:bg-indigo-800"><Menu size={24} /></button>
              <FileText className="h-8 w-8 text-yellow-400" />
              <div>
                <h1 className="font-bold text-lg leading-tight">SK Undang Johol</h1>
                <p className="text-xs text-indigo-200">Sistem Pengurusan Sekolah 2026</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-2">
               <div className="bg-indigo-800 rounded-lg p-1 flex mr-4">
                 <button onClick={() => { setActiveModule('bertugas'); setView('dashboard'); }} className={`px-3 py-1 rounded text-sm font-medium transition ${activeModule === 'bertugas' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200 hover:text-white'}`}>Bertugas</button>
                 <button onClick={() => { setActiveModule('kehadiran'); setView('dashboard'); }} className={`px-3 py-1 rounded text-sm font-medium transition ${activeModule === 'kehadiran' ? 'bg-white text-indigo-900 shadow' : 'text-indigo-200 hover:text-white'}`}>Kehadiran</button>
               </div>
               <div className="flex items-center gap-2 bg-indigo-800 px-3 py-1 rounded-full text-xs mr-2">
                  <User size={14} className="text-yellow-400" />
                  <span className="font-semibold">{currentUser.name}</span>
               </div>
              <button onClick={handleLogout} className="text-indigo-200 hover:text-white p-2"><LogOut size={20} /></button>
            </div>
          </div>
        </div>
      </nav>

      {sidebarOpen && (
        <div className="md:hidden bg-indigo-800 text-white p-4 space-y-2 print:hidden">
          <div className="px-3 py-2 text-xs text-indigo-200 border-b border-indigo-600 mb-2">Login: <strong>{currentUser.name}</strong></div>
          <button onClick={() => { setActiveModule('bertugas'); setView('dashboard'); setSidebarOpen(false); }} className={`block w-full text-left px-3 py-2 ${activeModule === 'bertugas' ? 'bg-indigo-700' : ''}`}>Modul Bertugas</button>
          <button onClick={() => { setActiveModule('kehadiran'); setView('dashboard'); setSidebarOpen(false); }} className={`block w-full text-left px-3 py-2 ${activeModule === 'kehadiran' ? 'bg-indigo-700' : ''}`}>Modul Kehadiran</button>
          <button onClick={handleLogout} className="block w-full text-left px-3 py-2 text-red-200">Log Keluar</button>
        </div>
      )}

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 print:p-0 print:max-w-none">
        {view === 'dashboard' && (
          <div className="px-4 py-6 sm:px-0">
            <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
               <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                 {activeModule === 'bertugas' ? <FileText className="text-indigo-600"/> : <BarChart className="text-green-600"/>}
                 {activeModule === 'bertugas' ? 'Laporan Guru Bertugas' : 'Laporan Kehadiran Murid'}
               </h2>
               <div className="flex gap-2 w-full sm:w-auto">
                 <div className="relative flex-grow sm:w-64">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input type="text" className="pl-9 w-full border rounded-md py-2 text-sm" placeholder="Cari..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                 </div>
                 <button 
                   onClick={activeModule === 'bertugas' ? handleNewLaporan : handleNewKehadiran} 
                   className={`${activeModule === 'bertugas' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-green-600 hover:bg-green-700'} text-white px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 shadow-sm`}
                 >
                   <PlusCircle size={16} /> Baru
                 </button>
               </div>
            </div>

            {activeModule === 'bertugas' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredLaporan.map((item) => (
                  <DashboardCard 
                    key={item.id} item={item} currentUser={currentUser} 
                    onView={() => {setCurrentLaporan(item); setView('print');}} 
                    onEdit={() => handleEditLaporan(item)} 
                    onDelete={() => handleDelete(item.id, item.createdBy, 'bertugas')} 
                    onSync={() => syncToCloud(item, 'bertugas')}
                    color="indigo"
                  />
                ))}
              </div>
            )}

            {activeModule === 'kehadiran' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredKehadiran.map((item) => (
                  <DashboardCard 
                    key={item.id} item={item} currentUser={currentUser} 
                    onView={() => {setCurrentKehadiran(item); setView('print');}} 
                    onEdit={() => handleEditKehadiran(item)} 
                    onDelete={() => handleDelete(item.id, item.createdBy, 'kehadiran')} 
                    onSync={() => syncToCloud(item, 'kehadiran')}
                    color="green"
                    subtitle={`Minggu ${item.minggu} • Kehadiran`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === 'form' && activeModule === 'bertugas' && currentLaporan && (
          <FormEditorBertugas initialData={currentLaporan} onSave={saveLaporan} onCancel={() => setView('dashboard')} currentUser={currentUser} />
        )}
        
        {view === 'form' && activeModule === 'kehadiran' && currentKehadiran && (
          <FormEditorKehadiran initialData={currentKehadiran} onSave={saveKehadiran} onCancel={() => setView('dashboard')} currentUser={currentUser} />
        )}

        {view === 'print' && activeModule === 'bertugas' && currentLaporan && (
          <PrintViewBertugas data={currentLaporan} onBack={() => setView('dashboard')} />
        )}

        {view === 'print' && activeModule === 'kehadiran' && currentKehadiran && (
          <PrintViewKehadiran data={currentKehadiran} onBack={() => setView('dashboard')} />
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENT: APPROVAL CARD ---
function ApprovalCard({ isSigned, signedBy, signedDate, onSign, currentUser }) {
  const isAdmin = currentUser.role === 'admin';

  if (isSigned) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
        <div className="bg-green-100 p-2 rounded-full"><ShieldCheck className="text-green-600" size={32} /></div>
        <div>
          <p className="text-xs font-bold text-green-700 uppercase tracking-wider">Laporan Telah Disahkan</p>
          <p className="font-bold text-gray-800">{signedBy}</p>
          <p className="text-xs text-gray-500">Tarikh: {formatDate(signedDate)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Lock className="text-yellow-600" size={18} />
          <span className="text-sm font-bold text-yellow-800">Status: Belum Disahkan</span>
        </div>
      </div>
      
      {isAdmin ? (
        <button 
          type="button" 
          onClick={onSign} 
          className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded shadow flex items-center justify-center gap-2"
        >
          <PenTool size={16} /> SAHKAN & TANDATANGAN
        </button>
      ) : (
        <p className="text-xs text-gray-500 mt-1 italic">Menunggu semakan Pentadbir.</p>
      )}
    </div>
  );
}

// --- SHARED COMPONENTS ---
function LoginScreen({ onLogin, users }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.find(u => u.username === username && u.password === password);
    user ? onLogin(user) : setError('ID atau Kata Laluan salah.');
  };
  return (
    <div className="min-h-screen bg-indigo-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-2xl p-8">
        <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-2">SK Undang Johol</h2>
        <p className="text-center text-gray-600 mb-8">Sistem Pengurusan Sekolah</p>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input type="text" required className="w-full border p-2 rounded" placeholder="ID Pengguna" value={username} onChange={e=>setUsername(e.target.value)} />
          <input type="password" required className="w-full border p-2 rounded" placeholder="Kata Laluan" value={password} onChange={e=>setPassword(e.target.value)} />
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          <button type="submit" className="w-full py-2 bg-indigo-600 text-white rounded font-bold">Log Masuk</button>
        </form>
      </div>
    </div>
  );
}

function DashboardCard({ item, currentUser, onView, onEdit, onDelete, onSync, color, subtitle }) {
  const theme = color === 'green' ? 'border-green-600 text-green-800 bg-green-100 hover:bg-green-50' : 'border-indigo-900 text-indigo-800 bg-indigo-100 hover:bg-indigo-50';
  
  // LOGIC STATUS KESELURUHAN (Hijau vs Merah)
  const isComplete = (item.type === 'bertugas' ? item.rumusan?.isSigned : item.isSigned);

  return (
    <div className={`bg-white overflow-hidden shadow rounded-lg border-l-4 ${color === 'green' ? 'border-green-600' : 'border-indigo-900'} hover:shadow-xl transition-shadow relative`}>
      {item.createdBy === currentUser.id && <div className="absolute top-0 right-0 bg-yellow-400 text-xs font-bold px-2 py-1 rounded-bl">ANDA</div>}
      <div className="px-4 py-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Minggu {item.minggu}</h3>
            <p className="text-xs text-gray-500">{subtitle || `${formatDate(item.tarikhMula)} - ${formatDate(item.tarikhAkhir)}`}</p>
          </div>
          {/* SYNC STATUS ICON */}
          {item.statusSync === 'synced' ? <CheckCircle size={16} className="text-green-600"/> : item.statusSync === 'syncing' ? <Loader size={16} className="animate-spin text-blue-600"/> : <span className="text-xs bg-gray-200 px-1 rounded">Local</span>}
        </div>
        
        {/* STATUS PENGESAHAN VISUAL */}
        <div className="mt-4 mb-2">
           {isComplete ? (
             <div className="flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold w-fit">
               <CheckCircle size={14} /> DISAHKAN / SELESAI
             </div>
           ) : (
             <div className="flex items-center gap-2 bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-bold w-fit">
               <XCircle size={14} /> BELUM DISAHKAN
             </div>
           )}
        </div>

        <div className="mt-2">
          <p className="text-xs font-bold text-gray-400 uppercase">Disediakan Oleh:</p>
          <p className="text-sm text-gray-900 truncate">{item.disediakanOleh}</p>
        </div>
        <div className="mt-4 flex justify-end gap-2 border-t pt-3">
            <button onClick={onSync} className={`p-2 rounded-full ${theme}`} title="Hantar Cloud"><Cloud size={16}/></button>
            <button onClick={onView} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Lihat Laporan"><Printer size={16}/></button>
            {(currentUser.role === 'admin' || item.createdBy === currentUser.id) && (
              <>
                <button onClick={onEdit} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Edit"><Edit size={16}/></button>
                <button onClick={onDelete} className="p-2 text-red-600 hover:bg-red-50 rounded-full" title="Padam"><Trash2 size={16}/></button>
              </>
            )}
        </div>
      </div>
    </div>
  );
}

// --- FORM: KEHADIRAN ---
function FormEditorKehadiran({ initialData, onSave, onCancel, currentUser }) {
  const [formData, setFormData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('enrolmen'); 
  const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];

  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  
  const handleClassChange = (index, field, value) => {
    const newClasses = [...formData.kelasData];
    newClasses[index][field] = Number(value); 
    setFormData(prev => ({ ...prev, kelasData: newClasses }));
  };

  const handleClassNameChange = (index, value) => {
    const newClasses = [...formData.kelasData];
    newClasses[index].namaKelas = value;
    setFormData(prev => ({ ...prev, kelasData: newClasses }));
  };

  const addClass = () => {
    const newId = formData.kelasData.length + 100;
    setFormData(prev => ({ ...prev, kelasData: [...prev.kelasData, { id: newId, namaKelas: '', lelaki: 0, perempuan: 0, hIsnin: 0, hSelasa: 0, hRabu: 0, hKhamis: 0, hJumaat: 0 }]}));
  };

  const removeClass = (index) => {
    const newClasses = formData.kelasData.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, kelasData: newClasses }));
  };

  const handleAdminSign = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, pengesah: currentUser.name, tarikhSah: today, isSigned: true }));
  };

  const isExcluded = (name) => name.toLowerCase().includes('pra') || name.toLowerCase().includes('intelek');
  const calcTotal = (field) => formData.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + curr[field], 0);
  const grandAll = calcTotal('lelaki') + calcTotal('perempuan');
  const totalHadirToday = days.includes(activeTab) ? formData.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr[`h${activeTab}`] || 0), 0) : 0;
  const totalAbsentToday = grandAll - totalHadirToday;
  const percentToday = grandAll > 0 ? ((totalHadirToday / grandAll) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-white shadow rounded-lg p-6">
       <div className="flex justify-between items-center mb-6 pb-4 border-b">
         <h2 className="text-2xl font-bold text-green-800">Laporan Kehadiran Mingguan</h2>
         <button onClick={onCancel}><X className="text-gray-500 hover:text-red-500" /></button>
       </div>
       <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }}>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50 p-4 rounded mb-6">
            <div><label className="text-xs font-bold">Minggu</label><input required type="number" className="w-full border p-2 rounded" value={formData.minggu} onChange={e=>handleChange('minggu', e.target.value)}/></div>
            <div><label className="text-xs font-bold">Mula</label><input required type="date" className="w-full border p-2 rounded" value={formData.tarikhMula} onChange={e=>handleChange('tarikhMula', e.target.value)}/></div>
            <div><label className="text-xs font-bold">Akhir</label><input required type="date" className="w-full border p-2 rounded" value={formData.tarikhAkhir} onChange={e=>handleChange('tarikhAkhir', e.target.value)}/></div>
         </div>
         <div className="flex space-x-2 border-b border-gray-200 mb-4 overflow-x-auto pb-2">
            <button type="button" onClick={() => setActiveTab('enrolmen')} className={`px-4 py-2 font-bold rounded-t-lg ${activeTab === 'enrolmen' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Enrolmen</button>
            {days.map(d => <button key={d} type="button" onClick={() => setActiveTab(d)} className={`px-4 py-2 font-bold rounded-t-lg ${activeTab === d ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{d}</button>)}
         </div>
         {activeTab === 'enrolmen' && (
           <div className="overflow-x-auto mb-6 bg-gray-50 p-4 rounded border">
             <table className="w-full text-sm border-collapse border bg-white">
               <thead>
                 <tr className="bg-green-100 text-green-900">
                   <th className="border p-2 text-left">Nama Kelas</th>
                   <th className="border p-2 w-24 text-center">Lelaki</th>
                   <th className="border p-2 w-24 text-center">Perempuan</th>
                   <th className="border p-2 w-24 text-center bg-gray-100">Jum Sebenar</th>
                   <th className="border p-2 w-12"></th>
                 </tr>
               </thead>
               <tbody>
                 {formData.kelasData.map((cls, index) => (
                   <tr key={index}>
                     <td className="border p-1"><input type="text" className="w-full p-1 border rounded" value={cls.namaKelas} onChange={e=>handleClassNameChange(index, e.target.value)} /></td>
                     <td className="border p-1"><input type="number" className="w-full p-1 border rounded text-center" value={cls.lelaki} onChange={e=>handleClassChange(index, 'lelaki', e.target.value)} /></td>
                     <td className="border p-1"><input type="number" className="w-full p-1 border rounded text-center" value={cls.perempuan} onChange={e=>handleClassChange(index, 'perempuan', e.target.value)} /></td>
                     <td className="border p-1 text-center font-bold bg-gray-50">{cls.lelaki + cls.perempuan}</td>
                     <td className="border p-1 text-center"><button type="button" onClick={() => removeClass(index)} className="text-red-400 hover:text-red-600"><X size={16}/></button></td>
                   </tr>
                 ))}
               </tbody>
             </table>
             <button type="button" onClick={addClass} className="mt-3 text-sm text-green-600 font-bold flex items-center gap-1 hover:text-green-800"><PlusCircle size={16}/> Tambah Kelas</button>
           </div>
         )}
         {days.includes(activeTab) && (
            <div className="overflow-x-auto mb-6 bg-blue-50 p-4 rounded border">
               <h3 className="font-bold text-blue-900 mb-2">Kehadiran Hari: {activeTab}</h3>
               <table className="w-full text-sm border-collapse border bg-white">
               <thead>
                 <tr className="bg-blue-100 text-blue-900">
                   <th className="border p-2 text-left">Nama Kelas</th>
                   <th className="border p-2 w-24 text-center bg-gray-100">Jum Sebenar</th>
                   <th className="border p-2 w-24 text-center text-blue-700">Hadir</th>
                   <th className="border p-2 w-24 text-center text-red-600 bg-gray-50">T.Hadir</th>
                   <th className="border p-2 w-24 text-center bg-gray-50">%</th>
                 </tr>
               </thead>
               <tbody>
                 {formData.kelasData.map((cls, index) => {
                   const total = cls.lelaki + cls.perempuan;
                   const fieldName = `h${activeTab}`;
                   const hadir = cls[fieldName] || 0;
                   const th = total - hadir;
                   const pct = total > 0 ? ((hadir/total)*100).toFixed(1) : '0.0';
                   return (
                     <tr key={index}>
                       <td className="border p-2 font-medium">{cls.namaKelas}</td>
                       <td className="border p-2 text-center bg-gray-100">{total}</td>
                       <td className="border p-1"><input type="number" className="w-full p-1 border rounded text-center font-bold text-blue-600" value={hadir} onChange={e=>handleClassChange(index, fieldName, e.target.value)} /></td>
                       <td className="border p-2 text-center text-red-600 bg-gray-50">{th}</td>
                       <td className={`border p-2 text-center ${getPercentClass(pct)}`}>{pct}%</td>
                     </tr>
                   )
                 })}
               </tbody>
               <tfoot>
                  <tr className="bg-blue-200 font-bold border-t-2 border-blue-400">
                     <td className="border p-2 text-right">JUMLAH (Tanpa Pra)</td>
                     <td className="border p-2 text-center">{grandAll}</td>
                     <td className="border p-2 text-center text-blue-800">{totalHadirToday}</td>
                     <td className="border p-2 text-center text-red-800">{totalAbsentToday}</td>
                     <td className={`border p-2 text-center ${getPercentClass(percentToday)}`}>{percentToday}%</td>
                  </tr>
               </tfoot>
             </table>
            </div>
         )}
         <div className="grid grid-cols-2 gap-4 border-t pt-4">
            <div><label className="text-xs font-bold">Disediakan Oleh</label><input disabled value={formData.disediakanOleh} className="w-full border p-2 rounded bg-gray-100"/></div>
            {/* APPROVAL CARD REPLACEMENT */}
            <ApprovalCard isSigned={formData.isSigned} signedBy={formData.pengesah} signedDate={formData.tarikhSah} onSign={handleAdminSign} currentUser={currentUser} />
         </div>
         <div className="flex justify-end gap-3 pt-6 border-t mt-4">
           <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Batal</button>
           <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded font-bold">Simpan Data</button>
         </div>
       </form>
    </div>
  );
}

// --- FORM: BERTUGAS (Legacy) ---
function FormEditorBertugas({ initialData, onSave, onCancel, currentUser }) {
  const [formData, setFormData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('Isnin');
  const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];
  const handleChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleDailyChange = (day, field, value) => setFormData(prev => ({...prev, laporanHarian: {...prev.laporanHarian, [day]: {...prev.laporanHarian[day], [field]: value}}}));
  const handleRumusanChange = (field, value) => setFormData(prev => ({...prev, rumusan: { ...prev.rumusan, [field]: value }}));
  
  const handleAdminSign = () => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, rumusan: { ...prev.rumusan, pengesah: currentUser.name, tarikhSah: today, isSigned: true } }));
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6 pb-4 border-b">
        <h2 className="text-2xl font-bold text-indigo-900">Laporan Guru Bertugas</h2>
        <button onClick={onCancel}><X className="text-gray-500" /></button>
      </div>
      <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-6">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-indigo-50 p-4 rounded">
            <div><label className="text-xs font-bold">Minggu</label><input required type="number" className="w-full border p-2 rounded" value={formData.minggu} onChange={e=>handleChange('minggu', e.target.value)}/></div>
            <div><label className="text-xs font-bold">Mula</label><input required type="date" className="w-full border p-2 rounded" value={formData.tarikhMula} onChange={e=>handleChange('tarikhMula', e.target.value)}/></div>
            <div><label className="text-xs font-bold">Akhir</label><input required type="date" className="w-full border p-2 rounded" value={formData.tarikhAkhir} onChange={e=>handleChange('tarikhAkhir', e.target.value)}/></div>
            <div><label className="text-xs font-bold">Guru Bertugas</label><input required className="w-full border p-2 rounded" value={formData.guruBertugas} onChange={e=>handleChange('guruBertugas', e.target.value)}/></div>
         </div>
         <div>
            <div className="flex gap-2 border-b mb-4 overflow-x-auto">
               {days.map(d => <button key={d} type="button" onClick={()=>setActiveTab(d)} className={`px-4 py-2 ${activeTab===d ? 'border-b-2 border-indigo-600 font-bold text-indigo-700' : 'text-gray-500'}`}>{d}</button>)}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <input placeholder="Hadir Murid (%)" className="border p-2 rounded" value={formData.laporanHarian[activeTab].hadirMurid} onChange={e=>handleDailyChange(activeTab, 'hadirMurid', e.target.value)} />
               <input placeholder="Hadir Guru (x/45)" className="border p-2 rounded" value={formData.laporanHarian[activeTab].hadirGuru} onChange={e=>handleDailyChange(activeTab, 'hadirGuru', e.target.value)} />
               <textarea placeholder="Disiplin" className="border p-2 rounded md:col-span-2" value={formData.laporanHarian[activeTab].disiplin} onChange={e=>handleDailyChange(activeTab, 'disiplin', e.target.value)} />
               <textarea placeholder="Kebersihan" className="border p-2 rounded md:col-span-2" value={formData.laporanHarian[activeTab].kebersihan} onChange={e=>handleDailyChange(activeTab, 'kebersihan', e.target.value)} />
               <textarea placeholder="Aktiviti" className="border p-2 rounded md:col-span-2" value={formData.laporanHarian[activeTab].aktiviti} onChange={e=>handleDailyChange(activeTab, 'aktiviti', e.target.value)} />
               <textarea placeholder="Catatan" className="border p-2 rounded md:col-span-2" value={formData.laporanHarian[activeTab].catatan} onChange={e=>handleDailyChange(activeTab, 'catatan', e.target.value)} />
            </div>
         </div>
         <div className="border-t pt-4">
             <h3 className="font-bold mb-2">Rumusan</h3>
             <textarea placeholder="Isu" className="w-full border p-2 mb-2 rounded" value={formData.rumusan.isu} onChange={e=>handleRumusanChange('isu', e.target.value)}/>
             <textarea placeholder="Tindakan" className="w-full border p-2 mb-2 rounded" value={formData.rumusan.tindakan} onChange={e=>handleRumusanChange('tindakan', e.target.value)}/>
             <textarea placeholder="Cadangan" className="w-full border p-2 mb-2 rounded" value={formData.rumusan.cadangan} onChange={e=>handleRumusanChange('cadangan', e.target.value)}/>
             
             {/* APPROVAL CARD REPLACEMENT */}
             <div className="mt-4">
                <ApprovalCard isSigned={formData.rumusan.isSigned} signedBy={formData.rumusan.pengesah} signedDate={formData.rumusan.tarikhSah} onSign={handleAdminSign} currentUser={currentUser} />
             </div>
         </div>
         <div className="flex justify-end gap-3 pt-6 border-t">
           <button type="button" onClick={onCancel} className="px-4 py-2 border rounded">Batal</button>
           <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded font-bold">Simpan Laporan</button>
         </div>
      </form>
    </div>
  );
}

// --- PRINT VIEW: KEHADIRAN ---
function PrintViewKehadiran({ data, onBack }) {
  const printRef = useRef();
  const handleDownloadPDF = () => { /* ...existing pdf logic... */ if (!window.html2pdf) { alert("Library loading..."); return; } const opt = { margin: 0.5, filename: `Kehadiran_Minggu_${data.minggu}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }; window.html2pdf().set(opt).from(printRef.current).save(); };
  const isExcluded = (name) => name.toLowerCase().includes('pra') || name.toLowerCase().includes('intelek');
  const grandL = data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + curr.lelaki, 0);
  const grandP = data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + curr.perempuan, 0);
  const grandAll = grandL + grandP;
  const dailyTotals = {
     Isnin: data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr.hIsnin || 0), 0),
     Selasa: data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr.hSelasa || 0), 0),
     Rabu: data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr.hRabu || 0), 0),
     Khamis: data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr.hKhamis || 0), 0),
     Jumaat: data.kelasData.reduce((acc, curr) => isExcluded(curr.namaKelas) ? acc : acc + (curr.hJumaat || 0), 0),
  };
  const dailyAbsent = { Isnin: grandAll - dailyTotals.Isnin, Selasa: grandAll - dailyTotals.Selasa, Rabu: grandAll - dailyTotals.Rabu, Khamis: grandAll - dailyTotals.Khamis, Jumaat: grandAll - dailyTotals.Jumaat };
  const getPercent = (val) => grandAll > 0 ? ((val / grandAll) * 100).toFixed(1) : '0.0';

  return (
    <div className="bg-gray-50 flex flex-col items-center min-h-screen">
       <div className="w-full max-w-[210mm] flex justify-between items-center mb-6 mt-4 gap-2 print:hidden px-4">
          <button onClick={onBack} className="flex items-center text-gray-600 bg-white px-3 py-2 rounded shadow-sm"><ChevronRight className="rotate-180 mr-1" /> Kembali</button>
          <div className="flex gap-2"><button onClick={() => window.print()} className="bg-green-600 text-white px-4 py-2 rounded shadow flex gap-2"><Printer size={18}/> Cetak</button><button onClick={handleDownloadPDF} className="bg-green-800 text-white px-4 py-2 rounded shadow flex gap-2"><Download size={18}/> PDF</button></div>
       </div>
       <div ref={printRef} className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[10mm] shadow-xl print:shadow-none text-sm leading-tight text-black">
          <div className="text-center border-b-2 border-black pb-2 mb-4">
             <h1 className="font-bold text-xl uppercase">Sekolah Kebangsaan Undang Johol</h1>
             <h2 className="font-semibold text-lg">Analisis Kehadiran Mingguan Murid Tahun 2026</h2>
          </div>
          <div className="flex justify-between mb-4 font-semibold text-sm"><p>Minggu: {data.minggu}</p><p>Tarikh: {formatDate(data.tarikhMula)} hingga {formatDate(data.tarikhAkhir)}</p></div>
          <div className="mb-4">
             <h3 className="font-bold border-b border-black mb-1 bg-gray-200 p-1">A. RUMUSAN ENROLMEN MURID (RUJUKAN UTAMA)</h3>
             <table className="w-full border-collapse border border-black text-xs mb-2">
                <thead><tr className="bg-gray-100"><th className="border border-black p-1 text-left pl-2">Kelas</th><th className="border border-black p-1 w-16 text-center">Lelaki</th><th className="border border-black p-1 w-16 text-center">Perempuan</th><th className="border border-black p-1 w-16 text-center font-bold">Jum Sebenar</th></tr></thead>
                <tbody>
                   {data.kelasData.map((cls, idx) => (<tr key={idx}><td className="border border-black p-1 pl-2">{cls.namaKelas}</td><td className="border border-black p-1 text-center">{cls.lelaki}</td><td className="border border-black p-1 text-center">{cls.perempuan}</td><td className="border border-black p-1 text-center font-bold">{cls.lelaki + cls.perempuan}</td></tr>))}
                   <tr className="bg-gray-300 font-bold border-t-2 border-black"><td className="border border-black p-1 text-right pr-2">JUMLAH BESAR (Tanpa Pra)</td><td className="border border-black p-1 text-center">{grandL}</td><td className="border border-black p-1 text-center">{grandP}</td><td className="border border-black p-1 text-center">{grandAll}</td></tr>
                </tbody>
             </table>
          </div>
          <div>
             <h3 className="font-bold border-b border-black mb-1 bg-gray-200 p-1">B. REKOD KEHADIRAN HARIAN (5 HARI)</h3>
             <table className="w-full border-collapse border border-black text-xs">
                <thead><tr className="bg-gray-100"><th className="border border-black p-1 text-left pl-2">Kelas</th><th className="border border-black p-1 w-16 text-center">Isnin</th><th className="border border-black p-1 w-16 text-center">Selasa</th><th className="border border-black p-1 w-16 text-center">Rabu</th><th className="border border-black p-1 w-16 text-center">Khamis</th><th className="border border-black p-1 w-16 text-center">Jumaat</th></tr></thead>
                <tbody>
                   {data.kelasData.map((cls, idx) => (<tr key={idx}><td className="border border-black p-1 pl-2 font-medium">{cls.namaKelas}</td><td className="border border-black p-1 text-center">{cls.hIsnin}</td><td className="border border-black p-1 text-center">{cls.hSelasa}</td><td className="border border-black p-1 text-center">{cls.hRabu}</td><td className="border border-black p-1 text-center">{cls.hKhamis}</td><td className="border border-black p-1 text-center">{cls.hJumaat}</td></tr>))}
                   <tr className="bg-gray-300 font-bold border-t-2 border-black"><td className="border border-black p-1 text-right pr-2">JUMLAH HADIR</td><td className="border border-black p-1 text-center">{dailyTotals.Isnin}</td><td className="border border-black p-1 text-center">{dailyTotals.Selasa}</td><td className="border border-black p-1 text-center">{dailyTotals.Rabu}</td><td className="border border-black p-1 text-center">{dailyTotals.Khamis}</td><td className="border border-black p-1 text-center">{dailyTotals.Jumaat}</td></tr>
                   <tr className="bg-gray-200 font-bold"><td className="border border-black p-1 text-right pr-2">JUMLAH TIDAK HADIR</td><td className="border border-black p-1 text-center text-red-700">{dailyAbsent.Isnin}</td><td className="border border-black p-1 text-center text-red-700">{dailyAbsent.Selasa}</td><td className="border border-black p-1 text-center text-red-700">{dailyAbsent.Rabu}</td><td className="border border-black p-1 text-center text-red-700">{dailyAbsent.Khamis}</td><td className="border border-black p-1 text-center text-red-700">{dailyAbsent.Jumaat}</td></tr>
                   <tr className="bg-gray-300 font-bold"><td className="border border-black p-1 text-right pr-2">PERATUS (%)</td><td className={`border border-black p-1 text-center ${getPercentClass(getPercent(dailyTotals.Isnin))}`}>{getPercent(dailyTotals.Isnin)}%</td><td className={`border border-black p-1 text-center ${getPercentClass(getPercent(dailyTotals.Selasa))}`}>{getPercent(dailyTotals.Selasa)}%</td><td className={`border border-black p-1 text-center ${getPercentClass(getPercent(dailyTotals.Rabu))}`}>{getPercent(dailyTotals.Rabu)}%</td><td className={`border border-black p-1 text-center ${getPercentClass(getPercent(dailyTotals.Khamis))}`}>{getPercent(dailyTotals.Khamis)}%</td><td className={`border border-black p-1 text-center ${getPercentClass(getPercent(dailyTotals.Jumaat))}`}>{getPercent(dailyTotals.Jumaat)}%</td></tr>
                </tbody>
             </table>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-12 text-center text-sm">
             <div><p>Disediakan Oleh:</p><div className="h-16"></div><p className="font-bold border-t border-black mx-10 pt-2">{data.disediakanOleh}</p><p className="text-xs">Guru Bertugas Mingguan</p></div>
             
             {/* DIGITAL SIGNATURE STAMP */}
             <div>
               <p>Disahkan Oleh:</p>
               {data.isSigned ? (
                 <div className="mx-auto w-48 py-2 relative">
                   <p style={{fontFamily: "'Brush Script MT', cursive", fontSize: "20px", transform: "rotate(-5deg)"}} className="text-blue-900 font-bold">{data.pengesah}</p>
                   <p className="text-[10px] mt-1 text-gray-600">Tarikh Sah: {formatDate(data.tarikhSah ? data.tarikhSah : data.rumusan?.tarikhSah)}</p>
                   <div className="border-t border-black mt-1"></div>
                 </div>
               ) : (
                 <div className="h-16 border-b border-black mx-10 mt-8"></div>
               )}
               <p className="text-xs mt-1">Guru Besar / Pentadbir</p>
             </div>
          </div>
       </div>
       <style>{`@media print { nav, button, .print\\:hidden { display: none !important; } body { background: white; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }`}</style>
    </div>
  );
}

// --- PRINT VIEW: BERTUGAS ---
function PrintViewBertugas({ data, onBack }) {
  const days = ['Isnin', 'Selasa', 'Rabu', 'Khamis', 'Jumaat'];
  const printRef = useRef();
  const handleDownloadPDF = () => { /*...existing logic...*/ if (!window.html2pdf) { alert("Library loading..."); return; } const opt = { margin: 0.5, filename: `Laporan_Bertugas_Minggu_${data.minggu}.pdf`, image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' } }; window.html2pdf().set(opt).from(printRef.current).save(); };

  return (
    <div className="bg-gray-50 flex flex-col items-center min-h-screen">
      <div className="w-full max-w-[210mm] flex flex-wrap justify-between items-center mb-6 mt-4 gap-2 print:hidden px-4">
        <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-3 py-2 rounded shadow-sm"><ChevronRight className="rotate-180 mr-1" /> Kembali</button>
        <div className="flex gap-2"><button onClick={() => window.print()} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2"><Printer size={18} /> Cetak</button><button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-2"><Download size={18} /> PDF</button></div>
      </div>
      <div ref={printRef} id="print-area" className="bg-white w-full max-w-[210mm] min-h-[297mm] p-[10mm] sm:p-[20mm] shadow-xl print:shadow-none print:w-full print:max-w-none print:p-0 print:m-0 text-sm leading-tight text-gray-900">
        <div className="text-center border-b-2 border-black pb-4 mb-4"><h1 className="font-bold text-xl uppercase">Sekolah Kebangsaan Undang Johol</h1><h2 className="font-semibold text-lg">Laporan Mingguan Guru Bertugas Tahun 2026</h2></div>
        <div className="mb-6 grid grid-cols-2 gap-x-8 gap-y-2 text-sm"><div className="flex"><span className="font-bold w-24">Minggu:</span><span>{data.minggu}</span></div><div className="flex"><span className="font-bold w-24">Tarikh:</span><span>{formatDate(data.tarikhMula)} hingga {formatDate(data.tarikhAkhir)}</span></div><div className="flex col-span-2 mt-2"><span className="font-bold w-24">Guru Bertugas:</span><span className="flex-1 border-b border-dotted border-gray-400 pb-1">{data.guruBertugas}</span></div></div>
        <h3 className="font-bold text-sm bg-gray-200 p-1 mb-2 border border-gray-400 text-center">BAHAGIAN A: LAPORAN HARIAN</h3>
        <div className="mb-6">
          <table className="w-full border-collapse border border-gray-400 text-xs">
            <thead><tr className="bg-gray-100"><th className="border border-gray-400 p-2 w-[10%]">Hari</th><th className="border border-gray-400 p-2 w-[15%]">Kehadiran (M/G)</th><th className="border border-gray-400 p-2 w-[20%]">Disiplin & Kebersihan</th><th className="border border-gray-400 p-2 w-[30%]">Aktiviti</th><th className="border border-gray-400 p-2 w-[25%]">Catatan</th></tr></thead>
            <tbody>{days.map(day => (<tr key={day}><td className="border border-gray-400 p-2 font-bold text-center bg-gray-50">{day}</td><td className="border border-gray-400 p-2 text-center"><div>M: {data.laporanHarian[day].hadirMurid || '-'}</div><div className="mt-1">G: {data.laporanHarian[day].hadirGuru || '-'}</div></td><td className="border border-gray-400 p-2"><div><span className="font-semibold">D:</span> {data.laporanHarian[day].disiplin || '-'}</div><div className="mt-1 pt-1 border-t border-dotted border-gray-300"><span className="font-semibold">K:</span> {data.laporanHarian[day].kebersihan || '-'}</div></td><td className="border border-gray-400 p-2">{data.laporanHarian[day].aktiviti || '-'}</td><td className="border border-gray-400 p-2 italic text-gray-600">{data.laporanHarian[day].catatan || '-'}</td></tr>))}</tbody>
          </table>
        </div>
        <h3 className="font-bold text-sm bg-gray-200 p-1 mb-2 border border-gray-400 text-center">BAHAGIAN B: RUMUSAN MINGGUAN</h3>
        <div className="border border-gray-400 p-4 mb-6 space-y-4"><div><span className="font-bold block mb-1 underline">Isu Utama / Masalah:</span><p className="min-h-[2em]">{data.rumusan.isu || 'Tiada isu direkodkan.'}</p></div><div><span className="font-bold block mb-1 underline">Tindakan Yang Telah Diambil:</span><p className="min-h-[2em]">{data.rumusan.tindakan || '-'}</p></div><div><span className="font-bold block mb-1 underline">Cadangan Penambahbaikan:</span><p className="min-h-[2em]">{data.rumusan.cadangan || '-'}</p></div></div>
        <div className="mt-10 grid grid-cols-2 gap-10">
          <div className="text-center"><p className="mb-8">Disediakan oleh:</p><div className="border-t border-black mx-4"></div><p className="font-bold mt-2 uppercase">{data.disediakanOleh || 'Ketua Guru Bertugas'}</p><p className="text-xs text-gray-500">Guru Bertugas Mingguan</p></div>
          
          {/* DIGITAL SIGNATURE STAMP */}
          <div className="text-center">
             <p className="mb-2">Disemak oleh:</p>
             {data.rumusan.isSigned ? (
                 <div className="mx-auto w-48 py-2 relative">
                   <p style={{fontFamily: "'Brush Script MT', cursive", fontSize: "20px", transform: "rotate(-5deg)"}} className="text-blue-900 font-bold">{data.rumusan.pengesah}</p>
                   <p className="text-[10px] mt-1 text-gray-600">Tarikh Sah: {formatDate(data.rumusan.tarikhSah)}</p>
                   <div className="border-t border-black mt-1"></div>
                 </div>
             ) : (
                 <div className="h-16 border-b border-black mx-4 mt-8"></div>
             )}
             <p className="font-bold mt-1 uppercase text-sm">{data.rumusan.pengesah || 'Pentadbir'}</p>
             <p className="text-xs">Guru Besar / Pentadbir</p>
          </div>
        </div>
      </div>
      <style>{`@media print { nav, button, .print\\:hidden { display: none !important; } body, html { margin: 0; padding: 0; background: white; } .min-h-screen { min-height: auto !important; } * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; } }`}</style>
    </div>
  );
}