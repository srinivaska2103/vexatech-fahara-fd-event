export default function StaffStatusBadge({ status }) {
  const getStatusStyles = (s) => {
    switch (s?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'inactive':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'on leave':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'busy':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'available':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusStyles(status)}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current"></span>
      {status || 'Unknown'}
    </span>
  );
}
