import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Star, Crown, Shield, Leaf, Tag, Package, GraduationCap, Truck, CreditCard, TreePine, Trees, Bike, Flame, CalendarCheck, Brain, Droplet, Battery, Users, Rocket, Eye, Sparkles, Lock, CheckCircle, XCircle, ArrowRight, Building, Recycle } from 'lucide-react';
import { rewardLevels, rewardsCatalog, achievements, userStats } from '../data/rewards';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

// CSS color-mix helpers for opacity on CSS variables
const bg5 = (color) => `color-mix(in srgb, ${color} 5%, transparent)`;
const bg10 = (color) => `color-mix(in srgb, ${color} 10%, transparent)`;
const bg20 = (color) => `color-mix(in srgb, ${color} 20%, transparent)`;
const bg50 = (color) => `color-mix(in srgb, ${color} 50%, transparent)`;

const tabConfig = [
  { id: 'catalog', label: 'Catálogo', icon: Package, accent: 'forest' },
  { id: 'levels', label: 'Niveles', icon: Award, accent: 'amber' },
  { id: 'achievements', label: 'Logros', icon: Star, accent: 'sky' },
];

const categoryIconMap = {
  Tag, Package, GraduationCap, Truck, CreditCard, TreePine, Trees, Bike,
  ShoppingBag: Package,
  Sprout: Leaf,
};

const levelIconMap = { seedling: Leaf, leaf: Leaf, shield: Shield, star: Star, crown: Crown };

export default function Rewards() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { user, addPoints } = useAuth();
  const [activeTab, setActiveTab] = useState('catalog');
  const [selectedReward, setSelectedReward] = useState(null);
  const containerRef = useRef(null);
  const tabBtnsRef = useRef(null);
  const contentCardsRef = useRef(null);

  const currentLevel = rewardLevels.find(l => l.id === userStats.currentLevel);
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
    const contentCards = contentCardsRef.current?.querySelectorAll('.content-card');
    if (contentCards?.length) {
      gsap.fromTo(contentCards,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.08,
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [activeTab] });

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

  const getTabBtnStyle = (accent, isActive, isDark) => {
    if (isActive) {
      return 'bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-sm text-[var(--accent)]';
    }
    return isDark
      ? 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-default)]'
      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-default)]';
  };

  const CurrentLevelIcon = currentLevel?.icon && levelIconMap[currentLevel.icon] ? levelIconMap[currentLevel.icon] : Leaf;

  return (
    <div ref={containerRef} className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header - Achievement Gallery */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[var(--accent-amber)]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent-amber)]/5 blur-3xl" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div className="text-center lg:text-left">
                <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--accent-amber)' }}>Programa de Fidelidad</p>
                <h1 className="font-display font-bold text-display-md lg:text-display-lg mb-4" style={{ color: 'var(--text-primary)' }}>
                  EcoRecompensas
                </h1>
                <p className="text-lg max-w-xl" style={{ color: 'var(--text-secondary)' }}>Canjea tus EcoPuntos por descuentos, experiencias y productos sostenibles</p>
              </div>
              <div className="flex flex-col items-center lg:items-end gap-4">
                <div className="text-center lg:text-right">
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Tus puntos</p>
                  <p className="font-display font-bold text-4xl lg:text-5xl" style={{ color: 'var(--accent-amber)' }}>{userStats.totalPoints.toLocaleString()}</p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl border" style={{ background: bg10('var(--accent-amber)'), borderColor: bg20('var(--accent-amber)') }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: bg20('var(--accent-amber)') }}>
                    <CurrentLevelIcon className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
                  </div>
                  <div className="text-right">
                    <p className="font-semibold" style={{ color: 'var(--text-primary)' }}>{currentLevel?.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{userStats.pointsToNext.toLocaleString()} pts para {nextLevel?.name}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-8 max-w-2xl lg:max-w-4xl mx-auto lg:mx-0">
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: 'var(--text-secondary)' }}>{currentLevel.name} ({currentLevel.minPoints.toLocaleString()} pts)</span>
                <span className="font-semibold" style={{ color: 'var(--accent-amber)' }}>{userStats.levelProgress}%</span>
                <span style={{ color: 'var(--text-secondary)' }}>{nextLevel?.name} ({nextLevel?.minPoints.toLocaleString()} pts)</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--bg-surface)' }}>
                <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${userStats.levelProgress}%`, background: 'linear-gradient(90deg, var(--accent-amber), var(--accent))' }} />
              </div>
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
          {/* Catalog Tab */}
          {activeTab === 'catalog' && (
            <div ref={contentCardsRef} className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
                <h2 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>Catálogo de recompensas</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Filtrar:</span>
                  <select className="input-field py-2 px-3 text-sm w-auto">
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
                  <RewardCard key={reward.id} reward={reward} onRedeem={handleRedeem} userLevel={userStats.currentLevel} userPoints={userStats.totalPoints} isDark={isDark} />
                ))}
              </div>
            </div>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <div ref={contentCardsRef} className="space-y-6">
              <h2 className="font-display font-semibold text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>Niveles de EcoCiudadano</h2>
              <p className="mb-8" style={{ color: 'var(--text-secondary)' }}>Sube de nivel acumulando puntos y desbloquea beneficios exclusivos</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewardLevels.map((level, i) => (
                  <LevelCard key={level.id} level={level} index={i} isCurrent={level.id === userStats.currentLevel} userPoints={userStats.totalPoints} isDark={isDark} />
                ))}
              </div>
            </div>
          )}

          {/* Achievements Tab */}
          {activeTab === 'achievements' && (
            <div ref={contentCardsRef} className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>Logros desbloqueados</h2>
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <Star className="w-4 h-4" style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
                  <span>{userStats.achievementsUnlocked}/{userStats.totalAchievements} desbloqueados</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement, i) => (
                  <AchievementCard key={achievement.id} achievement={achievement} index={i} unlocked={i < userStats.achievementsUnlocked} isDark={isDark} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Impact Stats - Bento Grid */}
      <section className="section-container pb-16 relative z-10" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-h3 text-center mb-10" style={{ color: 'var(--text-primary)' }}>Tu impacto ambiental</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Leaf, label: 'CO₂ evitado', value: `${userStats.co2Saved} kg`, accent: 'forest', desc: 'Equivale a 8 árboles al año' },
              { icon: Recycle, label: 'Residuos reciclados', value: `${userStats.wasteRecycled} kg`, accent: 'amber', desc: 'Desviados de relleno sanitario' },
              { icon: TreePine, label: 'Árboles salvados', value: '3.2', accent: 'forest', desc: 'Basado en papel/cartón reciclado' },
              { icon: Droplet, label: 'Agua ahorrada', value: '1,265 L', accent: 'sky', desc: 'Producción evitada de nuevos materiales' },
            ].map((stat, i) => (
              <div key={i} className="card-interactive card-padded text-center border" style={{ borderColor: 'var(--border-subtle)' }}>
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                  <stat.icon className="w-7 h-7" style={{ color: stat.accent === 'forest' ? 'var(--accent)' : stat.accent === 'amber' ? 'var(--accent-amber)' : 'var(--accent-sky)' }} aria-hidden="true" />
                </div>
                <p className="font-display font-bold text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Redeem Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(9, 10, 15, 0.9)' }} onClick={() => setSelectedReward(null)}>
          <div className="surface-panel rounded-2xl p-6 lg:p-8 max-w-md w-full animate-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-xl" style={{ color: 'var(--text-primary)' }}>Confirmar canje</h3>
              <button onClick={() => setSelectedReward(null)} className="btn-ghost p-1"><XCircle className="w-5 h-5" /></button>
            </div>
            {(() => {
              const iconMap = {
                tag: Tag,
                package: Package,
                'graduation-cap': GraduationCap,
                truck: Truck,
                'credit-card': CreditCard,
                'tree-pine': TreePine,
                trees: Trees,
                bike: Bike,
                'shopping-bag': Package,
                sprout: Leaf,
                leaf: Leaf,
              };
              const ModalIcon = iconMap[selectedReward.icon] || Package;
              return (
                <div className="flex items-center gap-4 mb-4 p-4 rounded-xl border" style={{ background: bg50('var(--bg-elevated)'), borderColor: 'var(--border-subtle)' }}>
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg20('var(--accent-amber)'), borderColor: bg20('var(--accent-amber)') }}>
                    <ModalIcon className="w-7 h-7" style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{selectedReward.name}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{selectedReward.description}</p>
                  </div>
                </div>
              );
            })()}
            <div className="flex items-center justify-between mb-6 p-4 rounded-xl border" style={{ background: bg10('var(--accent-amber)'), borderColor: bg20('var(--accent-amber)') }}>
              <span style={{ color: 'var(--text-secondary)' }}>Costo</span>
              <span className="font-display font-bold text-2xl" style={{ color: 'var(--accent-amber)' }}>{selectedReward.cost.toLocaleString()} pts</span>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Tus puntos actuales: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{userStats.totalPoints.toLocaleString()}</span>. Quedarás con <span className="font-bold" style={{ color: 'var(--accent-amber)' }}>{(userStats.totalPoints - selectedReward.cost).toLocaleString()}</span> pts.</p>
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

function RewardCard({ reward, onRedeem, userLevel, userPoints, isDark }) {
  const categoryColors = {
    discounts: 'amber',
    physical: 'forest',
    experience: 'sky',
    service: 'amber',
    impact: 'forest',
  };
  const color = categoryColors[reward.category] || 'amber';
  const styles = { iconColor: color === 'forest' ? 'var(--accent)' : color === 'amber' ? 'var(--accent-amber)' : 'var(--accent-sky)' };
  const canAfford = userPoints >= reward.cost;
  const levelOk = !reward.levelRequired || rewardLevels.findIndex(l => l.id === reward.levelRequired) <= rewardLevels.findIndex(l => l.id === userLevel);
  const inStock = reward.stock === undefined || reward.stock > 0;
  const available = canAfford && levelOk && inStock;

  const iconKey = reward.icon.charAt(0).toUpperCase() + reward.icon.slice(1).replace('-', '');
  const Icon = categoryIconMap[iconKey] || Package;

  const cardClasses = 'content-card card-interactive card-padded relative overflow-hidden group border ' + (available ? '' : 'opacity-50');
  const borderClass = available ? 'border-amber-200 hover:border-amber-300' : '';

  return (
    <div className={cardClasses} style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'var(--accent-amber)' }} aria-hidden="true" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
            <Icon className="w-6 h-6" style={{ color: styles.iconColor }} aria-hidden="true" />
          </div>
          {reward.popular && (
            <span className="badge text-xs" style={{ background: bg10('var(--accent-amber)'), borderColor: bg20('var(--accent-amber)'), color: 'var(--accent-amber)' }}>Popular</span>
          )}
        </div>
        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{reward.name}</h3>
        <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{reward.description}</p>
        <div className="flex items-center gap-2 text-xs mb-4" style={{ color: 'var(--text-secondary)' }}>
          {reward.partner && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {reward.partner}</span>}
          {reward.validUntil && <span className="flex items-center gap-1"><CalendarCheck className="w-3 h-3" /> {reward.validUntil}</span>}
          {reward.levelRequired && <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Requiere {rewardLevels.find(l => l.id === reward.levelRequired)?.name}</span>}
        </div>
        <div className="flex items-center justify-between pt-4 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
          <span className="font-display font-bold text-2xl" style={{ color: 'var(--accent-amber)' }}>{reward.cost.toLocaleString()} pts</span>
          <button
            onClick={() => onRedeem(reward)}
            disabled={!available}
            className={'btn-primary text-sm px-4 py-2 ' + (!available ? 'opacity-50 cursor-not-allowed' : '')}
          >
            {inStock ? (canAfford ? (levelOk ? 'Canjear' : 'Nivel requerido') : 'Puntos insuficientes') : 'Agotado'}
          </button>
        </div>
        {reward.stock !== undefined && (
          <p className="text-xs text-right mt-2" style={{ color: 'var(--text-muted)' }}>Stock: {reward.stock} unidades</p>
        )}
      </div>
    </div>
  );
}

function LevelCard({ level, index, isCurrent, userPoints, isDark }) {
  const isUnlocked = userPoints >= level.minPoints;
  const Icon = levelIconMap[level.icon] ?? Leaf;

  const borderColor = isCurrent ? 'var(--accent-amber)' : isUnlocked ? bg20('var(--accent)') : 'var(--border-subtle)';
  const bgColor = isCurrent ? bg10('var(--accent-amber)') : isUnlocked ? bg5('var(--accent)') : 'var(--bg-surface)';
  const ringClass = isCurrent ? 'ring-2' : '';
  const unlockedClass = isUnlocked ? '' : 'opacity-50';

  const cardClasses = 'content-card card-interactive card-padded relative border ' + ringClass + ' ' + unlockedClass;

  return (
    <div className={cardClasses} style={{ borderColor, background: bgColor }}>
      {isCurrent && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-white text-xs font-bold" style={{ background: 'var(--accent-amber)' }}>Nivel actual</div>
      )}
      <div className="text-center mb-6">
        {(() => {
          const borderClass = isCurrent ? 'border-amber-200' : isUnlocked ? 'border-forest-200' : 'border-stone-200';
          const bgStyle = isCurrent ? bg10('var(--accent-amber)') : isUnlocked ? bg10('var(--accent)') : 'var(--bg-elevated)';
          const iconColor = isCurrent ? 'var(--accent-amber)' : isUnlocked ? 'var(--accent)' : 'var(--text-muted)';
          return (
            <div className={'w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 ' + borderClass} style={{ background: bgStyle }}>
              <Icon className="w-10 h-10" style={{ color: iconColor }} aria-hidden="true" />
            </div>
          );
        })()}
        <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-primary)' }}>{level.name}</h3>
        <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>{level.minPoints.toLocaleString()} - {level.maxPoints === Infinity ? '∞' : level.maxPoints.toLocaleString()} pts</p>
      </div>
      <div className="space-y-3">
        {level.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2 text-sm" style={{ color: isUnlocked ? 'var(--text-secondary)' : 'var(--text-muted)' }}>
            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: isUnlocked ? 'var(--accent)' : 'var(--text-muted)' }} aria-hidden="true" />
            <span className={isUnlocked ? '' : 'line-through'}>
              {benefit}
              {!isUnlocked && <span className="ml-2 text-xs" style={{ color: 'var(--text-muted)' }}>(bloqueado)</span>}
            </span>
          </div>
        ))}
      </div>
      {!isUnlocked && !isCurrent && (
        <div className="mt-4 pt-4 border-t text-center" style={{ borderColor: 'var(--border-subtle)' }}>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Faltan {(level.minPoints - userPoints).toLocaleString()} pts</p>
        </div>
      )}
    </div>
  );
}

function AchievementCard({ achievement, index, unlocked, isDark }) {
  const Icon = categoryIconMap[achievement.icon] ?? Award;

  const cardClass = 'content-card card-interactive card-padded relative overflow-hidden border ' + (unlocked ? '' : 'opacity-40 grayscale');

  return (
    <div className={cardClass} style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="absolute top-0 right-0 w-20 h-20 rounded-full blur-xl" style={{ background: unlocked ? bg10('var(--accent-amber)') : bg10('var(--text-muted)') }} aria-hidden="true" />
      <div className="relative z-10">
        {(() => {
          const borderClass = unlocked ? 'border-amber-200' : 'border-stone-200';
          const bgStyle = unlocked ? bg10('var(--accent-amber)') : 'var(--bg-elevated)';
          const iconColor = unlocked ? 'var(--accent-amber)' : 'var(--text-muted)';
          return (
            <div className={'w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4 border-2 ' + borderClass} style={{ background: bgStyle }}>
              <Icon className="w-7 h-7" style={{ color: iconColor }} aria-hidden="true" />
            </div>
          );
        })()}
        <h4 className="font-semibold text-center mb-1" style={{ color: 'var(--text-primary)' }}>{achievement.name}</h4>
        <p className="text-xs text-center mb-3" style={{ color: 'var(--text-secondary)' }}>{achievement.description}</p>
        <div className="flex items-center justify-center gap-2">
          <span className="font-display font-bold text-lg" style={{ color: unlocked ? 'var(--accent-amber)' : 'var(--text-muted)' }}>{achievement.points} pts</span>
          {unlocked ? (
            <CheckCircle className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
          ) : (
            <Lock className="w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
          )}
        </div>
      </div>
    </div>
  );
}