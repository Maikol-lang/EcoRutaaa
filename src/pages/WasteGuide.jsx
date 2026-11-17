import { useState, useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, ChevronDown, ChevronUp, CheckCircle, XCircle, Info, AlertTriangle, Leaf, Recycle, Trash2, Droplet, Battery, Cpu, Building, Truck, Sparkles } from 'lucide-react';
import { wasteCategories, specialWaste } from '../data/wasteClassification';

gsap.registerPlugin(ScrollTrigger);

const searchItems = wasteCategories.flatMap(cat =>
  cat.examples.map(ex => ({
    category: cat.id,
    categoryName: cat.name,
    item: ex.item,
    details: ex.details,
    color: cat.color,
    textColor: cat.textColor,
  }))
).concat(specialWaste.flatMap(sw =>
  sw.items.map(item => ({
    category: 'special',
    categoryName: sw.category,
    item,
    details: `Eliminar en: ${sw.disposal}`,
    color: '#F59E0B',
    textColor: '#FFFFFF',
  }))
));

export default function WasteGuide() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedItems, setExpandedItems] = useState(new Set());
  const containerRef = useRef(null);

  const filteredItems = useMemo(() => {
    return searchItems.filter(item => {
      const matchesSearch = item.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.details.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const categories = [
    { id: 'all', label: 'Todos', icon: Sparkles },
    { id: 'white', label: 'Blanco', icon: Recycle, color: 'bg-white/10 border-white/20 text-white' },
    { id: 'green', label: 'Verde', icon: Leaf, color: 'bg-eco-green/10 border-eco-green/20 text-eco-green' },
    { id: 'black', label: 'Negro', icon: Trash2, color: 'bg-gray-900/50 border-gray-700/30 text-gray-300' },
    { id: 'special', label: 'Especiales', icon: AlertTriangle, color: 'bg-amber-500/10 border-amber-500/20 text-amber-400' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const categoryBtns = containerRef.current?.querySelectorAll('.category-btn');
      const wasteCards = containerRef.current?.querySelectorAll('.waste-card');
      const specialCards = containerRef.current?.querySelectorAll('.special-card');

      if (categoryBtns?.length) {
        gsap.fromTo(categoryBtns,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.05 }
        );
      }
      if (wasteCards?.length) {
        gsap.fromTo(wasteCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.05,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
      if (specialCards?.length) {
        gsap.fromTo(specialCards,
          { y: 30, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.08,
            scrollTrigger: { trigger: containerRef.current, start: 'top 85%' }
          }
        );
      }
    }, containerRef);
    return () => ctx.revert();
  }, [activeCategory, searchQuery]);

  const toggleExpanded = (item) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(item)) next.delete(item);
      else next.add(item);
      return next;
    });
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
          <div className="max-w-7xl mx-auto text-center">
            <p className="text-eco-green/60 text-sm font-medium uppercase tracking-wider mb-2">Guía Oficial</p>
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              Clasificación de Residuos
              <br />
              <span className="gradient-text">Resolución 2184/2019</span>
            </h1>
            <p className="text-eco-green/60 max-w-2xl mx-auto text-lg">
              Separa correctamente: Contenedor <span className="font-semibold text-white">Blanco</span> (Aprovechables),
              <span className="font-semibold text-eco-green">Verde</span> (Orgánicos) y
              <span className="font-semibold text-gray-300">Negro</span> (No Aprovechables).
            </p>
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="section-container -mt-6 lg:-mt-8 pb-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="glass-panel rounded-2xl p-4 lg:p-6 mb-6">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
              <input
                type="search"
                placeholder="Busca qué va en cada contenedor... (ej: pilas, aceite, tetrapak, cáscaras)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-field pl-12 pr-4 py-3.5 text-base"
                aria-label="Buscar residuos"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); setSearchQuery(''); }}
                  className={`category-btn flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 border ${
                    activeCategory === cat.id
                      ? `bg-${cat.id === 'white' ? 'white/10' : cat.id === 'green' ? 'eco-green/10' : cat.id === 'black' ? 'gray-900/50' : 'amber-500/10'} border-current text-current shadow-lg shadow-current/20`
                      : cat.color + ' text-eco-green/60 hover:text-white hover:border-current/50'
                  }`}
                >
                  <cat.icon className="w-4 h-4" aria-hidden="true" />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-container pb-16 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Three Main Containers */}
          {activeCategory === 'all' && (
            <div ref={containerRef} className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
              {['white', 'green', 'black'].map((catId) => {
                const cat = wasteCategories.find(c => c.id === catId);
                const Icon = catId === 'white' ? Recycle : catId === 'green' ? Leaf : Trash2;
                return (
                  <div key={catId} className={`waste-card card p-6 relative overflow-hidden group ${catId === 'white' ? 'border-white/20' : catId === 'green' ? 'border-eco-green/20' : 'border-gray-700/30'}`}>
                    <div className="absolute top-0 right-0 w-32 h-32 bg-current/5 rounded-full blur-2xl opacity-20" style={{ '--current': cat.color }} aria-hidden="true" />
                    <div className="relative z-10">
                      <div className={`flex items-center gap-3 mb-4 w-14 h-14 rounded-xl flex items-center justify-center ${catId === 'white' ? 'bg-white/10 border-white/20' : catId === 'green' ? 'bg-eco-green/10 border-eco-green/20' : 'bg-gray-900/50 border-gray-700/30'}`}>
                        <Icon className="w-7 h-7" style={{ color: cat.color }} aria-hidden="true" />
                      </div>
                      <h3 className="font-display font-bold text-xl text-white mb-1">{cat.name}</h3>
                      <p className="text-sm" style={{ color: cat.textColor }} opacity={0.7}>{cat.subtitle}</p>
                      <p className="text-eco-green/50 text-sm mt-4">{cat.description}</p>
                      <div className="mt-6 pt-4 border-t border-current/20 space-y-3" style={{ '--current': cat.color }}>
                        {cat.examples.slice(0, 3).map((ex) => (
                          <div key={ex.item} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: cat.color }} aria-hidden="true" />
                            <span style={{ color: cat.textColor }}>{ex.item}</span>
                          </div>
                        ))}
                        <button
                          onClick={() => setActiveCategory(catId)}
                          className="w-full mt-2 flex items-center justify-center gap-2 text-sm font-medium transition-colors"
                          style={{ color: cat.color }}
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
          {activeCategory !== 'all' && activeCategory !== 'special' && (
            <div ref={containerRef} className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-semibold text-xl text-white">
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
                />
              ))}
            </div>
          )}

          {/* Special Waste */}
          {activeCategory === 'special' && (
            <div ref={containerRef} className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-white mb-4">Residuos Especiales y Peligrosos</h2>
              <p className="text-eco-green/60 mb-6">Estos residuos <strong className="text-amber-400">NUNCA</strong> van en los contenedores comunes. Llévalos a Puntos Limpios.</p>
              {specialWaste.map((sw, i) => (
                <SpecialWasteCard key={sw.category} data={sw} index={i} />
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchQuery && activeCategory === 'all' && (
            <div ref={containerRef} className="space-y-4">
              <h2 className="font-display font-semibold text-xl text-white mb-4">
                Resultados para "{searchQuery}" ({filteredItems.length})
              </h2>
              {filteredItems.length === 0 ? (
                <div className="card p-8 text-center">
                  <Search className="w-12 h-12 text-eco-green/30 mx-auto mb-4" aria-hidden="true" />
                  <p className="text-eco-green/50">No se encontraron resultados. Intenta con otros términos.</p>
                </div>
              ) : (
                filteredItems.map((item, i) => (
                  <SearchResultCard key={`${item.category}-${item.item}-${i}`} item={item} index={i} />
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Key Principles */}
      <section className="section-container pb-16 relative z-10 bg-eco-bg-light/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display font-semibold text-xl text-white text-center mb-10">Principios clave de la separación</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: Sparkles, title: 'Limpio y Seco', desc: 'Lava y seca envases antes de depositarlos. Los residuos sucios contaminan el reciclaje.', color: 'eco-neon' },
              { icon: Leaf, title: 'Orgánico Separado', desc: 'Los orgánicos en verde generan compost. Mezclados en negro generan metano (25x más CO₂).', color: 'eco-green' },
              { icon: AlertTriangle, title: 'Peligrosos Separados', desc: 'Pilas, aceites, medicamentos y electrónicos dañan suelos y aguas. Solo Puntos Limpios.', color: 'eco-cyan' },
            ].map((principle, i) => (
              <div key={i} className="card p-6">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4`} style={{ background: `var(--${principle.color})20`, borderColor: `var(--${principle.color})40` }}>
                  <principle.icon className="w-6 h-6" style={{ color: `var(--${principle.color})` }} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-white mb-2">{principle.title}</h3>
                <p className="text-eco-green/60 text-sm">{principle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function WasteItemCard({ item, details, category, index, isExpanded, onToggle, tips, stats }) {
  const cat = wasteCategories.find(c => c.id === category);
  const Icon = category === 'white' ? Recycle : category === 'green' ? Leaf : Trash2;

  return (
    <div className={`card overflow-hidden ${category === 'white' ? 'border-white/10' : category === 'green' ? 'border-eco-green/10' : 'border-gray-700/20'}`}>
      <button
        onClick={onToggle}
        className="w-full p-5 flex items-center gap-4 text-left"
        aria-expanded={isExpanded}
      >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${category === 'white' ? 'bg-white/10 border-white/20' : category === 'green' ? 'bg-eco-green/10 border-eco-green/20' : 'bg-gray-900/50 border-gray-700/30'}`}>
          <Icon className="w-6 h-6" style={{ color: cat?.color }} aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white">{item}</h3>
          <p className="text-sm text-eco-green/60">{details}</p>
        </div>
        <ChevronDown className={`w-5 h-5 text-eco-green/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {isExpanded && (
        <div className="px-5 pb-5 border-t border-current/10 animate-in" style={{ '--current': cat?.color }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div>
              <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
                <Info className="w-4 h-4" aria-hidden="true" />
                Tips clave
              </h4>
              <ul className="space-y-2 text-sm text-eco-green/70">
                {tips?.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: cat?.color }} aria-hidden="true" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-eco-neon text-sm mb-3 flex items-center gap-1">
                <Sparkles className="w-4 h-4" aria-hidden="true" />
                Impacto ambiental
              </h4>
              <div className="space-y-2 text-sm text-eco-green/70">
                {stats && Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                    <span className="font-medium" style={{ color: cat?.color }}>{value}</span>
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

function SpecialWasteCard({ data, index }) {
  const icons = { 'alert-triangle': AlertTriangle, 'cpu': Cpu, 'building': Building, 'droplet': Droplet, 'battery': Battery };
  const Icon = icons[data.icon] || AlertTriangle;

  return (
    <div className="special-card card p-5 border-amber-500/20 bg-amber-500/5">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-amber-400" aria-hidden="true" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white mb-1">{data.category}</h3>
          <div className="flex flex-wrap gap-2 mb-3">
            {data.items.map((item) => (
              <span key={item} className="px-2 py-1 text-xs rounded bg-amber-500/10 border border-amber-500/20 text-amber-300">{item}</span>
            ))}
          </div>
          <p className="text-sm text-amber-300 flex items-center gap-1">
            <Info className="w-3.5 h-3.5" aria-hidden="true" />
            {data.disposal}
          </p>
        </div>
      </div>
    </div>
  );
}

function SearchResultCard({ item, index }) {
  const cat = wasteCategories.find(c => c.id === item.category);
  const Icon = item.category === 'white' ? Recycle : item.category === 'green' ? Leaf : item.category === 'black' ? Trash2 : AlertTriangle;

  return (
    <div className="card p-4 flex items-center gap-4 animate-in stagger-1">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${item.category === 'white' ? 'bg-white/10 border-white/20' : item.category === 'green' ? 'bg-eco-green/10 border-eco-green/20' : item.category === 'black' ? 'bg-gray-900/50 border-gray-700/30' : 'bg-amber-500/10 border-amber-500/20'}`}>
        <Icon className="w-5 h-5" style={{ color: item.color }} aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-white truncate">{item.item}</h4>
          <span className={`badge text-xs`} style={{ backgroundColor: `${item.color}20`, borderColor: `${item.color}40`, color: item.textColor }}>
            {item.categoryName}
          </span>
        </div>
        <p className="text-sm text-eco-green/60 truncate">{item.details}</p>
      </div>
    </div>
  );
}