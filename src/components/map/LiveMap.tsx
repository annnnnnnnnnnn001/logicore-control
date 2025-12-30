import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { drivers, trucks, routes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Snowflake, AlertTriangle, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveMapProps {
  selectedRouteId?: string;
  onTruckClick?: (driverId: string) => void;
  className?: string;
}

export function LiveMap({ selectedRouteId, onTruckClick, className }: LiveMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedTruck, setSelectedTruck] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Using a public token for demo - in production, use environment variable
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNmQycGlhejBjbmkycnM0c3V2MHRqOW0ifQ.sMgDsgLpGJD5cqFDlXZb8Q';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.98, 40.75], // NYC
      zoom: 11,
      pitch: 40,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      markersRef.current.forEach(marker => marker.remove());
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Add truck markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each driver with location
    drivers.forEach(driver => {
      if (!driver.currentLocation) return;
      
      const truck = trucks.find(t => t.id === driver.truckId);
      if (!truck) return;

      const route = routes.find(r => r.driverId === driver.id);
      const isSelected = selectedRouteId && route?.id === selectedRouteId;

      // Create marker element
      const el = document.createElement('div');
      el.className = 'truck-marker-container';
      el.style.cssText = 'cursor: pointer; transition: transform 0.2s;';
      
      const statusColor = truck.status === 'moving' 
        ? '#22c55e' 
        : truck.status === 'idle' 
          ? '#3b82f6' 
          : '#ef4444';

      const size = isSelected ? 48 : 40;
      const ringSize = isSelected ? 56 : 0;

      el.innerHTML = `
        <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
          ${isSelected ? `
            <div class="absolute inset-0 rounded-full border-2 border-primary animate-ping" style="width: ${ringSize}px; height: ${ringSize}px; margin: -4px;"></div>
          ` : ''}
          <div class="relative flex items-center justify-center rounded-full shadow-lg transition-all duration-200" style="width: ${size}px; height: ${size}px; background: ${statusColor};">
            <svg xmlns="http://www.w3.org/2000/svg" width="${size * 0.5}" height="${size * 0.5}" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          ${truck.temperatureAlert ? `
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-md" style="animation: pulse 1.5s infinite;">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              </svg>
            </div>
          ` : ''}
          ${truck.type === 'refrigerated' && !truck.temperatureAlert ? `
            <div class="absolute -bottom-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center shadow-md border-2 border-white">
              <span style="font-size: 9px; font-weight: 700; color: white;">${truck.temperature}°</span>
            </div>
          ` : ''}
        </div>
      `;

      el.onmouseenter = () => {
        el.style.transform = 'scale(1.1)';
        setSelectedTruck(driver.id);
      };
      el.onmouseleave = () => {
        el.style.transform = 'scale(1)';
        setSelectedTruck(null);
      };

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onTruckClick?.(driver.id);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([driver.currentLocation.lng, driver.currentLocation.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Fly to selected route's driver
    if (selectedRouteId) {
      const route = routes.find(r => r.id === selectedRouteId);
      const driver = route ? drivers.find(d => d.id === route.driverId) : null;
      
      if (driver?.currentLocation) {
        map.current.flyTo({
          center: [driver.currentLocation.lng, driver.currentLocation.lat],
          zoom: 14,
          duration: 1500,
          pitch: 50,
        });
      }
    }
  }, [mapLoaded, selectedRouteId, onTruckClick]);

  const selectedDriver = selectedTruck ? drivers.find(d => d.id === selectedTruck) : null;
  const selectedDriverTruck = selectedDriver ? trucks.find(t => t.id === selectedDriver.truckId) : null;

  return (
    <div className={cn("relative w-full h-full rounded-lg overflow-hidden", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Legend */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border"
      >
        <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wide">Fleet Status</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-success-solid shadow-sm" />
            <span className="text-sm">Moving</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-info-solid shadow-sm" />
            <span className="text-sm">Idle</span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-error-solid shadow-sm" />
            <span className="text-sm">Stopped</span>
          </div>
          <div className="flex items-center gap-2.5">
            <Snowflake className="w-3 h-3 text-info-solid" />
            <span className="text-sm">Refrigerated</span>
          </div>
        </div>
      </motion.div>

      {/* Truck Info Popup */}
      <AnimatePresence>
        {selectedDriver && selectedDriverTruck && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-4 left-4 bg-card/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-border min-w-[200px]"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                {selectedDriver.avatar}
              </div>
              <div>
                <p className="font-semibold text-sm">{selectedDriver.name}</p>
                <p className="text-xs text-muted-foreground font-mono">{selectedDriverTruck.plateNumber}</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className={cn(
                  "px-2 py-0.5 rounded-full text-xs font-medium capitalize",
                  selectedDriverTruck.status === 'moving' ? 'bg-success text-success-foreground' :
                  selectedDriverTruck.status === 'idle' ? 'bg-info text-info-foreground' : 'bg-error text-error-foreground'
                )}>
                  {selectedDriverTruck.status}
                </span>
              </div>
              {selectedDriverTruck.type === 'refrigerated' && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Temperature</span>
                  <span className={cn(
                    "font-mono font-medium",
                    selectedDriverTruck.temperatureAlert ? 'text-error-foreground' : 'text-info-foreground'
                  )}>
                    {selectedDriverTruck.temperature}°F
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Load</span>
                <span className="font-mono">
                  {Math.round((selectedDriverTruck.currentLoad.weight / selectedDriverTruck.capacity.weight) * 100)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-4 right-16 flex items-center gap-2 bg-card/95 backdrop-blur-md rounded-lg px-3 py-2 shadow-md border border-border"
      >
        <div className="relative">
          <Zap className="w-4 h-4 text-success-foreground" />
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-success-solid rounded-full animate-pulse" />
        </div>
        <span className="text-xs font-medium">Live</span>
      </motion.div>

      {/* Loading overlay */}
      <AnimatePresence>
        {!mapLoaded && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted flex items-center justify-center"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 border-3 border-primary/20 border-t-primary rounded-full animate-spin" />
              </div>
              <span className="text-sm text-muted-foreground font-medium">Loading map...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}