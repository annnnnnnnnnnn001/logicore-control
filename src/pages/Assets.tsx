import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { rtiAssets, customers } from '@/data/mockData';
import {
  RotateCcw,
  Package,
  AlertTriangle,
  TrendingUp,
  ArrowRightLeft,
  Search,
  Filter,
  Download,
  Plus,
  ChevronRight,
  Truck
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ViewMode = 'ledger' | 'kanban';

const kanbanColumns = [
  { id: 'to_inspect', title: 'To Inspect', color: 'bg-warning' },
  { id: 'restock', title: 'Restock', color: 'bg-info' },
  { id: 'write_off', title: 'Write-Off', color: 'bg-error' },
  { id: 'vendor_return', title: 'Vendor Return', color: 'bg-muted' },
];

const mockReturnedGoods = [
  { id: 'RET001', orderId: 'ORD-78245', customer: 'Metro Foods Inc', reason: 'Damaged packaging', quantity: 5, status: 'to_inspect', photo: true },
  { id: 'RET002', orderId: 'ORD-78251', customer: 'Harbor Distributors', reason: 'Wrong item shipped', quantity: 12, status: 'restock', photo: true },
  { id: 'RET003', orderId: 'ORD-78230', customer: 'Valley Fresh Market', reason: 'Expired product', quantity: 8, status: 'write_off', photo: false },
  { id: 'RET004', orderId: 'ORD-78218', customer: 'City Grocers', reason: 'Quality issue', quantity: 3, status: 'vendor_return', photo: true },
  { id: 'RET005', orderId: 'ORD-78255', customer: 'Prime Wholesale', reason: 'Over-delivery', quantity: 20, status: 'to_inspect', photo: true },
  { id: 'RET006', orderId: 'ORD-78260', customer: 'Central Supply Co', reason: 'Customer refused', quantity: 15, status: 'restock', photo: false },
];

const Assets = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('ledger');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  const totalAssetsOut = rtiAssets.reduce((sum, a) => sum + a.balance, 0);
  const customersWithHighBalance = rtiAssets.filter(a => a.balance > 20).length;

  const filteredAssets = rtiAssets.filter(a =>
    a.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header title="Assets & RTI Management" subtitle="Returnable transport items and reverse logistics" />

      <div className="p-6 space-y-6 flex-1">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-primary/10">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assets Out</p>
                <p className="text-2xl font-semibold">{totalAssetsOut}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-warning/20">
                <AlertTriangle className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">High Balance Customers</p>
                <p className="text-2xl font-semibold text-warning-foreground">{customersWithHighBalance}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-success/20">
                <TrendingUp className="w-5 h-5 text-success-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Returns This Week</p>
                <p className="text-2xl font-semibold text-success-foreground">47</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-metric"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-info/20">
                <ArrowRightLeft className="w-5 h-5 text-info-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Retrievals</p>
                <p className="text-2xl font-semibold">12</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* View Mode Toggle & Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            {/* View Toggle */}
            <div className="flex items-center gap-2 p-1 bg-muted rounded-lg">
              <button
                onClick={() => setViewMode('ledger')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  viewMode === 'ledger'
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                RTI Ledger
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                  viewMode === 'kanban'
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Reverse Logistics
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 h-9 pl-9 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary-dark transition-colors">
                <Plus className="w-4 h-4" />
                Generate Retrieval
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {viewMode === 'ledger' ? (
            <motion.div
              key="ledger"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="card-elevated overflow-hidden"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Customer</th>
                      <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Asset Type</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Quantity Out</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Returned</th>
                      <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Balance</th>
                      <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Last Activity</th>
                      <th className="text-center font-medium text-muted-foreground py-3 px-4 text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAssets.map((asset, index) => (
                      <motion.tr
                        key={asset.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.02 * index }}
                        className={cn(
                          "border-b border-border-subtle transition-colors hover:bg-muted/50",
                          asset.balance > 20 && "bg-warning/5"
                        )}
                      >
                        <td className="py-3 px-4">
                          <span className="font-medium">{asset.customerName}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium capitalize",
                            asset.type === 'pallet' ? 'bg-primary/10 text-primary' :
                              asset.type === 'crate' ? 'bg-info/20 text-info-foreground' :
                                'bg-muted text-muted-foreground'
                          )}>
                            {asset.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-mono">{asset.quantityOut}</td>
                        <td className="py-3 px-4 text-right font-mono text-success-foreground">{asset.quantityReturned}</td>
                        <td className={cn(
                          "py-3 px-4 text-right font-mono font-medium",
                          asset.balance > 20 ? "text-warning-foreground" : ""
                        )}>
                          {asset.balance}
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">
                          {asset.lastActivity.toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            {asset.balance > 10 && (
                              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-primary-foreground hover:bg-primary-dark transition-colors">
                                <Truck className="w-3 h-3" />
                                Schedule Pickup
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="kanban"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {kanbanColumns.map((column) => {
                const items = mockReturnedGoods.filter(g => g.status === column.id);
                return (
                  <div key={column.id} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-3 h-3 rounded-full", column.color)} />
                      <h4 className="font-medium">{column.title}</h4>
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {items.map((item, index) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.05 * index }}
                          className="card-elevated p-3 cursor-pointer hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <span className="font-mono text-xs text-muted-foreground">{item.orderId}</span>
                            {item.photo && (
                              <div className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                                <Package className="w-3 h-3 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium mb-1">{item.customer}</p>
                          <p className="text-xs text-muted-foreground mb-2">{item.reason}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium">{item.quantity} units</span>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Assets;