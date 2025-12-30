import { motion, AnimatePresence } from 'framer-motion';
import { exceptions } from '@/data/mockData';
import { 
  Thermometer, 
  Clock, 
  CreditCard, 
  PackageX, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Bell,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const iconMap = {
  temperature: Thermometer,
  delay: Clock,
  credit_hold: CreditCard,
  damage: PackageX,
  missing_item: AlertTriangle,
};

const severityStyles = {
  low: { bg: 'bg-muted', text: 'text-muted-foreground', dot: 'bg-muted-foreground', border: 'border-muted' },
  medium: { bg: 'bg-info/10', text: 'text-info-foreground', dot: 'bg-info-solid', border: 'border-info/30' },
  high: { bg: 'bg-warning/10', text: 'text-warning-foreground', dot: 'bg-warning-solid', border: 'border-warning/30' },
  critical: { bg: 'bg-error/10', text: 'text-error-foreground', dot: 'bg-error-solid', border: 'border-error/30' },
};

export function ExceptionFeed() {
  const [filter, setFilter] = useState<'all' | 'active'>('active');
  
  const sortedExceptions = [...exceptions]
    .filter(e => filter === 'all' || !e.resolved)
    .sort((a, b) => {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      if (a.resolved !== b.resolved) return a.resolved ? 1 : -1;
      return severityOrder[a.severity] - severityOrder[b.severity];
    });

  const criticalCount = exceptions.filter(e => !e.resolved && e.severity === 'critical').length;
  const activeCount = exceptions.filter(e => !e.resolved).length;

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
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bell className="w-5 h-5 text-foreground" />
              {criticalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-error-solid text-[10px] font-bold text-white rounded-full flex items-center justify-center animate-pulse">
                  {criticalCount}
                </span>
              )}
            </div>
            <h3 className="font-semibold">Live Exceptions</h3>
          </div>
          <span className={cn(
            'text-xs font-medium px-2.5 py-1 rounded-full',
            criticalCount > 0
              ? 'bg-error text-error-foreground'
              : 'bg-success text-success-foreground'
          )}>
            {activeCount} active
          </span>
        </div>
        
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setFilter('active')}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              filter === 'active' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
              filter === 'all' ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
            )}
          >
            All
          </button>
        </div>
      </div>

      {/* Exception List */}
      <div className="max-h-[340px] overflow-y-auto scrollbar-thin">
        <AnimatePresence mode="popLayout">
          {sortedExceptions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <CheckCircle2 className="w-12 h-12 text-success-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No active exceptions</p>
            </motion.div>
          ) : (
            sortedExceptions.map((exception, index) => {
              const Icon = iconMap[exception.type];
              const style = severityStyles[exception.severity];

              return (
                <motion.div
                  key={exception.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.03 * index }}
                  whileHover={{ backgroundColor: 'hsl(var(--muted) / 0.5)' }}
                  className={cn(
                    'p-4 border-b border-border-subtle cursor-pointer transition-colors group',
                    exception.resolved && 'opacity-50'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      'p-2 rounded-lg shrink-0',
                      exception.resolved ? 'bg-muted' : style.bg
                    )}>
                      <Icon className={cn('w-4 h-4', exception.resolved ? 'text-muted-foreground' : style.text)} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'w-2 h-2 rounded-full shrink-0',
                          exception.resolved ? 'bg-muted-foreground' : style.dot,
                          !exception.resolved && exception.severity === 'critical' && 'animate-pulse'
                        )} />
                        <span className={cn(
                          'text-xs font-semibold uppercase tracking-wide',
                          exception.resolved ? 'text-muted-foreground' : style.text
                        )}>
                          {exception.severity}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          • {formatTime(exception.timestamp)}
                        </span>
                      </div>
                      
                      <p className={cn(
                        'text-sm leading-relaxed',
                        exception.resolved ? 'text-muted-foreground' : 'text-foreground'
                      )}>
                        {exception.message}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                          {exception.relatedEntity.type}: {exception.relatedEntity.name}
                        </span>
                        {exception.resolved ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-success-foreground" />
                        ) : (
                          <button className="text-xs text-primary hover:underline font-medium">
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}