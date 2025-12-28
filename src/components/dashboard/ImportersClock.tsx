import { motion } from 'framer-motion';
import { importContainers } from '@/data/mockData';
import { Ship, AlertTriangle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ImportersClock() {
  const sortedContainers = [...importContainers].sort((a, b) => a.freeDaysRemaining - b.freeDaysRemaining);

  const getProgressColor = (days: number) => {
    if (days <= 0) return 'bg-error-solid';
    if (days <= 1) return 'bg-warning-solid';
    if (days <= 3) return 'bg-warning-solid/70';
    return 'bg-success-solid';
  };

  const getProgressBg = (days: number) => {
    if (days <= 0) return 'bg-error/50';
    if (days <= 1) return 'bg-warning/50';
    if (days <= 3) return 'bg-warning/30';
    return 'bg-success/30';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Ship className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Importer's Clock</h3>
        </div>
        <span className="text-sm text-muted-foreground">{importContainers.length} containers</span>
      </div>

      <div className="space-y-4">
        {sortedContainers.map((container, index) => (
          <motion.div
            key={container.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className="space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-sm font-medium">{container.containerId}</span>
                {container.freeDaysRemaining <= 1 && (
                  <AlertTriangle className="w-4 h-4 text-error-foreground animate-pulse" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <Clock className={cn(
                  'w-4 h-4',
                  container.freeDaysRemaining <= 0 ? 'text-error-foreground' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'text-sm font-medium',
                  container.freeDaysRemaining <= 0 
                    ? 'text-error-foreground' 
                    : container.freeDaysRemaining <= 1 
                      ? 'text-warning-foreground'
                      : 'text-foreground'
                )}>
                  {container.freeDaysRemaining <= 0 
                    ? 'DEMURRAGE' 
                    : `${container.freeDaysRemaining} days left`}
                </span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className={cn('h-2 rounded-full overflow-hidden', getProgressBg(container.freeDaysRemaining))}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(0, Math.min(100, (7 - container.freeDaysRemaining) / 7 * 100))}%` }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  className={cn('h-full rounded-full', getProgressColor(container.freeDaysRemaining))}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{container.contents}</span>
                <span>${container.demurragePerDay}/day</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
