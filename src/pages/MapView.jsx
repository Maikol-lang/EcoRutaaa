import { useEffect, useRef, useState, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { gsap } from 'gsap';
import { Link } from 'react-router-dom';
import { Truck, MapPin, Leaf, Recycle, Building, Layers, Navigation, Locate, ZoomIn, ZoomOut, Filter, Info, Clock, User, Gauge, Activity, Sun, Moon, Package, Map as MapIcon } from 'lucide-react';
import { trucks, routeStats } from '../data/routes';
import { cleanPoints, cleanPointTypes } from '../data/cleanPoints';
import { useTheme } from '../context/ThemeContext';

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

const routeColors = {
  white: '#059669',
  green: '#10B981',
  black: '#0F172A',
};

const cleanPointColors = {
  fixed: '#059669',
  mobile: '#0284C7',
  community: '#D97706',
};

// OSRM: Waypoints reales en intersecciones urbanas de Girardot (casco urbano: lat 4.2950-4.3125, lng -74.8105 a -74.7935)
// NUNCA en Cerro de La Peñosa ni fuera de vías
const truckWaypoints = {
  'ECO-001': { // Centro / Parque Bolívar - Carrera 8, Calle 10, Alfonso López, Carrera 6
    name: 'Circuito Centro Histórico',
    sector: 'Centro / Parque Bolívar',
    color: '#059669',
    schedule: 'Lunes, Miércoles y Viernes · 06:00 a.m. – 10:00 a.m.',
    waypoints: [
      [4.3009, -74.8075], // Parque Bolívar (inicio)
      [4.3021, -74.8092], // Carrera 8 con Calle 10
      [4.3045, -74.8110], // Calle 10 con Carrera 6
      [4.3068, -74.8135], // Alfonso López
      [4.3052, -74.8158], // San Antonio
      [4.3028, -74.8142], // Carrera 6 con Calle 14
      [4.3009, -74.8075], // Regresa a Parque Bolívar
    ],
  },
  'ECO-002': { // Kennedy - Av. Ciudad de las Acacias, Carrera 15, Calle 18
    name: 'Circuito Kennedy',
    sector: 'Kennedy',
    color: '#0284C7',
    schedule: 'Martes y Jueves · 02:00 p.m. – 06:00 p.m.',
    waypoints: [
      [4.2970, -74.8180], // Villa Olímpica / Av. Acacias
      [4.2995, -74.8205], // Unicentro Girardot
      [4.3022, -74.8228], // EcoPunto Barrio Kennedy
      [4.3018, -74.8235], // Centro comercial Kennedy
      [4.3002, -74.8210], // Colegio Kennedy
      [4.2978, -74.8185], // Av. Acacias sur
      [4.2970, -74.8180], // Cierra
    ],
  },
  'ECO-003': { // El Diamante - Av. El Diamante, Carrera 20, Calle 25
    name: 'Circuito El Diamante',
    sector: 'El Diamante',
    color: '#10B981',
    schedule: 'Lunes a Sábado · 09:00 p.m. – 01:00 a.m.',
    waypoints: [
      [4.3120, -74.8020], // EcoPunto El Diamante
      [4.3150, -74.8000], // El Diamante entrada
      [4.3175, -74.8025], // Av. El Diamante con Carrera 20
      [4.3200, -74.8050], // Centro cívico El Diamante
      [4.3185, -74.7985], // Colegio
      [4.3120, -74.8020], // Cierra
    ],
  },
  'ECO-004': { // Alto de la Cruz - Carrera 12, Calle 16, Mirador
    name: 'Circuito Alto de la Cruz',
    sector: 'Alto de la Cruz',
    color: '#D97706',
    schedule: 'Martes, Jueves y Sábado · 07:00 a.m. – 11:00 a.m.',
    waypoints: [
      [4.3095, -74.8125], // EcoPunto Alto de la Cruz
      [4.3105, -74.8145], // Calle 16 con Carrera 12
      [4.3115, -74.8125], // Mirador / Barrio alto
      [4.3095, -74.8105], // Iglesia
      [4.3095, -74.8125], // Cierra
    ],
  },
  'ECO-005': { // La Esperanza - Av. Esperanza, Carrera 5, Calle 12
    name: 'Circuito La Esperanza',
    sector: 'La Esperanza',
    color: '#84CC16',
    schedule: 'Lunes, Miércoles y Viernes · 01:00 p.m. – 05:00 p.m.',
    waypoints: [
      [4.2960, -74.8085], // EcoPunto La Esperanza
      [4.2980, -74.8105], // Av. Esperanza con Carrera 5
      [4.3000, -74.8085], // Parque central
      [4.2985, -74.8065], // Mercado
      [4.2960, -74.8085], // Cierra
    ],
  },
  'ECO-006': { // Camellón del Comercio - Calle 13, Carrera 9, Plaza Mayor
    name: 'Circuito Camellón del Comercio',
    sector: 'Camellón del Comercio',
    color: '#06B6D4',
    schedule: 'Martes y Jueves · 08:00 a.m. – 12:00 p.m.',
    waypoints: [
      [4.3040, -74.8005], // EcoPunto Camellón del Comercio
      [4.3055, -74.8025], // Calle 13 con Carrera 9
      [4.3065, -74.8005], // Plaza mayor
      [4.3045, -74.7985], // Banco central
      [4.3040, -74.8005], // Cierra
    ],
  },
  'ECO-007': { // Terminal de Transportes - Carrera 7, Calle 18
    name: 'Circuito Terminal de Transportes',
    sector: 'Terminal de Transportes',
    color: '#EC4899',
    schedule: 'Lunes a Sábado · 10:00 p.m. – 02:00 a.m.',
    waypoints: [
      [4.2985, -74.8155], // EcoPunto Terminal de Transportes
      [4.2995, -74.8135], // Carrera 7 con Calle 18
      [4.3015, -74.8115], // Plaza Terminal
      [4.2995, -74.8155], // Entrada principal
      [4.2985, -74.8155], // Cierra
    ],
  },
  'ECO-008': { // Villa Olímpica / Granada - Av. Acacias, Calle 21, Carrera 15
    name: 'Circuito Villa Olímpica - Granada',
    sector: 'Villa Olímpica / Granada',
    color: '#8B5CF6',
    schedule: 'Lunes, Miércoles, Viernes y Sábado · 05:00 a.m. – 09:00 a.m.',
    waypoints: [
      [4.2970, -74.8180], // EcoPunto Villa Olímpica
      [4.3000, -74.8160], // Av. Acacias con Calle 21
      [4.3030, -74.8140], // EcoPunto Barrio Granada
      [4.3055, -74.8050], // Carrera 15 con Calle 21
      [4.3030, -74.8140], // Regresa por Granada
      [4.2970, -74.8180], // Cierra
    ],
  },
  'ECO-009': { // Recogida Puntos Limpios (circuito operativo real)
    name: 'Circuito Operativo Puntos Limpios',
    sector: 'Recogida Puntos Limpios',
    color: '#F97316',
    schedule: 'Miércoles y Sábado · 08:00 a.m. – 02:00 p.m.',
    waypoints: [
      [4.3009, -74.8075], // EcoPunto Parque Bolívar
      [4.3040, -74.8005], // EcoPunto Camellón del Comercio
      [4.3055, -74.8050], // EcoPunto Barrio Granada
      [4.3095, -74.8125], // EcoPunto Alto de la Cruz
      [4.3120, -74.8020], // EcoPunto El Diamante
      [4.2995, -74.8205], // EcoPunto Unicentro
      [4.3022, -74.8228], // EcoPunto Barrio Kennedy
      [4.2970, -74.8180], // EcoPunto Villa Olímpica
      [4.2985, -74.8155], // EcoPunto Terminal
      [4.2960, -74.8085], // EcoPunto La Esperanza
      [4.3009, -74.8075], // Cierra en Parque Bolívar
    ],
  },
};

// OSRM cache en memoria
const osrmCache = new Map();

async function fetchOSRMRoute(waypoints) {
  const key = waypoints.map(([lat, lng]) => `${lat.toFixed(6)},${lng.toFixed(6)}`).join(';');
  if (osrmCache.has(key)) return osrmCache.get(key);

  const coords = waypoints.map(([lat, lng]) => `${lng},${lat}`).join(';');
  const url = `https://router.project-osrm.org/route/v1/driving/${coords}?overview=full&geometries=geojson`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`OSRM ${res.status}`);
    const data = await res.json();
    if (data.code !== 'Ok' || !data.routes?.[0]?.geometry?.coordinates) {
      throw new Error('OSRM invalid response');
    }
    // OSRM returns [lng, lat] -> convert to [lat, lng] for Leaflet
    const routeCoords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    osrmCache.set(key, routeCoords);
    return routeCoords;
  } catch (e) {
    console.warn('OSRM fetch failed, using fallback straight lines:', e.message);
    // Fallback: straight lines between waypoints
    return waypoints;
  }
}

function createCleanPointIcon(isDark) {
  const fillColor = '#059669';
  const strokeColor = isDark ? '#090A0F' : '#FFFFFF';
  const iconColor = isDark ? '#F8FAFC' : '#FFFFFF';
  return L.divIcon({
    className: 'clean-point-marker',
    html: `
      <div class="relative" style="filter: drop-shadow(0 2px 8px ${isDark ? 'rgba(248,250,252,0.15)' : 'rgba(15,23,42,0.2)'});">
        <svg viewBox="0 0 24 24" width="32" height="32">
          <circle cx="12" cy="12" r="11" fill="${fillColor}" stroke="${strokeColor}" stroke-width="2.5"/>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke="${iconColor}" stroke-width="2"/>
          <circle cx="12" cy="10" r="3" fill="${iconColor}"/>
        </svg>
        <div class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[var(--accent)] rounded-full border-2 border-[var(--bg-surface)] animate-pulse" />
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
}

function createTruckIcon(isDark) {
  const truckColor = '#0284C7';
  const wheelColor = isDark ? '#F8FAFC' : '#0F172A';
  const bgColor = isDark ? '#1A1F2E' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.15)';
  const shadowColor = isDark ? 'rgba(248,250,252,0.15)' : 'rgba(15,23,42,0.15)';
  return L.divIcon({
    className: 'truck-marker',
    html: `
      <div class="relative flex items-center justify-center">
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all duration-200 ease-out"
             style="background: ${bgColor}; border: 1.5px solid ${borderColor}; box-shadow: 0 2px 8px ${shadowColor};">
          <svg viewBox="0 0 24 24" width="16" height="16" class="transition-transform duration-200 ease-out" style="transform: scale(1);">
            <path fill="${truckColor}" d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
            <circle cx="7" cy="19" r="1.5" fill="${wheelColor}"/>
            <circle cx="17" cy="19" r="1.5" fill="${wheelColor}"/>
          </svg>
        </div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 15],
    popupAnchor: [0, -15],
  });
}

function MapControls({ visibleLayers, onToggleLayer, onLocate, onResetView, theme, isMobileLayersOpen, onToggleMobileLayers, selectedTruck, selectedPoint }) {
  const isDark = theme === 'dark';

  // Show mobile layers panel when open
  if (isMobileLayersOpen) {
    return (
      <div className="map-controls absolute top-4 right-4 z-30 w-72">
        <div className="surface-panel rounded-xl shadow-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-subtle)]">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
              <Layers className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
              Capas y Leyenda
            </div>
            <button
              onClick={onToggleMobileLayers}
              className="p-1.5 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
              aria-label="Cerrar capas"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          <div className="p-4 space-y-4">
            {[
              { id: 'cleanPoints', label: 'Puntos Limpios', icon: Package, color: 'var(--accent)', bgColor: 'var(--accent)' },
              { id: 'trucks', label: 'Flota de camiones', icon: Navigation, color: 'var(--accent-sky)', bgColor: 'var(--accent-sky)' },
            ].map((layer) => (
              <label key={layer.id} className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer transition-colors hover:bg-[var(--bg-elevated)]">
                <input
                  type="checkbox"
                  checked={visibleLayers[layer.id]}
                  onChange={(e) => onToggleLayer(layer.id, e.target.checked)}
                  className="w-4 h-4 accent-[var(--accent)] rounded border-[var(--border-default)]"
                />
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: layer.bgColor + '/10', border: '1px solid ' + layer.bgColor + '20' }}>
                  <layer.icon className="w-4 h-4" style={{ color: layer.color }} aria-hidden="true" />
                </div>
                <span className="text-sm font-medium text-[var(--text-primary)]">{layer.label}</span>
              </label>
            ))}
            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-2 text-xs text-[var(--text-secondary)]">
              {visibleLayers.cleanPoints && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
                  <span>Puntos de reciclaje fijos, móviles y comunitarios</span>
                </div>
              )}
              {visibleLayers.trucks && (
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-sky)' }} />
                  <span>Camiones en tiempo real con rutas OSRM</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop: original controls
  return (
    <div className="map-controls absolute top-4 right-4 z-20 flex flex-col gap-2 lg:hidden">
      {/* Mobile: pill button for layers */}
      <button
        onClick={onToggleMobileLayers}
        className="surface-panel rounded-full px-4 py-2 shadow-lg flex items-center gap-2 whitespace-nowrap transition-all duration-200 hover:shadow-xl"
        aria-label={isMobileLayersOpen ? 'Cerrar capas y leyenda' : 'Abrir capas y leyenda'}
      >
        <Layers className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
        <span className="text-sm font-medium text-[var(--text-primary)] hidden sm:inline">Capas y Leyenda</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
          <div className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-sky)' }} />
        </div>
      </button>
    </div>
  );
}

function MapLegend({ visibleLayers, theme }) {
  const isDark = theme === 'dark';
  const strokeColor = isDark ? '#090A0F' : '#FFFFFF';
  const iconColor = isDark ? '#F8FAFC' : '#FFFFFF';
  const wheelColor = isDark ? '#F8FAFC' : '#0F172A';
  const bgColor = isDark ? '#1A1F2E' : '#FFFFFF';
  const borderColor = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(15,23,42,0.15)';
  const shadowColor = isDark ? 'rgba(248,250,252,0.15)' : 'rgba(15,23,42,0.15)';
  const truckColor = '#0284C7';

  return (
    <div className="map-legend absolute bottom-4 left-4 z-20 surface-panel rounded-xl p-4 shadow-lg min-w-[200px] max-w-[240px]">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-sm text-[var(--text-primary)]">Leyenda</span>
      </div>
      <div className="space-y-3 text-xs">
        {visibleLayers.cleanPoints && (
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="flex-shrink-0 relative" style={{filter: 'drop-shadow(0 2px 8px rgba(15,23,42,0.15))'}}>
              <svg viewBox="0 0 24 24" width="24" height="24">
                <circle cx="12" cy="12" r="10" fill="#059669" stroke={strokeColor} strokeWidth="2"/>
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" fill="none" stroke={iconColor} strokeWidth="2"/>
                <circle cx="12" cy="10" r="3" fill={iconColor}/>
              </svg>
            </div>
            <span className="text-sm font-medium">Puntos Limpios (EcoPuntos)</span>
          </div>
        )}
        {visibleLayers.trucks && (
          <div className="flex items-center gap-3 text-[var(--text-secondary)]">
            <div className="flex-shrink-0 relative" style={{filter: `drop-shadow(0 2px 8px ${shadowColor})`}}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{background: bgColor, border: `1.5px solid ${borderColor}`}}>
                <svg viewBox="0 0 24 24" width="16" height="16">
                  <path fill={truckColor} d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
                  <circle cx="7" cy="19" r="1.5" fill={wheelColor}/>
                  <circle cx="17" cy="19" r="1.5" fill={wheelColor}/>
                </svg>
              </div>
            </div>
            <span className="text-sm font-medium">Flota de camiones</span>
          </div>
        )}
        {visibleLayers.trucks && (
          <div className="flex items-center gap-3 text-[var(--text-secondary)] ml-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-1.5 rounded" style={{background: 'linear-gradient(90deg, transparent, #059669, transparent)'}} />
            </div>
            <span className="text-sm font-medium">Ruta de recolección (hover/clic)</span>
          </div>
        )}
      </div>
    </div>
  );
}

function MapView() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const layersRef = useRef({ routes: null, cleanPoints: null, trucks: null, truckRoute: null });
  const tileLayerRef = useRef(null);
  const truckMarkersRef = useRef([]);
  const animationIntervalRef = useRef(null);

  const [visibleLayers, setVisibleLayers] = useState({
    cleanPoints: true,
    trucks: true,
  });
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [hoveredTruckId, setHoveredTruckId] = useState(null);
  const [selectedTruckId, setSelectedTruckId] = useState(null);
  const [isMobileLayersOpen, setIsMobileLayersOpen] = useState(false);
  // OSRM route cache per truck (in-memory, persists across renders)
  const [truckRoutesOSRM, setTruckRoutesOSRM] = useState({});

  // activeTruckId = hoveredTruckId || selectedTruckId
  const activeTruckId = hoveredTruckId ?? selectedTruckId;

  // OpenStreetMap free tiles - NO API KEY REQUIRED
  const tileUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

  // Fetch OSRM routes for ALL 9 trucks on mount
  useEffect(() => {
    const trucksToFetch = ['ECO-001', 'ECO-002', 'ECO-003', 'ECO-004', 'ECO-005', 'ECO-006', 'ECO-007', 'ECO-008', 'ECO-009'];
    const fetchAll = async () => {
      const newRoutes = { ...truckRoutesOSRM };
      for (const truckId of trucksToFetch) {
        const wp = truckWaypoints[truckId]?.waypoints;
        if (wp && wp.length >= 2) {
          const routeCoords = await fetchOSRMRoute(wp);
          newRoutes[truckId] = routeCoords;
        }
      }
      setTruckRoutesOSRM(newRoutes);
    };
    fetchAll();
  }, []);

  const addTileLayer = (map) => {
    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }
    const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

    const tileLayer = L.tileLayer(tileUrl, {
      attribution,
      maxZoom: 19,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    return tileLayer;
  };

  // Draw truck route polyline (double line: base/border + main line)
  const drawTruckRoute = (truckId) => {
    if (!mapRef.current || !layersRef.current.truckRoute) return;
    layersRef.current.truckRoute.clearLayers();

    // Use OSRM route if available, fallback to static waypoints
    const routeCoords = truckRoutesOSRM[truckId] || truckWaypoints[truckId]?.waypoints || [];
    if (!Array.isArray(routeCoords) || routeCoords.length === 0) return;

    const color = truckWaypoints[truckId]?.color || '#059669';

    // Base line (thicker, darker - acts as border/glow)
    L.polyline(routeCoords, {
      color: '#000000',
      weight: 6,
      opacity: 0.4,
      interactive: false,
    }).addTo(layersRef.current.truckRoute);

    // Main line (crisp, colored)
    L.polyline(routeCoords, {
      color,
      weight: 3,
      opacity: 0.95,
      lineCap: 'round',
      lineJoin: 'round',
      interactive: false,
    }).addTo(layersRef.current.truckRoute);

    // Start/end markers
    const startCoord = routeCoords[0];
    const endCoord = routeCoords[routeCoords.length - 1];

    L.circleMarker(startCoord, {
      radius: 8,
      color: '#FFFFFF',
      fillColor: color,
      fillOpacity: 1,
      weight: 2,
      interactive: false,
    }).addTo(layersRef.current.truckRoute);

    L.circleMarker(endCoord, {
      radius: 8,
      color: '#FFFFFF',
      fillColor: color,
      fillOpacity: 1,
      weight: 2,
      interactive: false,
    }).addTo(layersRef.current.truckRoute);
  };

  const clearTruckRoute = () => {
    if (layersRef.current.truckRoute) {
      layersRef.current.truckRoute.clearLayers();
    }
  };

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

    // Add initial tile layer
    addTileLayer(map);

    const cleanPointsLayer = L.layerGroup().addTo(map);
    const trucksLayer = L.layerGroup().addTo(map);
    const truckRouteLayer = L.layerGroup().addTo(map);

    layersRef.current = { cleanPoints: cleanPointsLayer, trucks: trucksLayer, truckRoute: truckRouteLayer };

    function addCleanPoints() {
      cleanPoints.forEach((point) => {
        const typeInfo = cleanPointTypes[point.type];
        const color = cleanPointColors[point.type] || '#059669';

        const marker = L.marker(point.coordinates, {
          icon: createCleanPointIcon(isDark),
        }).addTo(cleanPointsLayer);

        const capacityPct = point.stats?.capacityAvailable ?? Math.floor(Math.random() * 30) + 50;

        const popupContent = `
          <div class="p-3 min-w-[300px] max-w-[340px] text-[var(--text-primary)] font-sans" style="color: var(--text-primary) !important;">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: ${color}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-[var(--text-primary)] truncate">${point.name}</h4>
                <span class="badge badge-success text-xs">${typeInfo.label}</span>
              </div>
            </div>
            <div class="space-y-2 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <div class="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span class="truncate">${point.address}</span>
              </div>
              <div class="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span>${point.hours}</span>
              </div>
              ${point.phone ? `
              <div class="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span>${point.phone}</span>
              </div>
              ` : ''}
              <div class="flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span class="font-medium">Residuos:</span>
              </div>
              <div class="flex flex-wrap gap-1 ml-6">
                ${point.acceptedWaste.map(waste => `<span class="px-2 py-0.5 text-xs rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">${waste}</span>`).join('')}
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Gauge className="w-4 h-4 text-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                <span class="font-medium">Capacidad disponible:</span>
                <span className="text-[var(--accent)] font-bold ml-auto">${capacityPct}%</span>
              </div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { className: 'leaflet-popup-custom', maxWidth: 360 });
      });
    }

    function addTrucks() {
      const activeTrucks = trucks.filter(t => t.status === 'active');
      activeTrucks.forEach((truck, i) => {
        // Use OSRM route coordinates (follows actual streets) or fallback to static waypoints
        const routeCoords = truckRoutesOSRM[truck.id] || truckWaypoints[truck.id]?.waypoints || [GIRARDOT_CENTER];
        const position = routeCoords[Math.floor(Date.now() / 30000) % routeCoords.length];

        const marker = L.marker(position, { icon: createTruckIcon(isDark) }).addTo(trucksLayer);

        // Store truck reference for hover/click
        marker.truckId = truck.id;

        // Hover: show route preview
        marker.on('mouseover', () => {
          setHoveredTruckId(truck.id);
          if (!selectedTruckId) {
            drawTruckRoute(truck.id);
          }
        });

        marker.on('mouseout', () => {
          setHoveredTruckId(null);
          if (!selectedTruckId) {
            clearTruckRoute();
          }
        });

        // Click: select truck, show route and open popup
        marker.on('click', (e) => {
          e.originalEvent?.stopPropagation();
          setSelectedTruckId(truck.id);
          drawTruckRoute(truck.id);
          marker.openPopup();
        });

        const truckWaypoint = truckWaypoints[truck.id];
        const popupContent = `
          <div class="p-2 min-w-[260px] text-[var(--text-primary)] font-sans" style="color: var(--text-primary) !important;">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-lg bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2">
                  <path d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
                  <circle cx="7" cy="19" r="1.5"/>
                  <circle cx="17" cy="19" r="1.5"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-[var(--text-primary)]">${truck.id}</h4>
                <p class="text-xs text-[var(--text-muted)]">${truck.type}</p>
              </div>
            </div>
            <div class="space-y-2 text-xs text-[var(--text-secondary)]">
              <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <Clock className="w-4 h-4 text-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-[var(--text-muted)]">Días y horarios de paso</div>
                  <div class="font-medium text-[var(--text-primary)]">${truckWaypoint?.schedule || '—'}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 9 9 3 15 9 15 21 9 27 3 21 3 9"/></svg> ${truckWaypoint?.name || 'En tránsito'}
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg> Conductor: ${truck.driver || 'Sin asignar'}
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg> Combustible: ${truck.fuelLevel}%
              </div>
              <div class="flex items-center gap-2">
                <Activity className="w-4 h-4" aria-hidden="true" />
                <span>Estado: <span class="text-[var(--accent)] font-medium capitalize">${truck.status}</span></span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Sector: <span class="font-medium">${truckWaypoint?.sector || '—'}</span></span>
              </div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { className: 'leaflet-popup-custom' });
        truckMarkersRef.current.push({ marker, truck, routeCoords });
      });
    }

    if (visibleLayers.cleanPoints) addCleanPoints();
    if (visibleLayers.trucks) addTrucks();

    // Click on map background: clear selection
    map.on('click', () => {
      setSelectedTruckId(null);
      clearTruckRoute();
    });

    animationIntervalRef.current = setInterval(() => {
      if (!mapRef.current || !mapRef.current._container) return;
      truckMarkersRef.current.forEach(({ marker, truck }) => {
        if (marker && marker._map) {
          // Use OSRM route coordinates for animation (follows actual streets)
          const routeCoords = truckRoutesOSRM[truck.id] || truckWaypoints[truck.id]?.waypoints || [GIRARDOT_CENTER];
          if (Array.isArray(routeCoords) && routeCoords.length > 0) {
            const position = routeCoords[Math.floor(Date.now() / 30000) % routeCoords.length];
            marker.setLatLng(position);
          }
        }
      });
    }, 30000);

    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
        animationIntervalRef.current = null;
      }
      truckMarkersRef.current = [];
      if (mapRef.current) {
        try {
          mapRef.current.remove();
        } catch (e) {
          console.warn('Error removing map:', e);
        }
        mapRef.current = null;
      }
    };
  }, []);

  // Draw/clear truck route when activeTruckId changes
  useEffect(() => {
    if (activeTruckId) {
      drawTruckRoute(activeTruckId);
    } else {
      clearTruckRoute();
    }
  }, [activeTruckId]);

  // Re-create markers when theme changes
  useEffect(() => {
    if (!mapRef.current) return;

    // Recreate clean point markers with new theme
    if (layersRef.current.cleanPoints && mapRef.current.hasLayer(layersRef.current.cleanPoints)) {
      layersRef.current.cleanPoints.clearLayers();
      cleanPoints.forEach((point) => {
        const typeInfo = cleanPointTypes[point.type];
        const color = cleanPointColors[point.type] || '#059669';

        const marker = L.marker(point.coordinates, {
          icon: createCleanPointIcon(isDark),
        }).addTo(layersRef.current.cleanPoints);

        const capacityPct = point.stats?.capacityAvailable ?? Math.floor(Math.random() * 30) + 50;

        const popupContent = `
          <div class="p-3 min-w-[300px] max-w-[340px] text-[var(--text-primary)] font-sans" style="color: var(--text-primary) !important;">
            <div class="flex items-start gap-3 mb-3">
              <div class="w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0" style="background: ${color}">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-semibold text-[var(--text-primary)] truncate">${point.name}</h4>
                <span class="badge badge-success text-xs">${typeInfo.label}</span>
              </div>
            </div>
            <div class="space-y-2 text-sm text-[var(--text-secondary)] border-t border-[var(--border-subtle)] pt-3">
              <div class="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span class="truncate">${point.address}</span>
              </div>
              <div class="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span>${point.hours}</span>
              </div>
              ${point.phone ? `
              <div class="flex items-center gap-2">
                <User className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span>${point.phone}</span>
              </div>
              ` : ''}
              <div class="flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--text-muted)] flex-shrink-0" aria-hidden="true" />
                <span class="font-medium">Residuos:</span>
              </div>
              <div class="flex flex-wrap gap-1 ml-6">
                ${point.acceptedWaste.map(waste => `<span class="px-2 py-0.5 text-xs rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">${waste}</span>`).join('')}
              </div>
              <div class="flex items-center gap-2 pt-2 border-t border-[var(--border-subtle)]">
                <Gauge className="w-4 h-4 text-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                <span class="font-medium">Capacidad disponible:</span>
                <span className="text-[var(--accent)] font-bold ml-auto">${capacityPct}%</span>
              </div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { className: 'leaflet-popup-custom', maxWidth: 360 });
      });
    }

    // Recreate truck markers with new theme
    if (layersRef.current.trucks && mapRef.current.hasLayer(layersRef.current.trucks)) {
      layersRef.current.trucks.clearLayers();
      truckMarkersRef.current = [];
      const activeTrucks = trucks.filter(t => t.status === 'active');
      activeTrucks.forEach((truck, i) => {
        // Use OSRM route coordinates (follows actual streets) or fallback to static waypoints
        const routeCoords = truckRoutesOSRM[truck.id] || truckWaypoints[truck.id]?.waypoints || [GIRARDOT_CENTER];
        const position = routeCoords[Math.floor(Date.now() / 30000) % routeCoords.length];

        const marker = L.marker(position, { icon: createTruckIcon(isDark) }).addTo(layersRef.current.trucks);
        marker.truckId = truck.id;

        // Hover: show route preview
        marker.on('mouseover', () => {
          setHoveredTruckId(truck.id);
          if (!selectedTruckId) {
            drawTruckRoute(truck.id);
          }
        });

        marker.on('mouseout', () => {
          setHoveredTruckId(null);
          if (!selectedTruckId) {
            clearTruckRoute();
          }
        });

        // Click: select truck
        marker.on('click', (e) => {
          e.originalEvent?.stopPropagation();
          setSelectedTruckId(truck.id);
          drawTruckRoute(truck.id);
          marker.openPopup();
        });

        const truckWaypoint = truckWaypoints[truck.id];
        const popupContent = `
          <div class="p-2 min-w-[260px] text-[var(--text-primary)] font-sans" style="color: var(--text-primary) !important;">
            <div class="flex items-center gap-2 mb-3">
              <div class="w-9 h-9 rounded-lg bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20 flex items-center justify-center">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0284C7" stroke-width="2">
                  <path d="M4 18h16v2H4zm14-8h-4V8c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2v2H2c-1.1 0-2 .9-2 2v4c0 1.1.9 2 2 2h2v4h2v-4h12v4h2c1.1 0 2-.9 2-2v-4h2c1.1 0 2-.9 2-2v-4c0-1.1-.9-2-2-2zm-2 0H6V8c0-1.1.9-2 2-2h8c1.1 0 2 .9 2 2v2z"/>
                  <circle cx="7" cy="19" r="1.5"/>
                  <circle cx="17" cy="19" r="1.5"/>
                </svg>
              </div>
              <div>
                <h4 class="font-semibold text-[var(--text-primary)]">${truck.id}</h4>
                <p class="text-xs text-[var(--text-muted)]">${truck.type}</p>
              </div>
            </div>
            <div class="space-y-2 text-xs text-[var(--text-secondary)]">
              <div class="flex items-center gap-2 p-2 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                <Clock className="w-4 h-4 text-[var(--accent)] flex-shrink-0" aria-hidden="true" />
                <div>
                  <div class="text-[var(--text-muted)]">Días y horarios de paso</div>
                  <div class="font-medium text-[var(--text-primary)]">${truckWaypoint?.schedule || '—'}</div>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="3 9 9 3 15 9 15 21 9 27 3 21 3 9"/></svg> ${truckWaypoint?.name || 'En tránsito'}
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg> Conductor: ${truck.driver || 'Sin asignar'}
              </div>
              <div class="flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="2" x2="12" y2="22"/><path d="M5 12H2a10 10 0 0 0 20 0h-3"/></svg> Combustible: ${truck.fuelLevel}%
              </div>
              <div class="flex items-center gap-2">
                <Activity className="w-4 h-4" aria-hidden="true" />
                <span>Estado: <span class="text-[var(--accent)] font-medium capitalize">${truck.status}</span></span>
              </div>
              <div class="flex items-center gap-2">
                <MapPin className="w-4 h-4" aria-hidden="true" />
                <span>Sector: <span class="font-medium">${truckWaypoint?.sector || '—'}</span></span>
              </div>
            </div>
          </div>
        `;
        marker.bindPopup(popupContent, { className: 'leaflet-popup-custom' });
        truckMarkersRef.current.push({ marker, truck, routeCoords });
      });
    }

    // Redraw active truck route with new theme colors
    if (activeTruckId) {
      drawTruckRoute(activeTruckId);
    }
  }, [isDark]);

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
        gsap.fromTo(mapControls, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.15 });
      }
      if (mapLegend) {
        gsap.fromTo(mapLegend, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.3 });
      }
    });
    return () => ctx.revert();
  }, [visibleLayers]);

  return (
    <div className={`relative h-[calc(100vh-4rem)] lg:h-[calc(100vh-5rem)] bg-[var(--bg-canvas)]`}>
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

      {/* Top-right: Layers button (mobile) / Layers panel (desktop) */}
      <MapControls
        visibleLayers={visibleLayers}
        onToggleLayer={toggleLayer}
        onLocate={handleLocate}
        onResetView={handleResetView}
        theme={theme}
        isMobileLayersOpen={isMobileLayersOpen}
        onToggleMobileLayers={() => setIsMobileLayersOpen(!isMobileLayersOpen)}
        selectedTruck={selectedTruckId}
        selectedPoint={selectedFeature}
      />

      {/* Desktop Legend (lg+) */}
      <div className="hidden lg:block">
        <MapLegend visibleLayers={visibleLayers} theme={theme} />
      </div>

      {/* Mobile: Vertical control bar on right edge */}
      <div className="lg:hidden absolute right-2 top-16 z-20 flex flex-col gap-1.5">
        <button
          onClick={handleLocate}
          className="w-10 h-10 surface-panel rounded-lg flex items-center justify-center shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Mi ubicación"
        >
          <Locate className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomIn()}
          className="w-10 h-10 surface-panel rounded-lg flex items-center justify-center shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Acercar"
        >
          <ZoomIn className="w-5 h-5" aria-hidden="true" />
        </button>
        <button
          onClick={() => mapRef.current?.zoomOut()}
          className="w-10 h-10 surface-panel rounded-lg flex items-center justify-center shadow-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
          aria-label="Alejar"
        >
          <ZoomOut className="w-5 h-5" aria-hidden="true" />
        </button>
      </div>

      {/* Mobile: Compact bottom info bar - hidden when truck or point selected */}
      {(selectedTruckId || selectedFeature) ? null : (
        <div className="lg:hidden absolute bottom-4 left-4 right-4 z-20 surface-panel rounded-xl px-4 py-3 shadow-lg">
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
              <span className="font-semibold text-[var(--text-primary)]">{cleanPoints.length} EcoPuntos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-sky)' }} />
              <span className="font-semibold text-[var(--text-primary)]">{trucks.filter(t => t.status === 'active').length} Camiones activos</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Info Panel (lg+) */}
      <div className="hidden lg:block absolute bottom-4 right-4 z-[1000] surface-panel rounded-xl p-4 shadow-lg min-w-[280px] max-w-[320px]">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[var(--text-primary)]">Información rápida</h3>
        </div>
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 rounded-lg bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20">
            <div className="font-display font-bold text-2xl text-[var(--accent-sky)]">{Object.keys(truckWaypoints).length}</div>
            <div className="text-xs text-[var(--text-secondary)]">Circuitos de flota</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20">
            <div className="font-display font-bold text-2xl text-[var(--accent)]">{cleanPoints.length}</div>
            <div className="text-xs text-[var(--text-secondary)]">Puntos Limpios</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20">
            <div className="font-display font-bold text-2xl text-[var(--accent-sky)]">{trucks.filter(t => t.status === 'active').length}</div>
            <div className="text-xs text-[var(--text-secondary)]">Camiones activos</div>
          </div>
          <div className="p-3 rounded-lg bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20">
            <div className="font-display font-bold text-2xl text-[var(--accent-amber)]">{routeStats.dailyTons}</div>
            <div className="text-xs text-[var(--text-secondary)]">Toneladas/día</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MapView;