import { useState, useEffect, useRef, useMemo } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Info, AlertTriangle, Leaf, Recycle, Trash2, Droplet, Battery, Cpu, Building, Truck, Sparkles } from 'lucide-react';
import { wasteCategories, specialWaste } from '../data/wasteClassification';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

const searchItems = wasteCategories.flatMap(cat =>
  cat.examples.map(ex => ({
    category: cat.id,
    categoryName: cat.name,
    item: ex.item,
    details: ex.details,
    color: cat.color,
  }))
).concat(specialWaste.flatMap(sw =>
  sw.items.map(item => ({
    category: 'special',
    categoryName: sw.category,
    item,
    details: `Eliminar en: ${sw.disposal}`,
    color: 'amber',
  }))
));

const categoryIcons = {
  white: Recycle,
  green: Leaf,
  black: Trash2,
  special: AlertTriangle,
};

const categoryAccent = {
  white: 'forest',
  green: 'forest',
  black: 'stone',
  special: 'amber',
};

const allCategories = [
  { id: 'all', label: 'Todos', icon: Sparkles, accent: 'stone' },
  { id: 'white', label: 'Blanco', icon: Recycle, accent: 'forest' },
  { id: 'green', label: 'Verde', icon: Leaf, accent: 'forest' },
  { id: 'black', label: 'Negro', icon: Trash2, accent: 'stone' },
  { id: 'special', label: 'Especiales', icon: AlertTriangle, accent: 'amber' },
];

export default function WasteGuide() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const containerRef = useRef(null);
  const categoryBtnsRef = useRef(null);
  const cardsRef = useRef(null);

  const filteredItems = useMemo(() => {
    return searchItems.filter(item => {
      const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  // GSAP Animations
  useGSAP(() => {
    // Category buttons entrance
    const categoryBtns = categoryBtnsRef.current?.querySelectorAll('.category-btn');
    if (categoryBtns?.length) {
      gsap.fromTo(categoryBtns,
        { y: 16, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.05 }
      );
    }

    // Waste cards entrance
    const wasteCards = cardsRef.current?.querySelectorAll('.waste-card');
    if (wasteCards?.length) {
      gsap.fromTo(wasteCards,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.05,
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [activeCategory, searchQuery] });

  const toggleExpanded = (item) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
  };

  const getCategoryCardStyle = (accent, isActive, isDark) => {
    if (isActive) {
      return 'bg-[var(--bg-elevated)] border-[var(--border-default)] shadow-sm';
    }
    return isDark
      ? 'bg-[var(--bg-surface)]/50 border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]/50 hover:border-[var(--border-default)]'
      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] hover:border-[var(--border-default)]';
  };

  return (
    <div ref={containerRef} className="min-h-screen pb-16 bg-[var(--bg-canvas)]">
      {/* Header - Editorial style */}
      <section className="relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full bg-[var(--accent-amber)]/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-3xl" />
        </div>
        <div className="section-container relative z-10 pt-8 pb-12 lg:pt-16 lg:pb-20">
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-sm font-medium uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>Guía Oficial</p>
            <h1 className="font-display font-bold text-display-md lg:text-display-lg mb-4" style={{ color: 'var(--text-primary)' }}>
              Clasificación de Residuos
              <br />
              <span className="gradient-text">Resolución 2184/2019</span>
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Separa correctamente: Contenedor <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Blanco</span> (Aprovechables),{' '}
              <span className="font-semibold" style={{ color: 'var(--accent)' }}>Verde</span> (Orgánicos) y{' '}
              <span className="font-semibold" style={{ color: 'var(--text-secondary)' }}>Negro</span> (No Aprovechables).
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="surface-panel rounded-2xl p-4 lg:p-6 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
              <input
                type="search"
                placeholder="Busca qué va en cada contenedor... (ej: pilas, aceite, tetrapak, cáscaras)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-4 py-3.5 text-base"
                aria-label="Buscar residuos"
              />
            </div>
            <div ref={categoryBtnsRef} className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                    className={`category-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)] border ${getCategoryCardStyle(cat.accent, isActive, isDark)}`}
                  >
                    <cat.icon className={`w-4 h-4 ${isActive ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} aria-hidden="true" />
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Three Main Containers - Overview Grid */}
          {activeCategory === 'all' && !searchQuery && (
            <div ref={cardsRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {['white', 'green', 'black'].map((catId) => {
                const cat = wasteCategories.find(c => c.id === catId);
                const Icon = categoryIcons[catId];
                const accent = categoryAccent[catId];
                return (
                  <div key={catId} className="waste-card card-interactive card-padded relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10 blur-2xl" style={{ background: 'var(--accent)' }} aria-hidden="true" />
                    <div className="relative z-10">
                      <div className="w-13 h-13 rounded-xl flex items-center justify-center mb-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] group-hover:scale-105 transition-transform duration-200">
                        <Icon className="w-7 h-7" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-bold text-h4 mb-1" style={{ color: 'var(--text-primary)' }}>{cat.name}</h3>
                      <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{cat.subtitle}</p>
                      <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{cat.description}</p>
                      <div className="mt-4 pt-4 border-t space-y-3" style={{ borderColor: 'var(--border-subtle)' }}>
                        {cat.examples.slice(0, 3).map((ex) => (
                          <div key={ex.item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                            <span>{ex.item}</span>
                          </div>
                        ))}
                        <button
                          onClick={() => setActiveCategory(catId)}
                          className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors" style={{ color: 'var(--accent)' }}
                        >
                          Ver todo <ChevronDown className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Detailed Category View */}
          {activeCategory !== 'all' && activeCategory !== 'special' && !searchQuery && (
            <div ref={cardsRef} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-h3" style={{ color: 'var(--text-primary)' }}>
                  {wasteCategories.find(c => c.id === activeCategory)?.name} - Detalle completo
                </h2>
                <button onClick={() => setActiveCategory('all')} className="btn-ghost text-sm">Ver todos</button>
              </div>
              {wasteCategories.find(c => c.id === activeCategory)?.examples.map((ex, i) => (
                <WasteItemCard
                  key={ex.item}
                  item={ex.item}
                  details={ex.details}
                  category={activeCategory}
                  index={i}
                  isExpanded={expandedItems.has(ex.item)}
                  onToggle={() => toggleExpanded(ex.item)}
                  tips={wasteCategories.find(c => c.id === activeCategory)?.tips}
                  stats={wasteCategories.find(c => c.id === activeCategory)?.stats}
                  isDark={isDark}
                />
              ))}
            </div>
          )}

          {/* Special Waste */}
          {activeCategory === 'special' && !searchQuery && (
            <div ref={cardsRef} className="space-y-4">
              <h2 className="font-display font-semibold text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>Residuos Especiales y Peligrosos</h2>
              <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>Estos residuos <strong style={{ color: 'var(--accent-amber)' }}>NUNCA</strong> van en los contenedores comunes. Llévalos a Puntos Limpios.</p>
              {specialWaste.map((sw, i) => (
                <SpecialWasteCard key={sw.category} data={sw} index={i} isDark={isDark} />
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchQuery && (
            <div ref={cardsRef} className="space-y-4">
              <h2 className="font-display font-semibold text-h3 mb-4" style={{ color: 'var(--text-primary)' }}>
                Resultados para "{searchQuery}" ({filteredItems.length})
              </h2>
              {filteredItems.length === 0 ? (
                <div className="card-padded text-center py-12">
                  <Search className="w-10 h-10 mx-auto mb-4" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                  <p style={{ color: 'var(--text-secondary)' }}>No se encontraron resultados. Intenta con otros términos.</p>
                </div>
              ) : (
                filteredItems.map((item, i) => (
                  <SearchResultCard key={`${item.category}-${item.item}-${i}`} item={item} index={i} isDark={isDark} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Key Principles */}
      <section className="section-container pb-16 relative z-10" style={{ background: 'var(--bg-elevated)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-h3 text-center mb-10" style={{ color: 'var(--text-primary)' }}>Principios clave de la separación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Limpio y Seco', desc: 'Lava y seca envases antes de depositarlos. Los residuos sucios contaminan el reciclaje.', accent: 'forest' },
              { icon: Leaf, title: 'Orgánico Separado', desc: 'Los orgánicos en verde generan compost. Mezclados en negro generan metano (25x más CO₂).', accent: 'forest' },
              { icon: AlertTriangle, title: 'Peligrosos Separados', desc: 'Pilas, aceites, medicamentos y electrónicos dañan suelos y aguas. Solo Puntos Limpios.', accent: 'sky' },
            ].map((principle, i) => (
              <div key={i} className="card-interactive card-padded">
                <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-4 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
                  <principle.icon className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                </div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{principle.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function WasteItemCard({ item, details, category, index, isExpanded, onToggle, tips, stats, isDark }) {
  const accent = categoryAccent[category];
  const Icon = categoryIcons[category];

  return (
    <div className="card-interactive overflow-hidden border" style={{ borderColor: 'var(--border-subtle)' }}>
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left"
        aria-expanded={isExpanded}
      >
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <Icon className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>{item}</h3>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{details}</p>
        </div>
        <ChevronDown className="w-5 h-5 transition-transform duration-200" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t animate-in" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Info className="w-4 h-4" aria-hidden="true" />
                Tips clave
              </h4>
              <ul className="space-y-2 text-sm">
                {tips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                    <span style={{ color: 'var(--text-secondary)' }}>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3 flex items-center gap-1" style={{ color: 'var(--accent)' }}>
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Impacto ambiental
              </h4>
              <div className="space-y-2 text-sm">
                {stats && Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {key === 'recoveryRate' ? 'Tasa de recuperación' :
                       key === 'landfillHours' ? 'Degradación en relleno' :
                       key === 'impact' ? 'Impacto ambiental' :
                       key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                    <span className="font-medium" style={{ color: 'var(--accent)' }}>{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SpecialWasteCard({ data, index, isDark }) {
  const icons = { 'alert-triangle': AlertTriangle, 'cpu': Cpu, 'building': Building, 'droplet': Droplet, 'battery': Battery };
  const Icon = icons[data.icon] || AlertTriangle;

  return (
    <div className="special-card card-interactive card-padded border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="flex items-start gap-4">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
          <Icon className="w-5 h-5" style={{ color: 'var(--accent-amber)' }} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{data.category}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.items.map((item) => (
              <span key={item} className="px-2.5 py-1 text-xs rounded border" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--accent-amber)' }}>{item}</span>
            ))}
          </div>
          <p className="text-sm flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            {data.disposal}
          </p>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ item, index, isDark }) {
  const Icon = categoryIcons[item.category] || AlertTriangle;
  const accent = categoryAccent[item.category] || 'amber';

  return (
    <div className="card-padded flex items-center gap-4 animate-in stagger-1 border" style={{ borderColor: 'var(--border-subtle)' }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-[var(--bg-elevated)] border border-[var(--border-subtle)]">
        <Icon className="w-4.5 h-4.5" style={{ color: accent === 'forest' ? 'var(--accent)' : accent === 'stone' ? 'var(--text-secondary)' : 'var(--accent-amber)' }} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.item}</h4>
          <span className="badge text-xs" style={{ background: 'var(--bg-elevated)', borderColor: 'var(--border-subtle)', color: accent === 'forest' ? 'var(--accent)' : accent === 'stone' ? 'var(--text-secondary)' : 'var(--accent-amber)' }}>
            {item.categoryName}
          </span>
        </div>
        <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>{item.details}</p>
      </div>
    </div>
  );
}