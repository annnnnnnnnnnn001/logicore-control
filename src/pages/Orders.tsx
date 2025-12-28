import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { orders, Order } from '@/data/mockData';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  AlertTriangle,
  Clock,
  Search,
  Filter,
  ChevronDown,
  MapPin,
  Scale,
  Box,
  Calendar,
  CreditCard,
  Route,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

type OrderStatus = 'all' | 'unplanned' | 'routing' | 'in_transit' | 'delivered' | 'exception';

const Orders = () => {
  const [filter, setFilter] = useState<OrderStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = orders.filter(o => {
    const matchesFilter = filter === 'all' || o.status === filter;
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const statusCounts = {
    all: orders.length,
    unplanned: orders.filter(o => o.status === 'unplanned').length,
    routing: orders.filter(o => o.status === 'routing').length,
    in_transit: orders.filter(o => o.status === 'in_transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    exception: orders.filter(o => o.status === 'exception').length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-success text-success-foreground';
      case 'in_transit': return 'bg-info text-info-foreground';
      case 'routing': return 'bg-primary/10 text-primary';
      case 'exception': return 'bg-error text-error-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-error text-error-foreground';
      case 'express': return 'bg-warning text-warning-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders(prev => 
      prev.includes(orderId) 
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Order Management" subtitle="Decision engine for order routing" />
      
      <div className="p-6 space-y-6 flex-1">
        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-elevated p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
              {(['all', 'unplanned', 'routing', 'in_transit', 'delivered', 'exception'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 whitespace-nowrap",
                    filter === status
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {status === 'in_transit' ? 'In Transit' : status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 text-xs opacity-70">({statusCounts[status]})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 h-9 pl-9 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>
        </motion.div>

        {/* Orders Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-10 py-3 px-4">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-border"
                      checked={selectedOrders.length === filteredOrders.length}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOrders(filteredOrders.map(o => o.id));
                        } else {
                          setSelectedOrders([]);
                        }
                      }}
                    />
                  </th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Order ID</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Customer</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Type</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Weight</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Volume</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Delivery Date</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Window</th>
                  <th className="text-center font-medium text-muted-foreground py-3 px-4 text-sm">Priority</th>
                  <th className="text-center font-medium text-muted-foreground py-3 px-4 text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredOrders.slice(0, 20).map((order, index) => (
                    <motion.tr
                      key={order.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: 0.02 * index }}
                      className={cn(
                        "border-b border-border-subtle transition-colors",
                        selectedOrders.includes(order.id) ? "bg-primary/5" : "hover:bg-muted/50",
                        order.creditHold && "bg-error/5"
                      )}
                    >
                      <td className="py-3 px-4">
                        <input 
                          type="checkbox" 
                          className="w-4 h-4 rounded border-border"
                          checked={selectedOrders.includes(order.id)}
                          onChange={() => toggleOrderSelection(order.id)}
                        />
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-medium">{order.id}</span>
                          {order.creditHold && (
                            <CreditCard className="w-4 h-4 text-error-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-sm">{order.customerName}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {order.city}
                          </p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className={cn(
                          "inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium",
                          order.type === 'route' ? 'bg-primary/10 text-primary' : 'bg-warning/20 text-warning-foreground'
                        )}>
                          {order.type === 'route' ? <Truck className="w-3 h-3" /> : <Package className="w-3 h-3" />}
                          {order.type === 'route' ? 'Route' : 'Carrier'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="group relative">
                          <span className="font-mono text-sm">
                            {order.actualWeight || order.estimatedWeight} lbs
                          </span>
                          {order.actualWeight && order.actualWeight !== order.estimatedWeight && (
                            <div className="absolute right-0 top-full mt-1 hidden group-hover:block z-10">
                              <div className="bg-popover border border-border rounded-lg shadow-lg p-2 text-xs">
                                <p className="text-muted-foreground">Est: {order.estimatedWeight} lbs</p>
                                <p className="font-medium">Act: {order.actualWeight} lbs</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-sm">
                        {order.volumeCubicFt} ft³
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 text-sm">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          {formatDate(order.requiredDeliveryDate)}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {order.deliveryWindow.start} - {order.deliveryWindow.end}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium uppercase",
                            getPriorityStyle(order.priority)
                          )}>
                            {order.priority}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex justify-center">
                          <span className={cn(
                            "px-2.5 py-1 rounded-full text-xs font-medium",
                            getStatusStyle(order.status)
                          )}>
                            {order.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Floating Action Bar */}
      <AnimatePresence>
        {selectedOrders.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
          >
            <div className="flex items-center gap-4 px-6 py-3 bg-card border border-border rounded-xl shadow-elevated">
              <span className="text-sm font-medium">
                {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
              </span>
              <div className="w-px h-6 bg-border" />
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary-dark transition-colors">
                <Route className="w-4 h-4" />
                Route Optimization
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-warning text-warning-foreground font-medium text-sm hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
                Rate Shop
              </button>
              <button 
                onClick={() => setSelectedOrders([])}
                className="px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted transition-colors"
              >
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
