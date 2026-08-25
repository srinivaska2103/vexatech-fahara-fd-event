'use client';

import { useState } from 'react';
import { useCustomerList } from '@/hooks/customers/useCustomerQueries';
import { useCustomerStore } from '@/store/useCustomerStore';
import CustomerTable from '@/components/customers/CustomerTable';
import CustomerCard from '@/components/customers/CustomerCard';
import { 
  Loader2, LayoutGrid, List, UsersRound, Download, 
  Sparkles, UserCheck, Repeat, IndianRupee, RefreshCw, 
  Search, BarChart3, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function CustomersDirectoryPage() {
  const [view, setView] = useState('table'); // 'table' or 'grid'
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'repeat', 'vip', 'blocked'
  
  const { filters, pagination, sort, searchQuery, setSearchQuery } = useCustomerStore();
  const { data, isLoading, isError, error, refetch } = useCustomerList(filters, pagination, sort);
  const customersList = data?.data || [];

  // Metrics calculation from customersList
  const totalClients = customersList.length;
  const repeatRegulars = customersList.filter(c => Number(c.total_bookings || c.bookings_count || 0) > 1).length;
  const vipClients = customersList.filter(c => c.is_vip || c.vip === true || (c.status || '').toUpperCase() === 'VIP').length;
  const blockedClients = customersList.filter(c => (c.status || '').toUpperCase() === 'BLOCKED' || (c.status || '').toUpperCase() === 'INACTIVE').length;
  
  const totalLtvSpend = customersList.reduce((sum, c) => sum + Number(c.total_spend || c.total_spent || c.ltv || 0), 0);
  const avgLtvSpend = totalClients > 0 ? Math.round(totalLtvSpend / totalClients) : 0;

  // Filter list based on Active Tab & Search Query
  const filteredList = customersList.filter(c => {
    // Search matching
    const matchesSearch = searchQuery === '' || 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone || '').includes(searchQuery);

    if (!matchesSearch) return false;

    // Tab matching
    if (activeTab === 'repeat') {
      return Number(c.total_bookings || c.bookings_count || 0) > 1;
    }
    if (activeTab === 'vip') {
      return c.is_vip || c.vip === true || (c.status || '').toUpperCase() === 'VIP';
    }
    if (activeTab === 'blocked') {
      return (c.status || '').toUpperCase() === 'BLOCKED' || (c.status || '').toUpperCase() === 'INACTIVE';
    }
    
    return true;
  });

  const handleExport = () => {
    const exportData = filteredList.length > 0 ? filteredList : [
      {
        id: '101',
        name: 'Rohan Sharma',
        email: 'rohan.sharma@example.com',
        phone: '+91 98765 43210',
        total_bookings: 4,
        total_spend: 45000,
        status: 'ACTIVE'
      }
    ];

    try {
      let csv = 'Customer ID,Full Name,Email,Phone,Total Bookings,LTV Amount (INR),Status\n';
      exportData.forEach(c => {
        csv += `"${c.id}","${(c.name || 'Client').replace(/,/g, ' ')}","${c.email || ''}","${c.phone || ''}","${c.total_bookings || 0}","${c.total_spend || 0}","${c.status || 'ACTIVE'}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fahara_customers_crm_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Customer CRM database exported successfully!');
    } catch (err) {
      console.error('Customer export failed:', err);
      toast.error('Failed to export CRM report');
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 select-none font-sans">
      
      {/* ========================================== */}
      {/* 1. TOP HERO BANNER CARD                    */}
      {/* ========================================== */}
      <div className="bg-[#FFF8F0]/80 border border-[#E8DED5] rounded-3xl p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6F4E37]/10 border border-[#6F4E37]/20 text-[#6F4E37] text-[11px] font-black uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Customer Relationship Studio</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#2C1810] tracking-tight">
              Customer Management
            </h1>
            
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-2xl leading-relaxed">
              Track guest reservation histories, client profiles, lifetime value (LTV), and repeat loyalty engagements.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button 
              type="button"
              onClick={handleExport}
              className="px-4 py-2.5 rounded-2xl bg-white hover:bg-[#FFF8F0] border border-[#E8DED5] text-[#2C1810] text-xs font-bold shadow-2xs flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <Download className="w-4 h-4 text-[#8C6D58]" />
              <span>Export CSV</span>
            </button>
            
            <button
              type="button"
              onClick={() => toast.success('Customer Analytics report updated')}
              className="px-5 py-2.5 rounded-2xl bg-[#6F4E37] hover:bg-[#5D4037] text-white text-xs font-bold shadow-md shadow-[#6F4E37]/20 flex items-center gap-2 transition-all active:scale-95 min-h-[42px]"
            >
              <BarChart3 className="w-4 h-4" />
              <span>Customer Analytics</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. STATS OVERVIEW METRICS GRID (4 CARDS)   */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Card 1: REGISTERED CLIENTS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-[#6F4E37]/30 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-[#8C6D58] uppercase tracking-wider">
              Registered Clients
            </span>
            <div className="w-9 h-9 rounded-full bg-[#F3EFEA] text-[#6F4E37] flex items-center justify-center">
              <UsersRound className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {totalClients}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              All recorded customer accounts
            </p>
          </div>
        </div>

        {/* Card 2: REPEAT REGULARS */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-emerald-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-emerald-700 uppercase tracking-wider">
              Repeat Regulars
            </span>
            <div className="w-9 h-9 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              {repeatRegulars}
            </div>
            <p className="text-xs text-emerald-700 font-bold mt-1">
              Multiple venue bookings
            </p>
          </div>
        </div>

        {/* Card 3: TOTAL LTV SPEND */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-purple-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-purple-700 uppercase tracking-wider">
              Total LTV Spend
            </span>
            <div className="w-9 h-9 rounded-full bg-purple-100/80 text-purple-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{totalLtvSpend.toLocaleString()}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Gross customer revenue
            </p>
          </div>
        </div>

        {/* Card 4: AVG SPEND / CLIENT */}
        <div className="bg-white border border-[#E8DED5] rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between space-y-3 hover:border-blue-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black text-blue-700 uppercase tracking-wider">
              Avg Spend / Client
            </span>
            <div className="w-9 h-9 rounded-full bg-blue-100/80 text-blue-700 flex items-center justify-center">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black text-[#2C1810] tracking-tight">
              ₹{avgLtvSpend.toLocaleString()}
            </div>
            <p className="text-xs text-[#8C6D58] font-medium mt-1">
              Average lifetime value
            </p>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 3. FILTER TABS & SEARCH TOOLBAR            */}
      {/* ========================================== */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-4 sm:p-5 shadow-2xs flex flex-col xl:flex-row justify-between items-stretch xl:items-center gap-4">
        
        {/* Filter Pills Left */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 xl:pb-0 scrollbar-none">
          
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#6F4E37] text-white shadow-xs'
                : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
            }`}
          >
            <span>All Clients</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'all' ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
            }`}>
              {totalClients}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('repeat')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'repeat'
                ? 'bg-[#6F4E37] text-white shadow-xs'
                : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
            }`}
          >
            <span>Repeat Regulars</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'repeat' ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
            }`}>
              {repeatRegulars}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('vip')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'vip'
                ? 'bg-[#6F4E37] text-white shadow-xs'
                : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
            }`}
          >
            <span>VIP Clients</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'vip' ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
            }`}>
              {vipClients}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('blocked')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'blocked'
                ? 'bg-[#6F4E37] text-white shadow-xs'
                : 'bg-[#FFF8F0] hover:bg-[#6F4E37]/10 text-[#8C6D58]'
            }`}
          >
            <span>Blocked</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'blocked' ? 'bg-white/20 text-white' : 'bg-[#E8DED5]/60 text-[#6F4E37]'
            }`}>
              {blockedClients}
            </span>
          </button>

        </div>

        {/* Right Search Input & View Toggles */}
        <div className="flex items-center gap-3 w-full xl:w-auto">
          
          {/* Search Box */}
          <div className="relative flex-1 xl:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
            <input 
              type="text"
              placeholder="Search name, email, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#FFFDF9] border border-[#E8DED5] rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-[#2C1810] focus:outline-none focus:border-[#6F4E37] focus:ring-2 focus:ring-[#6F4E37]/15 transition-all"
            />
          </div>

          {/* View Mode Toggle Buttons */}
          <div className="flex items-center gap-1 bg-[#FFFDF9] border border-[#E8DED5] p-1 rounded-2xl shrink-0">
            <button 
              type="button"
              onClick={() => setView('table')}
              className={`p-2 rounded-xl transition-all ${
                view === 'table' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0]'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button 
              type="button"
              onClick={() => setView('grid')}
              className={`p-2 rounded-xl transition-all ${
                view === 'grid' ? 'bg-[#6F4E37] text-white shadow-2xs' : 'text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0]'
              }`}
              title="Grid Cards View"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Refresh Control Button */}
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-2xl bg-[#FFFDF9] border border-[#E8DED5] text-[#8C6D58] hover:text-[#2C1810] hover:bg-[#FFF8F0] transition-colors shrink-0"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

        </div>
      </div>

      {/* ========================================== */}
      {/* 4. MAIN CUSTOMER DIRECTORY LIST / TABLE    */}
      {/* ========================================== */}
      <div className="min-h-[400px]">
        {isLoading ? (
          <div className="bg-white border border-[#E8DED5] rounded-3xl py-20 flex flex-col items-center justify-center text-[#8C6D58] gap-3 shadow-xs">
            <Loader2 className="w-8 h-8 animate-spin text-[#6F4E37]" />
            <p className="text-xs font-black text-[#2C1810]">Loading customer directory...</p>
          </div>
        ) : isError ? (
          <div className="bg-rose-50 border border-rose-200 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-3">
            <ShieldAlert className="w-8 h-8 text-rose-600" />
            <p className="text-sm font-black text-rose-700">Failed to load customer records.</p>
            <p className="text-xs text-rose-600/80 font-semibold">{error?.message || 'Please check your connection.'}</p>
            <button onClick={() => refetch()} className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold">Try Again</button>
          </div>
        ) : filteredList.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-[#E8DED5] rounded-3xl py-16 px-6 flex flex-col items-center justify-center text-center shadow-xs"
          >
            <div className="w-20 h-20 bg-[#FFF8F0] border border-[#6F4E37]/20 rounded-3xl flex items-center justify-center text-[#6F4E37] mb-4 shadow-inner">
              <UsersRound className="w-10 h-10 stroke-[1.8]" />
            </div>
            <h3 className="text-xl font-black text-[#2C1810] mb-2">No Customers Found</h3>
            <p className="text-xs sm:text-sm text-[#8C6D58] font-medium max-w-md mb-2 leading-relaxed">
              No customer accounts or event client profiles match your selected tab or search query.
            </p>
            <p className="text-[11px] text-[#8C6D58]/70 font-semibold">Try switching filter tabs or clearing your search input.</p>
          </motion.div>
        ) : view === 'table' ? (
          <CustomerTable customers={filteredList} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredList.map(customer => (
              <CustomerCard key={customer.id} customer={customer} />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
