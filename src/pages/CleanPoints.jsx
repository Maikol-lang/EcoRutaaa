import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, Building, Truck, Navigation, Filter, ChevronDown, ChevronUp, Clock, Award, MapPin as MapPinIcon, CheckCircle, Car, Wifi, Droplet, Users, Leaf, Recycle, Trash2, Zap } from 'lucide-react';
import { cleanPoints, cleanPointTypes, rewardsByWaste } from '../data/cleanPoints';
import { NavLink } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

export default function CleanPoints() {
  const [filterType, setFilterType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPoint, setExpandedPoint] = useState(null);
  const containerRef = useRef(null);

  const filteredPoints = useMemo(() => {
    return cleanPoints.filter(point => {
      const matchesType = filterType === 'all' || point.type === filterType;
      const matchesSearch = point.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        point.acceptedWaste.some(w => w.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesType && matchesSearch;
    });
  }, [filterType, searchQuery]);

  const types = [
    { id: 'all', label: 'Todos', icon: Building },
    { id: 'fixed', label: 'Fijos', icon: Building },
    { id: 'mobile', label: 'Móviles', icon: Truck },
    { id: 'community', label: 'Comunitarios', icon: Users },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const filterBtns = containerRef.current?.querySelectorAll('.filter-btn');
      const pointCards = containerRef.current?.querySelectorAll('.point-card');

      if (filterBtns?.length) {
        gsap.fromTo(filterBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
      }
      if (pointCards?.length) {
        gsap.fromTo(pointCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [filterType, searchQuery]);

  const toggleExpanded = (pointId) => {
    setExpandedPoint(prev => prev === pointId ? null : pointId);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb-neon w-96 h-96 top-0 right-0 translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="glow-orb-green w-72 h-72 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider mb-2">Red de Entrega</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Puntos Limpios
              <br />
              <span className="gradient-text">de Girardot</span>
            </h1>
            <p className="text-eco-green/60 max-w-2xl mx-auto text-lg">
              {cleanPoints.length} puntos de entrega autorizados para residuos especiales, peligrosos y voluminosos.
              Gana EcoPuntos por cada depósito.
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl p-4 lg:p-6 mb-6">
            <div className="relative mb-4">
              <MapPinIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
              <input
                type="search"
                placeholder="Buscar por nombre, dirección o residuo aceptado..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-4 py-3.5 text-base"
                aria-label="Buscar puntos limpios"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type.id}
                  onClick={() => { setFilterType(type.id); setSearchQuery(''); }}
                  className={`filter-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    filterType === type.id
                      ? 'bg-eco-neon/10 border-eco-neon/30 text-eco-neon shadow-lg shadow-eco-neon/20'
                      : 'bg-eco-surface/50 border-eco-border/50 text-eco-green/60 hover:text-white hover:border-eco-green/30'
                  }`}
                >
                  <type.icon className="w-4 h-4" aria-hidden="true" />
                  {type.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Points List */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-semibold text-xl text-white">
              {filteredPoints.length} punto{filteredPoints.length !== 1 ? 's' : ''} encontrado{filteredPoints.length !== 1 ? 's' : ''}
            </h2>
            <NavLink to="/map" className="btn-ghost flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              Ver en mapa
            </NavLink>
          </div>

          {filteredPoints.length === 0 ? (
            <div className="card p-12 text-center">
              <Filter className="w-16 h-16 text-eco-green/30 mx-auto mb-4" aria-hidden="true" />
              <p className="text-eco-green/50 text-lg">No se encontraron puntos con esos filtros</p>
              <button onClick={() => { setFilterType('all'); setSearchQuery(''); }} className="btn-secondary mt-4">
                Limpiar filtros
              </button>
            </div>
          ) : (
            <div ref={containerRef} className="space-y-4">
              {filteredPoints.map((point, i) => (
                <CleanPointCard
                  key={point.id}
                  point={point}
                  index={i}
                  isExpanded={expandedPoint === point.id}
                  onToggle={() => toggleExpanded(point.id)}
                  rewardsByWaste={rewardsByWaste}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How to earn points */}
      <section className="section-container pb-16 relative z-10 bg-eco-bg-light/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-xl text-white text-center mb-10">¿Cuántos puntos ganas por residuo?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-eco-border/30 text-left">
                  <th className="pb-3 font-medium text-eco-green/60">Residuo</th>
                  <th className="pb-3 font-medium text-eco-green/60 text-right">Puntos/kg</th>
                  <th className="pb-3 font-medium text-eco-green/60 text-right">Máx/visita</th>
                  <th className="pb-3 font-medium text-eco-green/60 text-right">Dónde</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-eco-border/20">
                {Object.entries(rewardsByWaste).map(([waste, data]) => (
                  <tr key={waste} className="hover:bg-eco-green/5 transition-colors">
                    <td className="py-3 text-white">{waste}</td>
                    <td className="py-3 text-right font-semibold text-eco-neon">
                      {data.pointsPerKg ? `${data.pointsPerKg}/kg` : data.pointsPerUnit ? `${data.pointsPerUnit}/unidad` : '—'}
                    </td>
                    <td className="py-3 text-right text-eco-green/60">{data.maxPerVisit.toLocaleString()}</td>
                    <td className="py-3 text-right text-eco-green/50 text-xs">Puntos Limpios</td>
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

function CleanPointCard({ point, index, isExpanded, onToggle, rewardsByWaste }) {
  const typeInfo = cleanPointTypes[point.type];
  const typeColors = { fixed: 'eco-green', mobile: 'eco-cyan', community: 'eco-neon' };
  const color = typeColors[point.type];

  return (
    <div className={`card overflow-hidden animate-in stagger-1 ${isExpanded ? 'ring-1 ring-eco-neon/30' : ''}`}>
      <button
        onClick={onToggle}
        className="w-full p-5 lg:p-6 flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-6 text-left"
        aria-expanded={isExpanded}
      >
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${color === 'eco-green' ? 'bg-eco-green/10 border border-eco-green/20' : color === 'eco-cyan' ? 'bg-eco-cyan/10 border border-eco-cyan/20' : 'bg-eco-neon/10 border border-eco-neon/20'}`}>
          <Building className="w-7 h-7" style={{ color: `var(--${color})` }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-3 mb-2">
            <h3 className="font-display font-semibold text-lg text-white">{point.name}</h3>
            <span className={`badge text-xs`} style={{ backgroundColor: `var(--${color})20`, borderColor: `var(--${color})40`, color: `var(--${color})` }}>
              {typeInfo.label}
            </span>
            {point.status === 'active' && (
              <span className="flex items-center gap-1 text-xs text-eco-neon">
                <span className="w-2 h-2 bg-eco-neon rounded-full animate-pulse" aria-hidden="true" />
                Activo
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-eco-green/60 mb-2">
            <span className="flex items-center gap-1"><MapPinIcon className="w-3.5 h-3.5" aria-hidden="true" /> {point.address}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" aria-hidden="true" /> {point.hours}</span>
            {point.phone && <span className="flex items-center gap-1">📞 {point.phone}</span>}
          </div>
          <div className="flex flex-wrap gap-1">
            {point.acceptedWaste.slice(0, 4).map((waste) => (
              <span key={waste} className="px-2 py-0.5 text-xs rounded bg-eco-surface border border-eco-border/50 text-eco-green/70">{waste}</span>
            ))}
            {point.acceptedWaste.length > 4 && (
              <span className="px-2 py-0.5 text-xs rounded bg-eco-neon/20 border border-eco-neon/30 text-eco-neon">+{point.acceptedWaste.length - 4} más</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4 lg:ml-auto">
          <div className="text-right hidden sm:block">
            <div className="font-display font-bold text-2xl text-eco-neon">{point.stats.monthlyVisits.toLocaleString()}</div>
            <div className="text-xs text-eco-green/60">visitas/mes</div>
          </div>
          <div className="text-right hidden sm:block">
            <div className="font-display font-bold text-2xl text-eco-green">{point.stats.pointsGiven.toLocaleString()}</div>
            <div className="text-xs text-eco-green/60">pts entregados</div>
          </div>
          <ChevronDown className={`w-6 h-6 text-eco-green/50 transition-transform lg:block ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>
      </button>
      {isExpanded && (
        <div className="px-5 lg:px-6 pb-5 lg:pb-6 border-t border-eco-border/20 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {/* Services */}
            <div className="lg:col-span-2">
              <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
                <Zap className="w-4 h-4" aria-hidden="true" />
                Servicios disponibles
              </h4>
              <div className="flex flex-wrap gap-2">
                {point.services.map((service) => (
                  <span key={service} className="px-3 py-1.5 text-xs rounded-lg bg-eco-green/10 border border-eco-green/20 text-eco-green">{service}</span>
                ))}
              </div>
            </div>
            {/* Features */}
            <div>
              <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" aria-hidden="true" />
                Características
              </h4>
              <div className="space-y-2">
                {point.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2 text-sm text-eco-green/70">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 text-eco-green" aria-hidden="true" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Stats */}
            <div>
              <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
                <Award className="w-4 h-4" aria-hidden="true" />
                Estadísticas mensuales
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-eco-green/60">Visitas</span><span className="font-medium text-white">{point.stats.monthlyVisits.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-eco-green/60">Toneladas</span><span className="font-medium text-eco-green">{point.stats.tonsCollected} t</span></div>
                <div className="flex justify-between"><span className="text-eco-green/60">Puntos</span><span className="font-medium text-eco-neon">{point.stats.pointsGiven.toLocaleString()}</span></div>
              </div>
            </div>
          </div>

          {/* Accepted waste with points */}
          <div className="mt-6 pt-6 border-t border-eco-border/20">
            <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
              <Recycle className="w-4 h-4" aria-hidden="true" />
              Residuos aceptados y puntos por kg
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {point.acceptedWaste.map((waste) => {
                const reward = rewardsByWaste[waste];
                return (
                  <div key={waste} className="p-3 rounded-lg bg-eco-surface/50 border border-eco-border/30">
                    <p className="text-sm font-medium text-white truncate">{waste}</p>
                    {reward && (
                      <p className="text-xs text-eco-neon font-semibold mt-1">
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