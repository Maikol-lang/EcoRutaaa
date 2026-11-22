import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Users, Truck, MapPin, Award, BarChart3, Settings, TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const mockStats = {
  totalUsers: 2847,
  activeRoutes: 5,
  cleanPoints: 6,
  totalPoints: 1245890,
  monthlyCollections: 156,
  avgResponseTime: '12 min',
};

const mockAlerts = [
  { id: 1, type: 'truck', message: 'Camión ECO-003 reporta falla mecánica', time: 'Hace 15 min', severity: 'high' },
  { id: 2, type: 'container', message: 'Contenedor verde lleno en Parque Alfonso López', time: 'Hace 1 hora', severity: 'high' },
  { id: 3, type: 'schedule', message: 'Ruta Norte: retraso de 30 min por tráfico', time: 'Hace 2 horas', severity: 'medium' },
  { id: 4, type: 'user', message: 'Reporte ciudadano: vertedero ilegal sector El Carmelo', time: 'Hace 3 horas', severity: 'high' },
];

const mockRecentActivity = [
  { id: 1, user: 'María González', action: 'Depositó 2.5kg plástico', points: 125, location: 'Punto Limpio Plaza Mayor', time: 'Hace 5 min' },
  { id: 2, user: 'Carlos Ruiz', action: 'Completó ruta Centro Histórico', points: 50, location: 'Camión ECO-001', time: 'Hace 12 min' },
  { id: 3, user: 'Ana Torres', action: 'Canjeó descuento 15%', points: -300, location: 'Cafetería El Parque', time: 'Hace 28 min' },
  { id: 4, user: 'Luis Herrera', action: 'Reportó contenedor lleno', points: 25, location: 'Parque Alfonso López', time: 'Hace 45 min' },
];

export default function AdminPanel() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const containerRef = useRef(null);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-ivory">
        <div className="surface-panel p-12 text-center max-w-md rounded-2xl">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-display font-bold text-2xl text-charcoal-900 mb-3">Acceso Restringido</h2>
          <p className="text-stone-600 mb-6">Solo administradores pueden acceder a este panel.</p>
        </div>
      </div>
    );
  }

  const getCategoryStyles = (color) => {
    const styles = {
      forest: { bg: 'bg-sage-50', border: 'border-sage-100', text: 'text-forest-700', iconBg: 'bg-sage-100', iconColor: 'text-forest-600', badgeBg: 'bg-sage-100', badgeText: 'text-forest-800', badgeBorder: 'border-sage-200' },
      stone: { bg: 'bg-stone-100', border: 'border-stone-200', text: 'text-stone-700', iconBg: 'bg-stone-200', iconColor: 'text-stone-600', badgeBg: 'bg-stone-100', badgeText: 'text-stone-800', badgeBorder: 'border-stone-200' },
      amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', badgeBg: 'bg-amber-50', badgeText: 'text-amber-800', badgeBorder: 'border-amber-200' },
      sky: { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', badgeBg: 'bg-sky-50', badgeText: 'text-sky-800', badgeBorder: 'border-sky-100' },
      rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', badgeBg: 'bg-rose-50', badgeText: 'text-rose-800', badgeBorder: 'border-rose-200' },
    };
    return styles[color] || styles.forest;
  };

  const getSeverityStyles = (severity) => {
    const styles = {
      high: { color: 'rose', label: 'Crítica' },
      medium: { color: 'amber', label: 'Media' },
      low: { color: 'forest', label: 'Baja' },
    };
    return styles[severity] || styles.low;
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      const statCards = containerRef.current?.querySelectorAll('.stat-card');
      const tabPanels = containerRef.current?.querySelectorAll('.tab-panel:not(.hidden)');

      if (statCards?.length) {
        gsap.fromTo(statCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
        );
      }
      if (tabPanels?.length) {
        gsap.fromTo(tabPanels,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', delay: 0.2 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: BarChart3, color: 'stone' },
    { id: 'routes', label: 'Rutas', icon: Truck, color: 'sky' },
    { id: 'cleanpoints', label: 'Puntos Limpios', icon: MapPin, color: 'forest' },
    { id: 'users', label: 'Usuarios', icon: Users, color: 'amber' },
    { id: 'rewards', label: 'Recompensas', icon: Award, color: 'amber' },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle, color: 'rose' },
    { id: 'settings', label: 'Configuración', icon: Settings, color: 'sky' },
  ];

  return (
    <div className="min-h-screen pb-16 bg-ivory" ref={containerRef}>
      {/* Header - Control Room */}
      <section className="relative overflow-hidden bg-charcoal-900">
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-forest-600/10 blur-3xl" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <p className="text-sage-400 text-sm font-medium uppercase tracking-wider mb-2">Panel de Control</p>
                <h1 className="font-display font-bold text-display-md lg:text-display-lg text-white">
                  Administración EcoRuta
                </h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-stone-400">
                <Activity className="w-4 h-4 text-forest-500 animate-pulse" aria-hidden="true" />
                <span>Sistema operativo</span>
                <span className="w-2 h-2 bg-forest-500 rounded-full animate-pulse-slow" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            {[
              { label: 'Usuarios Activos', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'amber' },
              { label: 'Rutas Activas', value: mockStats.activeRoutes, icon: Truck, color: 'sky' },
              { label: 'Puntos Limpios', value: mockStats.cleanPoints, icon: MapPin, color: 'forest' },
              { label: 'Puntos Totales', value: mockStats.totalPoints.toLocaleString(), icon: Award, color: 'amber' },
              { label: 'Recolecciones/mes', value: mockStats.monthlyCollections, icon: TrendingUp, color: 'forest' },
              { label: 'Tiempo Respuesta', value: mockStats.avgResponseTime, icon: Activity, color: 'sky' },
            ].map((stat, i) => {
              const styles = getCategoryStyles(stat.color);
              return (
                <div key={i} className={`stat-card card-interactive card-padded ${styles.border}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-stone-600 text-sm mb-1">{stat.label}</p>
                      <p className="font-mono font-bold text-2xl lg:text-3xl text-charcoal-900">{stat.value}</p>
                    </div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${styles.iconBg}`}>
                      <stat.icon className="w-6 h-6 ${styles.iconColor}" aria-hidden="true" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="surface-panel rounded-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-stone-200 overflow-x-auto">
              <nav className="flex gap-1 p-1 min-w-max" role="tablist" aria-label="Secciones del panel admin">
                {tabs.map((tab) => {
                  const styles = getCategoryStyles(tab.color);
                  return (
                    <button
                      key={tab.id}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`panel-${tab.id}`}
                      id={`tab-${tab.id}`}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] whitespace-nowrap ${
                        activeTab === tab.id
                          ? `${styles.bg} ${styles.border} ${styles.text} shadow-sm`
                          : `${styles.bg} ${styles.border} text-stone-600 hover:text-charcoal-900 hover:bg-white`
                      }`}
                    >
                      <tab.icon className="w-4 h-4" aria-hidden="true" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Panels */}
            <div className="p-6 lg:p-8">
              {/* Overview */}
              <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className={`tab-panel ${activeTab === 'overview' ? '' : 'hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Recent Alerts */}
                  <div className="card-interactive card-padded">
                    <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-rose-600" aria-hidden="true" />
                      Alertas Recientes
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockAlerts.map((alert) => {
                        const severityStyles = getSeverityStyles(alert.severity);
                        const styles = getCategoryStyles(severityStyles.color);
                        return (
                          <div key={alert.id} className={`p-3 rounded-lg ${styles.bg} ${styles.border}`}>
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${styles.iconColor.replace('text-', 'bg-')}`} aria-hidden="true" />
                                <p className="text-sm text-charcoal-900 flex-1">{alert.message}</p>
                              </div>
                              <span className="text-xs text-stone-500 whitespace-nowrap">{alert.time}</span>
                            </div>
                            <span className={`badge text-xs mt-1 ${styles.badgeBg} ${styles.badgeBorder} ${styles.badgeText}`}>
                              {severityStyles.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card-interactive card-padded">
                    <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-forest-600" aria-hidden="true" />
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockRecentActivity.map((act) => (
                        <div key={act.id} className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-charcoal-900 text-sm">{act.user}</p>
                            <span className={`text-xs font-semibold ${act.points > 0 ? 'text-amber-700' : 'text-rose-600'}`}>
                              {act.points > 0 ? '+' : ''}{act.points} pts
                            </span>
                          </div>
                          <p className="text-xs text-stone-600">{act.action} · {act.location}</p>
                          <p className="text-xs text-stone-400 mt-1">{act.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card-interactive card-padded">
                  <h3 className="font-semibold text-charcoal-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-forest-600" aria-hidden="true" />
                    Acciones Rápidas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Nueva Ruta', desc: 'Crear ruta de recolección', icon: Truck, color: 'sky' },
                      { label: 'Punto Limpio', desc: 'Registrar nuevo punto', icon: MapPin, color: 'forest' },
                      { label: 'Recompensa', desc: 'Añadir al catálogo', icon: Award, color: 'amber' },
                      { label: 'Notificación', desc: 'Enviar alerta masiva', icon: Activity, color: 'rose' },
                    ].map((action, i) => {
                      const styles = getCategoryStyles(action.color);
                      return (
                        <button key={i} className={`card-padded text-left hover:border-amber-200 transition-colors group ${styles.border}`}>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${styles.iconBg} group-hover:scale-110 transition-transform`}>
                            <action.icon className="w-6 h-6 ${styles.iconColor}" aria-hidden="true" />
                          </div>
                          <p className="font-medium text-charcoal-900">{action.label}</p>
                          <p className="text-xs text-stone-600 mt-1">{action.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Other tabs - placeholder content */}
              {['routes', 'cleanpoints', 'users', 'rewards', 'alerts', 'settings'].map((tabId) => {
                const tabInfo = tabs.find(t => t.id === tabId);
                const styles = getCategoryStyles(tabInfo?.color || 'stone');
                return (
                  <div key={tabId} role="tabpanel" id={`panel-${tabId}`} aria-labelledby={`tab-${tabId}`} className={`tab-panel ${activeTab === tabId ? '' : 'hidden'}`}>
                    <div className="card-padded text-center py-16">
                      <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-4 ${styles.iconBg}`}>
                        <tabInfo.icon className={`w-8 h-8 ${styles.iconColor}`} aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-semibold text-xl text-charcoal-900 mb-2">
                        {tabInfo?.label}
                      </h3>
                      <p className="text-stone-600">Sección en desarrollo. Próximamente: gestión completa de {tabInfo?.label.toLowerCase()}.</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Need to import getCategoryStyles for the components
const getCategoryStyles = (color) => {
  const styles = {
    forest: { bg: 'bg-sage-50', border: 'border-sage-100', text: 'text-forest-700', iconBg: 'bg-sage-100', iconColor: 'text-forest-600', badgeBg: 'bg-sage-100', badgeText: 'text-forest-800', badgeBorder: 'border-sage-200' },
    stone: { bg: 'bg-stone-100', border: 'border-stone-200', text: 'text-stone-700', iconBg: 'bg-stone-200', iconColor: 'text-stone-600', badgeBg: 'bg-stone-100', badgeText: 'text-stone-800', badgeBorder: 'border-stone-200' },
    amber: { bg: 'bg-amber-50', border: 'border-amber-100', text: 'text-amber-700', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', badgeBg: 'bg-amber-50', badgeText: 'text-amber-800', badgeBorder: 'border-amber-200' },
    sky: { bg: 'bg-sky-50', border: 'border-sky-100', text: 'text-sky-700', iconBg: 'bg-sky-100', iconColor: 'text-sky-600', badgeBg: 'bg-sky-50', badgeText: 'text-sky-800', badgeBorder: 'border-sky-100' },
    rose: { bg: 'bg-rose-50', border: 'border-rose-100', text: 'text-rose-700', iconBg: 'bg-rose-100', iconColor: 'text-rose-600', badgeBg: 'bg-rose-50', badgeText: 'text-rose-800', badgeBorder: 'border-rose-200' },
  };
  return styles[color] || styles.forest;
};