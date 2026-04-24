import React, { useState, useEffect } from 'react';
import { HistoryItem } from '../services/aiService';
import { Trash2, Download, Search, Filter, ExternalLink, FileJson, FileSpreadsheet, Sparkles } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'image' | 'video'>('all');

  useEffect(() => {
    const saved = localStorage.getItem('jowo-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const handleDelete = (id: string) => {
    const updated = history.filter(h => h.id !== id);
    setHistory(updated);
    localStorage.setItem('jowo-history', JSON.stringify(updated));
  };

  const exportCSV = () => {
    const headers = ['ID', 'Type', 'Prompt', 'Created At', 'URL'];
    const rows = history.map(h => [h.id, h.type, h.prompt.replace(/,/g, ' '), h.createdAt, h.url]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `jowo_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(search.toLowerCase()) || 
                         (item.metadata?.title || '').toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'all' || item.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight mb-2">Project History</h1>
          <p className="text-gray-400">Manage and export your AI generated assets.</p>
        </div>
        <div className="flex gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-sm font-medium">
            <FileSpreadsheet className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row items-center gap-4 py-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search metadata or prompts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/5 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-neon-blue/40"
          />
        </div>
        <div className="flex bg-white/5 p-1 rounded-xl border border-white/5">
          {(['all', 'image', 'video'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f ? 'bg-neon-blue text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredHistory.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-card group overflow-hidden"
            >
              <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                <img src={item.url} alt={item.prompt} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <div className="flex gap-2 w-full">
                    <button className="flex-1 py-2 bg-white/10 backdrop-blur-md rounded-lg flex items-center justify-center gap-2 text-xs font-medium border border-white/10 hover:bg-white/20 transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="p-2 bg-red-500/20 backdrop-blur-md rounded-lg text-red-500 border border-red-500/20 hover:bg-red-500/40 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    item.type === 'image' ? 'bg-neon-blue/20 text-neon-blue' : 'bg-neon-purple/20 text-neon-purple'
                  }`}>
                    {item.type}
                  </span>
                  <span className="text-[10px] text-gray-500 font-medium">{formatDate(item.createdAt)}</span>
                </div>
                <p className="text-sm font-medium line-clamp-2 text-gray-200">{item.prompt}</p>
                {item.metadata?.title && (
                  <div className="pt-3 border-t border-white/5">
                    <h5 className="text-xs font-bold text-gray-400 mb-1 flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> {item.metadata.title}
                    </h5>
                    <div className="flex flex-wrap gap-1">
                      {item.metadata.keywords?.slice(0, 3).map((k: string) => (
                        <span key={k} className="text-[10px] text-gray-500">#{k}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHistory.length === 0 && (
        <div className="text-center py-32 space-y-4">
           <div className="w-20 h-20 bg-white/5 border border-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Filter className="w-10 h-10 text-gray-600" />
           </div>
           <h3 className="text-2xl font-bold">No results found</h3>
           <p className="text-gray-500">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
}
