import React, { useEffect, useState } from 'react';
import { HistoryItem } from '../services/aiService';
import { LayoutDashboard, ImageIcon, Video, Clock, TrendingUp, Sparkles } from 'lucide-react';
import { formatDate } from '../lib/utils';
import { motion } from 'motion/react';

export default function Dashboard() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('jowo-history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const stats = [
    { label: 'Total Projects', value: history.length, icon: LayoutDashboard, color: 'text-neon-blue' },
    { label: 'Images Created', value: history.filter(h => h.type === 'image').length, icon: ImageIcon, color: 'text-purple-400' },
    { label: 'Videos Created', value: history.filter(h => h.type === 'video').length, icon: Video, color: 'text-pink-400' },
    { label: 'Active time', value: '12h', icon: Clock, color: 'text-green-400' },
  ];

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome Back, Voyager</h1>
        <p className="text-gray-400">Explore the boundaries of your imagination with AI.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card hover:scale-[1.02]"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={stat.color}>
                <stat.icon className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-blue" />
                Recent Projects
              </h3>
              <button className="text-sm text-neon-blue hover:underline">View all</button>
            </div>

            <div className="space-y-4">
              {history.length === 0 ? (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-white/5 rounded-2xl">
                  No projects yet. Start creating!
                </div>
              ) : (
                history.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-all">
                    <img src={item.url} alt={item.prompt} className="w-16 h-16 rounded-lg object-cover" referrerPolicy="no-referrer" />
                    <div className="flex-1 overflow-hidden">
                      <h4 className="font-medium truncate">{item.prompt}</h4>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                        <span className="px-2 py-0.5 rounded bg-white/10 uppercase">{item.type}</span>
                        <span>{formatDate(item.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card bg-gradient-to-br from-neon-blue/20 to-neon-purple/20 border-neon-blue/20">
            <h3 className="text-xl font-bold mb-4">Pro Plan</h3>
            <p className="text-sm text-gray-300 mb-6">
              Unlock unlimited high-quality generations, 4K rendering, and cloud priority.
            </p>
            <button className="neo-button w-full">Upgrade Now</button>
          </div>
        </div>
      </div>
    </div>
  );
}
