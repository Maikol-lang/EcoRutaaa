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
      <div className="min-h-screen flex items-center justify-center bg-eco-bg">
        <div className="card p-12 text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" aria-hidden="true" />
          <h2 className="font-display font-bold text-2xl text-white mb-3">Acceso Restringido</h2>
          <p className="text-eco-green/60 mb-6">Solo administradores pueden acceder a este panel.</p>
        </div>
      </div>
    );
  }

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
    { id: 'overview', label: 'Resumen', icon: BarChart3 },
    { id: 'routes', label: 'Rutas', icon: Truck },
    { id: 'cleanpoints', label: 'Puntos Limpios', icon: MapPin },
    { id: 'users', label: 'Usuarios', icon: Users },
    { id: 'rewards', label: 'Recompensas', icon: Award },
    { id: 'alerts', label: 'Alertas', icon: AlertTriangle },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  return (
    <div className="min-h-screen pb-16" ref={containerRef}>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb-neon w-96 h-96 top-0 right-0 translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="glow-orb-green w-72 h-72 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
              <div>
                <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider mb-2">Panel de Control</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
                  Administración EcoRuta
                </h1>
              </div>
              <div className="flex items-center gap-3 text-sm text-eco-green/60">
                <Activity className="w-4 h-4 text-eco-neon animate-pulse" aria-hidden="true" />
                <span>Sistema operativo</span>
                <span className="w-2 h-2 bg-eco-neon rounded-full animate-pulse-slow" aria-hidden="true" />
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
              { label: 'Usuarios Activos', value: mockStats.totalUsers.toLocaleString(), icon: Users, color: 'eco-neon' },
              { label: 'Rutas Activas', value: mockStats.activeRoutes, icon: Truck, color: 'eco-green' },
              { label: 'Puntos Limpios', value: mockStats.cleanPoints, icon: MapPin, color: 'eco-cyan' },
              { label: 'Puntos Totales', value: mockStats.totalPoints.toLocaleString(), icon: Award, color: 'eco-neon' },
              { label: 'Recolecciones/mes', value: mockStats.monthlyCollections, icon: TrendingUp, color: 'eco-green' },
              { label: 'Tiempo Respuesta', value: mockStats.avgResponseTime, icon: Activity, color: 'eco-cyan' },
            ].map((stat, i) => (
              <div key={i} className="stat-card card p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-eco-green/60 text-sm mb-1">{stat.label}</p>
                    <p className="font-display font-bold text-2xl lg:text-3xl text-white">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ background: `var(--${stat.color})20`, borderColor: `var(--${stat.color})40` }}>
                    <stat.icon className="w-6 h-6" style={{ color: `var(--${stat.color})` }} aria-hidden="true" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="glass-panel rounded-2xl overflow-hidden">
            {/* Tab Navigation */}
            <div className="border-b border-eco-border/30 overflow-x-auto">
              <nav className="flex gap-1 p-1 min-w-max" role="tablist" aria-label="Secciones del panel admin">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'bg-eco-neon/10 text-eco-neon border border-eco-neon/30 shadow-lg shadow-eco-neon/10'
                        : 'text-eco-green/60 hover:text-white hover:bg-eco-green/5'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" aria-hidden="true" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Tab Panels */}
            <div className="p-6 lg:p-8">
              {/* Overview */}
              <div role="tabpanel" id="panel-overview" aria-labelledby="tab-overview" className={`tab-panel ${activeTab === 'overview' ? '' : 'hidden'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  {/* Recent Alerts */}
                  <div className="card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-eco-neon" aria-hidden="true" />
                      Alertas Recientes
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockAlerts.map((alert) => (
                        <div key={alert.id} className={`p-3 rounded-lg ${alert.severity === 'high' ? 'bg-eco-neon/5' : alert.severity === 'medium' ? 'bg-amber-500/5' : 'bg-eco-green/5'}`}>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${alert.severity === 'high' ? 'bg-eco-neon' : alert.severity === 'medium' ? 'bg-amber-500' : 'bg-eco-green'}`} aria-hidden="true" />
                              <p className="text-sm text-white flex-1">{alert.message}</p>
                            </div>
                            <span className="text-xs text-eco-green/50 whitespace-nowrap">{alert.time}</span>
                          </div>
                          <span className={`badge text-xs mt-1 ${alert.severity === 'high' ? 'bg-red-500/20 border-red-500/30 text-red-400' : alert.severity === 'medium' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-eco-green/20 border-eco-green/30 text-eco-green'}`}>
                            {alert.severity === 'high' ? 'Crítica' : alert.severity === 'medium' ? 'Media' : 'Baja'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="card p-5">
                    <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-eco-green" aria-hidden="true" />
                      Actividad Reciente
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {mockRecentActivity.map((act) => (
                        <div key={act.id} className="p-3 rounded-lg bg-eco-surface/50 border border-eco-border/30">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium text-white text-sm">{act.user}</p>
                            <span className={`text-xs font-semibold ${act.points > 0 ? 'text-eco-neon' : 'text-red-400'}`}>
                              {act.points > 0 ? '+' : ''}{act.points} pts
                            </span>
                          </div>
                          <p className="text-xs text-eco-green/60">{act.action} · {act.location}</p>
                          <p className="text-xs text-eco-green/40 mt-1">{act.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card p-5">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-eco-neon" aria-hidden="true" />
                    Acciones Rápidas
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { label: 'Nueva Ruta', desc: 'Crear ruta de recolección', icon: Truck },
                      { label: 'Punto Limpio', desc: 'Registrar nuevo punto', icon: MapPin },
                      { label: 'Recompensa', desc: 'Añadir al catálogo', icon: Award },
                      { label: 'Notificación', desc: 'Enviar alerta masiva', icon: Activity },
                    ].map((action, i) => (
                      <button key={i} className="card p-4 text-left hover:border-eco-neon/30 transition-colors group">
                        <action.icon className="w-6 h-6 text-eco-neon mb-2 group-hover:scale-110 transition-transform" aria-hidden="true" />
                        <p className="font-medium text-white">{action.label}</p>
                        <p className="text-xs text-eco-green/60 mt-1">{action.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Other tabs - placeholder content */}
              {['routes', 'cleanpoints', 'users', 'rewards', 'alerts', 'settings'].map((tabId) => (
                <div key={tabId} role="tabpanel" id={`panel-${tabId}`} aria-labelledby={`tab-${tabId}`} className={`tab-panel ${activeTab === tabId ? '' : 'hidden'}`}>
                  <div className="card p-12 text-center">
                    <BarChart3 className="w-16 h-16 text-eco-green/30 mx-auto mb-4" aria-hidden="true" />
                    <h3 className="font-display font-semibold text-xl text-white mb-2">
                      {tabs.find(t => t.id === tabId)?.label}
                    </h3>
                    <p className="text-eco-green/60">Sección en desarrollo. Próximamente: gestión completa de {tabs.find(t => t.id === tabId)?.label.toLowerCase()}.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}