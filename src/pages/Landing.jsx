import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import Hero from '../components/Hero';
import { CheckCircle, Truck, MapPin, Leaf, Recycle, Award, Users, Target, Shield, Smartphone, Globe, Zap, ArrowRight, BarChart3, Bell, BookOpen } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const howItWorks = [
  { step: '01', icon: Smartphone, title: 'Descarga y Regístrate', desc: 'Crea tu cuenta en segundos y accede a tu panel personalizado' },
  { step: '02', icon: MapPin, title: 'Encuentra tu Ruta', desc: 'Consulta horarios, frecuencia y ubicación del camión en tiempo real' },
  { step: '03', icon: Recycle, title: 'Clasifica Correctamente', desc: 'Usa la guía oficial 2184/2019: blanco, verde, negro' },
  { step: '04', icon: Award, title: 'Gana EcoPuntos', desc: 'Deposita en Puntos Limpios y acumula puntos canjeables' },
];

const benefits = [
  { icon: Target, title: 'Precisión', desc: 'Rutas optimizadas con GPS, horarios exactos y notificaciones push' },
  { icon: Bell, title: 'Alertas Inteligentes', desc: 'Notificaciones predictivas: cuándo sacar la basura, cambios de ruta, contenedores llenos' },
  { icon: Award, title: 'Recompensas Reales', desc: 'Descuentos en 50+ comercios, talleres, experiencias y más' },
  { icon: Users, title: 'Comunidad', desc: '15K+ vecinos colaborando, reportando y mejorando su barrio' },
  { icon: Shield, title: 'Datos Abiertos', desc: 'Transparencia total: métricas públicas, auditoría ciudadana' },
  { icon: Zap, title: 'Innovación', desc: 'IA para predicción de llenado, rutas dinámicas, contenedores inteligentes' },
];

const testimonials = [
  { name: 'María González', role: 'Vecina, El Prado', text: '"Por fin sé exactamente cuándo pasa el camión. Ya no tengo que dejar la bolsa en la esquina desde la noche anterior."', avatar: 'MG', points: 2340, level: 'Eco Guardián' },
  { name: 'Carlos Mendoza', role: 'Conductor ECO-001', text: '"La app me optimiza la ruta y los vecinos salen a tiempo. Antes perdía 40 min esperando; ahora todo fluye."', avatar: 'CM', points: 0, level: 'Operador' },
  { name: 'Ana Patricia', role: 'Comerciante, Centro', text: '"El aceite usado ya no va al desagüe. Gano puntos, cuido el medio ambiente y mis clientes lo valoran."', avatar: 'AP', points: 4100, level: 'Eco Embajador' },
];

const liveMetrics = [
  { value: 32, label: 'Ciudadanos activos', suffix: 'K+', icon: Users, trend: '+12%' },
  { value: 57.5, label: 'Toneladas/día', suffix: '', icon: Truck, trend: '+8%', decimals: true },
  { value: 94, label: 'Cumplimiento rutas', suffix: '%', icon: Target, trend: '+3%' },
  { value: 1240, label: 'CO₂ evitadas/año', suffix: ' t', icon: Leaf, trend: '+15%' },
];

export default function Landing() {
  const containerRef = useRef(null);
  const howItWorksRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);
  const metricsRef = useRef(null);
  const [activeStep, setActiveStep] = useState(0);

  // Ensure containerRef is set before GSAP runs by using a selector scope
  useGSAP((ctx) => {
    const safeQuery = (selector, scope = containerRef.current) => scope?.querySelector(selector);
    const safeQueryAll = (selector, scope = containerRef.current) => scope?.querySelectorAll(selector);

    // Metrics counter animation
    const metricsEl = safeQuery('.metric-card');
    if (metricsEl && metricsRef.current) {
      gsap.fromTo('.metric-card',
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)', stagger: 0.08,
          scrollTrigger: { trigger: metricsRef.current, start: 'top 85%', once: true }
        }
      );
    }

    if (metricsRef.current) {
      ScrollTrigger.create({
        trigger: metricsRef.current,
        start: 'top 80%',
        onEnter: () => {
          safeQueryAll('.metric-value').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            const decimals = el.dataset.decimals === 'true' ? 1 : 0;
            gsap.to(el, {
              innerText: target,
              duration: 1.6,
              ease: 'power2.out',
              snap: { innerText: decimals ? 0.1 : 1 },
              onUpdate: function() {
                const val = this.targets()[0].innerText;
                el.innerText = decimals ? Number(val).toFixed(1) + suffix : Math.round(val) + suffix;
              },
            });
          });
        },
        once: true,
      });
    }

    // How it works - interactive stepper animation (targets the button elements)
    const howStepsEl = safeQuery('[data-how-step]', howItWorksRef.current);
    if (howStepsEl && howItWorksRef.current) {
      gsap.fromTo('[data-how-step]',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)', stagger: 0.1,
          scrollTrigger: { trigger: howItWorksRef.current, start: 'top 80%' }
        }
      );
    }

    // Benefits - Bento grid animation
    const benefitCardEl = safeQuery('.benefit-card', benefitsRef.current);
    if (benefitCardEl && benefitsRef.current) {
      gsap.fromTo('.benefit-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)', stagger: 0.08,
          scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' }
        }
      );
    }

    // Testimonials animation
    const testimonialCardEl = safeQuery('.testimonial-card', testimonialsRef.current);
    if (testimonialCardEl && testimonialsRef.current) {
      gsap.fromTo('.testimonial-card',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)', stagger: 0.1,
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%' }
        }
      );
    }

    // CTA animation
    const ctaContentEl = safeQuery('.cta-content', ctaRef.current);
    if (ctaContentEl && ctaRef.current) {
      gsap.fromTo('.cta-content',
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'var(--ease-out)',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' }
        }
      );
    }
  }, { scope: containerRef, dependencies: [] });

  return (
    <div ref={containerRef} className="min-h-screen bg-[var(--bg-canvas)]">
      <Hero />

      {/* Executive Metrics Strip - 4 KPIs + Executive Card with CTA */}
      <section ref={metricsRef} className="py-8 lg:py-10 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="section-container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">
            {/* 4 KPIs in 2x2 grid (8 cols) */}
            <div className="lg:col-span-8 grid grid-cols-2 gap-4 lg:gap-6">
              {liveMetrics.map((metric) => (
                <div key={metric.label} className="metric-card card-interactive card-padded relative">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[var(--text-muted)] text-xs uppercase tracking-wider font-medium mb-1">{metric.label}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="metric-value font-display font-bold text-3xl lg:text-4xl text-[var(--text-primary)] tabular-nums"
                             data-target={metric.value}
                             data-suffix={metric.suffix}
                             data-decimals={metric.decimals || false}>
                          0
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 self-start">
                      <metric.icon className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                      <span className="text-[var(--accent)] text-sm font-medium">{metric.trend}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Executive Impact Card + CTA (4 cols) */}
            <div className="lg:col-span-4">
              <div className="card-interactive card-padded h-full bg-gradient-to-br from-[var(--accent)]/5 via-transparent to-[var(--accent-lime)]/5 border border-[var(--accent)]/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                  </div>
                  <span className="badge badge-success">Impacto en Vivo</span>
                </div>
                <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-3">Tu barrio en tiempo real</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6">Métricas actualizadas cada hora: rutas activas, toneladas recuperadas, CO₂ evitado y cumplimiento por sector.</p>
                <NavLink
                  to="/stats"
                  className="btn-primary w-full justify-center group"
                >
                  Explorar estadísticas completas
                  <BarChart3 className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works - Interactive Stepper */}
      <section ref={howItWorksRef} className="py-12 lg:py-16 bg-[var(--bg-canvas)]">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Cómo funciona EcoRuta</h2>
            <p className="section-subtitle">Cuatro pasos simples para transformar tu gestión de residuos y ganar recompensas</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Step Selector - 4 cols */}
            <div className="lg:col-span-4 lg:col-start-1">
              <div className="space-y-3 sticky top-24">
                {howItWorks.map((step, i) => (
                  <button
                    key={step.step}
                    onClick={() => setActiveStep(i)}
                    data-how-step={step.step}
                    className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-[200ms] ease-[var(--ease-out)] ${
                      activeStep === i
                        ? 'border-[var(--accent)] bg-[var(--accent)]/5 text-[var(--text-primary)] shadow-[0_0_0_1px_var(--accent)]'
                        : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent)]/5'
                    }`}>
                    <div className="flex items-center gap-3">
                      <span className="font-display font-bold text-2xl text-[var(--text-muted)]">{step.step}</span>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-[var(--text-primary)]">{step.title}</h3>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5">{step.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step Preview - 8 cols */}
            <div className="lg:col-span-8 lg:col-start-5">
              <div className="relative min-h-[320px]">
                {howItWorks.map((step, i) => (
                  <div
                    key={`preview-${step.step}`}
                    className={`absolute inset-0 transition-all duration-[300ms] ease-[var(--ease-out)] ${
                      activeStep === i ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none -translate-y-4'
                    }`}>
                    <div className="card-interactive card-padded h-full bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                          activeStep === i ? 'bg-[var(--accent)]/10 border border-[var(--accent)]/20' : 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)]'
                        }`}>
                          <step.icon className="w-8 h-8 text-[var(--accent)]" aria-hidden="true" />
                        </div>
                        <div>
                          <span className="font-display font-bold text-3xl text-[var(--text-muted)]">{step.step}</span>
                          <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mt-1">{step.title}</h3>
                        </div>
                      </div>
                      <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8">{step.desc}</p>
                      <div className="flex items-center gap-4 pt-4 border-t border-[var(--border-subtle)]">
                        <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                          <CheckCircle className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                          <span>Disponible en la app</span>
                        </div>
                        <NavLink to={i === 0 ? '/register' : i === 1 ? '/map' : i === 2 ? '/waste-guide' : '/clean-points'}
                          className="btn-primary ml-auto">
                          {i === 0 ? 'Crear cuenta' : i === 1 ? 'Ver mapa en vivo' : i === 2 ? 'Ver guía' : 'Encontrar puntos'}
                        </NavLink>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits - Bento Grid Asimétrico */}
      <section ref={benefitsRef} className="py-12 lg:py-16 bg-[var(--bg-surface)]">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="section-title">Por qué miles eligen EcoRuta</h2>
            <p className="section-subtitle">Resultados medibles, comunidad real, impacto tangible</p>
          </div>

          {/* Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
            {/* Card 1 - Large: Alertas Inteligentes */}
            <div className="lg:col-span-7 lg:row-span-2 benefit-card card-interactive relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-sky)]/5 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20 flex items-center justify-center">
                    <Bell className="w-6 h-6 text-[var(--accent-sky)]" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="badge badge-info">Experiencia Ciudadana</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-display-sm lg:text-display-md text-[var(--text-primary)] mb-4">Alertas Inteligentes de Recolección</h3>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 flex-1">Notificaciones predictivas: cuándo sacar cada contenedor, cambios de ruta por clima o eventos, contenedores próximos a llenarse. Nunca más adivinar horarios.</p>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent-sky)]">30 min</p>
                    <p className="text-sm text-[var(--text-muted)]">Antelación media</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent)]">98%</p>
                    <p className="text-sm text-[var(--text-muted)]">Precisión alertas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent-lime)]">4.1K</p>
                    <p className="text-sm text-[var(--text-muted)]">Activas/día</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 - Medium: Resolución 2184 */}
            <div className="lg:col-span-5 benefit-card card-interactive h-full">
              <div className="h-full p-6 lg:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20 flex items-center justify-center mb-5">
                  <Shield className="w-5 h-5 text-[var(--accent-amber)]" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-3">Guía Interactiva Resolución 2184</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">Única app con la guía oficial del Ministerio de Ambiente: contenedor blanco (aprovechables), verde (orgánicos), negro (no aprovechables). Búsqueda por residuo y escáner.</p>
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--border-subtle)]">
                  <span className="badge badge-warning">Certificado</span>
                  <span className="text-sm text-[var(--text-muted)]">Validado por MADS</span>
                </div>
              </div>
            </div>

            {/* Card 3 - Medium: GPS Radar */}
            <div className="lg:col-span-4 lg:col-start-8 benefit-card card-interactive h-full">
              <div className="h-full p-6 lg:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-sky)]/10 border border-[var(--accent-sky)]/20 flex items-center justify-center mb-5 relative">
                  <Globe className="w-5 h-5 text-[var(--accent-sky)]" aria-hidden="true" />
                  <div className="absolute inset-0 rounded-xl border-2 border-[var(--accent-sky)]/30 animate-ping" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-3">Rastreo GPS en Vivo</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">Camiones con telemetría en tiempo real. Sabes exactamente cuándo pasa, sin esperas innecesarias. 94% cumplimiento de horarios.</p>
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <p className="text-sm text-[var(--text-muted)]">⟳ Actualizado cada 30 segundos</p>
                </div>
              </div>
            </div>

            {/* Card 4 - Large: Rewards & Community */}
            <div className="lg:col-span-8 lg:col-start-1 benefit-card card-interactive relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-amber)]/5 via-transparent to-[var(--accent)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
              <div className="relative z-10 h-full flex flex-col p-8 lg:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[var(--accent-amber)]/10 border border-[var(--accent-amber)]/20 flex items-center justify-center">
                    <Award className="w-6 h-6 text-[var(--accent-amber)]" aria-hidden="true" />
                  </div>
                  <div>
                    <span className="badge badge-warning">Recompensas Reales</span>
                  </div>
                </div>
                <h3 className="font-display font-bold text-display-sm lg:text-display-md text-[var(--text-primary)] mb-4">50+ comercios, talleres y experiencias</h3>
                <p className="text-[var(--text-secondary)] text-lg leading-relaxed mb-8 flex-1">Canjea EcoPuntos por descuentos en supermercados, restaurantes, cursos de compostaje, huertos urbanos y entradas a parques naturales.</p>
                <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-subtle)]">
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent)]">50+</p>
                    <p className="text-sm text-[var(--text-muted)]">Comercios aliados</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent-lime)]">12</p>
                    <p className="text-sm text-[var(--text-muted)]">Categorías</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display font-bold text-2xl text-[var(--accent-sky)]">3.2K</p>
                    <p className="text-sm text-[var(--text-muted)]">Canjes/mes</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 5 - Medium: Open Data */}
            <div className="lg:col-span-4 lg:col-start-9 benefit-card card-interactive h-full">
              <div className="h-full p-6 lg:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-[var(--accent-lime)]/10 border border-[var(--accent-lime)]/20 flex items-center justify-center mb-5">
                  <Target className="w-5 h-5 text-[var(--accent-lime)]" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-3">Datos Abiertos y Transparencia</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">Métricas públicas en tiempo real: rutas, toneladas, cumplimiento, emisiones. Auditoría ciudadana activa con 200+ voluntarios.</p>
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <NavLink to="/map" className="btn-ghost text-sm w-full justify-center">Ver dashboard público</NavLink>
                </div>
              </div>
            </div>

            {/* Card 6 - Medium: Innovation */}
            <div className="lg:col-span-4 lg:col-start-10 benefit-card card-interactive h-full">
              <div className="h-full p-6 lg:p-8 flex flex-col">
                <div className="w-11 h-11 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mb-5">
                  <Zap className="w-5 h-5 text-violet-500" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-3">IA Predictiva</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 flex-1">Predicción de llenado de contenedores, rutas dinámicas según demanda, contenedores inteligentes con sensores IoT.</p>
                <div className="pt-4 border-t border-[var(--border-subtle)]">
                  <span className="badge badge-premium">Beta 2025</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-12 lg:py-16 bg-[var(--bg-canvas)]">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Lo que dice la comunidad</h2>
            <p className="section-subtitle">Historias reales de vecinos que transformaron sus hábitos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card surface-panel card-padded">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center font-display font-bold text-white text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--text-primary)]">{testimonial.name}</p>
                    <p className="text-sm text-[var(--text-secondary)]">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-[var(--text-secondary)] mb-6 leading-relaxed">"{testimonial.text}"</p>
                {testimonial.points > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-[var(--accent)] font-medium">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      {testimonial.points.toLocaleString()} pts
                    </span>
                    <span className="badge bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hover)] to-[var(--accent-sky)] text-white border-transparent">{testimonial.level}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-12 lg:py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--bg-canvas)] via-[var(--bg-surface)] to-[#064E3B]" aria-hidden="true" />
        <div className="absolute inset-0" aria-hidden="true">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[var(--accent)]/10 blur-3xl" />
        </div>
        <div className="section-container relative z-10">
          <div className="cta-content surface-panel rounded-3xl p-8 lg:p-12 xl:p-16 text-center max-w-4xl mx-auto border border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
            <h2 className="font-display font-bold text-display-md lg:text-display-lg text-[var(--text-primary)] mb-4">
              ¿Listo para transformar tu barrio?
            </h2>
            <p className="text-lg lg:text-xl text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto leading-relaxed">
              Únete a 32,000+ ciudadanos de Girardot que ya separan, reciclan y ganan recompensas.
              Tu primer depósito te da 100 EcoPuntos de bienvenida.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/register" className="btn-primary btn-lg w-full sm:w-auto">
                Crear mi cuenta gratis
                <ArrowRight className="w-5 h-5" aria-hidden="true" />
              </NavLink>
              <NavLink to="/waste-guide" className="btn-secondary btn-lg w-full sm:w-auto">
                Ver guía de clasificación
              </NavLink>
            </div>
            <p className="mt-6 text-sm text-[var(--text-muted)]">Sin compromiso · Datos seguros · Cancela cuando quieras</p>
          </div>
        </div>
      </section>
    </div>
  );
}