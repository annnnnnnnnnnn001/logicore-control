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
  DollarSign
} from 'lucide-react';

const ControlTower = () => {
  const today = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen">
      <Header title="Control Tower" subtitle={today} />
      
      <div className="p-6 space-y-6">
        {/* Top Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <MetricCard
            title="Unplanned Orders"
            value={dashboardStats.unplannedOrders}
            subtitle="Need assignment"
            icon={Package}
            variant="warning"
          />
          <MetricCard
            title="In Transit"
            value={dashboardStats.inTransitOrders}
            subtitle="Currently delivering"
            icon={Truck}
            variant="info"
          />
          <MetricCard
            title="Delivered Today"
            value={dashboardStats.deliveredToday}
            subtitle="Completed"
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Exceptions"
            value={dashboardStats.exceptionOrders + dashboardStats.criticalExceptions}
            subtitle={`${dashboardStats.criticalExceptions} critical`}
            icon={AlertTriangle}
            variant="error"
          />
          <MetricCard
            title="Pending Settlements"
            value={dashboardStats.pendingReconciliations}
            subtitle={`${dashboardStats.discrepancies} discrepancies`}
            icon={DollarSign}
            variant={dashboardStats.discrepancies > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Active Drivers"
            value={`${dashboardStats.activeDrivers}/${dashboardStats.totalDrivers}`}
            subtitle="On route"
            icon={Clock}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DeliveryPerformance />
              <HybridVolumeChart />
            </div>
            <FleetStatus />
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <ExceptionFeed />
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ControlTower;