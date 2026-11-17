import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import { MapPin, Clock, Truck, AlertCircle, CheckCircle, Calendar, Bell, Map, Route, RefreshCw, Loader2, Leaf, Recycle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { collectionRoutes, gironotCollectionSchedule } from '../data/routes';
import { toast } from 'sonner';

gsap.registerPlugin(ScrollTrigger);

const today = new Date().toLocaleDateString('es-CO', { weekday: 'long' });
const tomorrow = new Date(Date.now() + 86400000).toLocaleDateString('es-CO', { weekday: 'long' });

const mockNextPickups = [
  { type: 'white', label: 'Aprovechables (Blanco)', time: 'Hoy 6:00 AM', status: 'upcoming', route: 'Ruta Centro Histórico', truck: 'ECO-001' },
  { type: 'green', label: 'Orgánicos (Verde)', time: 'Mañana 6:00 AM', status: 'scheduled', route: 'Ruta Sur - Orgánicos', truck: 'ECO-005' },
  { type: 'black', label: 'No Aprovechables (Negro)', time: 'Hoy 10:00 PM', status: 'upcoming', route: 'Ruta Nocturna', truck: 'ECO-007' },
];

const mockNotifications = [
  { id: 1, type: 'route', title: 'Camión en tu zona', message: 'El camión ECO-001 está a 5 min de tu parada', time: 'Hace 10 min', read: false, icon: Truck, color: 'eco-cyan' },
  { id: 2, type: 'schedule', title: 'Cambio de horario', message: 'Ruta Centro: recolección adelantada a 5:30 AM mañana', time: 'Hace 2 horas', read: false, icon: Clock, color: 'eco-neon' },
  { id: 3, type: 'achievement', title: '¡Logro desbloqueado!', message: 'Completaste 7 días consecutivos separando residuos', time: 'Ayer', read: true, icon: CheckCircle, color: 'eco-green' },
  { id: 4, type: 'alert', title: 'Punto Limpio Móvil', message: 'Plaza Mayor miércoles 8:00-14:00 - Aceite y pilas', time: 'Ayer', read: true, icon: MapPin, color: 'eco-neon' },
];

export default function CitizenApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('pickups');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [isLoading, setIsLoading] = useState(false);
  const tabsRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tabBtns = containerRef.current?.querySelectorAll('.tab-btn');
      const contentCards = containerRef.current?.querySelectorAll('.content-card');
      const pickupCards = containerRef.current?.querySelectorAll('.pickup-card');

      if (tabBtns?.length) {
        gsap.fromTo(tabBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08 }
        );
      }
      if (contentCards?.length) {
        gsap.fromTo(contentCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', stagger: 0.1 }
        );
      }
      if (pickupCards?.length) {
        gsap.fromTo(pickupCards,
          { x: -30, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1 }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleRefresh = async () => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsLoading(false);
    toast.success('Información actualizada', { description: 'Rutas y horarios sincronizados' });
  };

  const getTypeColor = (type) => {
    const colors = {
      white: 'bg-white/10 border-white/20 text-white',
      green: 'bg-eco-green/10 border-eco-green/20 text-eco-green',
      black: 'bg-gray-900/50 border-gray-700/30 text-gray-300',
    };
    return colors[type] || colors.white;
  };

  const getTypeIcon = (type) => {
    const icons = { white: Recycle, green: Leaf, black: Truck };
    return icons[type] || Recycle;
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb-neon w-96 h-96 top-0 right-0 translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="glow-orb-green w-72 h-72 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" aria-hidden="true" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div>
                <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider">Panel Ciudadano</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mt-1">
                  Hola, {user?.name || 'Vecino'} 👋
                </h1>
                <p className="text-eco-green/50 mt-2">Tu próxima recolección: <span className="text-eco-neon font-semibold">{mockNextPickups[0].time}</span></p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button onClick={handleRefresh} disabled={isLoading} className="btn-secondary flex items-center gap-2">
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} aria-hidden="true" />
                  Actualizar
                </button>
                <NavLink to="/map" className="btn-ghost flex items-center gap-2">
                  <Map className="w-4 h-4" aria-hidden="true" />
                  Ver Mapa
                </NavLink>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center">
                    <Route className="w-6 h-6 text-eco-neon" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-2xl text-eco-neon">3</p>
                    <p className="text-xs text-eco-green/60">Rutas activas hoy</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-eco-green/10 border border-eco-green/20 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-eco-green" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-2xl text-eco-green">{user?.points || 1250}</p>
                    <p className="text-xs text-eco-green/60">EcoPuntos totales</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-eco-cyan/10 border border-eco-cyan/20 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-eco-cyan" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-display font-bold text-2xl text-eco-cyan">8</p>
                    <p className="text-xs text-eco-green/60">Visitas este mes</p>
                  </div>
                </div>
              </div>
              <div className="card p-5">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <p className="font-display font-bold text-2xl text-amber-400">{user?.level || 'Eco Guardián'}</p>
                    <p className="text-xs text-eco-green/60">Nivel actual</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div className="section-container px-0 relative z-10 -mt-6 lg:-mt-8">
        <div ref={containerRef} className="flex gap-2 bg-eco-surface/80 backdrop-blur-sm border border-eco-border/50 rounded-xl p-1 w-fit mx-auto mb-8">
          {[
            { id: 'pickups', label: 'Próximas Recolecciones', icon: Truck },
            { id: 'schedule', label: 'Calendario Semanal', icon: Calendar },
            { id: 'notifications', label: 'Notificaciones', icon: Bell, badge: notifications.filter(n => !n.read).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn relative flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-eco-neon text-eco-bg shadow-lg shadow-eco-neon/25'
                  : 'text-eco-green/60 hover:text-white hover:bg-eco-green/5'
              }`}
            >
              <tab.icon className="w-4 h-4" aria-hidden="true" />
              {tab.label}
              {tab.badge && tab.badge > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                  {tab.badge > 9 ? '9+' : tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div ref={containerRef} className="space-y-6">
          {/* Pickups Tab */}
          {activeTab === 'pickups' && (
            <div className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-white">Próximas recolecciones en tu zona</h2>
              {mockNextPickups.map((pickup, i) => (
                <div key={pickup.type} className={`pickup-card card p-5 relative overflow-hidden ${getTypeColor(pickup.type)}`}>
                  <div className="absolute top-0 left-0 h-full w-1 bg-current" />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-current/20 flex items-center justify-center">
                        {(() => { const Icon = getTypeIcon(pickup.type); return <Icon className="w-7 h-7" aria-hidden="true" />; })()}
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{pickup.label}</h3>
                        <p className="text-sm opacity-80">{pickup.route} · Camión {pickup.truck}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 sm:ml-auto">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <Clock className="w-4 h-4" aria-hidden="true" />
                        {pickup.time}
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        pickup.status === 'upcoming' ? 'bg-eco-neon/20 text-eco-neon border border-eco-neon/30' :
                        'bg-eco-green/20 text-eco-green border border-eco-green/30'
                      }`}>
                        {pickup.status === 'upcoming' ? 'Próximo' : 'Programado'}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-current/20 flex flex-wrap items-center gap-4 text-sm opacity-80 relative z-10">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Centro, Alfonso López, San Antonio, El Prado, La Gaitana</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>{pickup.type === 'white' || pickup.type === 'black' ? 'Lun, Mié, Vie' : 'Mar, Jue, Sáb'}</span>
                    </div>
                  </div>
                </div>
              ))}

              <NavLink to="/map" className="btn-primary w-full sm:w-auto mx-auto block text-center mt-4">
                Ver todas las rutas en el mapa
                <Map className="w-4 h-4" aria-hidden="true" />
              </NavLink>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <h2 className="font-display font-semibold text-xl text-white">Calendario de recolección semanal</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {['white', 'green', 'black'].map((type) => {
                  const schedule = gironotCollectionSchedule[type];
                  const TypeIcon = getTypeIcon(type);
                  return (
                    <div key={type} className={`card p-6 ${getTypeColor(type)}`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-current/20 flex items-center justify-center">
                          <TypeIcon className="w-6 h-6" aria-hidden="true" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{type === 'white' ? 'Aprovechables' : type === 'green' ? 'Orgánicos' : 'No Aprovechables'}</h3>
                          <p className="text-sm opacity-80">Contenedor {type === 'white' ? 'Blanco' : type === 'green' ? 'Verde' : 'Negro'}</p>
                        </div>
                      </div>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.days.join(', ')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Truck className="w-4 h-4" aria-hidden="true" />
                          <span>{schedule.frequency}</span>
                        </div>
                      </div>
                      <div className="pt-4 border-t border-current/20">
                        <p className="text-xs opacity-70 mb-2">Barrios cubiertos:</p>
                        <div className="flex flex-wrap gap-1">
                          {schedule.neighborhoods.map((n) => (
                            <span key={n} className="px-2 py-1 text-xs rounded bg-current/20 border border-current/30">{n}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-semibold text-xl text-white">Notificaciones</h2>
                {notifications.some(n => !n.read) && (
                  <button
                    onClick={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
                    className="btn-ghost text-sm"
                  >
                    Marcar todo como leído
                  </button>
                )}
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    className={`card p-4 cursor-pointer transition-all ${!notif.read ? 'border-eco-neon/30 bg-eco-neon/5' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${notif.color}/10 border border-${notif.color}/20`}>
                        <notif.icon className={`w-5 h-5 text-${notif.color}`} aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-medium text-white">{notif.title}</h4>
                          <span className="text-xs text-eco-green/50 whitespace-nowrap">{notif.time}</span>
                        </div>
                        <p className="text-sm text-eco-green/60 mt-1">{notif.message}</p>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-eco-neon rounded-full mt-2" aria-hidden="true" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="card p-8 text-center">
                    <Bell className="w-12 h-12 text-eco-green/30 mx-auto mb-4" aria-hidden="true" />
                    <p className="text-eco-green/50">No hay notificaciones nuevas</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}