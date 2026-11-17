import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Crown, Shield, Leaf, Tag, Package, GraduationCap, Truck, CreditCard, TreePine, Trees, Bike, Flame, CalendarCheck, Brain, Droplet, Battery, Users, Rocket, Eye, Sparkles, Lock, CheckCircle, XCircle, ArrowRight, Building, Recycle } from 'lucide-react';
import { rewardLevels, rewardsCatalog, achievements, userStats } from '../data/rewards';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export default function Rewards() {
  const { user, addPoints } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedReward, setSelectedReward] = useState(null);
  const containerRef = useRef(null);

  const tabs = [
    { id: 'catalog', label: 'Catálogo', icon: Package },
    { id: 'levels', label: 'Niveles', icon: Award },
    { id: 'achievements', label: 'Logros', icon: Star },
  ];

  const currentLevel = rewardLevels.find(l => l.id === userStats.currentLevel);
  const nextLevel = rewardLevels.find(l => l.minPoints === currentLevel.maxPoints + 1);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tabBtns = containerRef.current?.querySelectorAll('.tab-btn');
      const rewardCards = containerRef.current?.querySelectorAll('.reward-card');
      const levelCards = containerRef.current?.querySelectorAll('.level-card');
      const achievementCards = containerRef.current?.querySelectorAll('.achievement-card');

      if (tabBtns?.length) {
        gsap.fromTo(tabBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
      }
      if (rewardCards?.length) {
        gsap.fromTo(rewardCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
      if (levelCards?.length) {
        gsap.fromTo(levelCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
      if (achievementCards?.length) {
        gsap.fromTo(achievementCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeTab]);

  const handleRedeem = (reward) => {
    if (userStats.totalPoints >= reward.cost) {
      if (reward.levelRequired && rewardLevels.findIndex(l => l.id === reward.levelRequired) > rewardLevels.findIndex(l => l.id === userStats.currentLevel)) {
        alert(`Necesitas ser nivel ${rewardLevels.find(l => l.id === reward.levelRequired)?.name} para canjear esto`);
        return;
      }
      if (reward.stock !== undefined && reward.stock <= 0) {
        alert('Agotado');
        return;
      }
      setSelectedReward(reward);
    } else {
      alert(`Necesitas ${reward.cost - userStats.totalPoints} puntos más`);
    }
  };

  const confirmRedeem = () => {
    if (selectedReward) {
      addPoints(-selectedReward.cost);
      alert(`¡Canjeado! ${selectedReward.cost} puntos descontados. Revisa tu email para el código.`);
      setSelectedReward(null);
    }
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb-neon w-96 h-96 top-0 right-0 translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
          <div className="glow-orb-amber w-72 h-72 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" style={{ background: 'radial-gradient(circle, #FFD70040 0%, transparent 70%)' }} aria-hidden="true" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="text-center lg:text-left">
                <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider mb-2">Programa de Fidelidad</p>
                <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
                  EcoRecompensas
                </h1>
                <p className="text-eco-green/60 max-w-xl">Canjea tus EcoPuntos por descuentos, experiencias y productos sostenibles</p>
              </div>
              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="text-center lg:text-right">
                  <p className="text-eco-green/50 text-sm">Tus puntos</p>
                  <p className="font-display font-bold text-4xl lg:text-5xl text-eco-neon">{userStats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-eco-neon/10 border border-eco-neon/20">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${currentLevel.color}, ${currentLevel.color}CC)` }}>
                    <currentLevel.icon className="w-5 h-5 text-white" aria-hidden="true" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-white">{currentLevel.name}</p>
                    <p className="text-xs text-eco-green/60">{userStats.pointsToNext.toLocaleString()} pts para {nextLevel?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 max-w-2xl lg:max-w-4xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-eco-green/60">{currentLevel.name} ({currentLevel.minPoints.toLocaleString()} pts)</span>
                <span className="text-eco-neon font-semibold">{userStats.levelProgress}%</span>
                <span className="text-eco-green/60">{nextLevel?.name} ({nextLevel?.minPoints.toLocaleString()} pts)</span>
              </div>
              <div className="h-3 bg-eco-border/30 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${userStats.levelProgress}%`, background: `linear-gradient(90deg, ${currentLevel.color}, ${nextLevel?.color || currentLevel.color})` }} />
              </div>
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
          {/* Catalog Tab */}
          {activeTab === 'catalog' && (
            <div ref={containerRef} className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h2 className="font-display font-semibold text-xl text-white">Catálogo de recompensas</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-eco-green/60">Filtrar:</span>
                  <select className="input-field py-2 px-3 text-sm w-auto bg-eco-bg-light border-eco-border/50">
                    <option value="all">Todas las categorías</option>
                    <option value="discounts">Descuentos</option>
                    <option value="physical">Productos físicos</option>
                    <option value="experience">Experiencias</option>
                    <option value="service">Servicios</option>
                    <option value="impact">Impacto ambiental</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardsCatalog.map((reward) => (
                  <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeem} userLevel={userStats.currentLevel} userPoints={userStats.totalPoints} />
                ))}
              </div>
            </div>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <div ref={containerRef} className="space-y-6">
              <h2 className="font-display font-semibold text-xl text-white mb-4">Niveles de EcoCiudadano</h2>
              <p className="text-eco-green/60 mb-8">Sube de nivel acumulando puntos y desbloquea beneficios exclusivos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardLevels.map((level, i) => (
                  <LevelCard key={level.id} level={level} index={i} isCurrent={level.id === userStats.currentLevel} userPoints={userStats.totalPoints} />
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div ref={containerRef} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-xl text-white">Logros desbloqueados</h2>
                <div className="flex items-center gap-2 text-sm text-eco-green/60">
                  <Star className="w-4 h-4 text-amber-400" aria-hidden="true" />
                  <span>{userStats.achievementsUnlocked}/{userStats.totalAchievements} desbloqueados</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, i) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={i} unlocked={i < userStats.achievementsUnlocked} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats */}
      <section className="section-container pb-16 relative z-10 bg-eco-bg-light/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-xl text-white text-center mb-10">Tu impacto ambiental</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, label: 'CO₂ evitado', value: `${userStats.co2Saved} kg`, color: 'eco-green', desc: 'Equivale a 8 árboles al año' },
              { icon: Recycle, label: 'Residuos reciclados', value: `${userStats.wasteRecycled} kg`, color: 'eco-neon', desc: 'Desviados de relleno sanitario' },
              { icon: TreePine, label: 'Árboles salvados', value: '3.2', color: 'eco-green', desc: 'Basado en papel/cartón reciclado' },
              { icon: Droplet, label: 'Agua ahorrada', value: '1,265 L', color: 'eco-cyan', desc: 'Producción evitada de nuevos materiales' },
            ].map((stat, i) => (
              <div key={i} className="card p-6 text-center">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4`} style={{ background: `var(--${stat.color})20`, borderColor: `var(--${stat.color})40` }}>
                  <stat.icon className="w-7 h-7" style={{ color: `var(--${stat.color})` }} aria-hidden="true" />
                </div>
                <p className="font-display font-bold text-3xl text-white mb-1">{stat.value}</p>
                <p className="text-sm text-eco-green/60">{stat.label}</p>
                <p className="text-xs text-eco-green/40 mt-2">{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redeem Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-eco-bg/90 backdrop-blur-sm" onClick={() => setSelectedReward(null)}>
          <div className="glass-panel rounded-2xl p-6 lg:p-8 max-w-md w-full animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-xl text-white">Confirmar canje</h3>
              <button onClick={() => setSelectedReward(null)} className="btn-ghost p-1"><XCircle className="w-5 h-5" /></button>
            </div>
            <div className="flex items-center gap-4 mb-4 p-4 rounded-xl bg-eco-surface/50 border border-eco-border/30">
              <div className="w-14 h-14 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center flex-shrink-0">
                {selectedReward.icon.className} <selectedReward.icon className="w-7 h-7 text-eco-neon" aria-hidden="true" />
              </div>
              <div>
                <h4 className="font-semibold text-white">{selectedReward.name}</h4>
                <p className="text-sm text-eco-green/60">{selectedReward.description}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl bg-eco-neon/10 border border-eco-neon/20">
              <span className="text-eco-green/60">Costo</span>
              <span className="font-display font-bold text-2xl text-eco-neon">{selectedReward.cost.toLocaleString()} pts</span>
            </div>
            <p className="text-sm text-eco-green/50 mb-6">Tus puntos actuales: <span className="text-white font-medium">{userStats.totalPoints.toLocaleString()}</span>. Quedarás con <span className="text-eco-neon font-bold">{(userStats.totalPoints - selectedReward.cost).toLocaleString()}</span> pts.</p>
            <div className="flex gap-3">
              <button onClick={() => setSelectedReward(null)} className="btn-secondary flex-1">Cancelar</button>
              <button onClick={confirmRedeem} className="btn-primary flex-1">Confirmar canje</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RewardCard({ reward, onRedeem, userLevel, userPoints }) {
  const categoryColors = {
    discounts: 'eco-neon',
    physical: 'eco-green',
    experience: 'eco-cyan',
    service: 'amber',
    impact: 'emerald',
  };
  const color = categoryColors[reward.category] || 'eco-neon';
  const canAfford = userPoints >= reward.cost;
  const levelOk = !reward.levelRequired || rewardLevels.findIndex(l => l.id === reward.levelRequired) <= rewardLevels.findIndex(l => l.id === userLevel);
  const inStock = reward.stock === undefined || reward.stock > 0;
  const available = canAfford && levelOk && inStock;

  const icons = {
    Tag, Package, GraduationCap, Truck, CreditCard, TreePine, Trees, Bike,
  };
  const Icon = icons[reward.icon] || Package;

  return (
    <div className={`reward-card card p-5 relative overflow-hidden group ${available ? 'border-eco-neon/20 hover:border-eco-neon/40' : 'opacity-60'}`}>
      <div className="absolute top-0 right-0 w-24 h-24 bg-eco-neon/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color === 'eco-neon' ? 'bg-eco-neon/10 border border-eco-neon/20' : color === 'eco-green' ? 'bg-eco-green/10 border border-eco-green/20' : color === 'eco-cyan' ? 'bg-eco-cyan/10 border border-eco-cyan/20' : color === 'amber' ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-emerald-500/10 border border-emerald-500/20'}`}>
            <Icon className="w-6 h-6" style={{ color: `var(--${color})` }} aria-hidden="true" />
          </div>
          {reward.popular && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-eco-neon/20 text-eco-neon border border-eco-neon/30">Popular</span>
          )}
        </div>
        <h3 className="font-semibold text-white mb-2">{reward.name}</h3>
        <p className="text-sm text-eco-green/60 mb-4 line-clamp-2">{reward.description}</p>
        <div className="flex items-center gap-2 text-xs text-eco-green/50 mb-4">
          {reward.partner && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {reward.partner}</span>}
          {reward.validUntil && <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {reward.validUntil}</span>}
          {reward.levelRequired && <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Requiere {rewardLevels.find(l => l.id === reward.levelRequired)?.name}</span>}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-eco-border/20">
          <span className="font-display font-bold text-2xl text-eco-neon">{reward.cost.toLocaleString()} pts</span>
          <button
            onClick={() => onRedeem(reward)}
            disabled={!available}
            className={`btn-primary text-sm px-4 py-2 ${!available ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {inStock ? (canAfford ? (levelOk ? 'Canjear' : 'Nivel requerido') : 'Puntos insuficientes') : 'Agotado'}
          </button>
        </div>
        {reward.stock !== undefined && (
          <p className="text-xs text-eco-green/40 mt-2 text-right">Stock: {reward.stock} unidades</p>
        )}
      </div>
    </div>
  );
}

function LevelCard({ level, index, isCurrent, userPoints }) {
  const isUnlocked = userPoints >= level.minPoints;
  const icons = { seedling: Leaf, leaf: Leaf, shield: Shield, star: Star, crown: Crown };
  const Icon = icons[level.icon] || Leaf;

  return (
    <div className={`level-card card p-6 relative ${isCurrent ? 'ring-2 ring-eco-neon/50 bg-eco-neon/5' : isUnlocked ? 'border-eco-green/20' : 'opacity-50'}`}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-eco-neon text-eco-bg text-xs font-bold">Nivel actual</div>
      )}
      <div className="text-center mb-6">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 ${isCurrent ? 'bg-eco-neon/10 border-2 border-eco-neon' : isUnlocked ? 'bg-eco-green/10 border-2 border-eco-green' : 'bg-eco-border/30'}`}>
          <Icon className="w-10 h-10" style={{ color: isCurrent ? 'var(--eco-neon)' : isUnlocked ? 'var(--eco-green)' : 'var(--eco-border)' }} aria-hidden="true" />
        </div>
        <h3 className="font-display font-bold text-xl text-white">{level.name}</h3>
        <p className="text-sm text-eco-green/60 mt-1">{level.minPoints.toLocaleString()} - {level.maxPoints === Infinity ? '∞' : level.maxPoints.toLocaleString()} pts</p>
      </div>
      <div className="space-y-3">
        {level.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm text-eco-green/70">
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: isUnlocked ? 'var(--eco-green)' : 'var(--eco-border)' }} aria-hidden="true" />
            <span className={isUnlocked ? '' : 'line-through'}>{benefit}</span>
          </div>
        ))}
      </div>
      {!isUnlocked && !isCurrent && (
        <div className="mt-4 pt-4 border-t border-eco-border/20 text-center">
          <p className="text-sm text-eco-green/50">Faltan {(level.minPoints - userPoints).toLocaleString()} pts</p>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement, index, unlocked }) {
  const icons = { award: Award, flame: Flame, 'calendar-check': CalendarCheck, brain: Brain, droplet: Droplet, battery: Battery, users: Users, sparkles: Sparkles, rocket: Rocket, eye: Eye };
  const Icon = icons[achievement.icon] || Award;

  return (
    <div className={`achievement-card card p-5 relative overflow-hidden ${unlocked ? '' : 'opacity-40 grayscale'}`}>
      <div className="absolute top-0 right-0 w-20 h-20 bg-amber-400/10 rounded-full blur-xl" aria-hidden="true" />
      <div className="relative z-10">
        <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 ${unlocked ? 'bg-amber-400/10 border-2 border-amber-400' : 'bg-eco-border/30'}`}>
          <Icon className="w-7 h-7" style={{ color: unlocked ? '#FFD700' : 'var(--eco-border)' }} aria-hidden="true" />
        </div>
        <h4 className="font-semibold text-white text-center mb-1">{achievement.name}</h4>
        <p className="text-xs text-eco-green/60 text-center mb-3">{achievement.description}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-display font-bold text-lg" style={{ color: unlocked ? '#FFD700' : 'var(--eco-border)' }}>{achievement.points} pts</span>
          {unlocked ? (
            <CheckCircle className="w-5 h-5 text-eco-green" aria-hidden="true" />
          ) : (
            <Lock className="w-5 h-5 text-eco-border" aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}