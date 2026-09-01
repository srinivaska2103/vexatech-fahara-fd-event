'use client';
import React, { useState } from 'react';
import { Users, User, CheckSquare, Square, Search, UserCheck, X } from 'lucide-react';

export const RecipientSelector = ({ selected = [], onChange, customers = [] }) => {
  const [search, setSearch] = useState('');

  const activeCustomers = customers || [];

  const filteredCustomers = activeCustomers.filter(c => 
    !search || 
    (c.name && c.name.toLowerCase().includes(search.toLowerCase())) || 
    (c.email && c.email.toLowerCase().includes(search.toLowerCase()))
  );

  const isAllSelected = selected.length > 0 && activeCustomers.length > 0 && selected.length === activeCustomers.length;

  const toggleAll = () => {
    if (isAllSelected) {
      onChange([]);
    } else {
      onChange(activeCustomers.map(c => c.id || c.email));
    }
  };

  const toggleCustomer = (id) => {
    if (selected.includes(id)) {
      onChange(selected.filter(cId => cId !== id));
    } else {
      onChange([...selected, id]);
    }
  };

  const removeRecipient = (recipientId) => {
    onChange(selected.filter(id => id !== recipientId));
  };

  return (
    <div className="bg-white rounded-3xl border border-stone-200/90 shadow-2xs overflow-hidden text-[#2C1810]">
      
      {/* Selector Header Bar */}
      <div className="p-4 sm:p-5 border-b border-stone-200/70 bg-[#FFF8F0]/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6F4E37]/10 text-[#6F4E37] flex items-center justify-center font-extrabold text-xs shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm sm:text-base font-extrabold text-[#2C1810]">Target Email Recipients</h4>
            <p className="text-xs text-stone-500 font-medium">{selected.length} recipient{selected.length === 1 ? '' : 's'} selected</p>
          </div>
        </div>

        {activeCustomers.length > 0 && (
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={toggleAll}
              className="text-xs font-extrabold text-[#6F4E37] hover:text-[#5D3F2B] flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#6F4E37]/10 hover:bg-[#6F4E37]/20 transition-all cursor-pointer select-none"
              suppressHydrationWarning
            >
              {isAllSelected ? (
                <><CheckSquare className="w-4 h-4 text-emerald-600" /> Deselect All</>
              ) : (
                <><Square className="w-4 h-4 text-[#6F4E37]" /> Select All ({activeCustomers.length})</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Prominent & Interactive Search Input */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-white via-[#FFF8F0] to-[#FFF5EA] border-b border-stone-200/70 space-y-3">
        <div className="relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-[#6F4E37]" />
          <input 
            type="text" 
            placeholder="Search customers by name or email address..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm rounded-2xl border border-[#DDB892]/60 bg-white focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/10 shadow-2xs font-medium transition-all placeholder:text-stone-400"
          />
        </div>

        {/* Selected Recipients Pills */}
        {selected.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[10px] font-black text-[#6F4E37] uppercase tracking-wider mr-1">Selected:</span>
            {selected.map(id => {
              const cust = activeCustomers.find(c => (c.id || c.email) === id);
              const label = cust ? (cust.name || cust.email) : id;
              return (
                <span 
                  key={id} 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-[#DDB892] text-[#6F4E37] text-xs font-bold shadow-2xs"
                >
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="max-w-[160px] truncate">{label}</span>
                  <button 
                    type="button" 
                    onClick={() => removeRecipient(id)}
                    className="p-0.5 hover:bg-rose-100 hover:text-rose-600 rounded-full transition-colors ml-0.5 cursor-pointer"
                    suppressHydrationWarning
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              );
            })}
          </div>
        )}
      </div>

      {/* Recipient Cards Grid */}
      <div className="max-h-64 overflow-y-auto custom-scrollbar p-3 sm:p-4">
        {filteredCustomers.length === 0 ? (
          <div className="text-center py-10 text-xs text-stone-500 space-y-1">
            <p className="font-extrabold text-[#2C1810] text-sm">No customer records found</p>
            <p className="text-xs text-stone-400">Add attendees or customer contacts to broadcast email messages.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {filteredCustomers.map(customer => {
              const customerKey = customer.id || customer.email;
              const isSelected = selected.includes(customerKey);
              return (
                <div 
                  key={customerKey}
                  onClick={() => toggleCustomer(customerKey)}
                  className={`flex items-center justify-between p-3.5 rounded-2xl cursor-pointer transition-all border select-none ${
                    isSelected 
                      ? 'bg-[#FFF8F0] border-[#DDB892] shadow-2xs ring-1 ring-[#6F4E37]/20' 
                      : 'bg-white border-stone-200/80 hover:bg-stone-50/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-xs font-black transition-all ${
                      isSelected ? 'bg-[#6F4E37] text-white shadow-xs' : 'bg-stone-100 text-stone-600'
                    }`}>
                      {customer.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                    </div>
                    <div className="truncate">
                      <p className={`text-xs font-black truncate ${isSelected ? 'text-[#6F4E37]' : 'text-[#2C1810]'}`}>
                        {customer.name || 'Customer'}
                      </p>
                      <p className="text-[11px] text-stone-400 font-medium truncate">
                        {customer.email}
                      </p>
                    </div>
                  </div>

                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                    isSelected ? 'bg-[#6F4E37] border-[#6F4E37] text-white' : 'border-stone-300 bg-white'
                  }`}>
                    {isSelected && <UserCheck className="w-3 h-3 stroke-[3]" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
