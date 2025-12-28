import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { importContainers } from '@/data/mockData';
import { 
  Ship, 
  AlertTriangle, 
  Clock,
  Package,
  CheckCircle2,
  ChevronRight,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Imports = () => {
  const totalDemurrage = importContainers
    .filter(c => c.freeDaysRemaining <= 0)
    .reduce((sum, c) => sum + (Math.abs(c.freeDaysRemaining) * c.demurragePerDay), 0);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'unloaded': return 'bg-success text-success-foreground';
      case 'at_warehouse': return 'bg-info text-info-foreground';
      case 'in_transit': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="min-h-screen">
      <Header title="Import Containers" subtitle="Demurrage tracking and unloading status" />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Ship className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Containers</p>
                <p className="text-2xl font-semibold">{importContainers.length}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className={cn(
              "card-metric",
              importContainers.some(c => c.freeDaysRemaining <= 1) && "border-error/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-error/20">
                <AlertTriangle className="w-5 h-5 text-error-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Critical (≤1 day)</p>
                <p className="text-2xl font-semibold text-error-foreground">
                  {importContainers.filter(c => c.freeDaysRemaining <= 1).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Free Days</p>
                <p className="text-2xl font-semibold">
                  {Math.round(importContainers.reduce((sum, c) => sum + c.freeDaysRemaining, 0) / importContainers.length)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={cn(
              "card-metric",
              totalDemurrage > 0 && "border-error/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                totalDemurrage > 0 ? "bg-error/20" : "bg-success/20"
              )}>
                <DollarSign className={cn(
                  "w-5 h-5",
                  totalDemurrage > 0 ? "text-error-foreground" : "text-success-foreground"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Demurrage Accrued</p>
                <p className={cn(
                  "text-2xl font-semibold",
                  totalDemurrage > 0 && "text-error-foreground"
                )}>
                  ${totalDemurrage.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Container Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {importContainers.map((container, index) => {
            const progressPercent = (container.unloadedPallets / container.totalPallets) * 100;
            const isDemurrage = container.freeDaysRemaining <= 0;
            const isCritical = container.freeDaysRemaining <= 1;

            return (
              <motion.div
                key={container.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className={cn(
                  "card-elevated p-5 transition-all hover:shadow-md",
                  isDemurrage && "border-error/50 bg-error/5",
                  isCritical && !isDemurrage && "border-warning/50"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold">{container.containerId}</span>
                      {isDemurrage && (
                        <span className="px-2 py-0.5 rounded text-xs font-medium bg-error text-error-foreground animate-pulse">
                          DEMURRAGE
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Arrived {formatDate(container.arrivalDate)}
                    </p>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium",
                    getStatusStyle(container.status)
                  )}>
                    {container.status.replace('_', ' ')}
                  </span>
                </div>

                {/* Free Days */}
                <div className={cn(
                  "p-3 rounded-lg mb-4",
                  isDemurrage ? "bg-error/10" : isCritical ? "bg-warning/10" : "bg-muted"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className={cn(
                        "w-4 h-4",
                        isDemurrage ? "text-error-foreground" : isCritical ? "text-warning-foreground" : "text-muted-foreground"
                      )} />
                      <span className="text-sm font-medium">
                        {isDemurrage 
                          ? `${Math.abs(container.freeDaysRemaining)} days overdue` 
                          : `${container.freeDaysRemaining} free days left`}
                      </span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ${container.demurragePerDay}/day
                    </span>
                  </div>
                </div>

                {/* Contents */}
                <div className="mb-4">
                  <p className="text-sm font-medium">{container.contents}</p>
                </div>

                {/* Unloading Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unloading Progress</span>
                    <span className="font-medium">
                      {container.unloadedPallets}/{container.totalPallets} pallets
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className={cn(
                        "h-full rounded-full",
                        progressPercent === 100 ? "bg-success-solid" : "bg-primary"
                      )}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
                  <button className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  {progressPercent < 100 && (
                    <button className="px-3 py-1.5 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-dark transition-colors">
                      Schedule Unload
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Imports;
