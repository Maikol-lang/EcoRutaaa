import { useState, useRef, useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, TrendingUp, ChevronDown, Users, Truck, Leaf, Target, Award, MapPin, Calendar, X } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const timeRanges = [
  { id: '7d', label: '7 días', days: 7 },
  { id: '30d', label: '30 días', days: 30 },
  { id: '1y', label: 'Último año', days: 365 },
];

const kpiData = {
  '7d': [
    { label: 'Residuos Aprovechados', value: 42.3, suffix: ' Ton', icon: Recycle, trend: '+12%', color: 'var(--accent)' },
    { label: 'Cumplimiento de Rutas', value: 94, suffix: '%', icon: Target, trend: '+3%', color: 'var(--accent-sky)' },
    { label: 'CO₂ Evitado', value: 28.7, suffix: ' Ton', icon: Leaf, trend: '+15%', color: 'var(--accent-lime)' },
    { label: 'Ciudadanos Activos', value: 28.4, suffix: 'K', icon: Users, trend: '+8%', color: 'var(--accent-amber)' },
  ],
  '30d': [
    { label: 'Residuos Aprovechados', value: 172.5, suffix: ' Ton', icon: Recycle, trend: '+8%', color: 'var(--accent)' },
    { label: 'Cumplimiento de Rutas', value: 94, suffix: '%', icon: Target, trend: '+2%', color: 'var(--accent-sky)' },
    { label: 'CO₂ Evitado', value: 115.2, suffix: ' Ton', icon: Leaf, trend: '+12%', color: 'var(--accent-lime)' },
    { label: 'Ciudadanos Activos', value: 32.1, suffix: 'K', icon: Users, trend: '+5%', color: 'var(--accent-amber)' },
  ],
  '1y': [
    { label: 'Residuos Aprovechados', value: 2040, suffix: ' Ton', icon: Recycle, trend: '+15%', color: 'var(--accent)' },
    { label: 'Cumplimiento de Rutas', value: 92, suffix: '%', icon: Target, trend: '+5%', color: 'var(--accent-sky)' },
    { label: 'CO₂ Evitado', value: 1240, suffix: ' Ton', icon: Leaf, trend: '+18%', color: 'var(--accent-lime)' },
    { label: 'Ciudadanos Activos', value: 35.8, suffix: 'K', icon: Users, trend: '+12%', color: 'var(--accent-amber)' },
  ],
};

const evolutionData = {
  '7d': [
    { day: 'Lun', aprovechables: 5.2, ordinarios: 8.1 },
    { day: 'Mar', aprovechables: 6.1, ordinarios: 7.8 },
    { day: 'Mié', aprovechables: 5.8, ordinarios: 8.3 },
    { day: 'Jue', aprovechables: 6.5, ordinarios: 7.5 },
    { day: 'Vie', aprovechables: 7.2, ordinarios: 8.9 },
    { day: 'Sáb', aprovechables: 6.8, ordinarios: 6.2 },
    { day: 'Dom', aprovechables: 4.7, ordinarios: 5.1 },
  ],
  '30d': [
    { day: 'Sem 1', aprovechables: 38.2, ordinarios: 52.1 },
    { day: 'Sem 2', aprovechables: 42.5, ordinarios: 48.3 },
    { day: 'Sem 3', aprovechables: 45.8, ordinarios: 51.2 },
    { day: 'Sem 4', aprovechables: 46.0, ordinarios: 49.8 },
  ],
  '1y': [
    { day: 'Ene', aprovechables: 152, ordinarios: 185 },
    { day: 'Feb', aprovechables: 148, ordinarios: 172 },
    { day: 'Mar', aprovechables: 165, ordinarios: 190 },
    { day: 'Abr', aprovechables: 172, ordinarios: 188 },
    { day: 'May', aprovechables: 180, ordinarios: 195 },
    { day: 'Jun', aprovechables: 178, ordinarios: 182 },
    { day: 'Jul', aprovechables: 185, ordinarios: 188 },
    { day: 'Ago', aprovechables: 182, ordinarios: 190 },
    { day: 'Sep', aprovechables: 190, ordinarios: 198 },
    { day: 'Oct', aprovechables: 195, ordinarios: 202 },
    { day: 'Nov', aprovechables: 200, ordinarios: 205 },
    { day: 'Dic', aprovechables: 193, ordinarios: 195 },
  ],
};

const zoneData = [
  { sector: 'Centro Histórico', toneladas: 42.5, ecoPuntos: 8, cumplimiento: 96 },
  { sector: 'Kennedy', toneladas: 38.2, ecoPuntos: 6, cumplimiento: 92 },
  { sector: 'El Peñón', toneladas: 31.8, ecoPuntos: 5, cumplimiento: 89 },
  { sector: 'La Esperanza', toneladas: 28.4, ecoPuntos: 4, cumplimiento: 91 },
  { sector: 'Alto de la Cruz', toneladas: 24.1, ecoPuntos: 3, cumplimiento: 87 },
];

const classificationData = [
  { label: 'Aprovechables (Blanco)', value: 54, color: '#F8FAFC', darkColor: '#1E293B', border: '#CBD5E1' },
  { label: 'Orgánicos (Verde Esmeralda)', value: 28, color: '#10B981', darkColor: '#059669', border: '#34D399' },
  { label: 'No Aprovechables (Negro)', value: 18, color: '#1E293B', darkColor: '#0F172A', border: '#334155' },
];

export default function Stats() {
  const containerRef = useRef(null);
  const kpiRef = useRef(null);
  const evolutionRef = useRef(null);
  const donutRef = useRef(null);
  const tableRef = useRef(null);
  const [activeRange, setActiveRange] = useState('30d');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState(null);

  const currentKpis = kpiData[activeRange];
  const currentEvolution = evolutionData[activeRange];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useGSAP((ctx) => {
    const safeQuery = (selector, scope = containerRef.current) => scope?.querySelector(selector);
    const safeQueryAll = (selector, scope = containerRef.current) => scope?.querySelectorAll(selector);

    // KPI cards animation
    if (kpiRef.current) {
      gsap.fromTo('.kpi-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.6, ease: 'var(--ease-out)', stagger: 0.08,
          scrollTrigger: { trigger: kpiRef.current, start: 'top 85%', once: true }
        }
      );
    }

    // Evolution chart animation
    if (evolutionRef.current) {
      gsap.fromTo('.evolution-card .chart-container',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)',
          scrollTrigger: { trigger: evolutionRef.current, start: 'top 80%' }
        }
      );
    }

    // Donut chart animation
    if (donutRef.current) {
      gsap.fromTo('.donut-card .chart-container',
        { scale: 0.8, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.8, ease: 'var(--ease-spring)',
          scrollTrigger: { trigger: donutRef.current, start: 'top 80%' }
        }
      );
    }

    // Table animation
    if (tableRef.current) {
      gsap.fromTo('.zone-table-row',
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.06,
          scrollTrigger: { trigger: tableRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [activeRange] });

  const getBarHeight = (value, maxValue, containerHeight) => {
    return (value / maxValue) * containerHeight;
  };

  const getDonutPath = (startAngle, endAngle, radius, innerRadius) => {
    const start = startAngle * Math.PI / 180 - Math.PI / 2;
    const end = endAngle * Math.PI / 180 - Math.PI / 2;
    const x1 = radius * Math.cos(start);
    const y1 = radius * Math.sin(start);
    const x2 = radius * Math.cos(end);
    const y2 = radius * Math.sin(end);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    const ix1 = innerRadius * Math.cos(start);
    const iy1 = innerRadius * Math.sin(start);
    const ix2 = innerRadius * Math.cos(end);
    const iy2 = innerRadius * Math.sin(end);
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${ix1} ${iy1} Z`;
  };

  const donutSegments = classificationData.map((item, i) => {
    const start = classificationData.slice(0, i).reduce((acc, d) => acc + d.value, 0) * 3.6;
    const end = start + item.value * 3.6;
    return { ...item, start, end };
  });

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-canvas)]">
      {/* Header */}
      <header className="py-8 lg:py-12 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="section-container">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <div>
                <h1 className="font-display font-bold text-h1 lg:text-display-sm text-[var(--text-primary)] tracking-tight">
                  Estadísticas e Impacto
                </h1>
                <p className="mt-2 text-[var(--text-secondary)] text-lg">
                  Métricas de recolección, aprovechamiento y cumplimiento en Girardot
                </p>
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full text-[var(--text-primary)] font-medium transition-all duration-[120ms] ease-[var(--ease-out)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--focus)]"
                  aria-expanded={isDropdownOpen}
                  aria-haspopup="listbox"
                  aria-label="Seleccionar rango de tiempo"
                >
                  <Calendar className="w-5 h-5 text-[var(--text-secondary)]" aria-hidden="true" />
                  <span>{timeRanges.find(r => r.id === activeRange)?.label}</span>
                  <ChevronDown className={`w-4 h-4 text-[var(--text-secondary)] transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
                </button>
                {isDropdownOpen && (
                  <ul className="absolute right-0 top-full mt-2 w-48 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl shadow-xl overflow-hidden z-20 animate-in" role="listbox">
                    {timeRanges.map((range) => (
                      <li key={range.id} role="option" aria-selected={activeRange === range.id}>
                        <button
                          onClick={() => { setActiveRange(range.id); setIsDropdownOpen(false); }}
                          className={`w-full px-4 py-2.5 text-left text-sm transition-colors ${
                            activeRange === range.id
                              ? 'bg-[var(--accent)]/10 text-[var(--accent)] font-medium'
                              : 'text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                          }`}
                        >
                          {range.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="section-container py-8 lg:py-12">
        {/* KPI Row */}
        <section ref={kpiRef} className="mb-8 lg:mb-12" aria-label="Indicadores clave">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {currentKpis.map((kpi, i) => (
              <div
                key={kpi.label}
                className="kpi-card card-interactive card-padded relative overflow-hidden group"
                style={{ '--kpi-color': kpi.color }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-[var(--kpi-color)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium mb-1">{kpi.label}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-display font-bold text-3xl lg:text-4xl text-[var(--text-primary)] tabular-nums">{kpi.value}</span>
                      <span className="font-display font-medium text-xl text-[var(--text-secondary)]">{kpi.suffix}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 self-start shrink-0">
                    <kpi.icon className="w-5 h-5" style={{ color: kpi.color }} aria-hidden="true" />
                    <span className="text-sm font-medium" style={{ color: kpi.color }}>{kpi.trend}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Central Grid: Evolution Chart + Donut Chart */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 mb-8 lg:mb-12" aria-label="Gráficos principales">
          {/* Evolution Chart - Left (7 cols) */}
          <div ref={evolutionRef} className="lg:col-span-7 evolution-card card card-padded">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)]">Evolución de Recolección</h2>
                <p className="text-[var(--text-secondary)] text-sm mt-1">Aprovechables vs. Ordinarios en el tiempo</p>
              </div>
              <div className="flex items-center gap-4 text-sm text-[var(--text-muted)]">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#10B981' }}></span>
                  Aprovechables
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: '#64748B' }}></span>
                  Ordinarios
                </span>
              </div>
            </div>
            <div className="chart-container relative h-[320px] lg:h-[380px]">
              <svg className="w-full h-full" viewBox="0 0 800 380" preserveAspectRatio="none" role="img" aria-label="Gráfico de barras comparando residuos aprovechables y ordinarios">
                <defs>
                  <linearGradient id="aprovechables-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.3" />
                  </linearGradient>
                  <linearGradient id="ordinarios-gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#64748B" stopOpacity="0.9" />
                    <stop offset="100%" stopColor="#64748B" stopOpacity="0.3" />
                  </linearGradient>
                </defs>
                {/* Grid lines */}
                <g stroke="var(--border-subtle)" strokeWidth="0.5" opacity="0.5">
                  {[25, 50, 75, 100].map((pct) => (
                    <line key={pct} x1="60" y1={30 + (1 - pct/100) * 300} x2="780" y2={30 + (1 - pct/100) * 300} />
                  ))}
                </g>
                {/* Y-axis labels */}
                <g fontSize="11" fill="var(--text-muted)" fontFamily="DM Sans" textAnchor="end">
                  {[0, 25, 50, 75, 100].map((pct) => (
                    <text key={pct} x="52" y={30 + (1 - pct/100) * 300 + 4} dominantBaseline="middle">
                      {Math.round((1 - pct/100) * 200)}
                    </text>
                  ))}
                </g>
                {/* Bars */}
                <g>
                  {currentEvolution.map((data, i) => {
                    const maxVal = Math.max(...currentEvolution.flatMap(d => [d.aprovechables, d.ordinarios]));
                    const barWidth = Math.min(40, 680 / currentEvolution.length / 2.5);
                    const gap = (720 - currentEvolution.length * barWidth * 2) / (currentEvolution.length + 1);
                    const xBase = 60 + gap + i * (barWidth * 2 + gap);
                    const aHeight = (data.aprovechables / maxVal) * 300;
                    const oHeight = (data.ordinarios / maxVal) * 300;
                    const isHovered = hoveredBar === i;

                    return (
                      <g key={data.day} onMouseEnter={() => setHoveredBar(i)} onMouseLeave={() => setHoveredBar(null)} style={{ cursor: 'pointer' }}>
                        {/* Aprovechables bar */}
                        <rect
                          x={xBase}
                          y={330 - aHeight}
                          width={barWidth}
                          height={aHeight}
                          rx={3}
                          fill="url(#aprovechables-gradient)"
                          opacity={isHovered ? 1 : 0.85}
                          filter={isHovered ? 'drop-shadow(0 4px 8px rgba(16,185,129,0.3))' : 'none'}
                          transition="opacity 0.2s, filter 0.2s"
                        />
                        {/* Ordinarios bar */}
                        <rect
                          x={xBase + barWidth + 4}
                          y={330 - oHeight}
                          width={barWidth}
                          height={oHeight}
                          rx={3}
                          fill="url(#ordinarios-gradient)"
                          opacity={isHovered ? 1 : 0.85}
                          filter={isHovered ? 'drop-shadow(0 4px 8px rgba(100,116,139,0.3))' : 'none'}
                          transition="opacity 0.2s, filter 0.2s"
                        />
                        {/* X-axis label */}
                        <text
                          x={xBase + barWidth + 2}
                          y={348}
                          fontSize="11"
                          fill="var(--text-muted)"
                          fontFamily="DM Sans"
                          textAnchor="middle"
                          dominantBaseline="hanging"
                        >
                          {data.day}
                        </text>
                        {/* Tooltip */}
                        {isHovered && (
                          <g>
                            <rect
                              x={xBase - 10}
                              y={330 - Math.max(aHeight, oHeight) - 65}
                              width={barWidth * 2 + 24}
                              height={55}
                              rx={6}
                              fill="var(--bg-surface)"
                              stroke="var(--border-subtle)"
                              filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))"
                            />
                            <text
                              x={xBase + barWidth + 2}
                              y={330 - Math.max(aHeight, oHeight) - 48}
                              fontSize="12"
                              fill="var(--text-primary)"
                              fontFamily="DM Sans"
                              fontWeight="600"
                              textAnchor="middle"
                            >
                              {data.day}
                            </text>
                            <text
                              x={xBase + barWidth + 2}
                              y={330 - Math.max(aHeight, oHeight) - 30}
                              fontSize="11"
                              fill="#10B981"
                              fontFamily="DM Sans"
                              fontWeight="500"
                              textAnchor="middle"
                            >
                              Aprovechables: {data.aprovechables} Ton
                            </text>
                            <text
                              x={xBase + barWidth + 2}
                              y={330 - Math.max(aHeight, oHeight) - 16}
                              fontSize="11"
                              fill="#64748B"
                              fontFamily="DM Sans"
                              fontWeight="500"
                              textAnchor="middle"
                            >
                              Ordinarios: {data.ordinarios} Ton
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </g>
              </svg>
            </div>
          </div>

          {/* Donut Chart - Right (5 cols) */}
          <div ref={donutRef} className="lg:col-span-5 donut-card card card-padded">
            <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-6">Clasificación Resolución 2184</h2>
            <div className="flex flex-col lg:flex-row items-center gap-6">
              <div className="chart-container relative w-full max-w-xs mx-auto lg:mx-0">
                <svg className="w-full h-auto" viewBox="0 0 200 200" role="img" aria-label="Gráfico de dona mostrando clasificación de residuos: 54% Aprovechables, 28% Orgánicos, 18% No Aprovechables">
                  <defs>
                    {donutSegments.map((seg, i) => (
                      <linearGradient key={i} id={`donut-gradient-${i}`} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={seg.color} stopOpacity="0.95" />
                        <stop offset="100%" stopColor={seg.darkColor} stopOpacity="0.95" />
                      </linearGradient>
                    ))}
                  </defs>
                  <circle cx="100" cy="100" r="80" fill="var(--bg-elevated)" />
                  {donutSegments.map((seg, i) => (
                    <path
                      key={i}
                      d={getDonutPath(seg.start, seg.end, 80, 50)}
                      fill={`url(#donut-gradient-${i})`}
                      stroke="var(--bg-canvas)"
                      strokeWidth={2}
                      onMouseEnter={() => setHoveredDonutSegment(i)}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                      style={{ cursor: 'pointer', transition: 'filter 0.2s' }}
                      filter={hoveredDonutSegment === i ? 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' : 'none'}
                    />
                  ))}
                  <circle cx="100" cy="100" r="50" fill="var(--bg-surface)" />
                  <text x="100" y="96" fontSize="28" fontWeight="700" fill="var(--text-primary)" fontFamily="Fraunces" textAnchor="middle" dominantBaseline="middle">
                    100%
                  </text>
                  <text x="100" y="118" fontSize="11" fill="var(--text-muted)" fontFamily="DM Sans" textAnchor="middle" dominantBaseline="middle">
                    Total clasificado
                  </text>
                  {hoveredDonutSegment !== null && (
                    <g>
                      <rect x="30" y="30" width="140" height="50" rx={8} fill="var(--bg-surface)" stroke="var(--border-subtle)" filter="drop-shadow(0 4px 12px rgba(0,0,0,0.15))" />
                      <text x="100" y="56" fontSize="13" fontWeight="600" fill="var(--text-primary)" fontFamily="DM Sans" textAnchor="middle" dominantBaseline="middle">
                        {donutSegments[hoveredDonutSegment].label}
                      </text>
                      <text x="100" y="72" fontSize="18" fontWeight="700" fill={donutSegments[hoveredDonutSegment].color} fontFamily="Fraunces" textAnchor="middle" dominantBaseline="middle">
                        {donutSegments[hoveredDonutSegment].value}%
                      </text>
                    </g>
                  )}
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <ul className="space-y-3" role="list" aria-label="Leyenda de clasificación">
                  {donutSegments.map((seg, i) => (
                    <li key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--bg-elevated)] transition-colors">
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{
                          background: `linear-gradient(135deg, ${seg.color}, ${seg.darkColor})`,
                          border: `1px solid ${seg.border}`
                        }}
                        aria-hidden="true"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">{seg.label}</p>
                        <p className="text-xs text-[var(--text-muted)]">{seg.value}% del total</p>
                      </div>
                      <span className="font-display font-semibold text-[var(--text-primary)] text-sm">{seg.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Zone Performance Table */}
        <section ref={tableRef} className="zone-table-card card card-padded" aria-label="Rendimiento por zona y circuito">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)]">Rendimiento por Zona y Circuito</h2>
              <p className="text-[var(--text-secondary)] text-sm mt-1">Toneladas recolectadas, EcoPuntos activos y cumplimiento por sector</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-[var(--text-muted)]">
              <MapPin className="w-4 h-4" aria-hidden="true" />
              <span>Girardot, Cundinamarca</span>
            </div>
          </div>
          <div className="overflow-x-auto -mx-6 px-6 pb-4" style={{ scrollbarWidth: 'thin' }}>
            <table className="w-full min-w-[600px]" role="table">
              <thead>
                <tr className="border-b border-[var(--border-subtle)]">
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)] whitespace-nowrap">Sector</th>
                  <th className="text-right py-3 px-4 font-semibold text-[var(--text-primary)] whitespace-nowrap">Toneladas</th>
                  <th className="text-center py-3 px-4 font-semibold text-[var(--text-primary)] whitespace-nowrap hidden md:table-cell">EcoPuntos</th>
                  <th className="text-left py-3 px-4 font-semibold text-[var(--text-primary)] whitespace-nowrap">Cumplimiento</th>
                </tr>
              </thead>
              <tbody>
                {zoneData.map((zone, i) => (
                  <tr key={zone.sector} className="zone-table-row border-b border-[var(--border-subtle)]/50 last:border-0 hover:bg-[var(--bg-elevated)]/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-[var(--accent)]" aria-hidden="true" />
                        <span className="font-medium text-[var(--text-primary)]">{zone.sector}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono tabular-nums text-[var(--text-primary)]">
                      {zone.toneladas.toLocaleString()} Ton
                    </td>
                    <td className="py-4 px-4 text-center hidden md:table-cell">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 text-[var(--accent)] text-sm font-medium rounded-full border border-[var(--accent)]/20">
                        <Award className="w-3.5 h-3.5" aria-hidden="true" />
                        {zone.ecoPuntos}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-[var(--text-secondary)]">Cumplimiento</span>
                          <span className="font-semibold text-[var(--text-primary)]">{zone.cumplimiento}%</span>
                        </div>
                        <div className="h-2 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-1000 ease-[var(--ease-out)]"
                            style={{
                              width: `${zone.cumplimiento}%`,
                              background: zone.cumplimiento >= 95 ? 'var(--accent)' : zone.cumplimiento >= 90 ? 'var(--accent-sky)' : 'var(--accent-amber)'
                            }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}