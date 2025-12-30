import { motion } from 'framer-motion';
import { drivers, trucks, routes } from '@/data/mockData';
import { Snowflake, Wifi, WifiOff, MapPin, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

export function FleetStatus() {
  const navigate = useNavigate();
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
      className="bg-card rounded-xl border border-border shadow-card overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-lg">Active Fleet</h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {activeDrivers.length} of {drivers.length} drivers on route
            </p>
          </div>
          <button 
            onClick={() => navigate('/fleet')}
            className="text-sm text-primary font-medium hover:underline"
          >
            View All
          </button>
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {drivers.slice(0, 8).map((driver, index) => {
            const truck = trucks.find(t => t.id === driver.truckId);
            const route = getDriverRoute(driver.id);
            const offline = isOffline(driver.lastSync);

            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                whileHover={{ y: -2, boxShadow: '0 4px 12px -2px rgba(0,0,0,0.08)' }}
                onClick={() => navigate('/routes')}
                className={cn(
                  'p-4 rounded-xl border border-border bg-card cursor-pointer transition-all duration-200',
                  offline && 'opacity-60',
                  truck?.temperatureAlert && 'border-error/50 bg-error/5'
                )}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {driver.avatar}
                    </div>
                    <span className={cn(
                      'absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-card',
                      truck ? getStatusColor(truck.status) : 'bg-muted-foreground'
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{driver.name}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-mono">{truck?.plateNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Temperature Alert */}
                {truck?.type === 'refrigerated' && (
                  <div className={cn(
                    'flex items-center justify-between p-2 rounded-lg mb-3 text-xs',
                    truck.temperatureAlert ? 'bg-error/10' : 'bg-info/10'
                  )}>
                    <div className="flex items-center gap-1.5">
                      <Snowflake className={cn(
                        'w-3.5 h-3.5',
                        truck.temperatureAlert ? 'text-error-foreground' : 'text-info-foreground'
                      )} />
                      <span className={truck.temperatureAlert ? 'text-error-foreground font-medium' : 'text-info-foreground'}>
                        Temp
                      </span>
                    </div>
                    <span className={cn(
                      'font-mono font-semibold',
                      truck.temperatureAlert ? 'text-error-foreground' : 'text-info-foreground'
                    )}>
                      {truck.temperature}°F
                    </span>
                  </div>
                )}

                {/* Route Info */}
                {route && (
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{route.stops.filter(s => s.status === 'completed').length}/{route.stops.length}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{route.totalMiles} mi</span>
                    </div>
                  </div>
                )}

                {/* Sync Status */}
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    {offline ? (
                      <WifiOff className="w-3 h-3 text-error-foreground" />
                    ) : (
                      <Wifi className="w-3 h-3 text-success-foreground" />
                    )}
                    <span className="text-muted-foreground">{formatSyncTime(driver.lastSync)}</span>
                  </div>
                  
                  {/* Load indicator */}
                  {truck && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Load</span>
                      <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
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
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}