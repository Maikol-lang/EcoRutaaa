import { useState, useEffect, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  User,
  Award,
  Leaf,
  Recycle,
  Trash2,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Camera,
  Bell,
  Shield,
  Star,
  Calendar,
  Clock,
  MapPin as MapPinIcon,
  BarChart,
  ArrowRight,
  CheckCircle,
  XCircle,
  Mail,
  MessageSquare,
  Truck,
  Crown,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { rewardLevels, userStats } from '../data/rewards';
import { useTheme } from '../context/ThemeContext';

const levelIconMap = { seedling: Leaf, leaf: Leaf, shield: Shield, star: Star, crown: Crown };

gsap.registerPlugin(ScrollTrigger);

const tabConfig = [
  { id: 'overview', label: 'Resumen', icon: User, accent: 'stone' },
  { id: 'activity', label: 'Actividad', icon: BarChart, accent: 'forest' },
  { id: 'settings', label: 'Configuración', icon: Settings, accent: 'sky' },
];

const quickActions = [
  { icon: MapPin, label: 'Mis Puntos Limpios', path: '/clean-points', accent: 'forest' },
  { icon: Award, label: 'Canjear recompensas', path: '/rewards', accent: 'amber' },
  { icon: Bell, label: 'Notificaciones', path: '/notifications', accent: 'sky' },
  { icon: Leaf, label: 'Guía clasificación', path: '/waste-guide', accent: 'forest' },
];

const mockActivity = [
  { id: 1, type: 'deposit', title: 'Depósito en Punto Limpio Centro', detail: '5 kg - Pilas, aceite, electrónicos', points: 850, time: 'Hace 2 horas', icon: MapPinIcon, accent: 'amber' },
  { id: 2, type: 'deposit', title: 'Depósito contenedor verde', detail: 'Orgánicos - 3 kg', points: 120, time: 'Hace 1 día', icon: Leaf, accent: 'forest' },
  { id: 3, type: 'deposit', title: 'Depósito contenedor blanco', detail: 'Plásticos, papel, vidrio - 2.5 kg', points: 180, time: 'Hace 3 días', icon: Recycle, accent: 'forest' },
  { id: 4, type: 'achievement', title: 'Logro: Racha Semanal', detail: '7 días consecutivos separando', points: 200, time: 'Hace 5 días', icon: Star, accent: 'amber' },
  { id: 5, type: 'reward', title: 'Canje: Descuento 10% Comercios', detail: 'Cafetería El Parque', points: -500, time: 'Hace 1 semana', icon: Award, accent: 'sky' },
  { id: 6, type: 'deposit', title: 'Depósito contenedor negro', detail: 'No aprovechables - 1.5 kg', points: 0, time: 'Hace 1 semana', icon: Trash2, accent: 'stone' },
  { id: 7, type: 'deposit', title: 'Punto Limpio Móvil Plaza Mayor', detail: 'Medicamentos, bombillas', points: 350, time: 'Hace 2 semanas', icon: MapPinIcon, accent: 'amber' },
  { id: 8, type: 'achievement', title: 'Logro: Maestro Clasificador', detail: '10 depósitos correctos en 3 contenedores', points: 300, time: 'Hace 3 semanas', icon: Star, accent: 'amber' },
];

const notificationPrefs = [
  { key: 'push', label: 'Notificaciones push', desc: 'Alertas en tiempo real en tu dispositivo', icon: Bell, accent: 'sky' },
  { key: 'email', label: 'Correo electrónico', desc: 'Resúmenes semanales y alertas importantes', icon: Mail, accent: 'stone' },
  { key: 'sms', label: 'SMS', desc: 'Solo alertas críticas (cambios de horario urgentes)', icon: MessageSquare, accent: 'stone' },
  { key: 'routeAlerts', label: 'Alertas de ruta', desc: 'Camión cerca, retrasos, finalizaciones', icon: Truck, accent: 'sky' },
  { key: 'scheduleChanges', label: 'Cambios de horario', desc: 'Modificaciones en días u horas de recolección', icon: Calendar, accent: 'amber' },
  { key: 'achievements', label: 'Logros y recompensas', desc: 'Nuevos niveles, logros, ofertas especiales', icon: Award, accent: 'forest' },
  { key: 'tips', label: 'Tips educativos', desc: 'Consejos de clasificación semanales', icon: Leaf, accent: 'forest' },
  { key: 'weeklyDigest', label: 'Resumen semanal', desc: 'Tu impacto ambiental y actividad de la semana', icon: BarChart, accent: 'stone' },
];

const neighborhoods = [
  'Centro Histórico', 'El Carmelo', 'San Antonio', 'La Gaitana', 'María Auxiliadora',
  'Alfonso López', 'Ciudadela La Paz', 'El Porvenir', 'La Tribuna', 'San Pedro',
  'Otro', 'No vivo en Girardot'
];

export default function Profile() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    neighborhood: '',
    notifications: {
      push: true,
      email: true,
      sms: false,
      routeAlerts: true,
      scheduleChanges: true,
      achievements: true,
      tips: false,
      weeklyDigest: true,
    },
  });
  const containerRef = useRef(null);
  const tabBtnsRef = useRef(null);
  const cardsRef = useRef(null);

  const currentLevel = rewardLevels.find(l => l.id === user?.level?.toLowerCase().replace(' ', '-') || 'guardian');
  const nextLevel = rewardLevels.find(l => l.minPoints === (currentLevel?.maxPoints || 0) + 1);

  // GSAP Animations
  useGSAP(() => {
    const tabBtns = tabBtnsRef.current?.querySelectorAll('.tab-btn');
    if (tabBtns?.length) {
      gsap.fromTo(tabBtns,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.05 }
      );
    }
    const profileCards = cardsRef.current?.querySelectorAll('.profile-card');
    if (profileCards?.length) {
      gsap.fromTo(profileCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.1,
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [activeTab] });

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const getTabBtnStyle = (accent, isActive, isDark) => {
    if (isActive) {
      return 'bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-sm text-[var(--accent)]';
    }
    return isDark
      ? 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-default)]'
      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-default)]';
  };

  return (
    <div className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header - Personal Canvas */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full" style={{ background: 'var(--accent)' }} />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            {/* Profile Header */}
            <div className="surface-panel rounded-3xl p-6 lg:p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="relative">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center text-white font-display font-bold text-4xl lg:text-5xl" style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-hover))' }}>
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full text-white flex items-center justify-center hover:scale-105 transition-transform" style={{ background: 'var(--accent)' }}>
                      <Camera className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="font-display font-bold text-2xl lg:text-3xl" style={{ color: 'var(--text-primary)' }}>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-transparent border-none font-display font-bold text-2xl lg:text-3xl w-auto focus:outline-none"
                          style={{ color: 'var(--text-primary)' }}
                        />
                      ) : (
                        user?.name || 'Usuario'
                      )}
                    </h1>
                    {isEditing && (
                      <button onClick={handleSave} className="btn-primary text-sm px-4">Guardar</button>
                    )}
                  </div>
                  <p style={{ color: 'var(--text-secondary)' }}>{user?.email || 'usuario@ejemplo.com'}</p>
                  <div className="mt-4 flex items-center justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ background: 'var(--accent-amber)/10', borderColor: 'var(--accent-amber)/20' }}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--accent-amber)/20' }}>
                        {(() => {
                          const LevelIcon = currentLevel?.icon && levelIconMap[currentLevel.icon] ? levelIconMap[currentLevel.icon] : Star;
                          return <LevelIcon className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />;
                        })()}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{currentLevel?.name || 'Eco Guardián'}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{user?.points?.toLocaleString() || '1,250'} EcoPuntos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl border" style={{ background: 'var(--accent)/10', borderColor: 'var(--accent)/20' }}>
                      <Award className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                      <div className="text-left">
                        <p className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>Rango #{user?.rank || 247}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>de {user?.totalUsers?.toLocaleString() || '15,420'} usuarios</p>
                      </div>
                    </div>
                  </div>
                </div>
                {!isEditing && (
                  <button onClick={() => setIsEditing(true)} className="btn-secondary flex items-center gap-2">
                    <Edit className="w-4 h-4" aria-hidden="true" />
                    Editar perfil
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Award} label="EcoPuntos" value={user?.points?.toLocaleString() || '1,250'} accent="amber" />
              <StatCard icon={Leaf} label="CO₂ evitado" value={`${userStats?.co2Saved || 187.5} kg`} accent="forest" />
              <StatCard icon={Recycle} label="Reciclado" value={`${userStats?.wasteRecycled || 84.3} kg`} accent="forest" />
              <StatCard icon={Star} label="Logros" value={`${userStats?.achievementsUnlocked || 6}/${userStats?.totalAchievements || 10}`} accent="amber" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div ref={tabBtnsRef} className="surface-panel rounded-2xl p-2">
            <div className="flex gap-1">
              {tabConfig.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] ${getTabBtnStyle(tab.accent, activeTab === tab.id, isDark)}`}
                >
                  <tab.icon className="w-4 h-4" aria-hidden="true" />
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tab Content */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'overview' && (
            <div ref={cardsRef} className="space-y-6">
              {/* Level Progress */}
              <div className="profile-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>Progreso de nivel</h3>
                  <ArrowRight className="w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48" cy="48" r="40"
                        fill="none" stroke="var(--border-default)" strokeWidth="8"
                      />
                      <circle
                        cx="48" cy="48" r="40"
                        fill="none" stroke="url(#progress-gradient)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="251"
                        strokeDashoffset={`${251 * (1 - (userStats?.levelProgress || 35) / 100)}`}
                        className="transition-all duration-1000"
                      />
                      <defs>
                        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="var(--accent-amber)" />
                          <stop offset="100%" stopColor="var(--accent)" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="font-display font-bold text-2xl" style={{ color: 'var(--accent-amber)' }}>{userStats?.levelProgress || 35}%</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Completado</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{currentLevel?.name}</span>
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{user?.points?.toLocaleString() || '1,250'} / {nextLevel?.minPoints?.toLocaleString() || '3,500'} pts</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${userStats?.levelProgress || 35}%`, background: 'linear-gradient(90deg, var(--accent-amber), var(--accent))' }} />
                    </div>
                    <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>Faltan {(nextLevel?.minPoints || 3500) - (user?.points || 1250)} puntos para {nextLevel?.name}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentLevel?.benefits.slice(0, 3).map((benefit, i) => (
                        <span key={i} className="badge text-xs" style={{ background: 'var(--accent)/10', borderColor: 'var(--accent)/20', color: 'var(--accent)' }}>{benefit}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="profile-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>Actividad reciente</h3>
                  <button className="btn-ghost text-sm">Ver todo</button>
                </div>
                <div className="space-y-4">
                  {mockActivity.slice(0, 5).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="profile-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="font-display font-semibold text-h3 mb-6" style={{ color: 'var(--text-primary)' }}>Accesos rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {quickActions.map((action) => (
                    <a key={action.label} href={action.path} className="card-interactive card-padded flex flex-col items-center gap-3 text-center group border" style={{ borderColor: 'var(--border-subtle)' }}>
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform duration-200">
                        <action.icon className="w-6 h-6" style={{ color: action.accent === 'forest' ? 'var(--accent)' : action.accent === 'amber' ? 'var(--accent-amber)' : 'var(--accent-sky)' }} aria-hidden="true" />
                      </div>
                      <span className="font-medium text-sm group-hover:text-[var(--accent)] transition-colors" style={{ color: 'var(--text-primary)' }}>{action.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div ref={cardsRef} className="space-y-4">
              <h3 className="font-display font-semibold text-h3 mb-6" style={{ color: 'var(--text-primary)' }}>Historial completo de actividad</h3>
              <div className="profile-card card-interactive card-padded border overflow-hidden" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b text-left" style={{ borderColor: 'var(--border-subtle)' }}>
                        <th className="pb-3 px-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Fecha</th>
                        <th className="pb-3 px-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Actividad</th>
                        <th className="pb-3 px-4 font-medium text-sm" style={{ color: 'var(--text-secondary)' }}>Detalle</th>
                        <th className="pb-3 px-4 font-medium text-sm text-right" style={{ color: 'var(--text-secondary)' }}>Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                      {mockActivity.map((activity) => (
                        <ActivityRow key={activity.id} activity={activity} />
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div ref={cardsRef} className="space-y-6">
              {/* Profile Form */}
              <div className="profile-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="font-display font-semibold text-h3 mb-6" style={{ color: 'var(--text-primary)' }}>Información personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Nombre completo</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="label">Teléfono</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="+57 3XX XXX XXXX" />
                  </div>
                  <div>
                    <label className="label">Barrio / Sector</label>
                    <select value={formData.neighborhood} onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} className="input-field">
                      <option value="">Selecciona tu barrio</option>
                      {neighborhoods.map((n) => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="label">Dirección completa</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="input-field" placeholder="Calle 10 # 5-25, Apto 301" />
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t flex justify-end" style={{ borderColor: 'var(--border-subtle)' }}>
                  <button onClick={handleSave} className="btn-primary">Guardar cambios</button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="profile-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
                <h3 className="font-display font-semibold text-h3 mb-6" style={{ color: 'var(--text-primary)' }}>Preferencias de notificación</h3>
                <div className="space-y-4">
                  {notificationPrefs.map((pref) => (
                    <SettingToggle key={pref.key} pref={pref} formData={formData} setFormData={setFormData} />
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="profile-card card-padded border" style={{ borderColor: 'var(--accent-coral)/20', background: 'var(--accent-coral)/5' }}>
                <h3 className="font-display font-semibold text-h3 mb-4 flex items-center gap-2" style={{ color: 'var(--accent-coral)' }}>
                  <Shield className="w-6 h-6" aria-hidden="true" />
                  Zona de peligro
                </h3>
                <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Estas acciones son irreversibles</p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-ghost text-[var(--accent-coral)] border border-[var(--accent-coral)]/20 hover:bg-[var(--accent-coral)]/5">
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                    Eliminar cuenta
                  </button>
                  <button onClick={logout} className="btn-secondary">
                    <LogOut className="w-4 h-4" aria-hidden="true" />
                    Cerrar sesión
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <Icon className="w-6 h-6" style={{ color: accent === 'forest' ? 'var(--accent)' : 'var(--accent-amber)' }} aria-hidden="true" />
        </div>
        <div>
          <p className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{value}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{label}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const accentColor = activity.accent === 'forest' ? 'var(--accent)' : activity.accent === 'amber' ? 'var(--accent-amber)' : activity.accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)';
  const isPositive = activity.points >= 0;

  return (
    <div className="card-padded flex items-center gap-4 border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
        <activity.icon className="w-5 h-5" style={{ color: accentColor }} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{activity.title}</p>
        <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{activity.detail}</p>
      </div>
      <div className="text-right">
        <p className="font-semibold" style={{ color: isPositive ? 'var(--accent-amber)' : 'var(--accent-coral)' }}>{isPositive ? '+' : ''}{activity.points} pts</p>
        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{activity.time}</p>
      </div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const accentColor = activity.accent === 'forest' ? 'var(--accent)' : activity.accent === 'amber' ? 'var(--accent-amber)' : activity.accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)';
  const isPositive = activity.points >= 0;

  return (
    <tr className="hover:bg-[var(--bg-elevated)]/50 transition-colors">
      <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-muted)' }}>{activity.time}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <activity.icon className="w-4 h-4" style={{ color: accentColor }} aria-hidden="true" />
          <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{activity.title}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-sm" style={{ color: 'var(--text-secondary)' }}>{activity.detail}</td>
      <td className="py-4 px-4 text-right font-semibold text-sm" style={{ color: isPositive ? 'var(--accent-amber)' : 'var(--accent-coral)' }}>{isPositive ? '+' : ''}{activity.points}</td>
    </tr>
  );
}

function SettingToggle({ pref, formData, setFormData }) {
  const Icon = pref.icon;
  const value = formData.notifications[pref.key];
  const accentColor = pref.accent === 'forest' ? 'var(--accent)' : pref.accent === 'amber' ? 'var(--accent-amber)' : pref.accent === 'sky' ? 'var(--accent-sky)' : 'var(--text-secondary)';

  return (
    <div className="card-padded flex items-center justify-between border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
          <Icon className="w-5 h-5" style={{ color: accentColor }} aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium" style={{ color: 'var(--text-primary)' }}>{pref.label}</p>
          <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{pref.desc}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => setFormData(prev => ({ ...prev, notifications: { ...prev.notifications, [pref.key]: e.target.checked } }))}
          className="sr-only peer"
        />
        <div className="w-11 h-6 rounded-full peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[var(--focus)]/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all" style={{ background: 'var(--border-default)', borderColor: 'var(--border-subtle)' }} />
      </label>
    </div>
  );
}