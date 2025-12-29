import { useState } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { drivers, trucks, routes } from '@/data/mockData';
import {
  Users,
  Clock,
  Phone,
  MapPin,
  Truck,
  Wifi,
  WifiOff,
  Coffee,
  CheckCircle2,
  XCircle,
  Search,
  Filter,
  ChevronRight,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';

type StatusFilter = 'all' | 'active' | 'idle' | 'break' | 'offline';

const Drivers = () => {
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrivers = drivers.filter(d => {
    const matchesFilter = filter === 'all' || d.status === filter;
    const matchesSearch = d.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: drivers.length,
    active: drivers.filter(d => d.status === 'active').length,
    idle: drivers.filter(d => d.status === 'idle').length,
    break: drivers.filter(d => d.status === 'break').length,
    offline: drivers.filter(d => d.status === 'offline').length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: 'bg-success', text: 'text-success-foreground', icon: CheckCircle2 };
      case 'idle': return { bg: 'bg-info', text: 'text-info-foreground', icon: Clock };
      case 'break': return { bg: 'bg-warning', text: 'text-warning-foreground', icon: Coffee };
      default: return { bg: 'bg-muted', text: 'text-muted-foreground', icon: XCircle };
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
    return (new Date().getTime() - date.getTime()) / 1000 > 3600;
  };

  const getDriverRoute = (driverId: string) => routes.find(r => r.driverId === driverId);
  const getDriverTruck = (truckId: string) => trucks.find(t => t.id === truckId);

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Driver Management" subtitle="Track and manage your fleet drivers" />

      <div className="p-6 space-y-6 flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {(['all', 'active', 'idle', 'break', 'offline'] as StatusFilter[]).map((status, index) => {
            const style = status === 'all' ? null : getStatusStyle(status);
            return (
              <motion.div
                key={status}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                onClick={() => setFilter(status)}
                className={cn(
                  "card-elevated p-4 cursor-pointer transition-all duration-200 hover:shadow-md",
                  filter === status && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  {style ? (
                    <div className={cn("w-3 h-3 rounded-full", style.bg.replace('bg-', 'bg-') + '-solid')} />
                  ) : (
                    <Users className="w-5 h-5 text-primary" />
                  )}
                  <div>
                    <p className="text-2xl font-semibold">{statusCounts[status]}</p>
                    <p className="text-sm text-muted-foreground capitalize">{status}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated p-4"
        >
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search drivers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
        </motion.div>

        {/* Drivers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDrivers.map((driver, index) => {
            const status = getStatusStyle(driver.status);
            const StatusIcon = status.icon;
            const route = getDriverRoute(driver.id);
            const truck = getDriverTruck(driver.truckId);
            const offline = isOffline(driver.lastSync);

            return (
              <motion.div
                key={driver.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.03 * index }}
                className={cn(
                  "card-elevated p-5 transition-all duration-200 hover:shadow-md",
                  offline && "opacity-75"
                )}
              >
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
                      {driver.avatar}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-card flex items-center justify-center",
                      status.bg
                    )}>
                      <StatusIcon className="w-2.5 h-2.5 text-primary-foreground" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{driver.name}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5" />
                      {driver.phone}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {offline ? (
                        <WifiOff className="w-3.5 h-3.5 text-error-foreground" />
                      ) : (
                        <Wifi className="w-3.5 h-3.5 text-success-foreground" />
                      )}
                      <span className="text-xs text-muted-foreground">
                        Synced {formatSyncTime(driver.lastSync)}
                      </span>
                    </div>
                  </div>
                  <span className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                    status.bg, status.text
                  )}>
                    {driver.status}
                  </span>
                </div>

                {/* Assigned Truck */}
                {truck && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 mb-4">
                    <Truck className="w-5 h-5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-mono text-sm font-medium">{truck.plateNumber}</p>
                      <p className="text-xs text-muted-foreground capitalize">{truck.type} truck</p>
                    </div>
                    <span className={cn(
                      "w-2.5 h-2.5 rounded-full",
                      truck.status === 'moving' ? 'bg-success-solid' :
                        truck.status === 'idle' ? 'bg-info-solid' : 'bg-error-solid'
                    )} />
                  </div>
                )}

                {/* Current Route */}
                {route && (
                  <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-primary uppercase">Active Route</span>
                      <span className="font-mono text-sm">{route.id}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5" />
                        {route.stops.length} stops
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <TrendingUp className="w-3.5 h-3.5" />
                        {route.totalMiles} mi
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-2 pt-4 border-t border-border">
                  <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-dark transition-colors">
                    <Phone className="w-4 h-4" />
                    Contact
                  </button>
                  <button className="px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                    <ChevronRight className="w-4 h-4" />
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

export default Drivers;