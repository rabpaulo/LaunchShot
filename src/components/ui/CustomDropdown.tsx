import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export interface DropdownOption {
  label: string;
  value: string | number;
  category?: string;
  fontFamily?: string; // specific for fonts
  badge?: string; // optional badge pill
  iconSrc?: string; // optional logo/icon data URI
}

interface CustomDropdownProps {
  value: string | number;
  options: DropdownOption[];
  onChange: (value: string | number) => void;
  isDark?: boolean;
  placeholder?: string;
  className?: string;
}

export function CustomDropdown({
  value,
  options,
  onChange,
  isDark = false,
  placeholder = 'Select...',
  className = ''
}: CustomDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Group options if they have categories
  const hasCategories = options.some(opt => opt.category);
  const groupedOptions = hasCategories
    ? options.reduce((acc, opt) => {
        const cat = opt.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(opt);
        return acc;
      }, {} as Record<string, DropdownOption[]>)
    : null;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between py-2 px-3 rounded-xl border-[1.5px] text-xs font-medium outline-none transition-all ${
          isDark 
            ? 'bg-[#1b2620] border-[#44594c] text-[#f3f6f4] hover:border-[#73aa84] focus:ring-2 focus:ring-[#2e855c]/25' 
            : 'bg-white border-[#b6c4b2] text-[#14201d] hover:border-[#4a7855] focus:ring-2 focus:ring-[#1f5c3f]/20 shadow-sm'
        }`}
      >
        <div className="flex items-center gap-2 truncate min-w-0 flex-1">
          {selectedOption?.iconSrc && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img src={selectedOption.iconSrc} alt="" className="w-4 h-4 rounded object-cover flex-shrink-0" />
          )}
          <span 
            className="truncate"
            style={selectedOption?.fontFamily ? { fontFamily: selectedOption.fontFamily } : {}}
          >
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className={`ml-auto text-[9px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${
              isDark ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40' : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
            }`}>
              {selectedOption.badge}
            </span>
          )}
        </div>
        <IoChevronDown className={`w-4 h-4 transition-transform duration-200 ml-1.5 flex-shrink-0 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-[#a3b2aa]' : 'text-[#4a5752]'}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-1.5 py-1.5 rounded-xl border-[1.5px] shadow-xl max-h-64 overflow-y-auto scrollbar-thin ${
            isDark 
              ? 'bg-[#141c18] border-[#34443a] shadow-black/50 scrollbar-thumb-zinc-700' 
              : 'bg-white border-[#c5cec2] shadow-gray-200/50 scrollbar-thumb-gray-200'
          }`}
        >
          {hasCategories && groupedOptions ? (
            Object.entries(groupedOptions).map(([category, opts]) => (
              <div key={category}>
                <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-[#a3b2aa] bg-[#141c18]/95 sticky top-0 backdrop-blur-md' : 'text-[#4a5752] bg-white/95 sticky top-0 backdrop-blur-md'
                }`}>
                  {category}
                </div>
                {opts.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                      opt.value === value 
                        ? isDark ? 'bg-[#203828] text-white font-semibold' : 'bg-[#e8f1e2] text-[#14201d] font-semibold'
                        : isDark ? 'text-[#f3f6f4] hover:bg-[#1d2922]' : 'text-[#14201d] hover:bg-[#f8f9f5]'
                    }`}
                    style={opt.fontFamily ? { fontFamily: opt.fontFamily } : {}}
                  >
                    <div className="flex items-center justify-between gap-2 w-full">
                      <div className="flex items-center gap-2 truncate min-w-0">
                        {opt.iconSrc && (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img src={opt.iconSrc} alt="" className="w-4 h-4 rounded object-cover flex-shrink-0" />
                        )}
                        <span className="truncate">{opt.label}</span>
                      </div>
                      {opt.badge && (
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${
                          isDark ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40' : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
                        }`}>
                          {opt.badge}
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ))
          ) : (
            options.map(opt => (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2 text-xs transition-colors ${
                  opt.value === value 
                    ? isDark ? 'bg-[#203828] text-white font-semibold' : 'bg-[#e8f1e2] text-[#14201d] font-semibold'
                    : isDark ? 'text-[#f3f6f4] hover:bg-[#1d2922]' : 'text-[#14201d] hover:bg-[#f8f9f5]'
                }`}
                style={opt.fontFamily ? { fontFamily: opt.fontFamily } : {}}
              >
                <div className="flex items-center justify-between gap-2 w-full">
                  <div className="flex items-center gap-2 truncate min-w-0">
                    {opt.iconSrc && (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={opt.iconSrc} alt="" className="w-4 h-4 rounded object-cover flex-shrink-0" />
                    )}
                    <span className="truncate">{opt.label}</span>
                  </div>
                  {opt.badge && (
                    <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-md border flex-shrink-0 ${
                      isDark ? 'bg-[#203828] text-[#73aa84] border-[#73aa84]/40' : 'bg-[#e8f1e2] text-[#1f5c3f] border-[#4a7855]/30'
                    }`}>
                      {opt.badge}
                    </span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
