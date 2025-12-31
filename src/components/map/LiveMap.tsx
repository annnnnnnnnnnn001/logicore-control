import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { drivers, trucks, routes } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Snowflake, AlertTriangle } from 'lucide-react';

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

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Using a public token for demo - in production, use environment variable
    mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS1kZW1vIiwiYSI6ImNtNmQycGlhejBjbmkycnM0c3V2MHRqOW0ifQ.sMgDsgLpGJD5cqFDlXZb8Q';

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-73.98, 40.75], // NYC
      zoom: 11,
      pitch: 30,
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

      // Create marker element
      const el = document.createElement('div');
      el.className = 'truck-marker';
      el.innerHTML = `
        <div class="relative group cursor-pointer">
          <div class="w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 ${
            truck.status === 'moving' 
              ? 'bg-emerald-500' 
              : truck.status === 'idle' 
                ? 'bg-blue-500' 
                : 'bg-red-500'
          }">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
            </svg>
          </div>
          ${truck.temperatureAlert ? `
            <div class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                <path d="M12 9v4"/>
                <path d="M12 17h.01"/>
                <path d="M3.586 15.414 10.586 8.414a2 2 0 0 1 2.828 0l7 7a2 2 0 0 1-2.828 2.828L12 12.657l-5.586 5.585a2 2 0 1 1-2.828-2.828z"/>
              </svg>
            </div>
          ` : ''}
          ${truck.type === 'refrigerated' ? `
            <div class="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center">
              <span class="text-[8px] font-bold text-white">${truck.temperature}°</span>
            </div>
          ` : ''}
          <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
            <div class="font-semibold">${driver.name}</div>
            <div class="text-gray-400">${truck.plateNumber}</div>
            <div class="mt-1 flex items-center gap-1">
              <span class="w-2 h-2 rounded-full ${
                truck.status === 'moving' ? 'bg-emerald-400' : truck.status === 'idle' ? 'bg-blue-400' : 'bg-red-400'
              }"></span>
              <span class="capitalize">${truck.status}</span>
            </div>
          </div>
        </div>
      `;

      el.addEventListener('click', () => {
        onTruckClick?.(driver.id);
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
          zoom: 13,
          duration: 1000,
        });
      }
    }
  }, [mapLoaded, selectedRouteId, onTruckClick]);

  return (
    <div className={cn("relative w-full h-full rounded-lg overflow-hidden", className)}>
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-card/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">Fleet Status</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-success-solid" />
            <span className="text-xs">Moving</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-info-solid" />
            <span className="text-xs">Idle</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-error-solid" />
            <span className="text-xs">Stopped</span>
          </div>
          <div className="flex items-center gap-2">
            <Snowflake className="w-3 h-3 text-info-solid" />
            <span className="text-xs">Refrigerated</span>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {!mapLoaded && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Loading map...</span>
          </div>
        </div>
      )}
    </div>
  );
}