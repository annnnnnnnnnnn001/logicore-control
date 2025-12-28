import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { driverSettlements, DriverSettlement } from '@/data/mockData';
import { 
  DollarSign, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  ChevronDown,
  ChevronUp,
  Image,
  Filter,
  Download,
  Search
} from 'lucide-react';
import { cn } from '@/lib/utils';

type FilterStatus = 'all' | 'pending' | 'reconciled' | 'discrepancy';

const Finance = () => {
  const [filter, setFilter] = useState<FilterStatus>('all');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSettlements = driverSettlements.filter(s => {
    const matchesFilter = filter === 'all' || s.status === filter;
    const matchesSearch = s.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.routeId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totals = {
    expectedCash: driverSettlements.reduce((sum, s) => sum + s.expectedCash, 0),
    expectedCheck: driverSettlements.reduce((sum, s) => sum + s.expectedCheck, 0),
    actualCash: driverSettlements.reduce((sum, s) => sum + s.actualCash, 0),
    actualCheck: driverSettlements.reduce((sum, s) => sum + s.actualCheck, 0),
    variance: driverSettlements.reduce((sum, s) => sum + s.variance, 0),
  };

  const statusCounts = {
    all: driverSettlements.length,
    pending: driverSettlements.filter(s => s.status === 'pending').length,
    reconciled: driverSettlements.filter(s => s.status === 'reconciled').length,
    discrepancy: driverSettlements.filter(s => s.status === 'discrepancy').length,
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'reconciled': return CheckCircle2;
      case 'discrepancy': return AlertTriangle;
      default: return Clock;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'reconciled': return 'bg-success text-success-foreground';
      case 'discrepancy': return 'bg-error text-error-foreground';
      default: return 'bg-warning text-warning-foreground';
    }
  };

  const getRowStyle = (settlement: DriverSettlement) => {
    if (settlement.variance === 0 && settlement.status === 'reconciled') {
      return 'bg-success/5 hover:bg-success/10';
    }
    if (settlement.status === 'discrepancy') {
      return 'bg-error/5 hover:bg-error/10';
    }
    return 'hover:bg-muted/50';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="min-h-screen">
      <Header title="Finance & Reconciliation" subtitle="Driver check-in and cash management" />
      
      <div className="p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <DollarSign className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Expected Total</p>
                <p className="text-xl font-semibold">{formatCurrency(totals.expectedCash + totals.expectedCheck)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/20">
                <CheckCircle2 className="w-5 h-5 text-success-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Collected Total</p>
                <p className="text-xl font-semibold">{formatCurrency(totals.actualCash + totals.actualCheck)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className={cn(
              "card-elevated p-4",
              totals.variance !== 0 && "border-error/50"
            )}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "p-2 rounded-lg",
                totals.variance === 0 ? "bg-success/20" : "bg-error/20"
              )}>
                <AlertTriangle className={cn(
                  "w-5 h-5",
                  totals.variance === 0 ? "text-success-foreground" : "text-error-foreground"
                )} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Variance</p>
                <p className={cn(
                  "text-xl font-semibold",
                  totals.variance < 0 ? "text-error-foreground" : totals.variance > 0 ? "text-success-foreground" : ""
                )}>
                  {formatCurrency(totals.variance)}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="card-elevated p-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/20">
                <Clock className="w-5 h-5 text-warning-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Review</p>
                <p className="text-xl font-semibold">{statusCounts.pending}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Filter & Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card-elevated p-4"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Status Tabs */}
            <div className="flex items-center gap-2">
              {(['all', 'pending', 'reconciled', 'discrepancy'] as FilterStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                    filter === status
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                  <span className="ml-2 text-xs opacity-70">({statusCounts[status]})</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search driver or route..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-56 h-9 pl-9 pr-4 text-sm bg-muted border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground"
                />
              </div>

              {/* Export */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-colors">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </motion.div>

        {/* Reconciliation Grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="card-elevated overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Driver</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Route</th>
                  <th className="text-left font-medium text-muted-foreground py-3 px-4 text-sm">Date</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Expected Cash</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Actual Cash</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Expected Check</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Actual Check</th>
                  <th className="text-right font-medium text-muted-foreground py-3 px-4 text-sm">Variance</th>
                  <th className="text-center font-medium text-muted-foreground py-3 px-4 text-sm">Status</th>
                  <th className="text-center font-medium text-muted-foreground py-3 px-4 text-sm">Proof</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredSettlements.map((settlement, index) => {
                    const StatusIcon = getStatusIcon(settlement.status);
                    const isExpanded = expandedRow === settlement.id;

                    return (
                      <motion.tr
                        key={settlement.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ delay: 0.02 * index }}
                        className={cn(
                          "border-b border-border-subtle transition-colors cursor-pointer",
                          getRowStyle(settlement)
                        )}
                        onClick={() => setExpandedRow(isExpanded ? null : settlement.id)}
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                              {settlement.driverName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <span className="font-medium">{settlement.driverName}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-sm">{settlement.routeId}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{formatDate(settlement.date)}</td>
                        <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(settlement.expectedCash)}</td>
                        <td className={cn(
                          "py-3 px-4 text-right font-mono text-sm",
                          settlement.actualCash !== settlement.expectedCash && "text-error-foreground font-medium"
                        )}>
                          {formatCurrency(settlement.actualCash)}
                        </td>
                        <td className="py-3 px-4 text-right font-mono text-sm">{formatCurrency(settlement.expectedCheck)}</td>
                        <td className={cn(
                          "py-3 px-4 text-right font-mono text-sm",
                          settlement.actualCheck !== settlement.expectedCheck && "text-error-foreground font-medium"
                        )}>
                          {formatCurrency(settlement.actualCheck)}
                        </td>
                        <td className={cn(
                          "py-3 px-4 text-right font-mono text-sm font-medium",
                          settlement.variance < 0 ? "text-error-foreground" : settlement.variance > 0 ? "text-success-foreground" : "text-success-foreground"
                        )}>
                          {settlement.variance === 0 ? (
                            <span className="text-success-foreground">$0.00</span>
                          ) : (
                            formatCurrency(settlement.variance)
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            <span className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
                              getStatusStyle(settlement.status)
                            )}>
                              <StatusIcon className="w-3.5 h-3.5" />
                              {settlement.status.charAt(0).toUpperCase() + settlement.status.slice(1)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex justify-center">
                            {settlement.proofImages.length > 0 ? (
                              <div className="flex items-center gap-1 text-primary">
                                <Image className="w-4 h-4" />
                                <span className="text-xs font-medium">{settlement.proofImages.length}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">None</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <motion.div
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          </motion.div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Finance;
