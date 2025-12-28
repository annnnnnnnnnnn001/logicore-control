// LogiCore Mock Data - Comprehensive TMS Dataset

export interface Driver {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  status: 'active' | 'idle' | 'offline' | 'break';
  truckId: string;
  lastSync: Date;
  currentLocation?: { lat: number; lng: number };
}

export interface Truck {
  id: string;
  plateNumber: string;
  type: 'box' | 'refrigerated' | 'flatbed';
  capacity: { weight: number; volume: number };
  currentLoad: { weight: number; volume: number };
  status: 'moving' | 'idle' | 'stopped' | 'maintenance';
  temperature?: number; // For refrigerated trucks
  temperatureAlert?: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  status: 'unplanned' | 'routing' | 'in_transit' | 'delivered' | 'exception';
  type: 'route' | 'carrier';
  estimatedWeight: number;
  actualWeight?: number;
  volumeCubicFt: number;
  requiredDeliveryDate: Date;
  deliveryWindow: { start: string; end: string };
  address: string;
  city: string;
  priority: 'standard' | 'express' | 'urgent';
  creditHold?: boolean;
  assignedRouteId?: string;
  carrierTrackingId?: string;
}

export interface Route {
  id: string;
  driverId: string;
  truckId: string;
  status: 'planning' | 'dispatched' | 'in_progress' | 'completed';
  stops: RouteStop[];
  plannedDeparture: Date;
  estimatedReturn: Date;
  totalMiles: number;
  totalWeight: number;
  totalVolume: number;
}

export interface RouteStop {
  id: string;
  orderId: string;
  customerName: string;
  address: string;
  plannedArrival: Date;
  actualArrival?: Date;
  timeWindowStart: string;
  timeWindowEnd: string;
  status: 'pending' | 'arrived' | 'completed' | 'skipped';
  sequence: number;
}

export interface ImportContainer {
  id: string;
  containerId: string;
  arrivalDate: Date;
  freeDaysRemaining: number;
  demurragePerDay: number;
  status: 'at_port' | 'in_transit' | 'at_warehouse' | 'unloaded';
  contents: string;
  totalPallets: number;
  unloadedPallets: number;
}

export interface CarrierShipment {
  id: string;
  carrier: 'FedEx' | 'UPS' | 'LTL';
  trackingNumber: string;
  orderId: string;
  status: 'label_created' | 'picked_up' | 'in_transit' | 'delivered';
  estimatedDelivery: Date;
  cost: number;
}

export interface Customer {
  id: string;
  name: string;
  address: string;
  city: string;
  creditLimit: number;
  currentBalance: number;
  rtiBalance: { pallets: number; crates: number };
  deliveryCost: number;
  lastOrderRevenue: number;
}

export interface DriverSettlement {
  id: string;
  driverId: string;
  driverName: string;
  routeId: string;
  date: Date;
  expectedCash: number;
  expectedCheck: number;
  actualCash: number;
  actualCheck: number;
  variance: number;
  status: 'pending' | 'reconciled' | 'discrepancy';
  proofImages: string[];
}

export interface Exception {
  id: string;
  type: 'temperature' | 'delay' | 'credit_hold' | 'damage' | 'missing_item';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: Date;
  relatedEntity: { type: 'driver' | 'order' | 'route' | 'customer'; id: string; name: string };
  resolved: boolean;
}

export interface RTIAsset {
  id: string;
  type: 'pallet' | 'crate' | 'dolly';
  customerId: string;
  customerName: string;
  quantityOut: number;
  quantityReturned: number;
  balance: number;
  lastActivity: Date;
}

// Generate realistic mock data
const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();

export const drivers: Driver[] = [
  { id: 'DRV001', name: 'John Martinez', avatar: 'JM', phone: '(555) 123-4567', status: 'active', truckId: 'TRK001', lastSync: new Date(Date.now() - 120000), currentLocation: { lat: 40.7128, lng: -74.0060 } },
  { id: 'DRV002', name: 'Sarah Chen', avatar: 'SC', phone: '(555) 234-5678', status: 'active', truckId: 'TRK002', lastSync: new Date(Date.now() - 60000), currentLocation: { lat: 40.7580, lng: -73.9855 } },
  { id: 'DRV003', name: 'Mike Thompson', avatar: 'MT', phone: '(555) 345-6789', status: 'idle', truckId: 'TRK003', lastSync: new Date(Date.now() - 300000), currentLocation: { lat: 40.6892, lng: -74.0445 } },
  { id: 'DRV004', name: 'Emily Davis', avatar: 'ED', phone: '(555) 456-7890', status: 'active', truckId: 'TRK004', lastSync: new Date(Date.now() - 180000), currentLocation: { lat: 40.7484, lng: -73.9857 } },
  { id: 'DRV005', name: 'Carlos Rodriguez', avatar: 'CR', phone: '(555) 567-8901', status: 'break', truckId: 'TRK005', lastSync: new Date(Date.now() - 900000) },
  { id: 'DRV006', name: 'Lisa Wang', avatar: 'LW', phone: '(555) 678-9012', status: 'active', truckId: 'TRK006', lastSync: new Date(Date.now() - 45000), currentLocation: { lat: 40.7614, lng: -73.9776 } },
  { id: 'DRV007', name: 'James Wilson', avatar: 'JW', phone: '(555) 789-0123', status: 'offline', truckId: 'TRK007', lastSync: new Date(Date.now() - 14400000) },
  { id: 'DRV008', name: 'Ana Gonzalez', avatar: 'AG', phone: '(555) 890-1234', status: 'active', truckId: 'TRK008', lastSync: new Date(Date.now() - 90000), currentLocation: { lat: 40.7282, lng: -73.7949 } },
  { id: 'DRV009', name: 'David Kim', avatar: 'DK', phone: '(555) 901-2345', status: 'idle', truckId: 'TRK009', lastSync: new Date(Date.now() - 600000) },
  { id: 'DRV010', name: 'Rachel Brown', avatar: 'RB', phone: '(555) 012-3456', status: 'active', truckId: 'TRK010', lastSync: new Date(Date.now() - 30000), currentLocation: { lat: 40.7831, lng: -73.9712 } },
];

export const trucks: Truck[] = [
  { id: 'TRK001', plateNumber: 'ABC-1234', type: 'box', capacity: { weight: 10000, volume: 1200 }, currentLoad: { weight: 7500, volume: 950 }, status: 'moving' },
  { id: 'TRK002', plateNumber: 'DEF-5678', type: 'refrigerated', capacity: { weight: 8000, volume: 1000 }, currentLoad: { weight: 6200, volume: 800 }, status: 'moving', temperature: 34, temperatureAlert: false },
  { id: 'TRK003', plateNumber: 'GHI-9012', type: 'box', capacity: { weight: 12000, volume: 1400 }, currentLoad: { weight: 4000, volume: 1350 }, status: 'idle' },
  { id: 'TRK004', plateNumber: 'JKL-3456', type: 'refrigerated', capacity: { weight: 8000, volume: 1000 }, currentLoad: { weight: 7800, volume: 650 }, status: 'moving', temperature: 42, temperatureAlert: true },
  { id: 'TRK005', plateNumber: 'MNO-7890', type: 'flatbed', capacity: { weight: 15000, volume: 800 }, currentLoad: { weight: 0, volume: 0 }, status: 'stopped' },
  { id: 'TRK006', plateNumber: 'PQR-1357', type: 'box', capacity: { weight: 10000, volume: 1200 }, currentLoad: { weight: 8500, volume: 1100 }, status: 'moving' },
  { id: 'TRK007', plateNumber: 'STU-2468', type: 'box', capacity: { weight: 10000, volume: 1200 }, currentLoad: { weight: 0, volume: 0 }, status: 'maintenance' },
  { id: 'TRK008', plateNumber: 'VWX-3691', type: 'refrigerated', capacity: { weight: 8000, volume: 1000 }, currentLoad: { weight: 5500, volume: 700 }, status: 'moving', temperature: 36, temperatureAlert: false },
  { id: 'TRK009', plateNumber: 'YZA-4820', type: 'box', capacity: { weight: 12000, volume: 1400 }, currentLoad: { weight: 2000, volume: 400 }, status: 'idle' },
  { id: 'TRK010', plateNumber: 'BCD-5931', type: 'box', capacity: { weight: 10000, volume: 1200 }, currentLoad: { weight: 9200, volume: 1150 }, status: 'moving' },
];

const customerNames = ['Metro Foods Inc', 'Harbor Distributors', 'Valley Fresh Market', 'City Grocers', 'Prime Wholesale', 'Central Supply Co', 'Eastern Imports', 'Pacific Trading', 'Summit Foods', 'Golden Gate Dist.'];

export const customers: Customer[] = customerNames.map((name, i) => ({
  id: `CUS${String(i + 1).padStart(3, '0')}`,
  name,
  address: `${100 + i * 50} Commerce Street`,
  city: ['New York', 'Brooklyn', 'Queens', 'Bronx', 'Jersey City'][i % 5],
  creditLimit: [50000, 75000, 100000, 25000, 150000][i % 5],
  currentBalance: Math.floor(Math.random() * 40000),
  rtiBalance: { pallets: Math.floor(Math.random() * 30), crates: Math.floor(Math.random() * 50) },
  deliveryCost: 35 + Math.floor(Math.random() * 40),
  lastOrderRevenue: 200 + Math.floor(Math.random() * 500),
}));

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

export const orders: Order[] = [
  // Unplanned orders
  { id: 'ORD-78341', customerId: 'CUS001', customerName: 'Metro Foods Inc', status: 'unplanned', type: 'route', estimatedWeight: 1250, volumeCubicFt: 145, requiredDeliveryDate: tomorrow, deliveryWindow: { start: '08:00', end: '12:00' }, address: '150 Commerce Street', city: 'New York', priority: 'standard' },
  { id: 'ORD-78342', customerId: 'CUS002', customerName: 'Harbor Distributors', status: 'unplanned', type: 'route', estimatedWeight: 2100, volumeCubicFt: 220, requiredDeliveryDate: tomorrow, deliveryWindow: { start: '09:00', end: '14:00' }, address: '200 Dock Avenue', city: 'Brooklyn', priority: 'express' },
  { id: 'ORD-78343', customerId: 'CUS003', customerName: 'Valley Fresh Market', status: 'unplanned', type: 'route', estimatedWeight: 890, volumeCubicFt: 95, requiredDeliveryDate: tomorrow, deliveryWindow: { start: '06:00', end: '10:00' }, address: '75 Valley Road', city: 'Queens', priority: 'urgent', creditHold: true },
  { id: 'ORD-78344', customerId: 'CUS004', customerName: 'City Grocers', status: 'unplanned', type: 'carrier', estimatedWeight: 450, volumeCubicFt: 48, requiredDeliveryDate: tomorrow, deliveryWindow: { start: '10:00', end: '16:00' }, address: '320 Main Street', city: 'Bronx', priority: 'standard' },
  
  // Routing orders
  { id: 'ORD-78320', customerId: 'CUS005', customerName: 'Prime Wholesale', status: 'routing', type: 'route', estimatedWeight: 3200, actualWeight: 3180, volumeCubicFt: 380, requiredDeliveryDate: today, deliveryWindow: { start: '07:00', end: '11:00' }, address: '500 Industrial Blvd', city: 'Jersey City', priority: 'standard', assignedRouteId: 'RTE001' },
  { id: 'ORD-78321', customerId: 'CUS006', customerName: 'Central Supply Co', status: 'routing', type: 'route', estimatedWeight: 1850, actualWeight: 1920, volumeCubicFt: 210, requiredDeliveryDate: today, deliveryWindow: { start: '08:00', end: '12:00' }, address: '280 Supply Lane', city: 'New York', priority: 'express', assignedRouteId: 'RTE001' },
  { id: 'ORD-78322', customerId: 'CUS007', customerName: 'Eastern Imports', status: 'routing', type: 'route', estimatedWeight: 2400, actualWeight: 2380, volumeCubicFt: 290, requiredDeliveryDate: today, deliveryWindow: { start: '09:00', end: '14:00' }, address: '150 Harbor Drive', city: 'Brooklyn', priority: 'standard', assignedRouteId: 'RTE002' },
  
  // In Transit orders
  { id: 'ORD-78301', customerId: 'CUS008', customerName: 'Pacific Trading', status: 'in_transit', type: 'route', estimatedWeight: 1600, actualWeight: 1580, volumeCubicFt: 175, requiredDeliveryDate: today, deliveryWindow: { start: '10:00', end: '14:00' }, address: '400 Pacific Avenue', city: 'Queens', priority: 'standard', assignedRouteId: 'RTE003' },
  { id: 'ORD-78302', customerId: 'CUS009', customerName: 'Summit Foods', status: 'in_transit', type: 'route', estimatedWeight: 2200, actualWeight: 2250, volumeCubicFt: 260, requiredDeliveryDate: today, deliveryWindow: { start: '11:00', end: '15:00' }, address: '720 Summit Street', city: 'Bronx', priority: 'express', assignedRouteId: 'RTE003' },
  { id: 'ORD-78303', customerId: 'CUS010', customerName: 'Golden Gate Dist.', status: 'in_transit', type: 'carrier', estimatedWeight: 680, volumeCubicFt: 72, requiredDeliveryDate: today, deliveryWindow: { start: '09:00', end: '17:00' }, address: '55 Gate Street', city: 'Jersey City', priority: 'standard', carrierTrackingId: 'FX789456123' },
  
  // Delivered orders
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `ORD-78${200 + i}`,
    customerId: `CUS${String((i % 10) + 1).padStart(3, '0')}`,
    customerName: customerNames[i % 10],
    status: 'delivered' as const,
    type: (i % 5 === 0 ? 'carrier' : 'route') as 'route' | 'carrier',
    estimatedWeight: 800 + Math.floor(Math.random() * 2500),
    actualWeight: 780 + Math.floor(Math.random() * 2500),
    volumeCubicFt: 80 + Math.floor(Math.random() * 300),
    requiredDeliveryDate: new Date(today.getTime() - (i * 24 * 60 * 60 * 1000)),
    deliveryWindow: { start: '08:00', end: '14:00' },
    address: customers[i % 10].address,
    city: customers[i % 10].city,
    priority: (['standard', 'express', 'urgent'] as const)[i % 3],
  })),
  
  // Exception orders
  { id: 'ORD-78350', customerId: 'CUS003', customerName: 'Valley Fresh Market', status: 'exception', type: 'route', estimatedWeight: 1450, volumeCubicFt: 160, requiredDeliveryDate: today, deliveryWindow: { start: '07:00', end: '11:00' }, address: '75 Valley Road', city: 'Queens', priority: 'urgent', creditHold: true },
  { id: 'ORD-78351', customerId: 'CUS005', customerName: 'Prime Wholesale', status: 'exception', type: 'route', estimatedWeight: 3800, actualWeight: 4200, volumeCubicFt: 420, requiredDeliveryDate: today, deliveryWindow: { start: '08:00', end: '12:00' }, address: '500 Industrial Blvd', city: 'Jersey City', priority: 'express' },
];

export const routes: Route[] = [
  {
    id: 'RTE001',
    driverId: 'DRV001',
    truckId: 'TRK001',
    status: 'in_progress',
    plannedDeparture: new Date(today.setHours(6, 0, 0, 0)),
    estimatedReturn: new Date(today.setHours(14, 0, 0, 0)),
    totalMiles: 85,
    totalWeight: 5050,
    totalVolume: 590,
    stops: [
      { id: 'STP001', orderId: 'ORD-78320', customerName: 'Prime Wholesale', address: '500 Industrial Blvd', plannedArrival: new Date(today.setHours(7, 30, 0, 0)), actualArrival: new Date(today.setHours(7, 25, 0, 0)), timeWindowStart: '07:00', timeWindowEnd: '11:00', status: 'completed', sequence: 1 },
      { id: 'STP002', orderId: 'ORD-78321', customerName: 'Central Supply Co', address: '280 Supply Lane', plannedArrival: new Date(today.setHours(9, 0, 0, 0)), timeWindowStart: '08:00', timeWindowEnd: '12:00', status: 'pending', sequence: 2 },
    ],
  },
  {
    id: 'RTE002',
    driverId: 'DRV002',
    truckId: 'TRK002',
    status: 'in_progress',
    plannedDeparture: new Date(today.setHours(5, 30, 0, 0)),
    estimatedReturn: new Date(today.setHours(13, 30, 0, 0)),
    totalMiles: 72,
    totalWeight: 2400,
    totalVolume: 290,
    stops: [
      { id: 'STP003', orderId: 'ORD-78322', customerName: 'Eastern Imports', address: '150 Harbor Drive', plannedArrival: new Date(today.setHours(8, 0, 0, 0)), timeWindowStart: '09:00', timeWindowEnd: '14:00', status: 'pending', sequence: 1 },
    ],
  },
  {
    id: 'RTE003',
    driverId: 'DRV004',
    truckId: 'TRK004',
    status: 'in_progress',
    plannedDeparture: new Date(today.setHours(7, 0, 0, 0)),
    estimatedReturn: new Date(today.setHours(15, 0, 0, 0)),
    totalMiles: 95,
    totalWeight: 3800,
    totalVolume: 435,
    stops: [
      { id: 'STP004', orderId: 'ORD-78301', customerName: 'Pacific Trading', address: '400 Pacific Avenue', plannedArrival: new Date(today.setHours(10, 30, 0, 0)), timeWindowStart: '10:00', timeWindowEnd: '14:00', status: 'pending', sequence: 1 },
      { id: 'STP005', orderId: 'ORD-78302', customerName: 'Summit Foods', address: '720 Summit Street', plannedArrival: new Date(today.setHours(12, 0, 0, 0)), timeWindowStart: '11:00', timeWindowEnd: '15:00', status: 'pending', sequence: 2 },
    ],
  },
];

export const importContainers: ImportContainer[] = [
  { id: 'IMP001', containerId: 'MSKU-7234561', arrivalDate: new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000), freeDaysRemaining: 2, demurragePerDay: 150, status: 'at_warehouse', contents: 'Frozen Seafood - 20 Pallets', totalPallets: 20, unloadedPallets: 8 },
  { id: 'IMP002', containerId: 'COSU-8456123', arrivalDate: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), freeDaysRemaining: 5, demurragePerDay: 175, status: 'at_warehouse', contents: 'Dry Goods - 24 Pallets', totalPallets: 24, unloadedPallets: 24 },
  { id: 'IMP003', containerId: 'HLXU-9123456', arrivalDate: new Date(today.getTime() - 6 * 24 * 60 * 60 * 1000), freeDaysRemaining: 0, demurragePerDay: 200, status: 'at_warehouse', contents: 'Refrigerated Produce - 18 Pallets', totalPallets: 18, unloadedPallets: 4 },
];

export const carrierShipments: CarrierShipment[] = [
  { id: 'SHP001', carrier: 'FedEx', trackingNumber: 'FX789456123', orderId: 'ORD-78303', status: 'in_transit', estimatedDelivery: today, cost: 45.50 },
  { id: 'SHP002', carrier: 'UPS', trackingNumber: '1Z999AA10123456784', orderId: 'ORD-78344', status: 'label_created', estimatedDelivery: tomorrow, cost: 38.25 },
  { id: 'SHP003', carrier: 'LTL', trackingNumber: 'LTL-2024-78456', orderId: 'ORD-78200', status: 'delivered', estimatedDelivery: new Date(today.getTime() - 24 * 60 * 60 * 1000), cost: 125.00 },
  { id: 'SHP004', carrier: 'FedEx', trackingNumber: 'FX789456124', orderId: 'ORD-78205', status: 'delivered', estimatedDelivery: new Date(today.getTime() - 48 * 60 * 60 * 1000), cost: 52.75 },
  { id: 'SHP005', carrier: 'UPS', trackingNumber: '1Z999AA10123456785', orderId: 'ORD-78210', status: 'picked_up', estimatedDelivery: today, cost: 41.00 },
];

export const driverSettlements: DriverSettlement[] = [
  { id: 'SET001', driverId: 'DRV001', driverName: 'John Martinez', routeId: 'RTE001', date: today, expectedCash: 1250.00, expectedCheck: 3400.00, actualCash: 1250.00, actualCheck: 3400.00, variance: 0, status: 'reconciled', proofImages: ['/check1.jpg', '/check2.jpg'] },
  { id: 'SET002', driverId: 'DRV002', driverName: 'Sarah Chen', routeId: 'RTE002', date: today, expectedCash: 890.00, expectedCheck: 2100.00, actualCash: 870.00, actualCheck: 2100.00, variance: -20.00, status: 'discrepancy', proofImages: ['/check3.jpg'] },
  { id: 'SET003', driverId: 'DRV004', driverName: 'Emily Davis', routeId: 'RTE003', date: today, expectedCash: 1500.00, expectedCheck: 4200.00, actualCash: 1500.00, actualCheck: 4200.00, variance: 0, status: 'pending', proofImages: [] },
  { id: 'SET004', driverId: 'DRV006', driverName: 'Lisa Wang', routeId: 'RTE004', date: new Date(today.getTime() - 24 * 60 * 60 * 1000), expectedCash: 980.00, expectedCheck: 2800.00, actualCash: 980.00, actualCheck: 2750.00, variance: -50.00, status: 'discrepancy', proofImages: ['/check4.jpg', '/check5.jpg'] },
  { id: 'SET005', driverId: 'DRV008', driverName: 'Ana Gonzalez', routeId: 'RTE005', date: new Date(today.getTime() - 24 * 60 * 60 * 1000), expectedCash: 1100.00, expectedCheck: 3100.00, actualCash: 1100.00, actualCheck: 3100.00, variance: 0, status: 'reconciled', proofImages: ['/check6.jpg'] },
  { id: 'SET006', driverId: 'DRV010', driverName: 'Rachel Brown', routeId: 'RTE006', date: new Date(today.getTime() - 48 * 60 * 60 * 1000), expectedCash: 750.00, expectedCheck: 1900.00, actualCash: 750.00, actualCheck: 1900.00, variance: 0, status: 'reconciled', proofImages: [] },
];

export const exceptions: Exception[] = [
  { id: 'EXC001', type: 'temperature', severity: 'critical', message: 'Temperature Spike - Truck TRK004 reading 42°F (threshold: 38°F)', timestamp: new Date(Date.now() - 300000), relatedEntity: { type: 'driver', id: 'DRV004', name: 'Emily Davis' }, resolved: false },
  { id: 'EXC002', type: 'delay', severity: 'medium', message: 'Route 3 - Running 32 minutes behind schedule', timestamp: new Date(Date.now() - 600000), relatedEntity: { type: 'route', id: 'RTE003', name: 'Route 3' }, resolved: false },
  { id: 'EXC003', type: 'credit_hold', severity: 'high', message: 'Valley Fresh Market - Order blocked due to credit limit exceeded', timestamp: new Date(Date.now() - 1800000), relatedEntity: { type: 'customer', id: 'CUS003', name: 'Valley Fresh Market' }, resolved: false },
  { id: 'EXC004', type: 'missing_item', severity: 'low', message: 'Order ORD-78320 - 2 cases short vs manifest', timestamp: new Date(Date.now() - 3600000), relatedEntity: { type: 'order', id: 'ORD-78320', name: 'ORD-78320' }, resolved: true },
  { id: 'EXC005', type: 'delay', severity: 'high', message: 'Driver James Wilson - Offline for 4+ hours', timestamp: new Date(Date.now() - 7200000), relatedEntity: { type: 'driver', id: 'DRV007', name: 'James Wilson' }, resolved: false },
];

export const rtiAssets: RTIAsset[] = [
  { id: 'RTI001', type: 'pallet', customerId: 'CUS001', customerName: 'Metro Foods Inc', quantityOut: 45, quantityReturned: 32, balance: 13, lastActivity: new Date(Date.now() - 86400000) },
  { id: 'RTI002', type: 'crate', customerId: 'CUS001', customerName: 'Metro Foods Inc', quantityOut: 120, quantityReturned: 95, balance: 25, lastActivity: new Date(Date.now() - 172800000) },
  { id: 'RTI003', type: 'pallet', customerId: 'CUS002', customerName: 'Harbor Distributors', quantityOut: 80, quantityReturned: 78, balance: 2, lastActivity: new Date(Date.now() - 43200000) },
  { id: 'RTI004', type: 'dolly', customerId: 'CUS003', customerName: 'Valley Fresh Market', quantityOut: 15, quantityReturned: 8, balance: 7, lastActivity: new Date(Date.now() - 259200000) },
  { id: 'RTI005', type: 'pallet', customerId: 'CUS005', customerName: 'Prime Wholesale', quantityOut: 200, quantityReturned: 145, balance: 55, lastActivity: new Date(Date.now() - 86400000) },
];

// Aggregated Stats
export const dashboardStats = {
  totalOrders: orders.length,
  unplannedOrders: orders.filter(o => o.status === 'unplanned').length,
  inTransitOrders: orders.filter(o => o.status === 'in_transit').length,
  exceptionOrders: orders.filter(o => o.status === 'exception').length,
  deliveredToday: orders.filter(o => o.status === 'delivered' && o.requiredDeliveryDate.toDateString() === today.toDateString()).length,
  activeDrivers: drivers.filter(d => d.status === 'active').length,
  totalDrivers: drivers.length,
  ownFleetVolume: orders.filter(o => o.type === 'route').length,
  carrierVolume: orders.filter(o => o.type === 'carrier').length,
  criticalExceptions: exceptions.filter(e => e.severity === 'critical' && !e.resolved).length,
  pendingReconciliations: driverSettlements.filter(s => s.status === 'pending').length,
  discrepancies: driverSettlements.filter(s => s.status === 'discrepancy').length,
};
