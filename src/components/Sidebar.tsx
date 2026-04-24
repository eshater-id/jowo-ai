import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ImageIcon, Video, History, LogOut, Settings, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: ImageIcon, label: 'Image AI', path: '/generate-image' },
    { icon: Video, label: 'Video AI', path: '/generate-video' },
    { icon: History, label: 'History', path: '/history' },
  ];

  return (
    <aside className="w-[240px] bg-premium-gray border-r border-white/5 flex flex-col h-screen fixed left-0 top-0 z-50 p-6">
      <div className="flex items-center gap-3 mb-12">
        <div className="w-8 h-8 rounded-lg neon-bg" />
        <span className="text-xl font-extrabold tracking-tighter uppercase">JOWO<span className="neon-blue">AI</span></span>
      </div>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium text-sm",
                isActive 
                  ? "bg-neon-blue/10 text-neon-blue" 
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden" />
          <div>
            <div className="text-sm font-semibold">Alex Rivera</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Pro Plan • 1.2k Credits</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
