import { useState, useEffect, useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Building, Truck, Navigation, Filter, ChevronDown, ChevronUp, Clock, Award, MapPin as MapPinIcon, CheckCircle, Car, Wifi, Droplet, Users, Leaf, Recycle, Trash2, Zap } from 'lucide-react';
import { cleanPoints, cleanPointTypes, rewardsByWaste } from '../data/cleanPoints';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const typeFilters = [
  { id: 'all', label: 'Todos', icon: Building, accent: 'stone' },
  { id: 'fixed', label: 'Fijos', icon: Building, accent: 'forest' },
  { id: 'mobile', label: 'Móviles', icon: Truck, accent: 'sky' },
  { id: 'community', label: 'Comunitarios', icon: Users, accent: 'amber' },
];

const typeIconMap = {
  fixed: Building,
  mobile: Truck,
  community: Users,
};

const typeAccentMap = {
  fixed: 'forest',
  mobile: 'sky',
  community: 'amber',
};

export default function CleanPoints() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPoint, setExpandedPoint] = useState(null);
  const containerRef = useRef(null);
  const filterBtnsRef = useRef(null);
  const cardsRef = useRef(null);

  const filteredPoints = useMemo(() => {
    return cleanPoints.filter(point => {
      const matchesType = filterType === 'all' || point.type === filterType;
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.acceptedWaste.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  // GSAP Animations
  useGSAP(() => {
    const filterBtns = filterBtnsRef.current?.querySelectorAll('.filter-btn');
    if (filterBtns?.length) {
      gsap.fromTo(filterBtns,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.05 }
      );
    }
    const pointCards = cardsRef.current?.querySelectorAll('.point-card');
    if (pointCards?.length) {
      gsap.fromTo(pointCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.08,
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [filterType, searchQuery] });

  const toggleExpanded = (pointId) => {
    setExpandedPoint(prev => prev === pointId ? null : pointId);
  };

  const getFilterBtnStyle = (accent, isActive, isDark) => {
    if (isActive) {
      return 'bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-sm text-[var(--accent)]';
    }
    return isDark
      ? 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-default)]'
      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-default)]';
  };

  return (
    <div ref={containerRef} className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header - Community Directory */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full bg-[var(--accent-sky)]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>Red de Entrega</p>
            <h1 className="font-display font-bold text-display-md lg:text-display-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              Puntos Limpios
              <br />
              <span className="gradient-text">de Girardot</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              {cleanPoints.length} puntos de entrega autorizados para residuos especiales, peligrosos y voluminosos.
              Gana EcoPuntos por cada depósito.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="surface-panel rounded-2xl p-4 lg:p-6 mb-6">
            <div className="relative mb-4">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, dirección o residuo aceptado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-4 py-3.5 text-base"
                aria-label="Buscar puntos limpios"
              />
            </div>
            <div ref={filterBtnsRef} className="flex flex-wrap gap-2">
              {typeFilters.map((type) => {
                const isActive = filterType === type.id;
                return (
                  <button
                    key={type.id}
                    onClick={() => { setFilterType(type.id); setSearchQuery(''); }}
                    className={`filter-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] border ${getFilterBtnStyle(type.accent, isActive, isDark)}`}
                  >
                    <type.icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                    {type.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Points List */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>
              {filteredPoints.length} punto{filteredPoints.length !== 1 ? 's' : ''} encontrado{filteredPoints.length !== 1 ? 's' : ''}
            </h2>
            <NavLink to="/map" className="btn-ghost flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Ver en mapa
            </NavLink>
          </div>

          {filteredPoints.length === 0 ? (
            <div className="card-padded text-center py-12">
              <Filter className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <p style={{ color: 'var(--text-secondary)' }}>No se encontraron puntos con esos filtros</p>
              <button onClick={() => { setFilterType('all'); setSearchQuery(''); }} className="btn-secondary mt-4">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div ref={cardsRef} className="space-y-4">
              {filteredPoints.map((point, i) => (
                <CleanPointCard
                  key={point.id}
                  point={point}
                  index={i}
                  isExpanded={expandedPoint === point.id}
                  onToggle={() => toggleExpanded(point.id)}
                  rewardsByWaste={rewardsByWaste}
                  isDark={isDark}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to earn points - Bento Grid Table */}
      <section className="section-container pb-16 relative z-10" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-h3 text-center mb-10" style={{ color: 'var(--text-primary)' }}>¿Cuántos puntos ganas por residuo?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left" style={{ borderColor: 'var(--border-subtle)' }}>
                  <th className="pb-3 font-medium text-right" style={{ color: 'var(--text-secondary)' }}>Residuo</th>
                  <th className="pb-3 font-medium text-right" style={{ color: 'var(--text-secondary)' }}>Puntos/kg</th>
                  <th className="pb-3 font-medium text-right" style={{ color: 'var(--text-secondary)' }}>Máx/visita</th>
                  <th className="pb-3 font-medium text-right" style={{ color: 'var(--text-secondary)' }}>Dónde</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                {Object.entries(rewardsByWaste).map(([waste, data]) => (
                  <tr key={waste} className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-3 font-medium" style={{ color: 'var(--text-primary)' }}>{waste}</td>
                    <td className="py-3 text-right font-semibold" style={{ color: 'var(--accent)' }}>
                      {data.pointsPerKg ? `${data.pointsPerKg}/kg` : data.pointsPerUnit ? `${data.pointsPerUnit}/unidad` : '—'}
                    </td>
                    <td className="py-3 text-right" style={{ color: 'var(--text-secondary)' }}>{data.maxPerVisit.toLocaleString()}</td>
                    <td className="py-3 text-right text-xs" style={{ color: 'var(--text-muted)' }}>Puntos Limpios</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

function CleanPointCard({ point, index, isExpanded, onToggle, rewardsByWaste, isDark }) {
  const typeInfo = cleanPointTypes[point.type];
  const color = typeAccentMap[point.type] || 'forest';
  const Icon = typeIconMap[point.type] || Building;

  return (
    <div className="point-card card-interactive card-padded border relative overflow-hidden group" style={{ borderColor: 'var(--border-subtle)' }}>
      <button
        onClick={onToggle}
        className="w-full p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 text-left"
        aria-expanded={isExpanded}
      >
        <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <Icon className="w-7 h-7" style={{ color: color === 'forest' ? 'var(--accent)' : color === 'sky' ? 'var(--accent-sky)' : 'var(--accent-amber)' }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-display font-semibold text-lg" style={{ color: 'var(--text-primary)' }}>{point.name}</h3>
            <span className="badge text-xs" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: color === 'forest' ? 'var(--accent)' : color === 'sky' ? 'var(--accent-sky)' : 'var(--accent-amber)' }}>
              {typeInfo.label}
            </span>
            {point.status === 'active' && (
              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--accent)' }}>
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                Activo
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm mb-2" style={{ color: 'var(--text-secondary)' }}>
            <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" aria-hidden="true" /> {point.address}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {point.hours}</span>
            {point.phone && <span className="flex items-center gap-1">📞 {point.phone}</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            {point.acceptedWaste.slice(0, 4).map((waste) => (
              <span key={waste} className="px-2 py-0.5 text-xs rounded border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}>{waste}</span>
            ))}
            {point.acceptedWaste.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded border" style={{ background: 'var(--accent-amber)/10', borderColor: 'var(--accent-amber)/20', color: 'var(--accent-amber)' }}>+{point.acceptedWaste.length - 4} más</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 lg:ml-auto">
          <div className="text-right hidden sm:block">
            <div className="font-mono font-bold text-2xl" style={{ color: 'var(--accent)' }}>{point.stats.monthlyVisits.toLocaleString()}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>visitas/mes</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="font-mono font-bold text-2xl" style={{ color: 'var(--accent-amber)' }}>{point.stats.pointsGiven.toLocaleString()}</div>
            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>pts entregados</div>
          </div>
          <ChevronDown className="w-6 h-6 transition-transform lg:block" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 border-t animate-in" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Zap className="w-4 h-4" aria-hidden="true" />
                Servicios disponibles
              </h4>
              <div className="flex flex-wrap gap-2">
                {point.services.map((service) => (
                  <span key={service} className="px-3 py-1.5 text-xs rounded-lg border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--accent)' }}>{service}</span>
                ))}
              </div>
            </div>
            {/* Features */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Características
              </h4>
              <div className="space-y-2">
                {point.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Award className="w-4 h-4" aria-hidden="true" />
                Estadísticas mensuales
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Visitas</span><span className="font-medium" style={{ color: 'var(--text-primary)' }}>{point.stats.monthlyVisits.toLocaleString()}</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Toneladas</span><span className="font-medium" style={{ color: 'var(--accent)' }}>{point.stats.tonsCollected} t</span></div>
                <div className="flex justify-between"><span style={{ color: 'var(--text-secondary)' }}>Puntos</span><span className="font-medium" style={{ color: 'var(--accent-amber)' }}>{point.stats.pointsGiven.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          {/* Accepted waste with points */}
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
              <Recycle className="w-4 h-4" aria-hidden="true" />
              Residuos aceptados y puntos por kg
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {point.acceptedWaste.map((waste) => {
                const reward = rewardsByWaste[waste];
                return (
                  <div key={waste} className="p-3 rounded-lg border" style={{ background: 'var(--bg-elevated)/50', borderColor: 'var(--border-subtle)' }}>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{waste}</p>
                    {reward && (
                      <p className="text-xs font-semibold mt-1" style={{ color: 'var(--accent-amber)' }}>
                        {reward.pointsPerKg ? `${reward.pointsPerKg} pts/kg` : reward.pointsPerUnit ? `${reward.pointsPerUnit} pts/unidad` : 'Consultar'}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}