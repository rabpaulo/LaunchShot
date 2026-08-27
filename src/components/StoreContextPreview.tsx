'use client';

import React, { useState } from 'react';
import { useEditorStore } from '@/store/useEditorStore';
import { TARGET_SIZES } from '@/config/sizes';
import { IoChevronBack, IoShareOutline, IoStar, IoLogoApple, IoLogoGooglePlaystore, IoSearchOutline, IoClose, IoPhonePortraitOutline, IoTabletPortraitOutline } from 'react-icons/io5';
import { CanvasEditor } from './CanvasEditor';

export function StoreContextPreview({ onClose }: { onClose: () => void }) {
  const { canvases, globalSettings } = useEditorStore();
  const [storeType, setStoreType] = useState<'app-store' | 'play-store'>('app-store');
  const [previewDevice, setPreviewDevice] = useState<'phone-sm' | 'phone-lg' | 'tablet'>('phone-lg');

  const isDark = globalSettings.theme !== 'light';
  const sizeConfig = TARGET_SIZES[globalSettings.targetSize] || TARGET_SIZES['ios-6.5'];
  
  const deviceStyles = {
    'phone-sm': { width: 375, height: 667 },
    'phone-lg': { width: 428, height: 926 },
    'tablet': { width: 768, height: 1024 },
  };
  const activeDevice = deviceStyles[previewDevice];
  
  return (
    <div className={`fixed inset-0 z-[200] flex flex-col ${isDark ? 'bg-black text-white' : 'bg-[#f8fafc] text-gray-900'}`}>
      <div className={`flex items-center justify-between p-4 border-b ${isDark ? 'border-zinc-800' : 'border-gray-200'}`}>
        <button onClick={onClose} className="px-4 py-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700 transition-colors flex items-center gap-2">
          <IoClose className="w-5 h-5" />
          Close Preview
        </button>
        <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-lg p-1">
          <button 
            onClick={() => setStoreType('app-store')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${storeType === 'app-store' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <IoLogoApple className="w-4 h-4" /> App Store
          </button>
          <button 
            onClick={() => setStoreType('play-store')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${storeType === 'play-store' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
          >
            <IoLogoGooglePlaystore className="w-4 h-4" /> Google Play
          </button>
        </div>
        
        <div className="flex bg-zinc-200 dark:bg-zinc-900 rounded-lg p-1">
          <button 
            onClick={() => setPreviewDevice('phone-sm')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewDevice === 'phone-sm' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            title="Small Phone (iPhone SE)"
          >
            <IoPhonePortraitOutline className="w-3.5 h-3.5" /> Small
          </button>
          <button 
            onClick={() => setPreviewDevice('phone-lg')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewDevice === 'phone-lg' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            title="Large Phone (iPhone Pro Max)"
          >
            <IoPhonePortraitOutline className="w-4 h-4" /> Large
          </button>
          <button 
            onClick={() => setPreviewDevice('tablet')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${previewDevice === 'tablet' ? 'bg-white dark:bg-zinc-700 shadow-sm text-black dark:text-white' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`}
            title="Tablet (iPad)"
          >
            <IoTabletPortraitOutline className="w-4 h-4" /> Tablet
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto flex justify-center py-12">
        <div 
          className="transition-all duration-300 relative" 
          style={{ width: `${activeDevice.width}px`, height: `${activeDevice.height}px` }}
        >
          <div className="w-full h-full bg-white border rounded-[3rem] shadow-2xl overflow-hidden relative border-8 border-gray-100 flex flex-col">
          
          {storeType === 'app-store' && (
            <div className="h-full flex flex-col font-sans text-black">
              {/* Fake Status Bar */}
              <div className="h-14 w-full flex justify-between items-center px-8 text-xs font-bold pt-4">
                <span>9:41</span>
                <div className="flex space-x-1.5 items-center">
                  <div className="w-4 h-3 bg-current rounded-sm"></div>
                  <div className="w-4 h-3 bg-current rounded-sm"></div>
                  <div className="w-5 h-3 bg-current rounded-sm"></div>
                </div>
              </div>
              
              {/* App Header */}
              <div className="px-4 py-2 flex items-center justify-between pb-4">
                <div className="flex items-center text-blue-500">
                  <IoChevronBack className="w-6 h-6" />
                  <span className="font-semibold">Search</span>
                </div>
                <div className="w-10" />
              </div>

              <div className="flex-1 overflow-y-auto px-5 py-2">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-28 h-28 bg-gray-200 rounded-2xl overflow-hidden flex-shrink-0 shadow-sm border">
                    {canvases[0]?.appIconSrc && (
                      <img src={canvases[0].appIconSrc} alt="App Icon" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 pt-1">
                    <h2 className="font-bold text-[22px] leading-tight mb-1">Your App Name</h2>
                    <p className="text-gray-500 text-[15px] mb-1">The best app ever</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-6">
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">10K RATINGS</div>
                    <div className="font-bold text-[22px] text-gray-500">4.9</div>
                    <div className="flex items-center text-gray-400 justify-center text-[10px]"><IoStar/><IoStar/><IoStar/><IoStar/><IoStar/></div>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">AGE</div>
                    <div className="font-bold text-[22px] text-gray-500">4+</div>
                    <div className="text-gray-400 text-[10px]">Years Old</div>
                  </div>
                  <div className="w-px h-10 bg-gray-200" />
                  <div className="text-center">
                    <div className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">CHART</div>
                    <div className="font-bold text-[22px] text-gray-500">#1</div>
                    <div className="text-gray-400 text-[10px]">Productivity</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-8">
                  <button className="flex-1 bg-blue-500 text-white font-bold py-2 rounded-full text-sm">GET</button>
                  <button className="p-2 text-blue-500 border border-blue-500 rounded-full"><IoShareOutline className="w-5 h-5" /></button>
                </div>
                
                {/* Horizontal Scroll for Screenshots */}
                <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
                  {canvases.map((canvas, i) => (
                    <div 
                      key={canvas.id} 
                      className="snap-center overflow-hidden flex-shrink-0 relative"
                      style={{ 
                        width: '240px', 
                        aspectRatio: `${sizeConfig.logicalWidth} / ${sizeConfig.logicalHeight}` 
                      }}
                    >
                      <CanvasEditor canvas={canvas} index={i} total={canvases.length} targetWidth={240} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {storeType === 'play-store' && (
             <div className="h-full flex flex-col text-black">
             {/* Fake Status Bar */}
             <div className="h-10 w-full flex justify-between items-center px-6 text-xs font-medium pt-2 opacity-70">
               <span>9:41</span>
               <div className="flex space-x-1.5 items-center">
                 <span>LTE</span>
                 <div className="w-4 h-3 bg-current"></div>
               </div>
             </div>
             
             {/* App Header */}
             <div className="px-4 py-2 flex items-center gap-4 border-b pb-3">
               <IoChevronBack className="w-6 h-6" />
               <div className="flex-1" />
               <IoSearchOutline className="w-5 h-5" />
             </div>

             <div className="flex-1 overflow-y-auto px-5 py-4">
               <div className="flex items-center gap-5 mb-6">
                 <div className="w-20 h-20 bg-gray-200 rounded-xl overflow-hidden flex-shrink-0 shadow-sm border">
                   {canvases[0]?.appIconSrc && (
                     <img src={canvases[0].appIconSrc} alt="App Icon" className="w-full h-full object-cover" />
                   )}
                 </div>
                 <div className="flex-1">
                   <h2 className="font-medium text-2xl leading-tight mb-1">Your App Name</h2>
                   <p className="text-emerald-700 text-sm font-medium mb-1">Your Company Inc.</p>
                   <p className="text-gray-500 text-[11px]">Contains ads • In-app purchases</p>
                 </div>
               </div>

               <div className="flex justify-between items-center mb-6 px-2">
                  <div className="text-center">
                    <div className="font-bold text-sm flex items-center justify-center gap-1">4.9 <IoStar className="w-3 h-3 text-gray-700"/></div>
                    <div className="text-[10px] text-gray-500 mt-1">30K reviews</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center">
                    <div className="font-bold text-sm">1M+</div>
                    <div className="text-[10px] text-gray-500 mt-1">Downloads</div>
                  </div>
                  <div className="w-px h-8 bg-gray-200" />
                  <div className="text-center flex flex-col items-center">
                    <div className="w-4 h-4 bg-gray-300 rounded-sm mb-1 text-[8px] flex items-center justify-center font-bold">E</div>
                    <div className="text-[10px] text-gray-500 mt-1">Everyone</div>
                  </div>
               </div>

               <button className="w-full bg-emerald-600 text-white font-medium py-2 rounded-full mb-6 text-sm">
                 Install
               </button>
               
               {/* Horizontal Scroll for Screenshots */}
               <div className="flex overflow-x-auto gap-3 pb-4 snap-x hide-scrollbar">
                 {canvases.map((canvas, i) => (
                   <div 
                     key={canvas.id} 
                     className="snap-center overflow-hidden flex-shrink-0 relative"
                     style={{ 
                       width: '180px', 
                       aspectRatio: `${sizeConfig.logicalWidth} / ${sizeConfig.logicalHeight}` 
                     }}
                   >
                     <CanvasEditor canvas={canvas} index={i} total={canvases.length} targetWidth={180} />
                   </div>
                 ))}
               </div>
             </div>
           </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
