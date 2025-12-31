import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { LiveMap } from '@/components/map/LiveMap';
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
  Snowflake,
  Map,
  ListOrdered,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'gantt' | 'map';

const RoutePlanning = () => {
  const [selectedRoute, setSelectedRoute] = useState<RouteType | null>(routes[0]);
  const [viewMode, setViewMode] = useState<ViewMode>('gantt');
  const [timelineStart] = useState(5); // 5 AM
  const [timelineEnd] = useState(18); // 6 PM

  const timeSlots = Array.from({ length: timelineEnd - timelineStart + 1 }, (_, i) => timelineStart + i);

  const getTimePosition = (date: Date) => {
    const hours = date.getHours() + date.getMinutes() / 60;
    const totalHours = timelineEnd - timelineStart;
    return ((hours - timelineStart) / totalHours) * 100;
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

  const handleTruckClick = (driverId: string) => {
    const route = routes.find(r => r.driverId === driverId);
    if (route) setSelectedRoute(route);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header title="Route Planning & Dispatch" subtitle="Gantt timeline and fleet visualization" />
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Gantt Chart or Map */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 border-r border-border overflow-hidden flex flex-col"
        >
          {/* Toolbar */}
          <div className="p-4 border-b border-border bg-card flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="font-semibold">
                {viewMode === 'gantt' ? 'Route Timeline' : 'Live Fleet Map'}
              </h2>
              <span className="text-sm text-muted-foreground">
                {routes.length} active routes
              </span>
            </div>
            <div className="flex items-center gap-2">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
                <button 
                  onClick={() => setViewMode('gantt')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    viewMode === 'gantt'
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ListOrdered className="w-4 h-4" />
                  Gantt
                </button>
                <button 
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
                    viewMode === 'map'
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Map className="w-4 h-4" />
                  Map
                </button>
              </div>
              <div className="w-px h-6 bg-border" />
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Filter className="w-4 h-4 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg hover:bg-muted transition-colors">
                <Maximize2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            {viewMode === 'gantt' ? (
              <motion.div
                key="gantt"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col overflow-hidden"
              >
                {/* Timeline Header */}
                <div className="flex border-b border-border bg-muted/30">
                  <div className="w-48 flex-shrink-0 p-3 border-r border-border">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Driver / Truck</span>
                  </div>
                  <div className="flex-1 flex relative">
                    {timeSlots.map((hour) => (
                      <div 
                        key={hour} 
                        className="flex-1 p-2 border-r border-border-subtle text-center"
                      >
                        <span className="text-xs text-muted-foreground font-medium">
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
                          "flex border-b border-border-subtle cursor-pointer transition-all duration-200",
                          isSelected ? "bg-primary/5 shadow-inner" : "hover:bg-muted/50"
                        )}
                        onClick={() => setSelectedRoute(route)}
                      >
                        {/* Driver Info */}
                        <div className="w-48 flex-shrink-0 p-3 border-r border-border">
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                                {driver?.avatar}
                              </div>
                              <span className={cn(
                                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card",
                                truck?.status === 'moving' ? 'bg-success-solid' : 
                                truck?.status === 'idle' ? 'bg-info-solid' : 'bg-warning-solid'
                              )} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-medium truncate">{driver?.name}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <span className="font-mono">{truck?.plateNumber}</span>
                                {truck?.type === 'refrigerated' && (
                                  <Snowflake className={cn(
                                    "w-3 h-3",
                                    truck.temperatureAlert ? "text-error-solid animate-pulse" : "text-info-solid"
                                  )} />
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
                            className="absolute top-0 bottom-0 w-0.5 bg-error-solid z-10 shadow-lg shadow-error-solid/30"
                            style={{ left: `${getTimePosition(new Date())}%` }}
                          >
                            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-error-solid shadow-lg" />
                          </div>

                          {/* Route duration bar */}
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 * index, ease: [0.25, 0.46, 0.45, 0.94] }}
                            className={cn(
                              "absolute h-10 rounded-lg border origin-left shadow-sm",
                              isSelected 
                                ? "bg-primary/30 border-primary/50" 
                                : "bg-primary/20 border-primary/30"
                            )}
                            style={{
                              left: `${getTimePosition(route.plannedDeparture)}%`,
                              width: `${getTimePosition(route.estimatedReturn) - getTimePosition(route.plannedDeparture)}%`,
                            }}
                          >
                            <div className="absolute inset-0 flex items-center px-2 gap-1 overflow-hidden">
                              {route.stops.map((stop, stopIndex) => (
                                <motion.div
                                  key={stop.id}
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  transition={{ delay: 0.1 * index + 0.05 * stopIndex }}
                                  className={cn(
                                    "h-6 px-2 rounded flex items-center gap-1 text-xs font-medium whitespace-nowrap shadow-sm",
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
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="map"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1"
              >
                <LiveMap 
                  selectedRouteId={selectedRoute?.id} 
                  onTruckClick={handleTruckClick}
                  className="h-full"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right Panel - Route Details & Load Visualization */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-96 flex-shrink-0 bg-card overflow-y-auto scrollbar-thin"
        >
          <AnimatePresence mode="wait">
            {selectedRoute ? (
              <motion.div 
                key={selectedRoute.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 space-y-6"
              >
                {/* Route Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedRoute.id}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedRoute.stops.length} stops • {selectedRoute.totalMiles} miles
                    </p>
                  </div>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className={cn(
                      "px-3 py-1.5 rounded-full text-xs font-medium",
                      selectedRoute.status === 'in_progress' 
                        ? 'bg-info text-info-foreground'
                        : selectedRoute.status === 'completed'
                          ? 'bg-success text-success-foreground'
                          : 'bg-warning text-warning-foreground'
                    )}
                  >
                    {selectedRoute.status.replace('_', ' ')}
                  </motion.span>
                </div>

                {/* Load Builder Visualization */}
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Truck Capacity</h4>
                  
                  {isCubedOut(selectedRoute) && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-warning/20 border border-warning/30 text-warning-foreground text-sm"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span className="font-medium">Cubed Out - High volume, low weight</span>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {/* Weight Bar */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Weight</span>
                        <span className="font-mono font-semibold">
                          {Math.round(getCapacityPercent(selectedRoute, 'weight'))}%
                        </span>
                      </div>
                      <div className="h-28 bg-muted rounded-xl overflow-hidden relative flex flex-col justify-end p-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${getCapacityPercent(selectedRoute, 'weight')}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={cn(
                            "w-full rounded-lg absolute bottom-0 left-0 right-0",
                            getCapacityPercent(selectedRoute, 'weight') > 90 
                              ? 'bg-gradient-to-t from-error-solid to-error-solid/70' 
                              : 'bg-gradient-to-t from-primary to-primary/70'
                          )}
                        />
                        <div className="relative z-10 text-center">
                          <span className="text-xs font-mono font-semibold text-primary-foreground drop-shadow-md">
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
                        <span className="font-mono font-semibold">
                          {Math.round(getCapacityPercent(selectedRoute, 'volume'))}%
                        </span>
                      </div>
                      <div className="h-28 bg-muted rounded-xl overflow-hidden relative flex flex-col justify-end p-2">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${getCapacityPercent(selectedRoute, 'volume')}%` }}
                          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                          className={cn(
                            "w-full rounded-lg absolute bottom-0 left-0 right-0",
                            getCapacityPercent(selectedRoute, 'volume') > 90 
                              ? 'bg-gradient-to-t from-error-solid to-error-solid/70' 
                              : isCubedOut(selectedRoute)
                                ? 'bg-gradient-to-t from-warning-solid to-warning-solid/70'
                                : 'bg-gradient-to-t from-info-solid to-info-solid/70'
                          )}
                        />
                        <div className="relative z-10 text-center">
                          <span className="text-xs font-mono font-semibold text-primary-foreground drop-shadow-md">
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
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Stops</h4>
                  <div className="space-y-2">
                    {selectedRoute.stops.map((stop, index) => (
                      <motion.div
                        key={stop.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        whileHover={{ x: 4 }}
                        className={cn(
                          "p-3 rounded-xl border transition-all cursor-grab active:cursor-grabbing group",
                          stop.status === 'completed' 
                            ? 'bg-success/10 border-success/30' 
                            : stop.status === 'arrived'
                              ? 'bg-info/10 border-info/30'
                              : 'border-border hover:border-primary/40 hover:bg-muted/30'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <GripVertical className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                          <div className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0",
                            stop.status === 'completed' 
                              ? 'bg-success text-success-foreground' 
                              : stop.status === 'arrived'
                                ? 'bg-info text-info-foreground'
                                : 'bg-muted text-muted-foreground'
                          )}>
                            {stop.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm">{stop.customerName}</p>
                            <p className="text-xs text-muted-foreground truncate">{stop.address}</p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {stop.timeWindowStart} - {stop.timeWindowEnd}
                              </span>
                              {stop.actualArrival && (
                                <span className="text-xs text-success-foreground font-medium">
                                  ✓ {formatTime(stop.actualArrival)}
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-dark transition-colors shadow-sm"
                  >
                    <Play className="w-4 h-4" />
                    Dispatch Route
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-xl border border-border hover:bg-muted transition-colors"
                  >
                    <RotateCcw className="w-4 h-4 text-muted-foreground" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-full text-muted-foreground"
              >
                <div className="text-center p-6">
                  <Truck className="w-12 h-12 mx-auto mb-4 opacity-30" />
                  <p className="font-medium">Select a route</p>
                  <p className="text-sm">Click on a route to view details</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default RoutePlanning;
