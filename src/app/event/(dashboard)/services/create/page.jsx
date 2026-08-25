import ServiceForm from '@/components/services/ServiceForm';

export default function CreateServicePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 sm:space-y-8 select-none">
      {/* Top Banner Header */}
      <div className="bg-white border border-[#E8DED5] rounded-3xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6F4E37]/10 via-[#A67B5B]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-[#FFF8F0] text-[#6F4E37] border border-[#6F4E37]/20 uppercase tracking-widest">
              Catalog Creator
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#2C1810] tracking-tight">Create Event Service</h1>
          <p className="text-xs sm:text-sm text-[#8C6D58] font-semibold mt-1">Add a new event service category or package offering step-by-step.</p>
        </div>
      </div>
      
      <ServiceForm />
    </div>
  );
}
