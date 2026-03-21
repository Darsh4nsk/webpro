import { Category } from '../types';
import { Book, FileText, Wrench } from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  const getCategoryConfig = () => {
    switch (category) {
      case 'physical':
        return {
          icon: Book,
          label: 'Physical',
          className: 'bg-primary/10 text-primary border border-primary/20',
        };
      case 'digital':
        return {
          icon: FileText,
          label: 'Digital',
          className: 'bg-secondary/10 text-secondary border border-secondary/20',
        };
      case 'service':
        return {
          icon: Wrench,
          label: 'Service',
          className: 'bg-accent/10 text-accent border border-accent/20',
        };
    }
  };

  const config = getCategoryConfig();
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-semibold ${config.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </span>
  );
}