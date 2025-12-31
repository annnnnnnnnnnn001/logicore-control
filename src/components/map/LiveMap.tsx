import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { drivers, trucks, routes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Snowflake, AlertTriangle, Truck, Navigation } from 'lucide-react';
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
  const [selectedDriver, setSelectedDriver] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Using a public token for demo - in production, use environment variable
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNmQycGlhejBjbmkycnM0c3V2MHRqOW0ifQ.sMgDsgLpGJD5cqFDlXZb8Q';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.98, 40.75], // NYC
      zoom: 11,
      pitch: 45,
      bearing: -17.6,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);
      
      // Add 3D building layer
      if (map.current) {
        const layers = map.current.getStyle().layers;
        const labelLayerId = layers?.find(
          (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
        )?.id;

        map.current.addLayer(
          {
            id: '3d-buildings',
            source: 'composite',
            'source-layer': 'building',
            filter: ['==', 'extrude', 'true'],
            type: 'fill-extrusion',
            minzoom: 15,
            paint: {
              'fill-extrusion-color': '#aaa',
              'fill-extrusion-height': ['get', 'height'],
              'fill-extrusion-base': ['get', 'min_height'],
              'fill-extrusion-opacity': 0.6,
            },
          },
          labelLayerId
        );
      }
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
      el.className = 'truck-marker';
      el.innerHTML = `
        <div class="relative group cursor-pointer transform transition-transform duration-200 ${isSelected ? 'scale-125' : 'hover:scale-110'}">
          <div class="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 ${
            isSelected ? 'ring-4 ring-white/50 ring-offset-2' : ''
          } ${
            truck.status === 'moving' 
              ? 'bg-emerald-500' 
              : truck.status === 'idle' 
                ? 'bg-blue-500' 
                : 'bg-red-500'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          ${truck.temperatureAlert ? `
            <div class="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse shadow-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5">
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
                <path d="M3.586 15.414 10.586 8.414a2 2 0 0 1 2.828 0l7 7a2 2 0 0 1-2.828 2.828L12 12.657l-5.586 5.585a2 2 0 1 1-2.828-2.828z"/>
              </svg>
            </div>
          ` : ''}
          ${truck.type === 'refrigerated' ? `
            <div class="absolute -bottom-1 -right-1 w-6 h-6 ${truck.temperatureAlert ? 'bg-red-500' : 'bg-cyan-500'} rounded-full flex items-center justify-center shadow-md">
              <span class="text-[9px] font-bold text-white">${truck.temperature}°</span>
            </div>
          ` : ''}
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-3 bg-gray-900/95 backdrop-blur-sm text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-200 whitespace-nowrap pointer-events-none z-50 shadow-xl">
            <div class="font-semibold text-base">${driver.name}</div>
            <div class="text-gray-400 font-mono text-xs mt-0.5">${truck.plateNumber}</div>
            <div class="mt-2 flex items-center gap-2">
              <span class="w-2.5 h-2.5 rounded-full ${
                truck.status === 'moving' ? 'bg-emerald-400' : truck.status === 'idle' ? 'bg-blue-400' : 'bg-red-400'
              }"></span>
              <span class="capitalize text-gray-300">${truck.status}</span>
            </div>
            ${route ? `
              <div class="mt-2 pt-2 border-t border-gray-700 text-xs text-gray-400">
                ${route.stops.length} stops • ${route.totalMiles} mi
              </div>
            ` : ''}
            <div class="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onTruckClick?.(driver.id);
        setSelectedDriver(driver.id);
      });

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([driver.currentLocation.lng, driver.currentLocation.lat])
        .addTo(map.current!);

      markersRef.current.push(marker);
    });

    // Add route lines for selected route
    if (selectedRouteId) {
      const route = routes.find(r => r.id === selectedRouteId);
      const driver = route ? drivers.find(d => d.id === route.driverId) : null;
      
      if (driver?.currentLocation) {
        // Center map on driver
        map.current.flyTo({
          center: [driver.currentLocation.lng, driver.currentLocation.lat],
          zoom: 14,
          pitch: 60,
          duration: 1500,
          essential: true
        });
      }
    }
  }, [mapLoaded, selectedRouteId, onTruckClick]);

  const activeDriversOnMap = drivers.filter(d => d.currentLocation);
  const alertCount = trucks.filter(t => t.temperatureAlert).length;

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
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Fleet Status</p>
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-success-solid shadow-sm" />
            <span className="text-sm">Moving</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {trucks.filter(t => t.status === 'moving').length}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-info-solid shadow-sm" />
            <span className="text-sm">Idle</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {trucks.filter(t => t.status === 'idle').length}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-error-solid shadow-sm" />
            <span className="text-sm">Stopped</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {trucks.filter(t => t.status === 'stopped').length}
            </span>
          </div>
          <div className="flex items-center gap-2.5">
            <Snowflake className="w-3.5 h-3.5 text-info-solid" />
            <span className="text-sm">Refrigerated</span>
            <span className="text-xs text-muted-foreground ml-auto">
              {trucks.filter(t => t.type === 'refrigerated').length}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 left-4 right-16 flex items-center gap-3"
      >
        <div className="bg-card/95 backdrop-blur-md rounded-lg px-4 py-2.5 shadow-lg border border-border flex items-center gap-2">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{activeDriversOnMap.length} Active</span>
        </div>
        {alertCount > 0 && (
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-error/90 backdrop-blur-md rounded-lg px-4 py-2.5 shadow-lg flex items-center gap-2 text-primary-foreground"
          >
            <AlertTriangle className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">{alertCount} Alert{alertCount > 1 ? 's' : ''}</span>
          </motion.div>
        )}
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
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground font-medium">Loading map...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
