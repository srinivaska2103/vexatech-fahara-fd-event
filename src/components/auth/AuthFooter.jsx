import Link from 'next/link';

export default function AuthFooter({ text, linkText, href, onClick }) {
  return (
    <div className="mt-8 text-center text-sm text-gray-500">
      {text}{' '}
      {onClick ? (
        <button onClick={onClick} type="button" className="font-semibold text-primary hover:text-secondary transition-colors cursor-pointer bg-transparent border-none p-0 m-0">
          {linkText}
        </button>
      ) : (
        <Link href={href || '#'} className="font-semibold text-primary hover:text-secondary transition-colors">
          {linkText}
        </Link>
      )}
    </div>
  );
}
