import { MapPin } from 'lucide-react';

export default function AddressCard({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border flex items-center gap-2">
        <MapPin className="w-4 h-4 text-text/50" /> Billing Address
      </h3>
      
      <div className="bg-background rounded-xl p-4 border border-border">
        {customer.address ? (
          <div className="text-sm font-semibold text-text leading-relaxed">
            {customer.address}
            <br />
            {customer.city && `${customer.city}, `}
            {customer.state && `${customer.state} `}
            {customer.zip_code}
            {customer.country && <><br />{customer.country}</>}
          </div>
        ) : (
          <div className="text-sm text-text/50 italic text-center py-2">
            No address information provided.
          </div>
        )}
      </div>
    </div>
  );
}
