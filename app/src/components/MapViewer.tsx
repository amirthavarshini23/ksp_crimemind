import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapHotspot {
  fir_id: number;
  fir_number: string;
  district: string;
  crime_type: string;
  station: string;
  lat: number;
  lng: number;
  severity: number;
}

interface MapViewerProps {
  hotspots: MapHotspot[];
  onSelectFir?: (id: number) => void;
  center?: [number, number];
  zoom?: number;
}

export const MapViewer: React.FC<MapViewerProps> = ({ 
  hotspots, 
  onSelectFir, 
  center = [12.9716, 77.5946], // Default Bengaluru
  zoom = 8 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (mapRef.current && !leafletMap.current) {
      // Initialize map
      const map = L.map(mapRef.current).setView(center, zoom);
      
      // Standard open street tiles (dark filter applied via index.css filter class)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map);

      leafletMap.current = map;
      markersGroup.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Sync zoom/center
  useEffect(() => {
    if (leafletMap.current) {
      leafletMap.current.setView(center, zoom);
    }
  }, [center, zoom]);

  // Update markers
  useEffect(() => {
    if (leafletMap.current && markersGroup.current) {
      // Clear previous
      markersGroup.current.clearLayers();

      hotspots.forEach((spot) => {
        // Decide color based on severity score
        let circleColor = '#10B981'; // Green
        if (spot.severity > 75) {
          circleColor = '#EF4444'; // Red
        } else if (spot.severity > 50) {
          circleColor = '#F59E0B'; // Orange
        }

        // Create glowing hotspot circle
        const circle = L.circleMarker([spot.lat, spot.lng], {
          radius: 12 + (spot.severity / 25),
          fillColor: circleColor,
          color: circleColor,
          weight: 1.5,
          opacity: 0.8,
          fillOpacity: 0.35,
          className: spot.severity > 75 ? 'pulse-signal' : ''
        });

        // Add popup
        const popupContent = `
          <div style="font-family: sans-serif; padding: 4px;">
            <div style="font-weight: bold; font-size: 13px; margin-bottom: 2px;">${spot.fir_number}</div>
            <div style="color: #9CA3AF; font-size: 10px; margin-bottom: 6px;">${spot.station}, ${spot.district}</div>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
              <span>Type: <b>${spot.crime_type}</b></span>
              <span style="color: ${circleColor}; font-weight: bold;">Severity: ${spot.severity}</span>
            </div>
            <div style="margin-top: 8px; border-t: 1px solid #374151; padding-top: 6px;">
              <button 
                onclick="window.selectHotspot(${spot.fir_id})" 
                style="background: #3B82F6; color: white; border: none; font-size: 10px; width: 100%; padding: 4px; border-radius: 4px; cursor: pointer; font-weight: 500;"
              >
                Inspect Crime Folder
              </button>
            </div>
          </div>
        `;

        circle.bindPopup(popupContent);
        markersGroup.current.addLayer(circle);
      });

      // Expose globally for click handlers inside popups
      (window as any).selectHotspot = (id: number) => {
        if (onSelectFir) onSelectFir(id);
      };
    }
  }, [hotspots, onSelectFir]);

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
      <div ref={mapRef} className="w-full h-full z-10" />
      
      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-850 p-3 rounded-lg z-20 shadow-lg text-[10px] space-y-1.5 backdrop-blur">
        <div className="font-semibold text-white uppercase tracking-wider text-[9px] mb-1">Crime Hotspot Index</div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block pulse-signal" />
          <span className="text-slate-300">Severe (Risk &gt; 75)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-500 inline-block" />
          <span className="text-slate-300">Moderate (Risk 50-75)</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 inline-block" />
          <span className="text-slate-300">Low Threat (Risk &lt; 50)</span>
        </div>
      </div>
    </div>
  );
};
export default MapViewer;
