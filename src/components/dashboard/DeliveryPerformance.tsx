import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Target, Clock, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DeliveryPerformance() {
  const metrics = [
    { label: 'On-Time Delivery', value: 94.2, target: 95, unit: '%', trend: 2.1, color: 'primary' },
    { label: 'Avg. Delivery Time', value: 38, target: 45, unit: 'min', trend: -5, color: 'success' },
    { label: 'First-Attempt Success', value: 89.7, target: 90, unit: '%', trend: 1.3, color: 'info' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Delivery Performance</h3>
        </div>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>

      <div className="space-y-5">
        {metrics.map((metric, index) => {
          const progress = Math.min((metric.value / metric.target) * 100, 100);
          const isAboveTarget = metric.value >= metric.target;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{metric.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-semibold">
                    {metric.value}{metric.unit}
                  </span>
                  <div className={cn(
                    "flex items-center gap-0.5 text-xs font-medium px-1.5 py-0.5 rounded",
                    metric.trend > 0 
                      ? "bg-success text-success-foreground" 
                      : "bg-error text-error-foreground"
                  )}>
                    {metric.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(metric.trend)}%
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                    className={cn(
                      "h-full rounded-full",
                      isAboveTarget ? "bg-success-solid" : `bg-${metric.color}`
                    )}
                  />
                </div>
                {/* Target marker */}
                <div 
                  className="absolute top-0 bottom-0 w-0.5 bg-foreground/30"
                  style={{ left: '100%', transform: 'translateX(-100%)' }}
                />
              </div>
              
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Target: {metric.target}{metric.unit}</span>
                {isAboveTarget && (
                  <span className="flex items-center gap-1 text-success-foreground">
                    <CheckCircle2 className="w-3 h-3" />
                    Above target
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}