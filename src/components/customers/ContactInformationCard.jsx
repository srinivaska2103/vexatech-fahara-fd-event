import { Phone, Mail, User } from 'lucide-react';

export default function ContactInformationCard({ customer }) {
  if (!customer) return null;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="text-sm font-bold text-text uppercase tracking-wider mb-6 pb-4 border-b border-border">
        Contact Information
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Mail className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/50 uppercase tracking-wider mb-1">Email Address</div>
            <div className="text-sm font-semibold text-text">{customer.email || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <Phone className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/50 uppercase tracking-wider mb-1">Phone Number</div>
            <div className="text-sm font-semibold text-text">{customer.phone || 'N/A'}</div>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-text/50 uppercase tracking-wider mb-1">Preferred Contact Method</div>
            <div className="text-sm font-semibold text-text">Email</div>
          </div>
        </div>
      </div>
    </div>
  );
}
