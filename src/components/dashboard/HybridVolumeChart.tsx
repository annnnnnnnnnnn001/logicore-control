import { motion } from 'framer-motion';
import { dashboardStats } from '@/data/mockData';
import { Truck, Package } from 'lucide-react';

export function HybridVolumeChart() {
  const total = dashboardStats.ownFleetVolume + dashboardStats.carrierVolume;
  const ownFleetPercent = Math.round((dashboardStats.ownFleetVolume / total) * 100);
  const carrierPercent = 100 - ownFleetPercent;

  const circumference = 2 * Math.PI * 40;
  const ownFleetDash = (ownFleetPercent / 100) * circumference;
  const carrierDash = (carrierPercent / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-elevated p-5"
    >
      <h3 className="font-semibold mb-4">Today's Volume Split</h3>
      
      <div className="flex items-center gap-6">
        {/* Donut Chart */}
        <div className="relative w-28 h-28">
          <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
            {/* Own Fleet Arc */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="12"
              stroke="hsl(var(--primary))"
              strokeLinecap="round"
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${ownFleetDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.3 }}
            />
            {/* Carrier Arc */}
            <motion.circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              strokeWidth="12"
              stroke="hsl(var(--warning-solid))"
              strokeLinecap="round"
              strokeDashoffset={-ownFleetDash}
              initial={{ strokeDasharray: `0 ${circumference}` }}
              animate={{ strokeDasharray: `${carrierDash} ${circumference}` }}
              transition={{ duration: 1, delay: 0.5 }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">orders</span>
          </div>
        </div>

        {/* Legend */}
        <div className="space-y-3 flex-1">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Own Fleet</span>
                <span className="text-sm font-semibold">{ownFleetPercent}%</span>
              </div>
              <span className="text-xs text-muted-foreground">{dashboardStats.ownFleetVolume} orders</span>
            </div>
            <Truck className="w-4 h-4 text-primary" />
          </div>
          
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-warning-solid" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Carrier</span>
                <span className="text-sm font-semibold">{carrierPercent}%</span>
              </div>
              <span className="text-xs text-muted-foreground">{dashboardStats.carrierVolume} orders</span>
            </div>
            <Package className="w-4 h-4 text-warning-solid" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
