import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Bell, Truck, AlertCircle, CheckCircle, Calendar, MapPin, Award, Leaf, Recycle, Trash2, X, Filter, ChevronDown, ChevronUp, Clock, Mail, Phone, Settings, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const mockNotifications = [
  { id: 1, type: 'route', title: 'Camión en tu zona', message: 'El camión ECO-001 está a 5 min de tu parada en Calle 10 # 5-25', time: 'Hace 10 min', read: false, priority: 'high', icon: Truck, accent: 'sky', action: { label: 'Ver en mapa', path: '/map' } },
  { id: 2, type: 'schedule', title: 'Cambio de horario', message: 'Ruta Centro Histórico: recolección adelantada a 5:30 AM mañana miércoles', time: 'Hace 2 horas', read: false, priority: 'high', icon: Calendar, accent: 'amber', action: { label: 'Ver calendario', path: '/app' } },
  { id: 3, type: 'achievement', title: '¡Logro desbloqueado!', message: 'Completaste 7 días consecutivos separando residuos correctamente', time: 'Ayer', read: true, priority: 'normal', icon: Award, accent: 'forest', action: { label: 'Ver logros', path: '/rewards' } },
  { id: 4, type: 'cleanpoint', title: 'Punto Limpio Móvil', message: 'Plaza Mayor miércoles 8:00-14:00 - Recepción de aceite y pilas', time: 'Ayer', read: true, priority: 'normal', icon: MapPin, accent: 'amber', action: { label: 'Ver detalles', path: '/clean-points' } },
  { id: 5, type: 'route', title: 'Ruta completada', message: 'Recolección de aprovechables (blanco) finalizada en tu sector', time: 'Ayer', read: true, priority: 'low', icon: CheckCircle, accent: 'forest', action: null },
  { id: 6, type: 'alert', title: 'Contenedor lleno reportado', message: 'Vecinos reportaron contenedor verde lleno en Parque Alfonso López', time: '2 días', read: true, priority: 'normal', icon: AlertCircle, accent: 'sky', action: { label: 'Reportar', path: '/map' } },
  { id: 7, type: 'tip', title: 'Tip de la semana', message: '¿Sabías que las tapas plásticas van en el contenedor blanco? Sepáralas y gana puntos extra', time: '3 días', read: true, priority: 'low', icon: Leaf, accent: 'forest', action: { label: 'Ver guía', path: '/waste-guide' } },
  { id: 8, type: 'reward', title: 'Nueva recompensa disponible', message: 'Descuento 15% en Cafetería El Parque - Solo para nivel Embajador', time: '4 días', read: false, priority: 'normal', icon: Award, accent: 'amber', action: { label: 'Canjear', path: '/rewards' } },
  { id: 9, type: 'schedule', title: 'Recordatorio: Recolección nocturna', message: 'Esta noche pasa el camión de no aprovechables (negro) a las 10:00 PM', time: '5 días', read: true, priority: 'normal', icon: Trash2, accent: 'stone', action: null },
  { id: 10, type: 'community', title: 'Evento comunitario', message: 'Taller de compostaje urbano sábado 10:00 AM en Punto Verde Alfonso López', time: '1 semana', read: true, priority: 'low', icon: Users, accent: 'sky', action: { label: 'Inscribirse', path: '/rewards' } },
];

const typeFilters = [
  { id: 'all', label: 'Todas', icon: Bell, accent: 'stone' },
  { id: 'unread', label: 'No leídas', icon: Bell, accent: 'amber' },
  { id: 'route', label: 'Rutas', icon: Truck, accent: 'sky' },
  { id: 'schedule', label: 'Horarios', icon: Calendar, accent: 'amber' },
  { id: 'achievement', label: 'Logros', icon: Award, accent: 'forest' },
  { id: 'alert', label: 'Alertas', icon: AlertCircle, accent: 'sky' },
];

const priorityAccent = {
  high: 'amber',
  normal: 'forest',
  low: 'stone',
};

export default function Notifications() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  const [expandedId, setExpandedId] = useState(null);
  const containerRef = useRef(null);
  const filterBtnsRef = useRef(null);
  const cardsRef = useRef(null);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  // GSAP Animations
  useGSAP(() => {
    const filterBtns = filterBtnsRef.current?.querySelectorAll('.filter-btn');
    if (filterBtns?.length) {
      gsap.fromTo(filterBtns,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.05 }
      );
    }
    const notificationCards = cardsRef.current?.querySelectorAll('.notification-card');
    if (notificationCards?.length) {
      gsap.fromTo(notificationCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.06,
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [filter] });

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

  const getFilterBtnStyle = (accent, isActive, isDark) => {
    if (isActive) {
      return 'bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-sm text-[var(--accent)]';
    }
    return isDark
      ? 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-default)]'
      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-default)]';
  };

  const getPriorityStyles = (priority, isDark) => {
    const accent = priorityAccent[priority] || 'stone';
    return {
      iconColor: accent === 'forest' ? 'var(--accent)' : accent === 'amber' ? 'var(--accent-amber)' : accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)',
      bg: accent === 'forest' ? 'var(--accent)/10' : accent === 'amber' ? 'var(--accent-amber)/10' : accent === 'sky' ? 'var(--accent-sky)/10' : 'var(--text-muted)/10',
    };
  };

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header - Information Feed */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'var(--accent)' }} />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>Centro de Alertas</p>
                <h1 className="font-display font-bold text-display-md lg:text-display-lg" style={{ color: 'var(--text-primary)' }}>
                  Notificaciones
                  {unreadCount > 0 && (
                    <span className="ml-3 inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold" style={{ background: 'var(--accent-amber)' }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </h1>
                <p className="text-lg mt-2" style={{ color: 'var(--text-secondary)' }}>Mantente informado sobre tus recolecciones, logros y novedades</p>
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
          <div ref={filterBtnsRef} className="surface-panel rounded-2xl p-2 lg:p-3">
            <div className="flex flex-wrap gap-1">
              {typeFilters.map((type) => {
                const isActive = filter === type.id;
                const count = type.id === 'unread' ? unreadCount : notifications.filter(n => n.type === type.id).length;
                return (
                  <button
                    key={type.id}
                    onClick={() => setFilter(type.id)}
                    className={`filter-btn flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] border ${getFilterBtnStyle(type.accent, isActive, isDark)}`}
                  >
                    <type.icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                    {type.label}
                    {(type.id !== 'all' && type.id !== 'unread') && count > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: type.accent === 'forest' ? 'var(--accent)' : type.accent === 'amber' ? 'var(--accent-amber)' : 'var(--accent-sky)' }}>
                        {count}
                      </span>
                    )}
                    {type.id === 'unread' && count > 0 && (
                      <span className="px-2 py-0.5 text-xs rounded-full border" style={{ background: 'var(--accent-amber)/10', borderColor: 'var(--accent-amber)/20', color: 'var(--accent-amber)' }}>
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Notifications List */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {filteredNotifications.length === 0 ? (
            <div className="card-padded text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <h3 className="font-display font-semibold text-xl mb-2" style={{ color: 'var(--text-primary)' }}>
                {filter === 'unread' ? '¡Todo al día!' : 'Sin notificaciones'}
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
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
            <div ref={cardsRef} className="space-y-3">
              {filteredNotifications.map((notif, i) => (
                <NotificationCard
                  key={notif.id}
                  notification={notif}
                  index={i}
                  isExpanded={expandedId === notif.id}
                  onToggle={() => toggleExpanded(notif.id)}
                  onMarkRead={() => markAsRead(notif.id)}
                  onDelete={() => deleteNotification(notif.id)}
                  getPriorityStyles={getPriorityStyles}
                  isDark={isDark}
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
      <section className="section-container pb-16 relative z-10" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-h3 text-center mb-10" style={{ color: 'var(--text-primary)' }}>Preferencias de notificación</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Truck, title: 'Rutas en vivo', desc: 'Camión cerca de tu zona, retrasos, finalizaciones', enabled: true, accent: 'sky' },
              { icon: Calendar, title: 'Cambios de horario', desc: 'Modificaciones en días, horas o frecuencias', enabled: true, accent: 'amber' },
              { icon: Award, title: 'Logros y recompensas', desc: 'Nuevos niveles, logros desbloqueados, ofertas', enabled: true, accent: 'forest' },
              { icon: AlertCircle, title: 'Alertas comunitarias', desc: 'Contenedores llenos, incidencias, eventos', enabled: true, accent: 'sky' },
              { icon: Leaf, title: 'Tips educativos', desc: 'Consejos de clasificación, datos ambientales', enabled: false, accent: 'forest' },
              { icon: Mail, title: 'Resumen semanal por email', desc: 'Reporte de tu impacto y actividad de la semana', enabled: true, accent: 'stone' },
            ].map((pref, i) => {
              return (
                <div key={i} className="card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <pref.icon className="w-5 h-5" style={{ color: pref.accent === 'forest' ? 'var(--accent)' : pref.accent === 'amber' ? 'var(--accent-amber)' : pref.accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)' }} aria-hidden="true" />
                    </div>
                    <div>
                      <h4 className="font-medium" style={{ color: 'var(--text-primary)' }}>{pref.title}</h4>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{pref.desc}</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={pref.enabled} className="sr-only peer" />
                    <div className="w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--focus)]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ background: 'var(--border-default)', borderColor: 'var(--border-subtle)' }} />
                    <span className="ml-3 text-sm" style={{ color: 'var(--text-secondary)' }}>{pref.enabled ? 'Activado' : 'Desactivado'}</span>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

function NotificationCard({ notification, index, isExpanded, onToggle, onMarkRead, onDelete, getPriorityStyles, isDark }) {
  const Icon = notification.icon;
  const priorityStyles = getPriorityStyles(notification.priority, isDark);
  const accentColor = notification.accent === 'forest' ? 'var(--accent)' : notification.accent === 'amber' ? 'var(--accent-amber)' : notification.accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)';

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <div className={`notification-card card-interactive card-padded border ${!notification.read ? 'border-amber-200 bg-amber-50/50' : ''}`} style={{
      borderColor: !notification.read ? 'var(--accent-amber)/20' : 'var(--border-subtle)',
      background: !notification.read ? 'var(--accent-amber)/5' : 'transparent',
    }}>
      <div
        onClick={onToggle}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        className="w-full flex items-start gap-4 text-left cursor-pointer"
        aria-expanded={isExpanded}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: priorityStyles.bg }}>
          <Icon className="w-5 h-5" style={{ color: priorityStyles.iconColor }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{notification.title}</h4>
            <span className="text-xs whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{notification.time}</span>
          </div>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{notification.message}</p>
          {!notification.read && (
            <div className="mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent-amber)' }} aria-hidden="true" />
              <span className="text-xs font-medium" style={{ color: 'var(--accent-amber)' }}>Nueva</span>
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
          <ChevronDown className="w-5 h-5 transition-transform" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t animate-in" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{notification.message}</p>
              {notification.action && (
                <button className="btn-primary mt-3 text-sm" onClick={(e) => e.stopPropagation()}>
                  {notification.action.label}
                </button>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-1 text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <Clock className="w-3 h-3" aria-hidden="true" />
                <span>{notification.time}</span>
              </div>
              <span className="px-2 py-1 text-xs rounded-full border" style={{
                background: notification.priority === 'high' ? 'var(--accent-amber)/10' : notification.priority === 'normal' ? 'var(--accent)/10' : 'var(--text-muted)/10',
                borderColor: notification.priority === 'high' ? 'var(--accent-amber)/20' : notification.priority === 'normal' ? 'var(--accent)/20' : 'var(--border-subtle)',
                color: notification.priority === 'high' ? 'var(--accent-amber)' : notification.priority === 'normal' ? 'var(--accent)' : 'var(--text-muted)',
              }}>
                Prioridad: {notification.priority === 'high' ? 'Alta' : notification.priority === 'normal' ? 'Normal' : 'Baja'}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}