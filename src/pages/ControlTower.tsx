import { motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { HybridVolumeChart } from '@/components/dashboard/HybridVolumeChart';
import { ExceptionFeed } from '@/components/dashboard/ExceptionFeed';
import { FleetStatus } from '@/components/dashboard/FleetStatus';
import { DeliveryPerformance } from '@/components/dashboard/DeliveryPerformance';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { dashboardStats } from '@/data/mockData';
import { 
  Package, 
  Truck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

const ControlTower = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Calculate trends (mock)
  const trends = {
    unplanned: { value: -12, positive: true },
    inTransit: { value: 8, positive: true },
    delivered: { value: 15, positive: true },
    exceptions: { value: 3, positive: false },
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Control Tower" subtitle={today} />
      
      <div className="p-6 space-y-6">
        {/* Welcome Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/10 p-6"
        >
          <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-1">Good morning! Here's your fleet status.</h2>
            <p className="text-muted-foreground text-sm">
              {dashboardStats.activeDrivers} drivers active • {dashboardStats.inTransitOrders} orders in transit
            </p>
          </div>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10">
            <Truck className="w-32 h-32 text-primary" />
          </div>
        </motion.div>

        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <MetricCard
              title="Unplanned Orders"
              value={dashboardStats.unplannedOrders}
              subtitle="Need assignment"
              icon={Package}
              variant="warning"
              trend={trends.unplanned}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <MetricCard
              title="In Transit"
              value={dashboardStats.inTransitOrders}
              subtitle="Currently delivering"
              icon={Truck}
              variant="info"
              trend={trends.inTransit}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <MetricCard
              title="Delivered Today"
              value={dashboardStats.deliveredToday}
              subtitle="Completed"
              icon={CheckCircle2}
              variant="success"
              trend={trends.delivered}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <MetricCard
              title="Exceptions"
              value={dashboardStats.exceptionOrders + dashboardStats.criticalExceptions}
              subtitle={`${dashboardStats.criticalExceptions} critical`}
              icon={AlertTriangle}
              variant="error"
              trend={trends.exceptions}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <MetricCard
              title="Pending Settlements"
              value={dashboardStats.pendingReconciliations}
              subtitle={`${dashboardStats.discrepancies} discrepancies`}
              icon={DollarSign}
              variant={dashboardStats.discrepancies > 0 ? 'warning' : 'default'}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <MetricCard
              title="Active Drivers"
              value={`${dashboardStats.activeDrivers}/${dashboardStats.totalDrivers}`}
              subtitle="On route"
              icon={Clock}
              variant="default"
            />
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <DeliveryPerformance />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <HybridVolumeChart />
              </motion.div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <FleetStatus />
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <ExceptionFeed />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <RecentActivity />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTower;