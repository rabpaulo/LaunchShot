import React, { useState, useRef, useEffect } from 'react';
import { IoChevronDown } from 'react-icons/io5';

export interface DropdownOption {
  label: string;
  value: string | number;
  category?: string;
  fontFamily?: string; // specific for fonts
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
        className={`w-full flex items-center justify-between py-2.5 px-3.5 rounded-xl border text-sm font-medium outline-none transition-all ${
          isDark 
            ? 'bg-zinc-900/60 border-zinc-700/80 text-gray-200 hover:border-zinc-600 focus:ring-2 focus:ring-zinc-600' 
            : 'bg-white border-gray-200 text-gray-800 hover:border-gray-300 focus:ring-2 focus:ring-zinc-300 shadow-sm'
        }`}
      >
        <span 
          className="truncate"
          style={selectedOption?.fontFamily ? { fontFamily: selectedOption.fontFamily } : {}}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <IoChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-zinc-400' : 'text-gray-400'}`} />
      </button>

      {isOpen && (
        <div 
          className={`absolute z-50 w-full mt-1.5 py-1.5 rounded-xl border shadow-xl max-h-64 overflow-y-auto scrollbar-thin ${
            isDark 
              ? 'bg-zinc-900 border-zinc-700 shadow-black/50 scrollbar-thumb-zinc-700' 
              : 'bg-white border-gray-100 shadow-gray-200/50 scrollbar-thumb-gray-200'
          }`}
        >
          {hasCategories && groupedOptions ? (
            Object.entries(groupedOptions).map(([category, opts]) => (
              <div key={category}>
                <div className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider ${
                  isDark ? 'text-zinc-500 bg-zinc-900/90 sticky top-0 backdrop-blur-md' : 'text-gray-400 bg-white/90 sticky top-0 backdrop-blur-md'
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
                    className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                      opt.value === value 
                        ? isDark ? 'bg-zinc-800 text-white' : 'bg-gray-50 text-gray-900 font-semibold'
                        : isDark ? 'text-gray-300 hover:bg-zinc-800/60' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={opt.fontFamily ? { fontFamily: opt.fontFamily } : {}}
                  >
                    {opt.label}
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
                className={`w-full text-left px-3.5 py-2 text-sm transition-colors ${
                  opt.value === value 
                    ? isDark ? 'bg-zinc-800 text-white' : 'bg-gray-50 text-gray-900 font-semibold'
                    : isDark ? 'text-gray-300 hover:bg-zinc-800/60' : 'text-gray-600 hover:bg-gray-50'
                }`}
                style={opt.fontFamily ? { fontFamily: opt.fontFamily } : {}}
              >
                {opt.label}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
