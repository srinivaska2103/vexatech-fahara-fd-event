export default function ServiceStatusBadge({ status }) {
  const getStatusStyles = () => {
    switch (status?.toUpperCase()) {
      case 'ACTIVE':
      case 'PUBLISHED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'DRAFT':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'ARCHIVED':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-primary/10 text-primary border-primary/20';
    }
  };

  return (
    <span className={`px-2.5 py-1 text-xs font-bold rounded-full border shadow-sm uppercase tracking-wider ${getStatusStyles()}`}>
      {status || 'ACTIVE'}
    </span>
  );
}
