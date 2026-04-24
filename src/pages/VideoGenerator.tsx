import React, { useState } from 'react';
import { aiService, HistoryItem } from '../services/aiService';
import { Loader2, Download, Share2, Sparkles, Wand2, Video, Clapperboard, MonitorPlay } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function VideoGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [metadata, setMetadata] = useState<any>(null);

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const operation = await aiService.generateVideo(prompt);
      const meta = await aiService.generateMetadata(prompt, 'video');
      
      setResult(operation);
      setMetadata(meta);
    } catch (error: any) {
      if (error.message.includes('API key')) {
        alert("Video generation (Veo) requires a user-provided API key. Please configure it in your environment.");
      } else {
        alert("Failed to initiate video generation.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex-1 flex gap-8">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="glass-card flex-1 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">Synthesize Motion</h2>
              <p className="text-sm text-slate-500 mt-1">Cinematic video synthesis powered by Veo-3.1 engine.</p>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A slow-motion drone shot of a misty emerald forest with ancient ruins emerging from the trees at sunrise..."
              className="input-glass h-40 resize-none text-base"
            />

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="meta-label">Output Aspect</label>
                <select className="input-glass w-full">
                  <option>16:9 Cinematic</option>
                  <option>9:16 Portrait</option>
                  <option>1:1 Social</option>
                </select>
              </div>
              <div>
                <label className="meta-label">Frame Rate</label>
                <select className="input-glass w-full">
                  <option>24 FPS (Film)</option>
                  <option>30 FPS (Standard)</option>
                  <option>60 FPS (High-Fidelity)</option>
                </select>
              </div>
            </div>

            <div className="mt-auto flex gap-4">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt}
                className="neo-button flex-1 h-14 text-lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Clapperboard className="w-5 h-5" />
                    Synthesize Masterpiece
                  </>
                )}
              </button>
            </div>
          </div>

          <AnimatePresence>
            {metadata && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl border-l-4 border-l-neon-deep-blue"
              >
                <label className="meta-label">Cinematic Brief</label>
                <p className="text-sm italic text-slate-400">"{metadata.description}"</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Status Panel */}
        <aside className="w-[400px] flex flex-col gap-6">
           <div className="glass-card flex-1 flex flex-col bg-premium-gray/50">
              <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Render Terminal</h3>
              
              <div className="flex-1 flex items-center justify-center">
                 {result ? (
                   <div className="text-center p-8 space-y-6">
                      <div className="w-20 h-20 bg-neon-blue/20 rounded-full flex items-center justify-center mx-auto animate-pulse">
                         <MonitorPlay className="w-10 h-10 text-neon-blue" />
                      </div>
                      <div className="space-y-2">
                         <h3 className="text-xl font-bold">Synthesizing...</h3>
                         <p className="text-xs text-slate-500 max-w-[200px] mx-auto italic font-mono">
                           Neural engine is fabricating temporal layers. This typically takes 240-300s.
                         </p>
                      </div>
                      <div className="p-3 glass rounded-xl text-[10px] font-mono text-neon-blue overflow-hidden truncate">
                        ID: {result.id}
                      </div>
                   </div>
                 ) : (
                   <div className="text-center space-y-4 max-w-[240px]">
                      <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                         <Video className="w-8 h-8 text-slate-700" />
                      </div>
                      <p className="text-slate-500 text-sm font-medium leading-relaxed">
                        Specify cinematic parameters in the synthesize panel to start the render.
                      </p>
                   </div>
                 )}
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
