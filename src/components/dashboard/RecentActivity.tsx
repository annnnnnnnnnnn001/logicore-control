import { motion } from 'framer-motion';
import { 
  Truck, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  MapPin,
  Package,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';

const activities = [
  { 
    id: 1, 
    type: 'delivery', 
    message: 'Order ORD-78301 delivered to Pacific Trading', 
    time: '2 min ago',
    icon: CheckCircle2,
    color: 'success'
  },
  { 
    id: 2, 
    type: 'dispatch', 
    message: 'Route RTE003 dispatched with 5 stops', 
    time: '8 min ago',
    icon: Truck,
    color: 'primary'
  },
  { 
    id: 3, 
    type: 'alert', 
    message: 'Temperature spike detected on TRK004', 
    time: '15 min ago',
    icon: AlertTriangle,
    color: 'error'
  },
  { 
    id: 4, 
    type: 'settlement', 
    message: 'Driver John Martinez check-in completed', 
    time: '22 min ago',
    icon: DollarSign,
    color: 'info'
  },
  { 
    id: 5, 
    type: 'order', 
    message: 'New order ORD-78345 received from Metro Foods', 
    time: '35 min ago',
    icon: Package,
    color: 'warning'
  },
  { 
    id: 6, 
    type: 'location', 
    message: 'Driver Sarah Chen arrived at Eastern Imports', 
    time: '41 min ago',
    icon: MapPin,
    color: 'primary'
  },
];

const colorMap = {
  success: { bg: 'bg-success', text: 'text-success-foreground' },
  primary: { bg: 'bg-primary/10', text: 'text-primary' },
  error: { bg: 'bg-error', text: 'text-error-foreground' },
  warning: { bg: 'bg-warning', text: 'text-warning-foreground' },
  info: { bg: 'bg-info', text: 'text-info-foreground' },
};

export function RecentActivity() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="card-elevated p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-semibold">Recent Activity</h3>
        </div>
        <button className="text-xs text-primary hover:underline font-medium">
          View all
        </button>
      </div>

      <div className="space-y-1">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          const colors = colorMap[activity.color as keyof typeof colorMap];

          return (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.05 * index }}
              className="flex items-start gap-3 py-3 border-b border-border-subtle last:border-0"
            >
              <div className={cn(
                "p-2 rounded-lg flex-shrink-0",
                colors.bg
              )}>
                <Icon className={cn("w-4 h-4", colors.text)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm leading-relaxed">{activity.message}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{activity.time}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}