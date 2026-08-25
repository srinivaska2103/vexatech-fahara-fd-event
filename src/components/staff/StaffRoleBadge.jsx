export default function StaffRoleBadge({ role }) {
  const getRoleStyles = (r) => {
    switch (r?.toLowerCase()) {
      case 'team leader':
      case 'event coordinator':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'photographer':
      case 'videographer':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'decorator':
      case 'lighting technician':
        return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'catering staff':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'dj':
        return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getRoleStyles(role)}`}>
      {role || 'Unknown'}
    </span>
  );
}
