import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Truck, AlertCircle, CheckCircle, Calendar, MapPin, Award, Leaf, Recycle, Trash2, X, Filter, ChevronDown, ChevronUp, Clock, Mail, Phone, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const mockNotifications = [
  { id: 1, type: 'route', title: 'Camión en tu zona', message: 'El camión ECO-001 está a 5 min de tu parada en Calle 10 # 5-25', time: 'Hace 10 min', read: false, priority: 'high', icon: Truck, color: 'eco-cyan', action: { label: 'Ver en mapa', path: '/map' } },
  { id: 2, type: 'schedule', title: 'Cambio de horario', message: 'Ruta Centro Histórico: recolección adelantada a 5:30 AM mañana miércoles', time: 'Hace 2 horas', read: false, priority: 'high', icon: Calendar, color: 'eco-neon', action: { label: 'Ver calendario', path: '/app' } },
  { id: 3, type: 'achievement', title: '¡Logro desbloqueado!', message: 'Completaste 7 días consecutivos separando residuos correctamente', time: 'Ayer', read: true, priority: 'normal', icon: Award, color: 'eco-green', action: { label: 'Ver logros', path: '/rewards' } },
  { id: 4, type: 'cleanpoint', title: 'Punto Limpio Móvil', message: 'Plaza Mayor miércoles 8:00-14:00 - Recepción de aceite y pilas', time: 'Ayer', read: true, priority: 'normal', icon: MapPin, color: 'eco-neon', action: { label: 'Ver detalles', path: '/clean-points' } },
  { id: 5, type: 'route', title: 'Ruta completada', message: 'Recolección de aprovechables (blanco) finalizada en tu sector', time: 'Ayer', read: true, priority: 'low', icon: CheckCircle, color: 'eco-green', action: null },
  { id: 6, type: 'alert', title: 'Contenedor lleno reportado', message: 'Vecinos reportaron contenedor verde lleno en Parque Alfonso López', time: '2 días', read: true, priority: 'normal', icon: AlertCircle, color: 'eco-cyan', action: { label: 'Reportar', path: '/map' } },
  { id: 7, type: 'tip', title: 'Tip de la semana', message: '¿Sabías que las tapas plásticas van en el contenedor blanco? Sepáralas y gana puntos extra', time: '3 días', read: true, priority: 'low', icon: Leaf, color: 'eco-green', action: { label: 'Ver guía', path: '/waste-guide' } },
  { id: 8, type: 'reward', title: 'Nueva recompensa disponible', message: 'Descuento 15% en Cafetería El Parque - Solo para nivel Embajador', time: '4 días', read: false, priority: 'normal', icon: Award, color: 'eco-neon', action: { label: 'Canjear', path: '/rewards' } },
  { id: 9, type: 'schedule', title: 'Recordatorio: Recolección nocturna', message: 'Esta noche pasa el camión de no aprovechables (negro) a las 10:00 PM', time: '5 días', read: true, priority: 'normal', icon: Trash2, color: 'gray', action: null },
  { id: 10, type: 'community', title: 'Evento comunitario', message: 'Taller de compostaje urbano sábado 10:00 AM en Punto Verde Alfonso López', time: '1 semana', read: true, priority: 'low', icon: Users, color: 'eco-cyan', action: { label: 'Inscribirse', path: '/rewards' } },
];

const typeFilters = [
  { id: 'all', label: 'Todas', icon: Bell },
  { id: 'unread', label: 'No leídas', icon: Bell },
  { id: 'route', label: 'Rutas', icon: Truck },
  { id: 'schedule', label: 'Horarios', icon: Calendar },
  { id: 'achievement', label: 'Logros', icon: Award },
  { id: 'alert', label: 'Alertas', icon: AlertCircle },
];

export default function Notifications() {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      const filterBtns = containerRef.current?.querySelectorAll('.filter-btn');
      const notificationCards = containerRef.current?.querySelectorAll('.notification-card');

      if (filterBtns?.length) {
        gsap.fromTo(filterBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
      }
      if (notificationCards?.length) {
        gsap.fromTo(notificationCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [filter]);

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const toggleExpanded = (id) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'border-l-4 border-l-eco-neon bg-eco-neon/5',
      normal: 'border-l-4 border-l-eco-green bg-eco-green/5',
      low: 'border-l-4 border-l-eco-border bg-eco-surface/50',
    };
    return colors[priority] || colors.normal;
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
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider mb-2">Centro de Alertas</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white">
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="ml-3 inline-flex items-center justify-center w-7 h-7 rounded-full bg-eco-neon text-eco-bg text-sm font-bold">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-eco-green/50 mt-2">Mantente informado sobre tus recolecciones, logros y novedades</p>
              </div>
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="btn-secondary flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" aria-hidden="true" />
                    Marcar todo como leído
                  </button>
                )}
                <button className="btn-ghost flex items-center gap-2" aria-label="Configuración de notificaciones">
                  <Settings className="w-4 h-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl p-2 lg:p-3">
            <div className="flex flex-wrap gap-1">
              {typeFilters.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setFilter(type.id)}
                  className={`filter-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === type.id
                      ? 'bg-eco-neon text-eco-bg shadow-lg shadow-eco-neon/25'
                      : 'text-eco-green/60 hover:text-white hover:bg-eco-green/5'
                  }`}
                >
                  <type.icon className="w-4 h-4" aria-hidden="true" />
                  {type.label}
                  {type.id !== 'all' && type.id !== 'unread' && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-current/20 text-current">
                      {notifications.filter(n => n.type === type.id).length}
                    </span>
                  )}
                  {type.id === 'unread' && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-eco-neon/20 text-eco-neon">{unreadCount}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {filteredNotifications.length === 0 ? (
            <div className="card p-12 text-center">
              <Bell className="w-16 h-16 text-eco-green/30 mx-auto mb-4" aria-hidden="true" />
              <h3 className="font-display font-semibold text-xl text-white mb-2">
                {filter === 'unread' ? '¡Todo al día!' : 'Sin notificaciones'}
              </h3>
              <p className="text-eco-green/50">
                {filter === 'unread'
                  ? 'No tienes notificaciones pendientes. ¡Buen trabajo!'
                  : `No hay notificaciones de tipo "${typeFilters.find(f => f.id === filter)?.label}"`}
              </p>
              {filter !== 'all' && (
                <button onClick={() => setFilter('all')} className="btn-primary mt-4">
                  Ver todas
                </button>
              )}
            </div>
          ) : (
            <div ref={containerRef} className="space-y-3">
              {filteredNotifications.map((notif, i) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  index={i}
                  isExpanded={expandedId === notif.id}
                  onToggle={() => toggleExpanded(notif.id)}
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                />
              ))}
            </div>
          )}

          {/* Load more */}
          {filteredNotifications.length > 10 && (
            <div className="text-center mt-8">
              <button className="btn-ghost">Cargar más notificaciones</button>
            </div>
          )}
        </div>
      </section>

      {/* Notification Preferences */}
      <section className="section-container pb-16 relative z-10 bg-eco-bg-light/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-xl text-white text-center mb-10">Preferencias de notificación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Rutas en vivo', desc: 'Camión cerca de tu zona, retrasos, finalizaciones', enabled: true },
              { icon: Calendar, title: 'Cambios de horario', desc: 'Modificaciones en días, horas o frecuencias', enabled: true },
              { icon: Award, title: 'Logros y recompensas', desc: 'Nuevos niveles, logros desbloqueados, ofertas', enabled: true },
              { icon: AlertCircle, title: 'Alertas comunitarias', desc: 'Contenedores llenos, incidencias, eventos', enabled: true },
              { icon: Leaf, title: 'Tips educativos', desc: 'Consejos de clasificación, datos ambientales', enabled: false },
              { icon: Mail, title: 'Resumen semanal por email', desc: 'Reporte de tu impacto y actividad de la semana', enabled: true },
            ].map((pref, i) => (
              <div key={i} className="card p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center">
                    <pref.icon className="w-5 h-5 text-eco-neon" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">{pref.title}</h4>
                    <p className="text-xs text-eco-green/60">{pref.desc}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                  <div className="w-11 h-6 bg-eco-border/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eco-neon/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-neon"></div>
                  <span className="ml-3 text-sm text-eco-green/60">{pref.enabled ? 'Activado' : 'Desactivado'}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationCard({ notification, index, isExpanded, onToggle, onMarkRead, onDelete }) {
  const Icon = notification.icon;
  const priorityColors = {
    high: 'eco-neon',
    normal: 'eco-green',
    low: 'gray',
    gray: 'gray',
  };
  const priorityColor = priorityColors[notification.priority] || 'eco-green';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`notification-card card overflow-hidden ${!notification.read ? 'border-eco-neon/20 bg-eco-neon/5' : ''} ${getPriorityColor(notification.priority)}`}>
      <div
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="w-full p-4 lg:p-5 flex items-start gap-4 text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-${priorityColor}/10 border border-${priorityColor}/20`}>
          <Icon className="w-5 h-5" style={{ color: `var(--${priorityColor})` }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold text-white">{notification.title}</h4>
            <span className="text-xs text-eco-green/50 whitespace-nowrap">{notification.time}</span>
          </div>
          <p className="text-sm text-eco-green/70 line-clamp-2">{notification.message}</p>
          {!notification.read && (
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-eco-neon rounded-full" aria-hidden="true" />
              <span className="text-xs text-eco-neon font-medium">Nueva</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!notification.read && (
            <button onClick={(e) => { e.stopPropagation(); onMarkRead(); }} className="btn-ghost p-2" aria-label="Marcar como leída">
              <CheckCircle className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="btn-ghost p-2" aria-label="Eliminar">
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
          <ChevronDown className={`w-5 h-5 text-eco-green/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
        </div>
      </div>
      {isExpanded && (
        <div className="px-4 lg:px-5 pb-4 lg:pb-5 border-t border-eco-border/20 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="md:col-span-2">
              <p className="text-sm text-eco-green/70">{notification.message}</p>
              {notification.action && (
                <button className="btn-primary mt-3 text-sm" onClick={(e) => e.stopPropagation()}>
                  {notification.action.label}
                </button>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs text-eco-green/60 mb-2">
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{notification.time}</span>
              </div>
              <span className={`px-2 py-1 text-xs rounded-full bg-${priorityColor}/20 text-${priorityColor} border border-${priorityColor}/30`}>
                Prioridad: {notification.priority === 'high' ? 'Alta' : notification.priority === 'normal' ? 'Normal' : 'Baja'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getPriorityColor(priority) {
  const colors = {
    high: 'border-l-4 border-l-eco-neon bg-eco-neon/5',
    normal: 'border-l-4 border-l-eco-green bg-eco-green/5',
    low: 'border-l-4 border-l-eco-border bg-eco-surface/50',
  };
  return colors[priority] || colors.normal;
}