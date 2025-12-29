import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { trucks, drivers } from '@/data/mockData';
import {
  Truck,
  Snowflake,
  AlertTriangle,
  Wrench,
  Fuel,
  Gauge,
  CheckCircle2,
  MapPin,
  Clock,
  Settings,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Fleet = () => {
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  const statusCounts = {
    moving: trucks.filter(t => t.status === 'moving').length,
    idle: trucks.filter(t => t.status === 'idle').length,
    stopped: trucks.filter(t => t.status === 'stopped').length,
    maintenance: trucks.filter(t => t.status === 'maintenance').length,
  };

  const getTruckDriver = (truckId: string) => drivers.find(d => d.truckId === truckId);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'moving': return { bg: 'bg-success', text: 'text-success-foreground', dot: 'bg-success-solid' };
      case 'idle': return { bg: 'bg-info', text: 'text-info-foreground', dot: 'bg-info-solid' };
      case 'stopped': return { bg: 'bg-error', text: 'text-error-foreground', dot: 'bg-error-solid' };
      default: return { bg: 'bg-warning', text: 'text-warning-foreground', dot: 'bg-warning-solid' };
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'refrigerated': return Snowflake;
      case 'flatbed': return Truck;
      default: return Truck;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Fleet Management" subtitle="Vehicle tracking and maintenance" />

      <div className="p-6 space-y-6 flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Moving', count: statusCounts.moving, color: 'bg-success-solid' },
            { label: 'Idle', count: statusCounts.idle, color: 'bg-info-solid' },
            { label: 'Stopped', count: statusCounts.stopped, color: 'bg-error-solid' },
            { label: 'Maintenance', count: statusCounts.maintenance, color: 'bg-warning-solid' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * index }}
              className="card-elevated p-4"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", stat.color)} />
                <div>
                  <p className="text-2xl font-semibold">{stat.count}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trucks.map((truck, index) => {
            const driver = getTruckDriver(truck.id);
            const status = getStatusStyle(truck.status);
            const TypeIcon = getTypeIcon(truck.type);
            const loadPercent = Math.round((truck.currentLoad.weight / truck.capacity.weight) * 100);

            return (
              <motion.div
                key={truck.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                onClick={() => setSelectedTruck(truck.id === selectedTruck ? null : truck.id)}
                className={cn(
                  "card-elevated p-5 cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedTruck === truck.id && "ring-2 ring-primary",
                  truck.temperatureAlert && "border-error/50"
                )}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2.5 rounded-xl",
                      truck.type === 'refrigerated' ? 'bg-info/20' : 'bg-muted'
                    )}>
                      <TypeIcon className={cn(
                        "w-5 h-5",
                        truck.type === 'refrigerated' ? 'text-info-foreground' : 'text-muted-foreground'
                      )} />
                    </div>
                    <div>
                      <p className="font-mono font-semibold">{truck.plateNumber}</p>
                      <p className="text-xs text-muted-foreground capitalize">{truck.type} truck</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {truck.temperatureAlert && (
                      <AlertTriangle className="w-5 h-5 text-error-foreground animate-pulse" />
                    )}
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                      status.bg, status.text
                    )}>
                      {truck.status}
                    </span>
                  </div>
                </div>

                {/* Driver */}
                {driver && (
                  <div className="flex items-center gap-2 mb-4 p-2 rounded-lg bg-muted/50">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                      {driver.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{driver.name}</p>
                      <p className="text-xs text-muted-foreground">{driver.phone}</p>
                    </div>
                  </div>
                )}

                {/* Temperature (for refrigerated) */}
                {truck.type === 'refrigerated' && (
                  <div className={cn(
                    "flex items-center justify-between p-2 rounded-lg mb-4",
                    truck.temperatureAlert ? "bg-error/10" : "bg-info/10"
                  )}>
                    <div className="flex items-center gap-2">
                      <Snowflake className={cn(
                        "w-4 h-4",
                        truck.temperatureAlert ? "text-error-foreground" : "text-info-foreground"
                      )} />
                      <span className="text-sm font-medium">Temperature</span>
                    </div>
                    <span className={cn(
                      "font-mono font-semibold",
                      truck.temperatureAlert ? "text-error-foreground" : "text-info-foreground"
                    )}>
                      {truck.temperature}°F
                    </span>
                  </div>
                )}

                {/* Load Capacity */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Load Capacity</span>
                    <span className="font-mono font-medium">
                      {truck.currentLoad.weight.toLocaleString()} / {truck.capacity.weight.toLocaleString()} lbs
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${loadPercent}%` }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className={cn(
                        "h-full rounded-full",
                        loadPercent > 90 ? 'bg-error-solid' : loadPercent > 70 ? 'bg-warning-solid' : 'bg-primary'
                      )}
                    />
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">
                    <MapPin className="w-3.5 h-3.5" />
                    Track
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-muted hover:bg-muted/80 transition-colors">
                    <Settings className="w-3.5 h-3.5" />
                    Details
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Fleet;