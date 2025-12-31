import { motion } from 'framer-motion';
import { drivers, trucks, routes } from '@/data/mockData';
import { Snowflake, Wifi, WifiOff, MapPin, Navigation, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FleetStatus() {
  const activeDrivers = drivers.filter(d => d.status === 'active' || d.status === 'idle');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-success-solid';
      case 'idle': return 'bg-info-solid';
      case 'stopped': return 'bg-error-solid';
      default: return 'bg-warning-solid';
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

  const getDriverRoute = (driverId: string) => routes.find(r => r.driverId === driverId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="card-elevated"
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-primary/10">
            <Truck className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-semibold">Active Fleet</h3>
        </div>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-success/20 text-success-foreground">
          {activeDrivers.length}/{drivers.length} online
        </span>
      </div>

      <div className="p-2 max-h-[320px] overflow-y-auto scrollbar-thin">
        <div className="space-y-1">
          {drivers.map((driver, index) => {
            const truck = trucks.find(t => t.id === driver.truckId);
            const route = getDriverRoute(driver.id);
            const offline = isOffline(driver.lastSync);

            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.02 * index }}
                whileHover={{ x: 4, backgroundColor: 'hsl(var(--muted)/0.5)' }}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all',
                  offline && 'opacity-50'
                )}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                    {driver.avatar}
                  </div>
                  <span className={cn(
                    'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card',
                    truck ? getStatusColor(truck.status) : 'bg-muted-foreground'
                  )} />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{driver.name}</span>
                    {truck?.type === 'refrigerated' && (
                      <div className={cn(
                        'flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full font-medium',
                        truck.temperatureAlert 
                          ? 'bg-error/20 text-error-foreground' 
                          : 'bg-info/20 text-info-foreground'
                      )}>
                        <Snowflake className="w-3 h-3" />
                        <span className="font-mono">{truck.temperature}°F</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
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

                {/* Route/Load */}
                <div className="text-right flex-shrink-0">
                  {route ? (
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs text-primary font-medium">
                        <Navigation className="w-3 h-3" />
                        {route.id}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {route.stops.filter(s => s.status !== 'completed').length} left
                      </div>
                    </div>
                  ) : (
                    <span className="text-xs text-muted-foreground">No route</span>
                  )}
                </div>

                {/* Load indicator */}
                {truck && (
                  <div className="flex-shrink-0">
                    <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(truck.currentLoad.weight / truck.capacity.weight) * 100}%` }}
                        transition={{ duration: 0.5, delay: 0.1 * index }}
                        className={cn(
                          'h-full rounded-full',
                          truck.currentLoad.weight / truck.capacity.weight > 0.9 
                            ? 'bg-error-solid' 
                            : truck.currentLoad.weight / truck.capacity.weight > 0.7
                              ? 'bg-warning-solid'
                              : 'bg-primary'
                        )}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center mt-0.5">
                      {Math.round((truck.currentLoad.weight / truck.capacity.weight) * 100)}%
                    </p>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
