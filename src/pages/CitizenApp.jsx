import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import { MapPin, Clock, Truck, AlertCircle, CheckCircle, Calendar, Bell, Map, Route, RefreshCw, Loader2, Leaf, Recycle, Award, Users, Target, Plus, X, Trash2, Droplet, Battery, Cpu, Building, Send, MessageSquare, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collectionRoutes, gironotCollectionSchedule } from '../data/routes';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const today = new Date().toLocaleDateString('es-CO', { weekday: 'long' });
const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('es-CO', { weekday: 'long' });

const NEIGHBORHOODS = [
  'Centro Histórico', 'Kennedy', 'El Peñón', 'La Esperanza', 'Alfonso López',
  'San Antonio', 'El Prado', 'La Gaitana', 'Camellón del Comercio', 'Alto de la Cruz'
];

const NEIGHBORHOOD_DATA = {
  'Centro Histórico': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:00–10:00', truck: 'ECO-001', eta: '~12 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~35 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~45 min' } },
  'Kennedy': { white: { schedule: 'Martes, Jueves · 14:00–18:00', truck: 'ECO-002', eta: '~25 min' }, green: { schedule: 'Lunes, Miércoles, Viernes · 06:00–10:00', truck: 'ECO-004', eta: '~40 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~50 min' } },
  'El Peñón': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:30–10:30', truck: 'ECO-003', eta: '~18 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~30 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~55 min' } },
  'La Esperanza': { white: { schedule: 'Lunes, Miércoles, Viernes · 13:00–17:00', truck: 'ECO-005', eta: '~22 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~28 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~48 min' } },
  'Alfonso López': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:00–10:00', truck: 'ECO-001', eta: '~15 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~32 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~42 min' } },
  'San Antonio': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:00–10:00', truck: 'ECO-001', eta: '~10 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~25 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~40 min' } },
  'El Prado': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:30–10:30', truck: 'ECO-003', eta: '~20 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~35 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~52 min' } },
  'La Gaitana': { white: { schedule: 'Lunes, Miércoles, Viernes · 06:30–10:30', truck: 'ECO-003', eta: '~28 min' }, green: { schedule: 'Martes, Jueves, Sábado · 06:00–10:00', truck: 'ECO-005', eta: '~38 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~60 min' } },
  'Camellón del Comercio': { white: { schedule: 'Martes, Jueves · 08:00–12:00', truck: 'ECO-006', eta: '~15 min' }, green: { schedule: 'Lunes, Miércoles, Viernes · 13:00–17:00', truck: 'ECO-005', eta: '~30 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~35 min' } },
  'Alto de la Cruz': { white: { schedule: 'Martes, Jueves, Sábado · 07:00–11:00', truck: 'ECO-004', eta: '~22 min' }, green: { schedule: 'Lunes, Miércoles, Viernes · 13:00–17:00', truck: 'ECO-005', eta: '~28 min' }, black: { schedule: 'Diario · 22:00–02:00', truck: 'ECO-007', eta: '~45 min' } },
};

const REPORT_CATEGORIES = [
  { id: 'critical', label: 'Punto crítico de residuos', icon: AlertCircle, color: 'var(--accent-coral)' },
  { id: 'special', label: 'Recolección especial/escombros', icon: Trash2, color: 'var(--accent-amber)' },
  { id: 'full', label: 'Contenedor lleno', icon: AlertTriangle, color: 'var(--accent-sky)' },
  { id: 'oil', label: 'Aceite usado/RAEE', icon: Droplet, color: 'var(--accent-lime)' },
];

const COMMUNITY_REPORTS = [
  { id: 1, barrio: 'Kennedy', category: 'Punto crítico de residuos', address: 'Calle 18 con Carrera 15', status: 'En atención', time: 'Hace 15 min', icon: AlertCircle, color: 'var(--accent-coral)' },
  { id: 2, barrio: 'El Peñón', category: 'Contenedor lleno', address: 'Av. El Diamante entrada', status: 'Verificado', time: 'Hace 42 min', icon: AlertTriangle, color: 'var(--accent-sky)' },
  { id: 3, barrio: 'Centro Histórico', category: 'Aceite usado/RAEE', address: 'Carrera 8 con Calle 10', status: 'Atendido', time: 'Hace 2 horas', icon: Droplet, color: 'var(--accent-lime)' },
];

const mockNextPickups = [
  { type: 'white', label: 'Aprovechables (Blanco)', time: 'Hoy 6:00 AM', status: 'upcoming', route: 'Ruta Centro Histórico', truck: 'ECO-001' },
  { type: 'green', label: 'Orgánicos (Verde)', time: 'Mañana 6:00 AM', status: 'scheduled', route: 'Ruta Sur - Orgánicos', truck: 'ECO-005' },
  { type: 'black', label: 'No Aprovechables (Negro)', time: 'Hoy 10:00 PM', status: 'upcoming', route: 'Ruta Nocturna', truck: 'ECO-007' },
];

const mockNotifications = [
  { id: 1, type: 'route', title: 'Camión en tu zona', message: 'El camión ECO-001 está a 5 min de tu parada', time: 'Hace 10 min', read: false, icon: Truck, color: 'sky' },
  { id: 2, type: 'schedule', title: 'Cambio de horario', message: 'Ruta Centro: recolección adelantada a 5:30 AM mañana', time: 'Hace 2 horas', read: false, icon: Clock, color: 'forest' },
  { id: 3, type: 'achievement', title: '¡Logro desbloqueado!', message: 'Completaste 7 días consecutivos separando residuos', time: 'Ayer', read: true, icon: CheckCircle, color: 'sage' },
  { id: 4, type: 'alert', title: 'Punto Limpio Móvil', message: 'Plaza Mayor miércoles 8:00-14:00 - Aceite y pilas', time: 'Ayer', read: true, icon: MapPin, color: 'amber' },
];

const getTypeStyles = (type) => {
  const styles = {
    white: { bg: 'bg-[var(--accent)]/5', border: 'border-[var(--accent)]/10', text: 'text-[var(--accent)]', iconBg: 'bg-[var(--accent)]/10', accent: 'var(--accent)' },
    green: { bg: 'bg-[var(--accent-lime)]/5', border: 'border-[var(--accent-lime)]/10', text: 'text-[var(--accent-lime)]', iconBg: 'bg-[var(--accent-lime)]/10', accent: 'var(--accent-lime)' },
    black: { bg: 'bg-[var(--text-muted)]/5', border: 'border-[var(--text-muted)]/10', text: 'text-[var(--text-muted)]', iconBg: 'bg-[var(--text-muted)]/10', accent: 'var(--text-muted)' },
  };
  return styles[type] || styles.white;
};

const getTypeIcon = (type) => {
  const icons = { white: Recycle, green: Leaf, black: Truck };
  return icons[type] || Recycle;
};

const getNotificationColor = (color) => {
  const colors = {
    sky: { bg: 'bg-[var(--accent-sky)]/5', border: 'border-[var(--accent-sky)]/10', icon: 'text-[var(--accent-sky)]', iconBg: 'bg-[var(--accent-sky)]/10' },
    forest: { bg: 'bg-[var(--accent)]/5', border: 'border-[var(--accent)]/10', icon: 'text-[var(--accent)]', iconBg: 'bg-[var(--accent)]/10' },
    sage: { bg: 'bg-[var(--accent-lime)]/5', border: 'border-[var(--accent-lime)]/10', icon: 'text-[var(--accent-lime)]', iconBg: 'bg-[var(--accent-lime)]/10' },
    amber: { bg: 'bg-[var(--accent-amber)]/5', border: 'border-[var(--accent-amber)]/10', icon: 'text-[var(--accent-amber)]', iconBg: 'bg-[var(--accent-amber)]/10' },
  };
  return colors[color] || colors.sky;
};

function ReportModal({ isOpen, onClose, selectedBarrio, onSubmit }) {
  const [category, setCategory] = useState('');
  const [address, setAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    return () => document.body.style.overflow = '';
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category || !address.trim()) return;
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    onSubmit({ category, address: address.trim(), barrio: selectedBarrio });
    setCategory(''); setAddress(''); setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(9, 10, 15, 0.85)' }} onClick={onClose}>
      <div className="surface-panel rounded-2xl p-6 lg:p-8 max-w-lg w-full animate-in" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-display font-semibold text-xl text-[var(--text-primary)]">Reportar novedad</h3>
          <button onClick={onClose} className="btn-ghost p-1"><X className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Categoría</label>
            <select value={category} onChange={e => setCategory(e.target.value)} className="input-field py-3.5" required>
              <option value="">Selecciona una categoría</option>
              {REPORT_CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Barrio (auto)</label>
            <input type="text" value={selectedBarrio} readOnly className="input-field py-3.5 bg-[var(--bg-elevated)] text-[var(--text-secondary)]" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-[var(--text-primary)]">Dirección / Referencia breve</label>
            <input type="text" value={address} onChange={e => setAddress(e.target.value)} placeholder="Ej: Calle 18 con Carrera 15, frente al parque" className="input-field py-3.5" required />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary flex-1" disabled={isSubmitting}>Cancelar</button>
            <button type="submit" className="btn-primary flex-1" disabled={isSubmitting || !category || !address.trim()}>
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Enviando...</> : <><Plus className="w-4 h-4 mr-2" />Enviar reporte (+50 pts)</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CitizenApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pickups');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBarrio, setSelectedBarrio] = useState(() => {
    if (typeof window !== 'undefined') return localStorage.getItem('ecoruta_barrio') || 'Centro Histórico';
    return 'Centro Histórico';
  });
  const [showReportModal, setShowReportModal] = useState(false);
  const [communityReports, setCommunityReports] = useState(COMMUNITY_REPORTS);
  const [userPoints, setUserPoints] = useState(() => {
    if (typeof window !== 'undefined') return parseInt(localStorage.getItem('ecoruta_points') || '1250', 10);
    return 1250;
  });
  const containerRef = useRef(null);
  const tabBtnsRef = useRef(null);
  const contentCardsRef = useRef(null);
  const pickupCardsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('ecoruta_barrio', selectedBarrio);
  }, [selectedBarrio]);

  const handleReportSubmit = (report) => {
    const newReport = {
      id: Date.now(),
      barrio: report.barrio,
      category: REPORT_CATEGORIES.find(c => c.id === report.category)?.label || report.category,
      address: report.address,
      status: 'En atención',
      time: 'Ahora',
      icon: REPORT_CATEGORIES.find(c => c.id === report.category)?.icon || AlertCircle,
      color: REPORT_CATEGORIES.find(c => c.id === report.category)?.color || 'var(--accent-coral)',
    };
    setCommunityReports(prev => [newReport, ...prev.slice(0, 2)]);
    setUserPoints(prev => {
      const next = prev + 50;
      localStorage.setItem('ecoruta_points', next.toString());
      return next;
    });
    toast.success('¡Reporte verificado! +50 EcoPuntos sumados', { description: `Tu reporte en ${report.barrio} ya está en el feed comunitario` });
  };

  useGSAP((ctx) => {
    const safeQueryAll = (selector, scope = containerRef.current) => scope?.querySelectorAll(selector);

    const tabBtns = safeQueryAll('.tab-btn', tabBtnsRef.current);
    const contentCards = safeQueryAll('.content-card', contentCardsRef.current);
    const pickupCards = safeQueryAll('.pickup-card', pickupCardsRef.current);

    if (tabBtns?.length) {
      gsap.fromTo(tabBtns,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.06 }
      );
    }
    if (contentCards?.length) {
      gsap.fromTo(contentCards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.08 }
      );
    }
    if (pickupCards?.length) {
      gsap.fromTo(pickupCards,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.08 }
      );
    }
  }, { scope: containerRef, dependencies: [activeTab, selectedBarrio] });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success('Información actualizada', { description: 'Rutas y horarios sincronizados' });
  };

  const barrioData = NEIGHBORHOOD_DATA[selectedBarrio] || NEIGHBORHOOD_DATA['Centro Histórico'];
  const nextPickups = [
    { type: 'white', label: 'Aprovechables (Blanco)', time: 'Hoy', status: 'upcoming', route: barrioData.white.schedule, truck: barrioData.white.truck, eta: barrioData.white.eta },
    { type: 'green', label: 'Orgánicos (Verde)', time: 'Próximo', status: 'scheduled', route: barrioData.green.schedule, truck: barrioData.green.truck, eta: barrioData.green.eta },
    { type: 'black', label: 'No Aprovechables (Negro)', time: 'Hoy', status: 'upcoming', route: barrioData.black.schedule, truck: barrioData.black.truck, eta: barrioData.black.eta },
  ];

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header Section - SaaS Command Center */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#0B132B] to-[#090A0F] text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[var(--accent-lime)]/5 blur-3xl" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Neighborhood Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white/80">Mi barrio / sector</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" aria-hidden="true" />
                <select
                  value={selectedBarrio}
                  onChange={e => setSelectedBarrio(e.target.value)}
                  className="input-field pl-12 pr-10 py-3.5 appearance-none bg-white/10 border-white/20 text-white placeholder-white/60 focus:border-[var(--accent-lime)] focus:ring-[var(--accent-lime)]/20"
                >
                  {NEIGHBORHOODS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <p className="text-[var(--accent-lime)] text-sm font-medium uppercase tracking-wider">Panel Ciudadano</p>
                <h1 className="font-display font-bold text-display-md lg:text-display-lg text-white mt-1">
                  Hola, {user?.name || 'Vecino'} 👋
                </h1>
                <p className="text-white/60 mt-2">Tu barrio: <span className="text-[var(--accent-lime)] font-semibold">{selectedBarrio}</span></p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleRefresh} disabled={isLoading} className="btn-secondary flex items-center gap-2 border-white/20 text-white hover:bg-white/10">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Actualizar
                </button>
                <NavLink to="/map" className="btn-ghost flex items-center gap-2 text-white hover:bg-white/10">
                  <Map className="w-4 h-4" aria-hidden="true" />
                  Ver Mapa
                </NavLink>
              </div>
            </div>

            {/* Quick Stats - Monospace for metrics */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card-interactive card-padded bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                    <Route className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-2xl lg:text-3xl text-[var(--accent-lime)] tabular-nums">3</p>
                    <p className="text-xs text-white/50">Rutas activas hoy</p>
                  </div>
                </div>
              </div>
              <div className="card-interactive card-padded bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                    <Award className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-2xl lg:text-3xl text-[var(--accent)] tabular-nums">{userPoints.toLocaleString()}</p>
                    <p className="text-xs text-white/50">EcoPuntos totales</p>
                  </div>
                </div>
              </div>
              <div className="card-interactive card-padded bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-lg bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20 flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[var(--accent-sky)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-2xl lg:text-3xl text-[var(--accent-sky)] tabular-nums">8</p>
                    <p className="text-xs text-white/50">Visitas este mes</p>
                  </div>
                </div>
              </div>
              <div className="card-interactive card-padded bg-white/5 border-white/10 backdrop-blur-sm">
                <div className="flex items-center gap-3 flex-col sm:flex-row sm:items-center">
                  <div className="w-11 h-11 rounded-lg bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20 flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="font-display font-bold text-lg sm:text-2xl lg:text-3xl text-[var(--accent-amber)] leading-tight">{user?.level || 'Eco Guardián'}</p>
                    <p className="text-xs text-white/50">Nivel actual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Truck ETA Pills */}
      <div className="section-container px-0 relative z-10 -mt-6 lg:-mt-8 mb-6">
        <div className="grid grid-cols-3 gap-3 md:grid-cols-3 mx-auto max-w-5xl">
          {nextPickups.map((pickup, i) => {
            const styles = getTypeStyles(pickup.type);
            const Icon = getTypeIcon(pickup.type);
            return (
              <div key={i} className={`card-interactive card-padded ${styles.bg} ${styles.border} flex flex-col items-center text-center gap-2`}>
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.iconBg} border border-current/20`}>
                    <Icon className="w-4 h-4" style={{ color: styles.accent }} aria-hidden="true" />
                  </div>
                  <span className="font-medium text-sm text-[var(--text-primary)]">{pickup.label}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <Truck className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{pickup.truck}</span>
                </div>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/5 px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>Llega en {pickup.eta}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs - Clean, functional */}
      <div className="section-container px-0 relative z-10 -mt-6 lg:-mt-8">
        <div ref={containerRef} className="grid grid-cols-3 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-lg p-1.5 w-full max-w-xs md:max-w-none mx-auto mb-8 md:grid-cols-3 md:flex md:items-center md:gap-1.5 md:p-1.5 md:rounded-lg">
          {[
            { id: 'pickups', label: 'Próximas', fullLabel: 'Próximas Recolecciones', icon: Truck },
            { id: 'schedule', label: 'Calendario', fullLabel: 'Calendario Semanal', icon: Calendar },
            { id: 'notifications', label: 'Alertas', fullLabel: 'Notificaciones', icon: Bell, badge: notifications.filter(n => !n.read).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn relative flex flex-col items-center gap-1 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] md:flex-row md:gap-2 ${
                activeTab === tab.id
                  ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50'
              }`}>
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              <span className="hidden md:inline">{tab.fullLabel}</span>
              <span className="md:hidden text-xs leading-tight">{tab.label}</span>
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent-coral)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Pickups Tab */}
          {activeTab === 'pickups' && (
            <div ref={pickupCardsRef} className="space-y-4">
              <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)]">Próximas recolecciones en {selectedBarrio}</h2>
              {nextPickups.map((pickup, i) => {
                const styles = getTypeStyles(pickup.type);
                const Icon = getTypeIcon(pickup.type);
                return (
                  <div key={`pickup-${i}`} className={`pickup-card content-card card-interactive card-padded ${styles.bg} ${styles.border} relative overflow-hidden`}>
                    <div className="absolute top-0 left-0 h-full w-1" style={{ backgroundColor: styles.accent }} />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${styles.iconBg} border border-current/20`}>
                          <Icon className="w-6 h-6" style={{ color: styles.accent }} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-[var(--text-primary)]">{pickup.label}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">{pickup.route} · Camión {pickup.truck}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 sm:ml-auto">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)]">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          {pickup.time}
                        </div>
                        <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] bg-[var(--accent)]/5 px-3 py-1 rounded-full">
                          <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Llega en {pickup.eta}</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)] relative z-10">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{selectedBarrio}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{pickup.type === 'white' || pickup.type === 'black' ? 'Lun, Mié, Vie' : 'Mar, Jue, Sáb'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}

              <NavLink to="/map" className="btn-primary w-full sm:w-auto mx-auto block text-center mt-4">
                Ver todas las rutas en el mapa
                <Map className="w-4 h-4" aria-hidden="true" />
              </NavLink>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)]">Calendario de recolección semanal</h2>
              <div ref={contentCardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['white', 'green', 'black'].map((type) => {
                  const schedule = gironotCollectionSchedule[type];
                  const TypeIcon = getTypeIcon(type);
                  const styles = getTypeStyles(type);
                  return (
                    <div key={type} className={`content-card card-interactive card-padded ${styles.bg} ${styles.border}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${styles.iconBg} border border-current/20`}>
                          <TypeIcon className="w-5 h-5" style={{ color: styles.accent }} aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg text-[var(--text-primary)]">{type === 'white' ? 'Aprovechables' : type === 'green' ? 'Orgánicos' : 'No Aprovechables'}</h3>
                          <p className="text-sm text-[var(--text-secondary)]">Contenedor {type === 'white' ? 'Blanco' : type === 'green' ? 'Verde' : 'Negro'}</p>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.days.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                          <Truck className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.frequency}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-[var(--border-subtle)]">
                        <p className="text-xs text-[var(--text-muted)] mb-2">Barrios cubiertos:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {schedule.neighborhoods.map((n) => (
                            <span key={n} className="px-2.5 py-1 text-xs rounded bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">{n}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications Tab - with Vigía Ciudadano */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Vigía Ciudadano Module */}
              <div className="card-interactive card-padded bg-gradient-to-r from-[var(--accent)]/5 to-[var(--accent-amber)]/5 border-[var(--accent)]/20">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg text-[var(--text-primary)]">Vigía Ciudadano · Reportes en Tiempo Real</h3>
                      <p className="text-sm text-[var(--text-secondary)]">Reporta incidencias y ayuda a mantener limpio tu barrio. +50 EcoPuntos por reporte verificado.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowReportModal(true)}
                    className="btn-primary flex items-center gap-2 whitespace-nowrap group"
                  >
                    <Plus className="w-4 h-4" aria-hidden="true" />
                    Reportar novedad (+50 pts)
                    <Send className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                  </button>
                </div>
                {/* Community Feed */}
                <div className="pt-4 border-t border-[var(--accent)]/20">
                  <h4 className="font-medium text-sm text-[var(--text-secondary)] mb-3">Feed Comunitario de Girardot</h4>
                  <div className="space-y-2">
                    {communityReports.map((report) => (
                      <div key={report.id} className="card-padded flex items-center gap-3 text-sm">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${report.color}/10`, border: `1px solid ${report.color}30` }}>
                          <report.icon className="w-4 h-4" style={{ color: report.color }} aria-hidden="true" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-medium text-[var(--text-primary)]">{report.barrio}</span>
                            <span className="px-2 py-0.5 text-xs rounded bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">{report.category}</span>
                            <span className="px-2 py-0.5 text-xs rounded font-medium" style={{ background: `${report.color}/15`, border: `1px solid ${report.color}30`, color: report.color }}>{report.status}</span>
                          </div>
                          <p className="text-xs text-[var(--text-muted)] truncate mt-0.5">{report.address}</p>
                        </div>
                        <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{report.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Notifications */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)]">Notificaciones</h2>
                  {notifications.some(n => !n.read) && (
                    <button
                      onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                      className="btn-ghost text-sm"
                    >
                      Marcar todo como leído
                    </button>
                  )}
                </div>
                <div ref={contentCardsRef} className="space-y-3 max-h-96 overflow-y-auto">
                  {notifications.map((notif) => {
                    const nStyles = getNotificationColor(notif.color);
                    return (
                      <div
                        key={notif.id}
                        onClick={() => markAsRead(notif.id)}
                        className={`content-card card-padded cursor-pointer transition-all ${!notif.read ? 'bg-[var(--accent)]/5 border-[var(--accent)]/10' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${nStyles.iconBg} border border-current/20`}>
                            <notif.icon className={`w-4.5 h-4.5 ${nStyles.icon}`} aria-hidden="true" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-[var(--text-primary)]">{notif.title}</h4>
                              <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">{notif.time}</span>
                            </div>
                            <p className="text-sm text-[var(--text-secondary)] mt-1">{notif.message}</p>
                            {!notif.read && (
                              <div className="w-2 h-2 bg-[var(--accent)] rounded-full mt-2" aria-hidden="true" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {notifications.length === 0 && (
                    <div className="content-card card-padded text-center">
                      <Bell className="w-10 h-10 text-[var(--text-muted)] mx-auto mb-4" aria-hidden="true" />
                      <p className="text-[var(--text-muted)]">No hay notificaciones nuevas</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Report Modal */}
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        selectedBarrio={selectedBarrio}
        onSubmit={handleReportSubmit}
      />
    </div>
  );
}