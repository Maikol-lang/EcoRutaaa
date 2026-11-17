import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Leaf, Recycle, Building, Layers, Navigation, Locate, ZoomIn, ZoomOut, Filter, Info, Clock, User, Gauge, Activity } from 'lucide-react';
import { collectionRoutes, trucks, routeStats } from '../data/routes';
import { cleanPoints, cleanPointTypes } from '../data/cleanPoints';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const GIRARDOT_CENTER = [4.3009, -74.8075];
const GIRARDOT_BOUNDS = [
  [4.27, -74.86],
  [4.34, -74.78],
];

const typeColors = {
  white: '#FFFFFF',
  green: '#19C878',
  black: '#374151',
  special: '#36D9E8',
  cyan: '#36D9E8',
  neon: '#39FF88',
};

const typeIcons = {
  white: Recycle,
  green: Leaf,
  black: Truck,
  special: Building,
};

function MapControls({ visibleLayers, onToggleLayer, onLocate, onResetView }) {
  return (
    <div className="map-controls absolute top-4 right-4 z-20 flex flex-col gap-2">
      <div className="glass-panel rounded-xl p-2 shadow-xl flex flex-col gap-1 min-w-[200px]">
        <div className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-eco-green/60 uppercase tracking-wider">
          <Layers className="w-4 h-4" aria-hidden="true" />
          Capas del mapa
        </div>
        {[
          { id: 'routes', label: 'Rutas de recolección', icon: Truck, color: '#39FF88' },
          { id: 'cleanPoints', label: 'Puntos Limpios', icon: Building, color: '#19C878' },
          { id: 'trucks', label: 'Camiones en vivo', icon: Navigation, color: '#36D9E8' },
        ].map((layer) => (
          <label key={layer.id} className="flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-eco-green/5 cursor-pointer transition-colors">
            <input
              type="checkbox"
              checked={visibleLayers[layer.id]}
              onChange={(e) => onToggleLayer(layer.id, e.target.checked)}
              className="w-4 h-4 accent-eco-neon rounded border-eco-border/50"
            />
            <layer.icon className="w-4 h-4" style={{ color: layer.color }} aria-hidden="true" />
            <span className="text-sm text-white">{layer.label}</span>
          </label>
        ))}
      </div>

      <div className="glass-panel rounded-xl p-2 shadow-xl flex flex-col gap-1">
        <button onClick={onLocate} className="btn-ghost p-2" aria-label="Mi ubicación">
          <Locate className="w-5 h-5" aria-hidden="true" />
        </button>
        <button onClick={onResetView} className="btn-ghost p-2" aria-label="Vista completa">
          <ZoomIn className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function createCustomIcon(color, iconName) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28">
      <circle cx="12" cy="12" r="10" fill="${color}" stroke="white" stroke-width="2"/>
      <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${iconName.charAt(0).toUpperCase()}</text>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-marker',
    html: svg,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });
}

function createTruckIcon() {
  return L.divIcon({
    className: 'truck-marker',
    html: `
      <div class="relative">
        <svg viewBox="0 0 24 24" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <path fill="#36D9E8" d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
          <circle cx="7" cy="19" r="1.5" fill="#333"/>
          <circle cx="17" cy="19" r="1.5" fill="#333"/>
        </svg>
        <div class="absolute -top-1 -right-1 w-5 h-5 bg-eco-neon text-eco-bg text-xs font-bold rounded-full flex items-center justify-center animate-ping">LIVE</div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function MapLegend({ visibleLayers }) {
  return (
    <div className="map-legend absolute bottom-4 left-4 z-20 glass-panel rounded-xl p-4 shadow-xl min-w-[180px] max-w-[220px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-white text-sm">Leyenda</span>
      </div>
      <div className="space-y-2 text-xs">
        {visibleLayers.routes && (
          <div className="flex items-center gap-2 text-eco-green/80">
            <div className="w-8 h-1 bg-eco-neon rounded" />
            <span>Rutas de recolección</span>
          </div>
        )}
        {visibleLayers.cleanPoints && (
          <div className="flex items-center gap-2 text-eco-green/80">
            <div className="w-3 h-3 rounded-full bg-eco-green border-2 border-white" />
            <span>Puntos Limpios</span>
          </div>
        )}
        {visibleLayers.trucks && (
          <div className="flex items-center gap-2 text-eco-green/80">
            <Truck className="w-4 h-4 text-eco-cyan" aria-hidden="true" />
            <span>Camiones activos</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MapView() {
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ routes: null, cleanPoints: null, trucks: null });
  const truckMarkersRef = useRef([]);
  const animationIntervalRef = useRef(null);

  const [visibleLayers, setVisibleLayers] = useState({
    routes: true,
    cleanPoints: true,
    trucks: true,
  });
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    if (mapRef.current || !mapContainerRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: GIRARDOT_CENTER,
      zoom: 14,
      maxBounds: GIRARDOT_BOUNDS,
      maxZoom: 18,
      minZoom: 11,
      zoomControl: false,
      attributionControl: false,
    });
    mapRef.current = map;

    const tileLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Apply dark mode filter only to tiles (not markers/popups/polylines)
    map.once('layeradd', (e) => {
      if (e.layer === tileLayer) {
        const tilePane = map.getPane('tilePane');
        if (tilePane) {
          tilePane.style.filter = 'invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)';
        }
      }
    });

    const routesLayer = L.layerGroup().addTo(map);
    const cleanPointsLayer = L.layerGroup().addTo(map);
    const trucksLayer = L.layerGroup().addTo(map);

    layersRef.current = { routes: routesLayer, cleanPoints: cleanPointsLayer, trucks: trucksLayer };

    function addRoutes() {
      collectionRoutes.forEach((route) => {
        const color = typeColors[route.type] || '#39FF88';
        const IconComponent = typeIcons[route.type] || Truck;

        const polyline = L.polyline(route.coordinates, {
          color,
          weight: 4,
          opacity: 0.8,
          dashArray: route.type === 'special' ? '10, 5' : undefined,
        }).addTo(routesLayer);

        const tooltipContent = `
          <div class="text-eco-bg p-2 min-w-[200px]">
            <div class="flex items-center gap-2 mb-1">
              <span style="color: ${color}">${IconComponent ? '◆' : '🚛'}</span>
              <strong class="text-white">${route.name}</strong>
            </div>
            <div class="text-xs" style="color: #19C878">
              ${route.schedule.days.join(', ')} · ${route.schedule.startTime}-${route.schedule.endTime}
            </div>
            <div class="text-xs mt-1" style="color: #19C87899">
              Camión: ${route.truck} · Conductor: ${route.driver}
            </div>
          </div>
        `;
        polyline.bindTooltip(tooltipContent, { sticky: true });

        route.coordinates.forEach((coord, i) => {
          L.circleMarker(coord, {
            radius: 6,
            color,
            fillColor: color,
            fillOpacity: 0.9,
            weight: 2,
          }).addTo(routesLayer).bindTooltip(
            `<div class="text-eco-bg p-1 text-xs">${route.neighborhoods[i]?.name || `Parada ${i + 1}`}</div>`
          );
        });
      });
    }

    function addCleanPoints() {
      cleanPoints.forEach((point) => {
        const typeInfo = cleanPointTypes[point.type];
        const color = typeColors[typeInfo.color.replace('eco-', '')] || '#19C878';

        const marker = L.marker(point.coordinates, {
          icon: createCustomIcon(color, typeInfo.icon),
        }).addTo(cleanPointsLayer);

        const popupContent = `
          <div class="p-2 min-w-[280px] text-eco-bg">
            <div class="flex items-start gap-3 mb-2">
              <div class="w-10 h-10 rounded-lg flex items-center justify-center text-white" style="background: ${color}">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-white">${point.name}</h4>
                <span class="badge text-xs" style="background-color: ${color}20; border-color: ${color}40; color: ${color}">
                  ${typeInfo.label}
                </span>
              </div>
            </div>
            <p class="text-sm" style="color: #19C878CC">${point.address}</p>
            <p class="text-xs mb-3" style="color: #19C87899"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> ${point.hours}</p>
            <div class="flex flex-wrap gap-1 mb-3">
              ${point.acceptedWaste.slice(0, 3).map(waste => `<span class="px-2 py-0.5 text-xs rounded bg-eco-surface border border-eco-border/50">${waste}</span>`).join('')}
              ${point.acceptedWaste.length > 3 ? `<span class="px-2 py-0.5 text-xs rounded bg-eco-neon/20 border border-eco-neon/30 text-eco-neon">+${point.acceptedWaste.length - 3} más</span>` : ''}
            </div>
            <div class="flex items-center gap-4 text-xs" style="color: #19C87899">
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/></svg> ${point.stats.monthlyVisits.toLocaleString()} visitas/mes</span>
              <span><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><path d="M5 21h14"/></svg> ${point.stats.pointsGiven.toLocaleString()} pts/mes</span>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
      });
    }

    function addTrucks() {
      const activeTrucks = trucks.filter(t => t.status === 'active');
      activeTrucks.forEach((truck, i) => {
        const route = collectionRoutes.find(r => r.truck === truck.id);
        const routeCoords = route?.coordinates ?? [GIRARDOT_CENTER];
        const position = routeCoords[Math.floor(Date.now() / 30000) % routeCoords.length];

        const marker = L.marker(position, { icon: createTruckIcon() }).addTo(trucksLayer);

        const popupContent = `
          <div class="p-2 min-w-[200px] text-eco-bg">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-8 h-8 rounded-lg bg-eco-cyan/20 border border-eco-cyan/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#36D9E8" stroke-width="2">
                  <path d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
                  <circle cx="7" cy="19" r="1.5"/>
                  <circle cx="17" cy="19" r="1.5"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-white">${truck.id}</h4>
                <p class="text-xs" style="color: #19C87899">${truck.type}</p>
              </div>
            </div>
            <div class="text-xs space-y-1" style="color: #19C878CC">
              <div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 9 9 3 15 9 15 21 9 27 3 21 3 9"/></svg> ${route?.name || 'En tránsito'}</div>
              <div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg> Conductor: ${truck.driver || 'Sin asignar'}</div>
              <div><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg> Combustible: ${truck.fuelLevel}%</div>
              <div>Estado: <span class="text-eco-neon capitalize">${truck.status}</span></div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent);
        truckMarkersRef.current.push({ marker, truck, routeCoords });
      });
    }

    if (visibleLayers.routes) addRoutes();
    if (visibleLayers.cleanPoints) addCleanPoints();
    if (visibleLayers.trucks) addTrucks();

    animationIntervalRef.current = setInterval(() => {
      if (!mapRef.current) return;
      truckMarkersRef.current.forEach(({ marker, routeCoords }) => {
        if (routeCoords && routeCoords.length > 0) {
          const position = routeCoords[Math.floor(Date.now() / 30000) % routeCoords.length];
          marker.setLatLng(position);
        }
      });
    }, 30000);

    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
      truckMarkersRef.current = [];
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const handleLocate = () => {
    if (navigator.geolocation && mapRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          mapRef.current.flyTo([pos.coords.latitude, pos.coords.longitude], 16);
        },
        () => alert('No se pudo obtener tu ubicación'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  const handleResetView = () => {
    mapRef.current?.flyTo(GIRARDOT_CENTER, 13);
  };

  const toggleLayer = (layer, visible) => {
    setVisibleLayers(prev => {
      const next = { ...prev, [layer]: visible };
      if (layersRef.current[layer] && mapRef.current) {
        if (visible) {
          layersRef.current[layer].addTo(mapRef.current);
        } else {
          mapRef.current.removeLayer(layersRef.current[layer]);
        }
      }
      return next;
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const mapControls = document.querySelector('.map-controls');
      const mapLegend = document.querySelector('.map-legend');

      if (mapControls) {
        gsap.fromTo(mapControls, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.2 });
      }
      if (mapLegend) {
        gsap.fromTo(mapLegend, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.4 });
      }
    });
    return () => ctx.revert();
  }, [visibleLayers]);

  return (
    <div className="relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)]">
      <div
        ref={mapContainerRef}
        className="w-full h-full"
        style={{
          position: 'relative',
          zIndex: 0,
          isolation: 'isolate',
          overflow: 'hidden',
          width: '100%',
          height: '100%',
        }}
      />

      <MapControls
        visibleLayers={visibleLayers}
        onToggleLayer={toggleLayer}
        onLocate={handleLocate}
        onResetView={handleResetView}
      />

      <MapLegend visibleLayers={visibleLayers} />

      {/* Info Panel */}
      <div className="absolute bottom-4 right-4 z-[1000] glass-panel rounded-xl p-4 shadow-xl min-w-[280px] max-w-[320px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-white">Información rápida</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-lg bg-eco-neon/10 border border-eco-neon/20">
            <div className="font-display font-bold text-2xl text-eco-neon">{collectionRoutes.length}</div>
            <div className="text-xs text-eco-green/60">Rutas activas</div>
          </div>
          <div className="p-3 rounded-lg bg-eco-green/10 border border-eco-green/20">
            <div className="font-display font-bold text-2xl text-eco-green">{cleanPoints.length}</div>
            <div className="text-xs text-eco-green/60">Puntos Limpios</div>
          </div>
          <div className="p-3 rounded-lg bg-eco-cyan/10 border border-eco-cyan/20">
            <div className="font-display font-bold text-2xl text-eco-cyan">{trucks.filter(t => t.status === 'active').length}</div>
            <div className="text-xs text-eco-green/60">Camiones activos</div>
          </div>
          <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <div className="font-display font-bold text-2xl text-amber-400">{routeStats.dailyTons}</div>
            <div className="text-xs text-eco-green/60">Toneladas/día</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;