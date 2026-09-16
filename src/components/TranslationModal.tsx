'use client';

import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import {
  IoClose,
  IoGlobeOutline,
  IoSparklesOutline,
  IoDownloadOutline,
  IoCloudUploadOutline,
  IoCopyOutline,
  IoSyncOutline,
  IoCheckmark,
  IoDocumentTextOutline,
} from 'react-icons/io5';
import toast from 'react-hot-toast';
import { useEditorStore, CanvasItem } from '@/store/useEditorStore';
import { SUPPORTED_LANGUAGES, getLanguageByCode } from '@/config/languages';
import {
  translateText,
  batchTranslateCanvases,
  batchTranslateAllLanguages,
  exportSingleLanguageJson,
  exportAllLanguagesJson,
  downloadTranslationTemplate,
  parseUploadedTranslationJson,
} from '@/utils/translator';

interface TranslationModalProps {
  onClose: () => void;
}

export function TranslationModal({ onClose }: TranslationModalProps) {
  const {
    canvases,
    globalSettings,
    batchUpdateTranslations,
  } = useEditorStore();

  const isDark = globalSettings.theme !== 'light';
  const currentActiveLanguage = globalSettings.activeLanguage || 'en';

  const [selectedLang, setSelectedLang] = useState<string>(currentActiveLanguage);
  const [isTranslatingCurrent, setIsTranslatingCurrent] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [translationProgress, setTranslationProgress] = useState<{ current: number; total: number } | null>(null);
  const [localTranslations, setLocalTranslations] = useState<Record<string, Record<string, { title: string; subtitle: string }>>>(() => {
    const initial: Record<string, Record<string, { title: string; subtitle: string }>> = {};
    for (const lang of SUPPORTED_LANGUAGES) {
      initial[lang.code] = {};
      canvases.forEach((canvas) => {
        const trans = canvas.translations?.[lang.code];
        initial[lang.code][canvas.id] = {
          title: trans?.title ?? (lang.code === 'en' ? canvas.title : ''),
          subtitle: trans?.subtitle ?? (lang.code === 'en' ? canvas.subtitle : ''),
        };
      });
    }
    return initial;
  });

  const [singleTranslateLoading, setSingleTranslateLoading] = useState<Record<string, boolean>>({});

  const selectedLangObj = getLanguageByCode(selectedLang) || SUPPORTED_LANGUAGES[0];

  // Helper to get translated slide counts
  const getTranslatedCount = (langCode: string) => {
    const langData = localTranslations[langCode];
    if (!langData) return 0;
    return Object.values(langData).filter((item) => item.title.trim() !== '').length;
  };

  // Update a single field in local state
  const handleInputChange = (canvasId: string, field: 'title' | 'subtitle', value: string) => {
    setLocalTranslations((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [canvasId]: {
          ...(prev[selectedLang]?.[canvasId] || { title: '', subtitle: '' }),
          [field]: value,
        },
      },
    }));
  };

  // Auto-translate a single slide for the selected language
  const handleTranslateSingleSlide = async (canvas: CanvasItem) => {
    const sourceTitle = localTranslations['en']?.[canvas.id]?.title || canvas.title;
    const sourceSubtitle = localTranslations['en']?.[canvas.id]?.subtitle || canvas.subtitle;

    setSingleTranslateLoading((prev) => ({ ...prev, [canvas.id]: true }));

    try {
      const [transTitle, transSubtitle] = await Promise.all([
        sourceTitle ? translateText(sourceTitle, selectedLang, 'en') : Promise.resolve(''),
        sourceSubtitle ? translateText(sourceSubtitle, selectedLang, 'en') : Promise.resolve(''),
      ]);

      setLocalTranslations((prev) => ({
        ...prev,
        [selectedLang]: {
          ...prev[selectedLang],
          [canvas.id]: {
            title: transTitle,
            subtitle: transSubtitle,
          },
        },
      }));
      toast.success(`Slide translated to ${selectedLangObj.name}!`);
    } catch {
      toast.error('Translation failed. Please try again.');
    } finally {
      setSingleTranslateLoading((prev) => ({ ...prev, [canvas.id]: false }));
    }
  };

  // Copy English source text into current language
  const handleCopyFromSource = (canvas: CanvasItem) => {
    const sourceTitle = localTranslations['en']?.[canvas.id]?.title || canvas.title;
    const sourceSubtitle = localTranslations['en']?.[canvas.id]?.subtitle || canvas.subtitle;

    setLocalTranslations((prev) => ({
      ...prev,
      [selectedLang]: {
        ...prev[selectedLang],
        [canvas.id]: {
          title: sourceTitle,
          subtitle: sourceSubtitle,
        },
      },
    }));
    toast.success('Copied from English source');
  };

  // Auto-translate all slides for current selected language
  const handleTranslateSelectedLanguage = async () => {
    if (canvases.length === 0) {
      toast.error('No canvases to translate.');
      return;
    }

    setIsTranslatingCurrent(true);
    try {
      const preparedCanvases: CanvasItem[] = canvases.map((c) => ({
        ...c,
        title: localTranslations['en']?.[c.id]?.title || c.title,
        subtitle: localTranslations['en']?.[c.id]?.subtitle || c.subtitle,
      }));

      const results = await batchTranslateCanvases(preparedCanvases, selectedLang);

      setLocalTranslations((prev) => {
        const updatedLangMap = { ...(prev[selectedLang] || {}) };
        results.forEach((item) => {
          updatedLangMap[item.id] = {
            title: item.title,
            subtitle: item.subtitle,
          };
        });
        return {
          ...prev,
          [selectedLang]: updatedLangMap,
        };
      });

      toast.success(`Successfully translated all slides to ${selectedLangObj.name}!`);
    } catch {
      toast.error('Auto-translation failed. Please check network connection.');
    } finally {
      setIsTranslatingCurrent(false);
    }
  };

  // Auto-translate across all supported languages
  const handleTranslateAllLanguages = async () => {
    if (canvases.length === 0) {
      toast.error('No canvases to translate.');
      return;
    }

    setIsTranslatingAll(true);
    const targetLangs = SUPPORTED_LANGUAGES.map((l) => l.code).filter((code) => code !== 'en');
    setTranslationProgress({ current: 0, total: targetLangs.length * canvases.length });

    try {
      const preparedCanvases: CanvasItem[] = canvases.map((c) => ({
        ...c,
        title: localTranslations['en']?.[c.id]?.title || c.title,
        subtitle: localTranslations['en']?.[c.id]?.subtitle || c.subtitle,
      }));

      const results = await batchTranslateAllLanguages(preparedCanvases, targetLangs, (current, total) => {
        setTranslationProgress({ current, total });
      });

      setLocalTranslations((prev) => {
        const updated = { ...prev };
        for (const [lang, items] of Object.entries(results)) {
          updated[lang] = updated[lang] || {};
          items.forEach((item) => {
            updated[lang][item.id] = {
              title: item.title,
              subtitle: item.subtitle,
            };
          });
        }
        return updated;
      });

      toast.success('All languages translated successfully!');
    } catch {
      toast.error('Batch translation failed.');
    } finally {
      setIsTranslatingAll(false);
      setTranslationProgress(null);
    }
  };

  // Save changes to store and apply active language
  const handleSaveAndApply = () => {
    batchUpdateTranslations(localTranslations, selectedLang);
    toast.success(`Saved translations and set ${selectedLangObj.name} as active!`);
    onClose();
  };

  // Upload JSON Translations
  const handleUploadJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = parseUploadedTranslationJson(text);

      if (result.type === 'single') {
        const items = result.data;
        setLocalTranslations((prev) => {
          const langMap = { ...(prev[selectedLang] || {}) };
          canvases.forEach((c, idx) => {
            if (items[idx]) {
              langMap[c.id] = {
                title: items[idx].title || '',
                subtitle: items[idx].subtitle || '',
              };
            }
          });
          return { ...prev, [selectedLang]: langMap };
        });
        toast.success(`Imported translations for ${selectedLangObj.name}!`);
      } else if (result.type === 'multi') {
        const multiData = result.data;
        setLocalTranslations((prev) => {
          const updated = { ...prev };
          for (const [lang, items] of Object.entries(multiData)) {
            updated[lang] = updated[lang] || {};
            canvases.forEach((c, idx) => {
              if (items[idx]) {
                updated[lang][c.id] = {
                  title: items[idx].title || '',
                  subtitle: items[idx].subtitle || '',
                };
              }
            });
          }
          return updated;
        });
        toast.success(`Imported translations for ${Object.keys(multiData).length} languages!`);
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to parse JSON file.');
    }

    if (e.target) e.target.value = '';
  };

  // Convert current local state into canvas items format for export
  const getPreparedCanvasesForExport = (): CanvasItem[] => {
    return canvases.map((c) => {
      const trans: Record<string, { title: string; subtitle: string }> = {};
      for (const [lang, map] of Object.entries(localTranslations)) {
        if (map[c.id]) {
          trans[lang] = map[c.id];
        }
      }
      return {
        ...c,
        translations: trans,
      };
    });
  };

  if (typeof document === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/65 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div
        className={`w-full max-w-5xl h-[88vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col border-[1.5px] ${
          isDark ? 'bg-[#141c18] border-[#34443a] text-[#f3f6f4]' : 'bg-white border-[#c5cec2] text-[#14201d]'
        }`}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between px-6 py-4 border-b-[1.5px] flex-shrink-0 ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border flex-shrink-0 ${
              isDark
                ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40'
                : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
            }`}>
              <IoGlobeOutline className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold">Screenshot Translations & Localization</h2>
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-semibold border ${
                    isDark
                      ? 'bg-[#1b2620] border-[#34443a] text-[#a3b2aa]'
                      : 'bg-[#f2f5ee] border-[#c5cec2] text-[#4a5752]'
                  }`}
                >
                  {canvases.length} {canvases.length === 1 ? 'Slide' : 'Slides'}
                </span>
              </div>
              <p className={`text-xs mt-0.5 ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
                Translate your screenshot headlines and descriptions for global App Store & Google Play listings
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border-[1.5px] transition-all ${
                isDark
                  ? 'border-[#44594c] hover:bg-[#283a2f] text-[#f3f6f4]'
                  : 'border-[#b6c4b2] hover:bg-[#e7efe3] text-[#14201d]'
              }`}
            >
              <IoClose className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub-header / Languages Scroll Bar */}
        <div
          className={`px-6 py-3 border-b-[1.5px] flex items-center gap-2 overflow-x-auto scrollbar-hide flex-shrink-0 ${
            isDark ? 'border-[#34443a] bg-[#111814]/50' : 'border-[#c5cec2] bg-[#f8f9f5]/50'
          }`}
        >
          <span className={`text-[10px] font-bold tracking-[1.5px] uppercase mr-1 flex-shrink-0 ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
            Language:
          </span>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = selectedLang === lang.code;
            const count = getTranslatedCount(lang.code);
            const isAllTranslated = count === canvases.length && canvases.length > 0;
            const isActiveCanvasLang = currentActiveLanguage === lang.code;

            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLang(lang.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all flex-shrink-0 border-[1.5px] ${
                  isSelected
                    ? isDark
                      ? 'bg-[#2e855c] border-[#2e855c] text-white shadow-sm font-bold'
                      : 'bg-[#1f5c3f] border-[#1f5c3f] text-white shadow-sm font-bold'
                    : isDark
                    ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:border-[#73aa84]'
                    : 'bg-white border-[#b6c4b2] text-[#14201d] hover:border-[#4a7855]'
                }`}
              >
                <span>{lang.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                    isSelected
                      ? isDark
                        ? 'bg-[#203828] text-white'
                        : 'bg-[#16452f] text-white'
                      : isAllTranslated
                      ? isDark
                        ? 'bg-[#203828] text-[#73aa84]'
                        : 'bg-[#e8f1e2] text-[#1f5c3f]'
                      : count > 0
                      ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
                      : isDark
                      ? 'bg-[#1b2620] text-[#a3b2aa]'
                      : 'bg-[#f2f5ee] text-[#4a5752]'
                  }`}
                >
                  {count}/{canvases.length}
                </span>
                {isActiveCanvasLang && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ring-2 ring-emerald-400/20" title="Active on canvas" />
                )}
              </button>
            );
          })}
        </div>

        {/* Top Controls & Batch Actions Bar */}
        <div
          className={`px-6 py-3 border-b-[1.5px] flex flex-wrap items-center justify-between gap-3 flex-shrink-0 ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold flex items-center gap-2">
              <span>{selectedLangObj.name}</span>
              <span className={`text-xs font-normal ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
                ({selectedLangObj.nativeName})
              </span>
            </span>

            {currentActiveLanguage === selectedLang ? (
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                isDark
                  ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40'
                  : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
              }`}>
                Active on Canvas
              </span>
            ) : (
              <button
                onClick={() => {
                  batchUpdateTranslations(localTranslations, selectedLang);
                  toast.success(`Set ${selectedLangObj.name} as active canvas language!`);
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border-[1.5px] transition-all ${
                  isDark
                    ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:border-[#73aa84]'
                    : 'bg-white border-[#b6c4b2] text-[#14201d] hover:border-[#4a7855]'
                }`}
              >
                Set as Active
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Auto Translate Single Language */}
            <button
              onClick={handleTranslateSelectedLanguage}
              disabled={isTranslatingCurrent || isTranslatingAll}
              className={`px-3 py-1.5 rounded-xl border-[1.5px] text-xs font-bold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#203828] border-[#73aa84]/40 text-[#73aa84] hover:bg-[#283a2f]'
                  : 'bg-[#e8f1e2] border-[#4a7855]/40 text-[#1f5c3f] hover:bg-[#e7efe3]'
              } disabled:opacity-50`}
            >
              {isTranslatingCurrent ? (
                <IoSyncOutline className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <IoSparklesOutline className="w-3.5 h-3.5" />
              )}
              <span>Auto-Translate {selectedLangObj.name}</span>
            </button>

            {/* Auto Translate All Languages */}
            <button
              onClick={handleTranslateAllLanguages}
              disabled={isTranslatingCurrent || isTranslatingAll}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 text-white ${
                isDark
                  ? 'bg-[#2e855c] border-[#2e855c] hover:bg-[#38a16f]'
                  : 'bg-[#1f5c3f] border-[#1f5c3f] hover:bg-[#16452f]'
              } disabled:opacity-50`}
            >
              {isTranslatingAll ? (
                <IoSyncOutline className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <IoSparklesOutline className="w-3.5 h-3.5" />
              )}
              <span>Auto-Translate All Languages</span>
            </button>

            {/* Import JSON */}
            <input
              type="file"
              id="translation-modal-import"
              accept=".json"
              onChange={handleUploadJson}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('translation-modal-import')?.click()}
              className={`px-3 py-1.5 rounded-xl border-[1.5px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:bg-[#283a2f] hover:border-[#73aa84]'
                  : 'bg-white border-[#b6c4b2] text-[#14201d] hover:bg-[#e7efe3] hover:border-[#4a7855]'
              }`}
            >
              <IoCloudUploadOutline className="w-3.5 h-3.5" />
              <span>Import JSON</span>
            </button>

            {/* Export Dropdown / Buttons */}
            <button
              onClick={() => {
                const prepared = getPreparedCanvasesForExport();
                exportSingleLanguageJson(prepared, selectedLang, globalSettings.appName || 'app');
                toast.success(`Exported ${selectedLangObj.name} translations JSON!`);
              }}
              className={`px-3 py-1.5 rounded-xl border-[1.5px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:bg-[#283a2f] hover:border-[#73aa84]'
                  : 'bg-white border-[#b6c4b2] text-[#14201d] hover:bg-[#e7efe3] hover:border-[#4a7855]'
              }`}
            >
              <IoDownloadOutline className="w-3.5 h-3.5" />
              <span>Export JSON ({selectedLang.toUpperCase()})</span>
            </button>

            <button
              onClick={() => {
                const prepared = getPreparedCanvasesForExport();
                exportAllLanguagesJson(prepared, globalSettings.appName || 'app');
                toast.success('Exported all languages translations JSON!');
              }}
              className={`px-3 py-1.5 rounded-xl border-[1.5px] text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:bg-[#283a2f] hover:border-[#73aa84]'
                  : 'bg-white border-[#b6c4b2] text-[#14201d] hover:bg-[#e7efe3] hover:border-[#4a7855]'
              }`}
            >
              <IoDownloadOutline className="w-3.5 h-3.5" />
              <span>Export All JSON</span>
            </button>

            <button
              onClick={() => {
                downloadTranslationTemplate(canvases);
                toast.success('Downloaded translation template JSON!');
              }}
              title="Download empty JSON template structure"
              className={`p-2 rounded-xl border-[1.5px] text-xs font-semibold transition-all ${
                isDark
                  ? 'bg-[#1d2922] border-[#44594c] text-[#a3b2aa] hover:text-[#f3f6f4] hover:bg-[#283a2f]'
                  : 'bg-white border-[#b6c4b2] text-[#4a5752] hover:text-[#14201d] hover:bg-[#e7efe3]'
              }`}
            >
              <IoDocumentTextOutline className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Translation Progress Indicator */}
        {translationProgress && (
          <div
            className={`px-6 py-2 border-b-[1.5px] flex items-center justify-between text-xs ${
              isDark ? 'bg-[#203828]/60 border-[#73aa84]/40 text-[#73aa84]' : 'bg-[#e8f1e2] border-[#4a7855]/30 text-[#1f5c3f]'
            }`}
          >
            <div className="flex items-center gap-2">
              <IoSyncOutline className={`w-4 h-4 animate-spin ${isDark ? 'text-[#73aa84]' : 'text-[#1f5c3f]'}`} />
              <span>Translating all languages in progress...</span>
            </div>
            <span className="font-mono font-bold">
              {Math.round((translationProgress.current / translationProgress.total) * 100)}% ({translationProgress.current} / {translationProgress.total})
            </span>
          </div>
        )}

        {/* Main Content: Slides List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {canvases.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <IoGlobeOutline className={`w-12 h-12 mb-3 ${isDark ? 'text-[#34443a]' : 'text-[#c5cec2]'}`} />
              <h3 className="font-bold text-base mb-1">No screenshot slides found</h3>
              <p className={`text-xs max-w-sm ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
                Add slides to your canvas or upload screenshots in the studio to start translating.
              </p>
            </div>
          ) : (
            canvases.map((canvas, index) => {
              const currentValues = localTranslations[selectedLang]?.[canvas.id] || {
                title: selectedLang === 'en' ? canvas.title : '',
                subtitle: selectedLang === 'en' ? canvas.subtitle : '',
              };
              const enSourceTitle = localTranslations['en']?.[canvas.id]?.title || canvas.title;
              const enSourceSubtitle = localTranslations['en']?.[canvas.id]?.subtitle || canvas.subtitle;
              const isSlideTranslating = singleTranslateLoading[canvas.id];

              return (
                <div
                  key={canvas.id}
                  className={`p-5 rounded-2xl border-[1.5px] transition-all ${
                    isDark ? 'bg-[#141c18] border-[#34443a] hover:border-[#4e6557]' : 'bg-[#f8f9f5] border-[#c5cec2] hover:border-[#8fa895]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center border ${
                        isDark
                          ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40'
                          : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
                      }`}>
                        {index + 1}
                      </span>
                      <h4 className="font-bold text-sm">Slide {index + 1}</h4>
                      <span className={`text-[11px] font-mono ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
                        Layout: {canvas.layout}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {selectedLang !== 'en' && (
                        <>
                          <button
                            onClick={() => handleCopyFromSource(canvas)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border-[1.5px] flex items-center gap-1.5 transition-all ${
                              isDark
                                ? 'bg-[#1d2922] border-[#44594c] text-[#f3f6f4] hover:bg-[#283a2f]'
                                : 'bg-white border-[#b6c4b2] text-[#14201d] hover:bg-[#e7efe3]'
                            }`}
                            title="Copy text from English source"
                          >
                            <IoCopyOutline className="w-3.5 h-3.5" />
                            <span>Copy English</span>
                          </button>

                          <button
                            onClick={() => handleTranslateSingleSlide(canvas)}
                            disabled={isSlideTranslating}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border-[1.5px] flex items-center gap-1.5 transition-all ${
                              isDark
                                ? 'bg-[#203828] border-[#73aa84]/40 text-[#73aa84] hover:bg-[#283a2f]'
                                : 'bg-[#e8f1e2] border-[#4a7855]/30 text-[#1f5c3f] hover:bg-[#e7efe3]'
                            } disabled:opacity-50`}
                          >
                            {isSlideTranslating ? (
                              <IoSyncOutline className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <IoSparklesOutline className="w-3.5 h-3.5" />
                            )}
                            <span>Auto-Translate</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Source Reference Column (English) */}
                    {selectedLang !== 'en' && (
                      <div
                        className={`p-3.5 rounded-xl border-[1.5px] text-xs space-y-2.5 ${
                          isDark ? 'bg-[#111814] border-[#34443a] text-[#a3b2aa]' : 'bg-white border-[#c5cec2] text-[#4a5752]'
                        }`}
                      >
                        <div className={`flex items-center justify-between text-[10px] font-bold uppercase tracking-wider ${
                          isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'
                        }`}>
                          <span>English (Source Reference)</span>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-0.5">Title:</span>
                          <p className={`font-semibold ${isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}`}>{enSourceTitle || 'No title'}</p>
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-bold text-zinc-500 mb-0.5">Subtitle:</span>
                          <p className={isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}>{enSourceSubtitle || 'No subtitle'}</p>
                        </div>
                      </div>
                    )}

                    {/* Target Language Translation Column */}
                    <div className={`${selectedLang === 'en' ? 'md:col-span-2' : ''} space-y-3`}>
                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}`}>
                          Title ({selectedLangObj.name}):
                        </label>
                        <input
                          type="text"
                          value={currentValues.title}
                          onChange={(e) => handleInputChange(canvas.id, 'title', e.target.value)}
                          placeholder={`Enter headline in ${selectedLangObj.name}...`}
                          dir={selectedLangObj.direction || 'ltr'}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs font-semibold border-[1.5px] transition-all outline-none ${
                            isDark
                              ? 'bg-[#1b2620] border-[#44594c] text-[#f3f6f4] placeholder-[#a3b2aa] focus:border-[#73aa84] focus:ring-2 focus:ring-[#2e855c]/25'
                              : 'bg-white border-[#b6c4b2] text-[#14201d] placeholder-[#4a5752] focus:border-[#1f5c3f] focus:ring-2 focus:ring-[#1f5c3f]/20'
                          }`}
                        />
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1 ${isDark ? 'text-[#f3f6f4]' : 'text-[#14201d]'}`}>
                          Subtitle ({selectedLangObj.name}):
                        </label>
                        <textarea
                          value={currentValues.subtitle}
                          onChange={(e) => handleInputChange(canvas.id, 'subtitle', e.target.value)}
                          placeholder={`Enter description in ${selectedLangObj.name}...`}
                          dir={selectedLangObj.direction || 'ltr'}
                          rows={2}
                          className={`w-full px-3.5 py-2 rounded-xl text-xs font-medium border-[1.5px] transition-all resize-none outline-none ${
                            isDark
                              ? 'bg-[#1b2620] border-[#44594c] text-[#f3f6f4] placeholder-[#a3b2aa] focus:border-[#73aa84] focus:ring-2 focus:ring-[#2e855c]/25'
                              : 'bg-white border-[#b6c4b2] text-[#14201d] placeholder-[#4a5752] focus:border-[#1f5c3f] focus:ring-2 focus:ring-[#1f5c3f]/20'
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          className={`px-6 py-4 border-t-[1.5px] flex items-center justify-between flex-shrink-0 ${
            isDark ? 'border-[#34443a] bg-[#111814]' : 'border-[#c5cec2] bg-[#f8f9f5]'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className={`text-xs ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`}>
              Selected language: <strong className={isDark ? 'text-white' : 'text-black'}>{selectedLangObj.name}</strong>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border-[1.5px] ${
                isDark ? 'border-[#44594c] text-[#a3b2aa] hover:bg-[#1d2922] hover:text-[#f3f6f4]' : 'border-[#b6c4b2] text-[#4a5752] hover:bg-[#e7efe3] hover:text-[#14201d]'
              }`}
            >
              Cancel
            </button>

            <button
              onClick={handleSaveAndApply}
              className={`px-5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm text-white ${
                isDark
                  ? 'bg-[#2e855c] hover:bg-[#38a16f] border border-[#2e855c]'
                  : 'bg-[#1f5c3f] hover:bg-[#16452f] border border-[#1f5c3f]'
              }`}
            >
              <IoCheckmark className="w-4 h-4" />
              <span>Apply & Save Translations</span>
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
