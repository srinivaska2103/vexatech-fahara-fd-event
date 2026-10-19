'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  icon: Icon,
  searchable = false,
  className = '',
  badge = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => String(opt.value) === String(value));

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = searchable && searchTerm.trim()
    ? options.filter((opt) => 
        (opt.label || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (opt.sublabel || '').toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full bg-[#FFFDF9] border transition-all duration-200 rounded-2xl px-3.5 py-2.5 text-left flex items-center justify-between gap-2 shadow-xs group ${
          isOpen
            ? 'border-[#6F4E37] ring-2 ring-[#6F4E37]/15 shadow-sm'
            : 'border-[#E8DED5] hover:border-[#DDB892] hover:bg-white'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {Icon && (
            <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isOpen ? 'bg-[#6F4E37] text-white' : 'bg-[#FFF8F0] text-[#6F4E37]'
            }`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
          )}
          <div className="min-w-0 flex flex-col">
            <span className="text-xs font-bold text-[#2C1810] truncate">
              {selectedOption ? selectedOption.label : <span className="text-[#8C6D58]/60 font-normal">{placeholder}</span>}
            </span>
            {selectedOption?.sublabel && (
              <span className="text-[10px] text-[#8C6D58] font-medium truncate">
                {selectedOption.sublabel}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {badge && (
            <span className="px-1.5 py-0.5 rounded-md bg-[#FFF8F0] text-[#6F4E37] border border-[#E8DED5] text-[10px] font-black">
              {badge}
            </span>
          )}
          <ChevronDown
            className={`w-4 h-4 text-[#8C6D58] group-hover:text-[#6F4E37] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#6F4E37]' : ''
            }`}
          />
        </div>
      </button>

      {/* Modern Popover Menu */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-[#E8DED5] rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {searchable && options.length > 5 && (
            <div className="p-2 border-b border-[#F0E6DE] bg-[#FFF8F0]/40">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C6D58]" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  autoFocus
                  className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#E8DED5] rounded-xl text-xs font-semibold text-[#2C1810] placeholder:text-[#8C6D58]/50 focus:border-[#6F4E37] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-center text-xs text-[#8C6D58] font-medium">
                No matching options
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                const ItemIcon = opt.icon;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onChange(opt.value);
                      setIsOpen(false);
                      setSearchTerm('');
                    }}
                    className={`w-full px-3 py-2 rounded-xl text-left flex items-center justify-between gap-2.5 transition-all duration-150 group ${
                      isSelected
                        ? 'bg-[#6F4E37] text-white shadow-xs'
                        : 'text-[#2C1810] hover:bg-[#FFF8F0] hover:text-[#6F4E37]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      {ItemIcon && (
                        <ItemIcon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isSelected ? 'text-white' : 'text-[#8C6D58] group-hover:text-[#6F4E37]'
                          }`}
                        />
                      )}
                      <div className="min-w-0">
                        <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-[#2C1810]'}`}>
                          {opt.label}
                        </div>
                        {opt.sublabel && (
                          <div className={`text-[10px] truncate ${isSelected ? 'text-white/80' : 'text-[#8C6D58]'}`}>
                            {opt.sublabel}
                          </div>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <Check className="w-4 h-4 text-white shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
