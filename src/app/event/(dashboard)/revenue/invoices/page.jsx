"use client";

import React, { useState } from 'react';
import { Download, Plus } from 'lucide-react';
import InvoiceTable from '@/components/finance/InvoiceTable';
import InvoicePreviewModal from '@/components/finance/InvoicePreviewModal';
import ReceiptCard from '@/components/finance/ReceiptCard';
import ExportReportModal from '@/components/finance/ExportReportModal';
import FinancialSearch from '@/components/finance/FinancialSearch';
import { useDashboardQueries } from '@/hooks/dashboard/useDashboardQueries';
import { useFinanceStore } from '@/store/useFinanceStore';
import Link from 'next/link';
import { useDebounce } from '@/hooks/useDebounce';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function InvoicesPage() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('invoices');
  
  const filters = useFinanceStore(state => state.filters);
  const pagination = useFinanceStore(state => state.pagination);
  const sort = useFinanceStore(state => state.sort);
  const setPagination = useFinanceStore(state => state.setPagination);
  const searchQuery = useFinanceStore(state => state.searchQuery);
  const setSearchQuery = useFinanceStore(state => state.setSearchQuery);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: dashboardData, isLoading } = useDashboardQueries();
  const rawBookings = dashboardData?.rawBookings || [];

  let processedInvoices = rawBookings.map(b => ({
    id: b.id || 'unknown',
    number: `INV-${b.id?.substring(0, 8).toUpperCase() || 'UNKNOWN'}`,
    customer: { name: b.customerName || b.customer_name || 'Anonymous' },
    date: b.createdAt || b.created_at || b.date || b.booking_date || new Date().toISOString(),
    amount: Number(b.amount || b.total_amount || b.cafe_amount || b.event_service_amount || b.subtotal || 0),
    status: ['COMPLETED', 'CONFIRMED'].includes((b.status || '').toUpperCase()) ? 'paid' : (b.status || '').toUpperCase() === 'CANCELLED' ? 'failed' : 'pending',
  }));

  if (debouncedSearch) {
    const q = debouncedSearch.toLowerCase();
    processedInvoices = processedInvoices.filter(inv => 
      inv.number.toLowerCase().includes(q) || 
      inv.customer.name.toLowerCase().includes(q)
    );
  }

  let processedReceipts = processedInvoices.filter(inv => inv.status === 'paid').map(inv => ({
    id: inv.id?.substring(0, 8).toUpperCase() || 'UNKNOWN',
    date: inv.date,
    amount: inv.amount,
    customer: inv.customer
  }));

  const totalInvoices = processedInvoices.length;
  const startIndex = (pagination.page - 1) * pagination.limit;
  const invoices = processedInvoices.slice(startIndex, startIndex + pagination.limit);

  const handleDownloadPdf = (data, type = 'Invoice') => {
    const doc = new jsPDF();
    const num = data.number || data.id;
    const name = data.customer?.name || 'Customer';
    const amount = data.amount?.toFixed(2) || '0.00';
    const dateStr = new Date(data.date).toLocaleDateString();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(26, 26, 26);
    doc.text(type.toUpperCase(), 14, 22);

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text(`#${num}`, 14, 32);

    // Billed To & Date
    doc.setFontSize(10);
    doc.setTextColor(102, 102, 102);
    doc.text('BILLED TO', 14, 45);
    doc.text('DATE ISSUED', 140, 45);

    doc.setFontSize(12);
    doc.setTextColor(26, 26, 26);
    doc.text(name, 14, 52);
    doc.text(dateStr, 140, 52);

    // Table
    autoTable(doc, {
      startY: 65,
      head: [['Description', 'Amount']],
      body: [
        ['Event Booking & Services', `Rs. ${amount}`]
      ],
      headStyles: { fillColor: [240, 240, 240], textColor: [100, 100, 100], fontStyle: 'bold' },
      bodyStyles: { textColor: [26, 26, 26] },
      alternateRowStyles: { fillColor: [255, 255, 255] },
      columnStyles: {
        1: { halign: 'right' }
      }
    });

    const finalY = doc.lastAutoTable?.finalY || 100;

    // Total
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Total', 14, finalY + 15);
    doc.text(`Rs. ${amount}`, 180, finalY + 15, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(136, 136, 136);
    doc.text('Thank you for your business!', 105, finalY + 40, { align: 'center' });

    doc.save(`${type}_${num}.pdf`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Invoices & Receipts</h1>
          <p className="text-gray-500 text-sm mt-1">Manage billing documents and customer payments.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium flex items-center shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Main Tabs */}
      <div className="flex space-x-1 border-b border-border mb-6">
        <Link href="/event/revenue" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Overview</Link>
        <Link href="/event/revenue/transactions" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Transactions</Link>
        <Link href="/event/revenue/payouts" className="px-4 py-3 text-sm font-medium text-gray-500 hover:text-text border-b-2 border-transparent">Payouts</Link>
        <Link href="/event/revenue/invoices" className="px-4 py-3 text-sm font-medium text-primary border-b-2 border-primary">Invoices & Receipts</Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <div className="w-full md:w-96">
            <FinancialSearch 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              placeholder="Search invoices by number or customer..." 
            />
          </div>
        </div>
        <InvoiceTable 
          invoices={invoices} 
          isLoading={isLoading && !invoices.length} 
          onPreview={setSelectedInvoice}
          onDownload={handleDownloadPdf}
        />
        <div className="p-4 border-t border-border flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + pagination.limit, totalInvoices)} of {totalInvoices} invoices
          </span>
          <div className="flex space-x-2">
            <button 
              className="px-3 py-1 border border-border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={pagination.page === 1}
              onClick={() => setPagination(pagination.page - 1)}
            >
              Previous
            </button>
            <button 
              className="px-3 py-1 border border-border rounded-md text-sm hover:bg-gray-50 disabled:opacity-50"
              disabled={startIndex + pagination.limit >= totalInvoices}
              onClick={() => setPagination(pagination.page + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modals & Drawers */}
      <ExportReportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} defaultTab="invoices" />
      <InvoicePreviewModal 
        isOpen={!!selectedInvoice} 
        onClose={() => setSelectedInvoice(null)} 
        invoice={selectedInvoice} 
      />
    </div>
  );
}
