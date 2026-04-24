import React from 'react';
import { Sidebar } from './Sidebar';
import { motion, AnimatePresence } from 'motion/react';
import { useLocation } from 'react-router-dom';

export function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-premium-black">
      <Sidebar />
      <div className="flex-1 ml-[240px] flex flex-col h-screen overflow-hidden">
        {/* Top Bar */}
        <header className="h-[64px] flex items-center justify-between px-8 border-bottom border-white/5 relative z-20">
          <div className="flex items-center gap-4 flex-1">
             <div className="relative max-w-md w-full">
               <input 
                 type="text" 
                 placeholder="Search projects or metadata..." 
                 className="bg-transparent border-none text-white w-full text-sm outline-none placeholder:text-slate-500"
               />
             </div>
          </div>
          <div className="flex items-center gap-4">
             <button className="bg-white/5 text-white px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase border border-white/5 hover:bg-white/10 transition-all">
               Export CSV
             </button>
             <div className="neon-blue text-[10px] font-black tracking-widest">ENGINE V4.2</div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          <div className="fixed inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-deep-blue/5 blur-[120px] rounded-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
              className="relative z-10 h-full"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
