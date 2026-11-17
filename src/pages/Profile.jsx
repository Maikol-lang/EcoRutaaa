import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
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

const levelIconMap = { seedling: Leaf, leaf: Leaf, shield: Shield, star: Star, crown: Crown };

gsap.registerPlugin(ScrollTrigger);

export default function Profile() {
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

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: User },
    { id: 'activity', label: 'Actividad', icon: BarChart },
    { id: 'settings', label: 'Configuración', icon: Settings },
  ];

  const currentLevel = rewardLevels.find(l => l.id === user?.level?.toLowerCase().replace(' ', '-') || 'guardian');
  const nextLevel = rewardLevels.find(l => l.minPoints === (currentLevel?.maxPoints || 0) + 1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tabBtns = containerRef.current?.querySelectorAll('.tab-btn');
      const profileCards = containerRef.current?.querySelectorAll('.profile-card');

      if (tabBtns?.length) {
        gsap.fromTo(tabBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
      }
      if (profileCards?.length) {
        gsap.fromTo(profileCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const mockActivity = [
    { id: 1, type: 'deposit', title: 'Depósito en Punto Limpio Centro', detail: '5 kg - Pilas, aceite, electrónicos', points: 850, time: 'Hace 2 horas', icon: MapPinIcon, color: 'eco-neon' },
    { id: 2, type: 'deposit', title: 'Depósito contenedor verde', detail: 'Orgánicos - 3 kg', points: 120, time: 'Hace 1 día', icon: Leaf, color: 'eco-green' },
    { id: 3, type: 'deposit', title: 'Depósito contenedor blanco', detail: 'Plásticos, papel, vidrio - 2.5 kg', points: 180, time: 'Hace 3 días', icon: Recycle, color: 'white' },
    { id: 4, type: 'achievement', title: 'Logro: Racha Semanal', detail: '7 días consecutivos separando', points: 200, time: 'Hace 5 días', icon: Star, color: 'amber' },
    { id: 5, type: 'reward', title: 'Canje: Descuento 10% Comercios', detail: 'Cafetería El Parque', points: -500, time: 'Hace 1 semana', icon: Award, color: 'eco-cyan' },
    { id: 6, type: 'deposit', title: 'Depósito contenedor negro', detail: 'No aprovechables - 1.5 kg', points: 0, time: 'Hace 1 semana', icon: Trash2, color: 'gray' },
    { id: 7, type: 'deposit', title: 'Punto Limpio Móvil Plaza Mayor', detail: 'Medicamentos, bombillas', points: 350, time: 'Hace 2 semanas', icon: MapPinIcon, color: 'eco-neon' },
    { id: 8, type: 'achievement', title: 'Logro: Maestro Clasificador', detail: '10 depósitos correctos en 3 contenedores', points: 300, time: 'Hace 3 semanas', icon: Star, color: 'amber' },
  ];

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
            {/* Profile Header */}
            <div className="glass-panel rounded-3xl p-6 lg:p-8 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                <div className="relative">
                  <div className="w-28 h-28 lg:w-32 lg:h-32 rounded-2xl bg-gradient-to-br from-eco-neon to-eco-green flex items-center justify-center text-eco-bg font-display font-bold text-4xl lg:text-5xl">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-eco-neon text-eco-bg flex items-center justify-center hover:scale-105 transition-transform">
                      <Camera className="w-5 h-5" aria-hidden="true" />
                    </button>
                  )}
                </div>
                <div className="flex-1 text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="font-display font-bold text-2xl lg:text-3xl text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          className="bg-transparent border-none text-white font-display font-bold text-2xl lg:text-3xl w-auto focus:outline-none"
                        />
                      ) : (
                        user?.name || 'Usuario'
                      )}
                    </h1>
                    {isEditing && (
                      <button onClick={handleSave} className="btn-primary text-sm px-4">Guardar</button>
                    )}
                  </div>
                  <p className="text-eco-green/60">{user?.email || 'usuario@ejemplo.com'}</p>
                  <div className="mt-4 flex items-center justify-center lg:justify-start gap-4">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-eco-neon/10 border border-eco-neon/20">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${currentLevel?.color}, ${currentLevel?.color}CC)` }}>
                        {currentLevel?.icon && currentLevel.icon !== 'seedling' ? (() => {
                          const Icon = levelIconMap[currentLevel.icon];
                          return <Icon className="w-4 h-4 text-white" />;
                        })() : (
                          <Star className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="text-left">
                        <p className="font-semibold text-white text-sm">{currentLevel?.name || 'Eco Guardián'}</p>
                        <p className="text-xs text-eco-green/60">{user?.points?.toLocaleString() || '1,250'} EcoPuntos</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-eco-green/10 border border-eco-green/20">
                      <Award className="w-5 h-5 text-eco-green" aria-hidden="true" />
                      <div className="text-left">
                        <p className="font-semibold text-white text-sm">Rango #{user?.rank || 247}</p>
                        <p className="text-xs text-eco-green/60">de {user?.totalUsers?.toLocaleString() || '15,420'} usuarios</p>
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
              <StatCard icon={Award} label="EcoPuntos" value={user?.points?.toLocaleString() || '1,250'} color="eco-neon" />
              <StatCard icon={Leaf} label="CO₂ evitado" value={`${userStats?.co2Saved || 187.5} kg`} color="eco-green" />
              <StatCard icon={Recycle} label="Reciclado" value={`${userStats?.wasteRecycled || 84.3} kg`} color="white" />
              <StatCard icon={Star} label="Logros" value={`${userStats?.achievementsUnlocked || 6}/${userStats?.totalAchievements || 10}`} color="amber" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl p-2">
            <div className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-btn flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-eco-neon text-eco-bg shadow-lg shadow-eco-neon/25'
                      : 'text-eco-green/60 hover:text-white hover:bg-eco-green/5'
                  }`}
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
            <div ref={containerRef} className="space-y-6">
              {/* Level Progress */}
              <div className="profile-card card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-xl text-white">Progreso de nivel</h3>
                  <ArrowRight className="w-5 h-5 text-eco-green/50" aria-hidden="true" />
                </div>
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="48" cy="48" r="40"
                        fill="none" stroke="var(--eco-border)" strokeWidth="8"
                      />
                      <circle
                        cx="48" cy="48" r="40"
                        fill="none" stroke="var(--eco-neon)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray="251"
                        strokeDashoffset={`${251 * (1 - (userStats?.levelProgress || 35) / 100)}`}
                        className="transition-all duration-1000"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="font-display font-bold text-2xl text-eco-neon">{userStats?.levelProgress || 35}%</p>
                        <p className="text-xs text-eco-green/60">Completado</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{currentLevel?.name}</span>
                      <span className="text-eco-green/60 text-sm">{user?.points?.toLocaleString() || '1,250'} / {nextLevel?.minPoints?.toLocaleString() || '3,500'} pts</span>
                    </div>
                    <div className="h-2 bg-eco-border/30 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${userStats?.levelProgress || 35}%`, background: 'linear-gradient(90deg, var(--eco-neon), var(--eco-green))' }} />
                    </div>
                    <p className="text-sm text-eco-green/50 mt-2">Faltan {(nextLevel?.minPoints || 3500) - (user?.points || 1250)} puntos para {nextLevel?.name}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {currentLevel?.benefits.slice(0, 3).map((benefit, i) => (
                        <span key={i} className="px-3 py-1 text-xs rounded-full bg-eco-green/10 border border-eco-green/20 text-eco-green">{benefit}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="profile-card card p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-display font-semibold text-xl text-white">Actividad reciente</h3>
                  <button className="btn-ghost text-sm">Ver todo</button>
                </div>
                <div className="space-y-4">
                  {mockActivity.slice(0, 5).map((activity) => (
                    <ActivityItem key={activity.id} activity={activity} />
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="profile-card card p-6">
                <h3 className="font-display font-semibold text-xl text-white mb-6">Accesos rápidos</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { icon: MapPin, label: 'Mis Puntos Limpios', path: '/clean-points', color: 'eco-green' },
                    { icon: Award, label: 'Canjear recompensas', path: '/rewards', color: 'eco-neon' },
                    { icon: Bell, label: 'Notificaciones', path: '/notifications', color: 'eco-cyan' },
                    { icon: Leaf, label: 'Guía clasificación', path: '/waste-guide', color: 'white' },
                  ].map((action) => (
                    <a key={action.label} href={action.path} className="card p-4 flex flex-col items-center gap-3 text-center group">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${action.color === 'eco-green' ? 'bg-eco-green/10 border border-eco-green/20' : action.color === 'eco-neon' ? 'bg-eco-neon/10 border border-eco-neon/20' : action.color === 'eco-cyan' ? 'bg-eco-cyan/10 border border-eco-cyan/20' : 'bg-white/10 border border-white/20'}`}>
                        <action.icon className="w-6 h-6" style={{ color: `var(--${action.color})` }} aria-hidden="true" />
                      </div>
                      <span className="font-medium text-white text-sm group-hover:text-eco-neon transition-colors">{action.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div ref={containerRef} className="space-y-4">
              <h3 className="font-display font-semibold text-xl text-white mb-6">Historial completo de actividad</h3>
              <div className="card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-eco-border/30 text-left">
                        <th className="pb-3 px-4 font-medium text-eco-green/60">Fecha</th>
                        <th className="pb-3 px-4 font-medium text-eco-green/60">Actividad</th>
                        <th className="pb-3 px-4 font-medium text-eco-green/60">Detalle</th>
                        <th className="pb-3 px-4 font-medium text-eco-green/60 text-right">Puntos</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-eco-border/20">
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
            <div ref={containerRef} className="space-y-6">
              {/* Profile Form */}
              <div className="profile-card card p-6">
                <h3 className="font-display font-semibold text-xl text-white mb-6">Información personal</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-eco-green/60 mb-2">Nombre completo</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-eco-green/60 mb-2">Email</label>
                    <input type="email" value={formData.email} onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))} className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-eco-green/60 mb-2">Teléfono</label>
                    <input type="tel" value={formData.phone} onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))} className="input-field" placeholder="+57 3XX XXX XXXX" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-eco-green/60 mb-2">Barrio / Sector</label>
                    <select value={formData.neighborhood} onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))} className="input-field">
                      <option value="">Selecciona tu barrio</option>
                      <option value="centro">Centro</option>
                      <option value="alfonso-lopez">Alfonso López</option>
                      <option value="san-antonio">San Antonio</option>
                      <option value="el-prado">El Prado</option>
                      <option value="la-gaitana">La Gaitana</option>
                      <option value="villa-del-sol">Villa del Sol</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-eco-green/60 mb-2">Dirección completa</label>
                    <input type="text" value={formData.address} onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))} className="input-field" placeholder="Calle 10 # 5-25, Apto 301" />
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-eco-border/20 flex justify-end">
                  <button onClick={handleSave} className="btn-primary">Guardar cambios</button>
                </div>
              </div>

              {/* Notification Preferences */}
              <div className="profile-card card p-6">
                <h3 className="font-display font-semibold text-xl text-white mb-6">Preferencias de notificación</h3>
                <div className="space-y-4">
                  {[
                    { key: 'push', label: 'Notificaciones push', desc: 'Alertas en tiempo real en tu dispositivo', icon: Bell },
                    { key: 'email', label: 'Correo electrónico', desc: 'Resúmenes semanales y alertas importantes', icon: Mail },
                    { key: 'sms', label: 'SMS', desc: 'Solo alertas críticas (cambios de horario urgentes)', icon: MessageSquare },
                    { key: 'routeAlerts', label: 'Alertas de ruta', desc: 'Camión cerca, retrasos, finalizaciones', icon: Truck },
                    { key: 'scheduleChanges', label: 'Cambios de horario', desc: 'Modificaciones en días u horas de recolección', icon: Calendar },
                    { key: 'achievements', label: 'Logros y recompensas', desc: 'Nuevos niveles, logros, ofertas especiales', icon: Award },
                    { key: 'tips', label: 'Tips educativos', desc: 'Consejos de clasificación semanales', icon: Leaf },
                    { key: 'weeklyDigest', label: 'Resumen semanal', desc: 'Tu impacto ambiental y actividad de la semana', icon: BarChart },
                  ].map((pref) => (
                    <SettingToggle key={pref.key} pref={pref} formData={formData} setFormData={setFormData} />
                  ))}
                </div>
              </div>

              {/* Danger Zone */}
              <div className="profile-card card p-6 border-red-500/20 bg-red-500/5">
                <h3 className="font-display font-semibold text-xl text-red-400 mb-4 flex items-center gap-2">
                  <Shield className="w-6 h-6" aria-hidden="true" />
                  Zona de peligro
                </h3>
                <p className="text-eco-green/60 mb-6">Estas acciones son irreversibles</p>
                <div className="flex flex-wrap gap-4">
                  <button className="btn-ghost text-red-400 hover:text-red-300 hover:bg-red-400/10 border border-red-400/30">
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

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === 'eco-neon' ? 'bg-eco-neon/10 border border-eco-neon/20' : color === 'eco-green' ? 'bg-eco-green/10 border border-eco-green/20' : color === 'white' ? 'bg-white/10 border border-white/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
          <Icon className="w-6 h-6" style={{ color: `var(--${color})` }} aria-hidden="true" />
        </div>
        <div>
          <p className="font-display font-bold text-xl text-white">{value}</p>
          <p className="text-xs text-eco-green/60">{label}</p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ activity }) {
  const colors = { 'eco-neon': 'eco-neon', 'eco-green': 'eco-green', 'white': 'white', 'amber': 'amber', 'eco-cyan': 'eco-cyan', 'gray': 'gray' };
  const color = colors[activity.color] || 'eco-green';
  const isPositive = activity.points >= 0;

  return (
    <div className="flex items-center gap-4 p-3 rounded-xl bg-eco-surface/50 border border-eco-border/30 hover:border-eco-neon/20 transition-colors">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color === 'eco-neon' ? 'bg-eco-neon/10 border border-eco-neon/20' : color === 'eco-green' ? 'bg-eco-green/10 border border-eco-green/20' : color === 'white' ? 'bg-white/10 border border-white/20' : color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20' : color === 'eco-cyan' ? 'bg-eco-cyan/10 border border-eco-cyan/20' : 'bg-gray-700/30 border border-gray-600/30'}`}>
        <activity.icon className="w-5 h-5" style={{ color: `var(--${color})` }} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white truncate">{activity.title}</p>
        <p className="text-sm text-eco-green/60 truncate">{activity.detail}</p>
      </div>
      <div className="text-right">
        <p className={`font-semibold ${isPositive ? 'text-eco-neon' : 'text-red-400'}`}>{isPositive ? '+' : ''}{activity.points} pts</p>
        <p className="text-xs text-eco-green/50">{activity.time}</p>
      </div>
    </div>
  );
}

function ActivityRow({ activity }) {
  const colors = { 'eco-neon': 'eco-neon', 'eco-green': 'eco-green', 'white': 'white', 'amber': 'amber', 'eco-cyan': 'eco-cyan', 'gray': 'gray' };
  const color = colors[activity.color] || 'eco-green';
  const isPositive = activity.points >= 0;

  return (
    <tr className="hover:bg-eco-green/5 transition-colors">
      <td className="py-4 px-4 text-eco-green/60">{activity.time}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <activity.icon className="w-4 h-4" style={{ color: `var(--${color})` }} aria-hidden="true" />
          <span className="font-medium text-white">{activity.title}</span>
        </div>
      </td>
      <td className="py-4 px-4 text-eco-green/60">{activity.detail}</td>
      <td className="py-4 px-4 text-right font-semibold" style={{ color: isPositive ? 'var(--eco-neon)' : 'var(--eco-red)' }}>{isPositive ? '+' : ''}{activity.points}</td>
    </tr>
  );
}

function SettingToggle({ pref, formData, setFormData }) {
  const Icon = pref.icon;
  const value = formData.notifications[pref.key];

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-eco-surface/50 border border-eco-border/30">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-eco-neon" aria-hidden="true" />
        </div>
        <div>
          <p className="font-medium text-white">{pref.label}</p>
          <p className="text-xs text-eco-green/50">{pref.desc}</p>
        </div>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => setFormData(prev => ({ ...prev, notifications: { ...prev.notifications, [pref.key]: e.target.checked } }))}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-eco-border/50 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-eco-neon/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-eco-neon"></div>
      </label>
    </div>
  );
}