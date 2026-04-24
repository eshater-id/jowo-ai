import React, { useState } from 'react';
import { aiService, HistoryItem } from '../services/aiService';
import { Loader2, Download, Share2, Sparkles, Wand2, Info, Search, ImageIcon, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUpscaling, setIsUpscaling] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<any>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');

  const handleGenerate = async () => {
    if (!prompt) return;
    setIsLoading(true);
    try {
      const imageUrl = await aiService.generateImage({ prompt, aspectRatio: aspectRatio as any });
      const meta = await aiService.generateMetadata(prompt, 'image');
      
      setResult(imageUrl);
      setMetadata(meta);

      // Save to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        type: 'image',
        prompt,
        url: imageUrl,
        createdAt: new Date().toISOString(),
        metadata: meta,
      };

      const saved = localStorage.getItem('jowo-history');
      const history = saved ? JSON.parse(saved) : [];
      localStorage.setItem('jowo-history', JSON.stringify([newItem, ...history]));
    } catch (error) {
      alert("Failed to generate image. Please check your API key and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpscale = async () => {
    if (!result) return;
    setIsUpscaling(true);
    try {
      const upscaledUrl = await aiService.upscaleImage(result);
      setResult(upscaledUrl);
    } catch (error) {
      alert("Upscaling failed. Please try again.");
    } finally {
      setIsUpscaling(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const link = document.createElement('a');
    link.href = result;
    link.download = `jowo-ai-${Date.now()}.png`;
    link.click();
  };

  const aspectRatios = [
    { label: 'Cinematic', value: '16:9' },
    { label: 'Vertical', value: '9:16' },
    { label: 'Square', value: '1:1' },
    { label: 'Classic', value: '4:3' },
  ];

  return (
    <div className="max-w-[1400px] mx-auto h-full flex flex-col">
      <div className="flex-1 flex gap-8">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="glass-card flex-1 flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight">Synthesize Vision</h2>
                <p className="text-sm text-slate-500 mt-1">Enter a prompt to generate AI-powered cinematic visuals.</p>
              </div>
            </div>

            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Cyberpunk skyscraper at night, volumetric lighting, hyper-realistic, 8k resolution, cinematic atmosphere..."
              className="input-glass h-32 resize-none text-base"
            />

            <div className="grid grid-cols-3 gap-6">
              <div>
                <label className="meta-label">Aspect Ratio</label>
                <select 
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="input-glass w-full"
                >
                  {aspectRatios.map(r => (
                    <option key={r.value} value={r.value}>{r.label} ({r.value})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="meta-label">Style Model</label>
                <select className="input-glass w-full">
                  <option>Realistic Photonic</option>
                  <option>Digital Concept</option>
                  <option>Oil Painting</option>
                </select>
              </div>
              <div>
                <label className="meta-label">Sampling</label>
                <select className="input-glass w-full">
                  <option>30 Steps (Fast)</option>
                  <option>50 Steps (Standard)</option>
                  <option>100 Steps (HD)</option>
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
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-5 h-5" />
                    Generate Masterpiece
                  </>
                )}
              </button>
              <button className="glass w-14 h-14 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all">
                <Download className="w-6 h-6 text-slate-400" />
              </button>
            </div>
          </div>

          <AnimatePresence>
            {metadata && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-6 rounded-2xl grid grid-cols-2 gap-8 border-l-4 border-l-neon-blue"
              >
                <div>
                   <label className="meta-label">AI Description</label>
                   <p className="text-sm font-medium leading-relaxed">{metadata.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 items-start content-start">
                   {metadata.keywords?.map((k: string) => (
                     <span key={k} className="px-2 py-1 bg-white/5 rounded-lg border border-white/5 text-[10px] font-bold text-slate-400 uppercase">
                       {k}
                     </span>
                   ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Panel */}
        <aside className="w-[400px] flex flex-col gap-6">
           <div className="glass-card flex-1 flex flex-col relative overflow-hidden bg-premium-gray/50">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500">Live Result</h3>
                {result && (
                  <div className="flex gap-2">
                    <button 
                      onClick={handleUpscale}
                      disabled={isUpscaling}
                      className="p-2 glass rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all"
                    >
                      {isUpscaling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={handleDownload} className="p-2 glass rounded-lg hover:bg-neon-blue/10 hover:text-neon-blue transition-all">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="flex-1 flex items-center justify-center relative">
                 <AnimatePresence mode="wait">
                   {result ? (
                     <motion.div
                       key="result"
                       initial={{ opacity: 0, scale: 0.9 }}
                       animate={{ opacity: 1, scale: 1 }}
                       className="relative w-full h-full flex items-center justify-center"
                     >
                       <img src={result} alt="AI Result" className="max-w-full max-h-[500px] rounded-xl shadow-2xl border border-white/5" referrerPolicy="no-referrer" />
                       {isUpscaling && (
                         <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 border-2 border-neon-blue/20 border-t-neon-blue rounded-full animate-spin mb-4" />
                            <p className="text-sm font-bold neon-blue uppercase tracking-widest">Enhancing Details</p>
                            <p className="text-xs text-slate-500 mt-2">Multiplying pixel density via neural engine...</p>
                         </div>
                       )}
                     </motion.div>
                   ) : (
                     <div className="text-center p-8 space-y-4">
                        <div className="w-16 h-16 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                           <Sparkles className="w-8 h-8 text-slate-700" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Render queue empty</p>
                     </div>
                   )}
                 </AnimatePresence>
              </div>
           </div>
        </aside>
      </div>
    </div>
  );
}
