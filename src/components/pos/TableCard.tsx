import { Table } from '@/types/pos';
import { Users, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableCardProps {
  table: Table;
  onClick: () => void;
  onFree?: (e: React.MouseEvent) => void;
  selected?: boolean;
  disabled?: boolean;
  orderStatus?: 'to-cook' | 'preparing' | 'completed';
}

const statusConfig = {
  free: {
    label: 'Available',
    className: 'table-free',
    dot: 'bg-status-free',
  },
  occupied: {
    label: 'Occupied',
    className: 'table-occupied',
    dot: 'bg-status-occupied',
  },
};

export const TableCard = ({ table, onClick, onFree, selected, disabled, orderStatus }: TableCardProps) => {
  const config = statusConfig[table.status];
  const isOccupied = table.status === 'occupied';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'table-card w-full text-left transition-all duration-200 h-full min-h-[140px] relative',
        config.className,
        selected && 'ring-2 ring-primary ring-offset-2',
        isOccupied && 'shadow-inner bg-amber-50 dark:bg-amber-900/10',
        disabled && 'cursor-not-allowed opacity-50'
      )}
    >
      <div className="flex items-center justify-between w-full mb-2">
        <span className="text-2xl font-bold text-foreground">
          T{table.number}
        </span>
        <span className={cn('w-3 h-3 rounded-full', config.dot, !isOccupied && 'animate-pulse-soft')} />
      </div>

      <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
        <Users className="w-4 h-4" />
        <span>{table.seats} seats</span>
      </div>

      {isOccupied && onFree && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onFree(e);
          }}
          className="absolute top-2 right-2 p-1.5 bg-white/80 hover:bg-white rounded-full shadow-sm text-muted-foreground hover:text-destructive transition-colors z-10"
          title="Free Table"
        >
          <LogOut className="w-3 h-3" />
        </div>
      )}

      <div className="mt-2 flex flex-col items-end gap-1.5">
        <span className={cn(
          'status-badge',
          table.status === 'free' && 'status-badge-free',
          table.status === 'occupied' && 'status-badge-occupied',
        )}>
          {config.label}
        </span>
        {isOccupied && orderStatus && (
          <span className={cn(
            "text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full shadow-sm border",
            orderStatus === 'to-cook' && "bg-warm-amber/10 text-warm-amber border-warm-amber/30",
            orderStatus === 'preparing' && "bg-status-occupied/10 text-status-occupied border-status-occupied/30 animate-pulse",
            orderStatus === 'completed' && "bg-kds-accent/10 text-kds-accent border-kds-accent/30"
          )}>
            {orderStatus === 'to-cook' ? 'To Cook' :
              orderStatus === 'preparing' ? 'Preparing' : 'Ready'}
          </span>
        )}
      </div>
    </button>
  );
};
