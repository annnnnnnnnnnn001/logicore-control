import { motion } from 'framer-motion';
import { exceptions } from '@/data/mockData';
import { 
  Thermometer, 
  Clock, 
  CreditCard, 
  PackageX, 
  AlertTriangle,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap = {
  temperature: Thermometer,
  delay: Clock,
  credit_hold: CreditCard,
  damage: PackageX,
  missing_item: AlertTriangle,
};

const severityStyles = {
  low: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground' },
  medium: { bg: 'bg-info', text: 'text-info-foreground', dot: 'bg-info-solid' },
  high: { bg: 'bg-warning', text: 'text-warning-foreground', dot: 'bg-warning-solid' },
  critical: { bg: 'bg-error', text: 'text-error-foreground', dot: 'bg-error-solid' },
};

export function ExceptionFeed() {
  const sortedExceptions = [...exceptions]
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Live Exceptions</h3>
        <span className={cn(
          'text-xs font-medium px-2 py-1 rounded-full',
          exceptions.filter(e => !e.resolved && e.severity === 'critical').length > 0
            ? 'bg-error text-error-foreground'
            : 'bg-success text-success-foreground'
        )}>
          {exceptions.filter(e => !e.resolved).length} active
        </span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto scrollbar-thin pr-1">
        {sortedExceptions.map((exception, index) => {
          const Icon = iconMap[exception.type];
          const style = severityStyles[exception.severity];

          return (
            <motion.div
              key={exception.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.03 * index }}
              className={cn(
                'p-3 rounded-lg border transition-all duration-200',
                exception.resolved 
                  ? 'bg-muted/30 border-border opacity-60' 
                  : `${style.bg} border-transparent`
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  'p-1.5 rounded-md',
                  exception.resolved ? 'bg-muted' : style.bg
                )}>
                  <Icon className={cn('w-4 h-4', style.text)} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={cn(
                      'w-2 h-2 rounded-full',
                      exception.resolved ? 'bg-muted-foreground' : style.dot,
                      !exception.resolved && exception.severity === 'critical' && 'animate-pulse'
                    )} />
                    <span className={cn(
                      'text-xs font-medium uppercase',
                      exception.resolved ? 'text-muted-foreground' : style.text
                    )}>
                      {exception.severity}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      • {formatTime(exception.timestamp)}
                    </span>
                  </div>
                  
                  <p className={cn(
                    'text-sm',
                    exception.resolved ? 'text-muted-foreground' : 'text-foreground'
                  )}>
                    {exception.message}
                  </p>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">
                      {exception.relatedEntity.type}: {exception.relatedEntity.name}
                    </span>
                    {exception.resolved ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-success-foreground" />
                    ) : (
                      <button className="text-xs text-primary hover:underline">
                        Resolve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
