import { motion } from 'framer-motion';
import { drivers, trucks } from '@/data/mockData';
import { Snowflake, Wifi, WifiOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FleetStatus() {
  const activeDrivers = drivers.filter(d => d.status === 'active' || d.status === 'idle');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'status-dot-success';
      case 'idle': return 'status-dot-info';
      case 'stopped': return 'status-dot-error';
      default: return 'status-dot-warning';
    }
  };

  const formatSyncTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  const isOffline = (date: Date) => {
    const diff = (new Date().getTime() - date.getTime()) / 1000;
    return diff > 3600; // 1 hour
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Active Fleet</h3>
        <span className="text-sm text-muted-foreground">
          {activeDrivers.length}/{drivers.length} drivers
        </span>
      </div>

      <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
        {drivers.map((driver, index) => {
          const truck = trucks.find(t => t.id === driver.truckId);
          const offline = isOffline(driver.lastSync);

          return (
            <motion.div
              key={driver.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.02 * index }}
              className={cn(
                'flex items-center gap-3 p-2.5 rounded-lg border border-border-subtle hover:bg-muted/50 transition-colors',
                offline && 'opacity-60'
              )}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                  {driver.avatar}
                </div>
                <span className={cn(
                  'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card',
                  truck ? getStatusColor(truck.status) : 'bg-muted-foreground'
                )} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{driver.name}</span>
                  {truck?.type === 'refrigerated' && (
                    <div className={cn(
                      'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded',
                      truck.temperatureAlert ? 'bg-error text-error-foreground' : 'bg-info text-info-foreground'
                    )}>
                      <Snowflake className="w-3 h-3" />
                      <span className="font-mono">{truck.temperature}°F</span>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-mono">{truck?.plateNumber}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    {offline ? (
                      <WifiOff className="w-3 h-3 text-error-foreground" />
                    ) : (
                      <Wifi className="w-3 h-3 text-success-foreground" />
                    )}
                    {formatSyncTime(driver.lastSync)}
                  </span>
                </div>
              </div>

              {/* Load indicator */}
              {truck && (
                <div className="text-right">
                  <div className="text-xs text-muted-foreground mb-1">Load</div>
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        'h-full rounded-full transition-all',
                        truck.currentLoad.weight / truck.capacity.weight > 0.9 
                          ? 'bg-error-solid' 
                          : 'bg-primary'
                      )}
                      style={{ width: `${(truck.currentLoad.weight / truck.capacity.weight) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
