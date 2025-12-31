import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { routes, drivers, trucks, orders, Route as RouteType } from '@/data/mockData';
import { 
  Clock,
  MapPin,
  Truck,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Filter,
  Snowflake
} from 'lucide-react';
import { cn } from '@/lib/utils';

const RoutePlanning = () => {
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(routes[0]);
  const [timelineStart] = useState(5); // 5 AM
  const [timelineEnd] = useState(18); // 6 PM

  const timeSlots = Array.from({ length: timelineEnd - timelineStart + 1 }, (_, i) => timelineStart + i);

  const getTimePosition = (date: Date) => {
    const hours = date.getHours() + date.getMinutes() / 60;
    const totalHours = timelineEnd - timelineStart;
    return ((hours - timelineStart) / totalHours) * 100;
  };

  const getStopWidth = () => {
    // Each stop is about 30 minutes
    const totalHours = timelineEnd - timelineStart;
    return (0.5 / totalHours) * 100;
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getDriver = (driverId: string) => drivers.find(d => d.id === driverId);
  const getTruck = (truckId: string) => trucks.find(t => t.id === truckId);

  const getCapacityPercent = (route: RouteType, type: 'weight' | 'volume') => {
    const truck = getTruck(route.truckId);
    if (!truck) return 0;
    return type === 'weight' 
      ? (route.totalWeight / truck.capacity.weight) * 100
      : (route.totalVolume / truck.capacity.volume) * 100;
  };

  const isCubedOut = (route: RouteType) => {
    const weightPercent = getCapacityPercent(route, 'weight');
    const volumePercent = getCapacityPercent(route, 'volume');
    return volumePercent > 85 && weightPercent < 60;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Route Planning & Dispatch" subtitle="Gantt timeline and fleet visualization" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Gantt Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 border-r border-border overflow-hidden flex flex-col"
        >
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">Route Timeline</h2>
              <span className="text-sm text-muted-foreground">
                {routes.length} active routes
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Timeline Header */}
          <div className="flex border-b border-border bg-muted/30">
            <div className="w-48 flex-shrink-0 p-3 border-r border-border">
              <span className="text-xs font-medium text-muted-foreground uppercase">Driver / Truck</span>
            </div>
            <div className="flex-1 flex relative">
              {timeSlots.map((hour) => (
                <div 
                  key={hour} 
                  className="flex-1 p-2 border-r border-border-subtle text-center"
                >
                  <span className="text-xs text-muted-foreground">
                    {hour > 12 ? `${hour - 12}PM` : hour === 12 ? '12PM' : `${hour}AM`}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gantt Rows */}
          <div className="flex-1 overflow-y-auto scrollbar-thin">
            {routes.map((route, index) => {
              const driver = getDriver(route.driverId);
              const truck = getTruck(route.truckId);
              const isSelected = selectedRoute?.id === route.id;

              return (
                <motion.div
                  key={route.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className={cn(
                    "flex border-b border-border-subtle cursor-pointer transition-colors",
                    isSelected ? "bg-primary/5" : "hover:bg-muted/50"
                  )}
                  onClick={() => setSelectedRoute(route)}
                >
                  {/* Driver Info */}
                  <div className="w-48 flex-shrink-0 p-3 border-r border-border">
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                          {driver?.avatar}
                        </div>
                        <span className={cn(
                          "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card",
                          truck?.status === 'moving' ? 'bg-success-solid' : 
                          truck?.status === 'idle' ? 'bg-info-solid' : 'bg-warning-solid'
                        )} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{driver?.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="font-mono">{truck?.plateNumber}</span>
                          {truck?.type === 'refrigerated' && (
                            <Snowflake className="w-3 h-3 text-info-solid" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="flex-1 relative h-16 flex items-center">
                    {/* Grid lines */}
                    {timeSlots.map((hour) => (
                      <div 
                        key={hour}
                        className="absolute top-0 bottom-0 border-r border-border-subtle"
                        style={{ left: `${((hour - timelineStart) / (timelineEnd - timelineStart)) * 100}%` }}
                      />
                    ))}

                    {/* Current time indicator */}
                    <div 
                      className="absolute top-0 bottom-0 w-0.5 bg-error-solid z-10"
                      style={{ left: `${getTimePosition(new Date())}%` }}
                    >
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-error-solid" />
                    </div>

                    {/* Route duration bar */}
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: 0.1 * index }}
                      className="absolute h-10 rounded-lg bg-primary/20 border border-primary/30 origin-left"
                      style={{
                        left: `${getTimePosition(route.plannedDeparture)}%`,
                        width: `${getTimePosition(route.estimatedReturn) - getTimePosition(route.plannedDeparture)}%`,
                      }}
                    >
                      <div className="absolute inset-0 flex items-center px-2 gap-1 overflow-hidden">
                        {route.stops.map((stop, stopIndex) => (
                          <div
                            key={stop.id}
                            className={cn(
                              "h-6 px-2 rounded flex items-center gap-1 text-xs font-medium whitespace-nowrap",
                              stop.status === 'completed' 
                                ? 'bg-success text-success-foreground' 
                                : stop.status === 'arrived'
                                  ? 'bg-info text-info-foreground'
                                  : 'bg-primary text-primary-foreground'
                            )}
                          >
                            {stop.status === 'completed' ? (
                              <CheckCircle2 className="w-3 h-3" />
                            ) : (
                              <MapPin className="w-3 h-3" />
                            )}
                            <span>{stopIndex + 1}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Right Panel - Route Details & Load Visualization */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 flex-shrink-0 bg-card overflow-y-auto"
        >
          {selectedRoute ? (
            <div className="p-4 space-y-6">
              {/* Route Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg">{selectedRoute.id}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoute.stops.length} stops • {selectedRoute.totalMiles} miles
                  </p>
                </div>
                <span className={cn(
                  "px-3 py-1 rounded-full text-xs font-medium",
                  selectedRoute.status === 'in_progress' 
                    ? 'bg-info text-info-foreground'
                    : selectedRoute.status === 'completed'
                      ? 'bg-success text-success-foreground'
                      : 'bg-warning text-warning-foreground'
                )}>
                  {selectedRoute.status.replace('_', ' ')}
                </span>
              </div>

              {/* Load Builder Visualization */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Truck Capacity</h4>
                
                {isCubedOut(selectedRoute) && (
                  <div className="flex items-center gap-2 p-2 rounded-lg bg-warning text-warning-foreground text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Cubed Out - High volume, low weight</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* Weight Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Weight</span>
                      <span className="font-mono font-medium">
                        {Math.round(getCapacityPercent(selectedRoute, 'weight'))}%
                      </span>
                    </div>
                    <div className="h-24 bg-muted rounded-lg overflow-hidden relative flex flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${getCapacityPercent(selectedRoute, 'weight')}%` }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t-lg",
                          getCapacityPercent(selectedRoute, 'weight') > 90 
                            ? 'bg-error-solid' 
                            : 'bg-primary'
                        )}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-mono text-primary-foreground font-medium">
                          {selectedRoute.totalWeight.toLocaleString()} lbs
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      of {getTruck(selectedRoute.truckId)?.capacity.weight.toLocaleString()} lbs
                    </p>
                  </div>

                  {/* Volume Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Volume</span>
                      <span className="font-mono font-medium">
                        {Math.round(getCapacityPercent(selectedRoute, 'volume'))}%
                      </span>
                    </div>
                    <div className="h-24 bg-muted rounded-lg overflow-hidden relative flex flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${getCapacityPercent(selectedRoute, 'volume')}%` }}
                        transition={{ duration: 0.5 }}
                        className={cn(
                          "w-full rounded-t-lg",
                          getCapacityPercent(selectedRoute, 'volume') > 90 
                            ? 'bg-error-solid' 
                            : isCubedOut(selectedRoute)
                              ? 'bg-warning-solid'
                              : 'bg-info-solid'
                        )}
                      />
                      <div className="absolute inset-0 flex items-end justify-center pb-1">
                        <span className="text-xs font-mono text-primary-foreground font-medium">
                          {selectedRoute.totalVolume} cu ft
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground text-center">
                      of {getTruck(selectedRoute.truckId)?.capacity.volume} cu ft
                    </p>
                  </div>
                </div>
              </div>

              {/* Stop List */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">Stops</h4>
                <div className="space-y-2">
                  {selectedRoute.stops.map((stop, index) => (
                    <motion.div
                      key={stop.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className={cn(
                        "p-3 rounded-lg border transition-all",
                        stop.status === 'completed' 
                          ? 'bg-success/5 border-success/20' 
                          : stop.status === 'arrived'
                            ? 'bg-info/5 border-info/20'
                            : 'border-border hover:border-primary/30'
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium",
                          stop.status === 'completed' 
                            ? 'bg-success text-success-foreground' 
                            : stop.status === 'arrived'
                              ? 'bg-info text-info-foreground'
                              : 'bg-muted text-muted-foreground'
                        )}>
                          {stop.status === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{stop.customerName}</p>
                          <p className="text-xs text-muted-foreground truncate">{stop.address}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Clock className="w-3 h-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {stop.timeWindowStart} - {stop.timeWindowEnd}
                            </span>
                            {stop.actualArrival && (
                              <span className="text-xs text-success-foreground font-medium">
                                Arrived {formatTime(stop.actualArrival)}
                              </span>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-dark transition-colors">
                  <Play className="w-4 h-4" />
                  Dispatch Route
                </button>
                <button className="p-2.5 rounded-lg border border-border hover:bg-muted transition-colors">
                  <RotateCcw className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p className="text-sm">Select a route to view details</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RoutePlanning;
