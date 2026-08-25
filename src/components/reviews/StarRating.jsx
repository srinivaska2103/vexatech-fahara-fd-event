import { Star } from 'lucide-react';

export default function StarRating({ rating = 0, max = 5, size = "w-4 h-4" }) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(max)].map((_, i) => (
        <Star 
          key={i} 
          className={`${size} ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'fill-background text-border'}`} 
        />
      ))}
    </div>
  );
}
