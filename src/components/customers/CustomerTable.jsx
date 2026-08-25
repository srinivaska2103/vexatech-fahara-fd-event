'use client';
import { useCustomerStore } from '@/store/useCustomerStore';
import CustomerStatusBadge from './CustomerStatusBadge';
import VIPBadge from './VIPBadge';
import { Eye, ChevronRight, Phone, Mail, IndianRupee } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function CustomerTable({ customers }) {
  const { selectedCustomerIds, toggleCustomerSelection, selectAllCustomers } = useCustomerStore();

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      selectAllCustomers(customers.map(c => c.id));
    } else {
      selectAllCustomers([]);
    }
  };

  return (
    <div className="w-full bg-white border border-[#E8DED5] rounded-3xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm text-[#2C1810] whitespace-nowrap">
          <thead className="bg-[#FFF8F0] border-b border-[#E8DED5] text-[10px] uppercase tracking-wider text-[#8C6D58] font-black select-none">
            <tr>
              <th className="p-4 w-12 text-center">
                <input 
                  type="checkbox" 
                  className="w-4 h-4 rounded-md border-[#E8DED5] text-[#6F4E37] focus:ring-[#6F4E37]"
                  checked={customers.length > 0 && selectedCustomerIds.length === customers.length}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-4">Customer Details</th>
              <th className="p-4">Contact Info</th>
              <th className="p-4">Total Bookings & LTV</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">View Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F2EAE1]">
            {customers.map((customer, idx) => (
              <motion.tr 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                key={customer.id} 
                className="hover:bg-[#FFFDF9] transition-colors group cursor-pointer"
              >
                <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded-md border-[#E8DED5] text-[#6F4E37] focus:ring-[#6F4E37]"
                    checked={selectedCustomerIds.includes(customer.id)}
                    onChange={() => toggleCustomerSelection(customer.id)}
                  />
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#FFF8F0] border border-[#6F4E37]/20 flex items-center justify-center font-black text-[#6F4E37] text-sm shadow-2xs">
                      {customer.name?.charAt(0)?.toUpperCase() || 'C'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#2C1810] text-sm group-hover:text-[#6F4E37] transition-colors">
                          {customer.name || 'Guest Client'}
                        </span>
                        <VIPBadge isVip={customer.is_vip} />
                      </div>
                      <span className="text-[10px] text-[#8C6D58] font-bold">Ref: #{customer.id}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-bold text-[#2C1810] flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#8C6D58]" />
                    <span>{customer.phone || 'N/A'}</span>
                  </div>
                  <div className="text-xs text-[#8C6D58] font-medium flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3 h-3 text-[#8C6D58]/70" />
                    <span>{customer.email || 'No Email'}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="text-xs font-black text-[#2C1810]">
                    {customer.total_bookings || 0} Bookings
                  </div>
                  <div className="text-xs text-[#8C6D58] font-bold flex items-center mt-0.5">
                    <span>LTV: </span>
                    <IndianRupee className="w-3 h-3 text-[#6F4E37] ml-1 stroke-[2.5]" />
                    <span>{(customer.total_spend || 0).toLocaleString('en-IN')}</span>
                  </div>
                </td>
                <td className="p-4">
                  <CustomerStatusBadge status={customer.status || 'ACTIVE'} />
                </td>
                <td className="p-4 text-right">
                  <Link 
                    href={`/event/customers/${customer.id}`} 
                    className="inline-flex items-center justify-center p-2 rounded-xl bg-[#FFF8F0] hover:bg-[#6F4E37] text-[#6F4E37] hover:text-white border border-[#6F4E37]/20 transition-all shadow-2xs"
                  >
                    <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
