import { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Truck, Award, Leaf, MapPin, Users, Target } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: 32, label: 'Ciudadanos registrados', suffix: 'K+', icon: Users },
  { value: 57.5, label: 'Toneladas/día recolectadas', suffix: '', icon: Truck, decimals: true },
  { value: 94, label: 'Tasa de cumplimiento rutas', suffix: '%', icon: Target },
  { value: 1240, label: 'Toneladas CO₂ evitadas/año', suffix: '', icon: Leaf },
];

const features = [
  { icon: MapPin, title: 'Rutas en Tiempo Real', desc: 'Consulta horarios y ubicación del camión recolector en vivo' },
  { icon: Leaf, title: 'Clasificación 2184/2019', desc: 'Guía oficial blanco/verde/negro con ejemplos y tips' },
  { icon: Award, title: 'Puntos por Reciclar', desc: 'Gana EcoPuntos canjeables por descuentos y experiencias' },
  { icon: Users, title: 'Comunidad Activa', desc: 'Reporta, comparte y colabora con tus vecinos' },
];

export default function Hero() {
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const bentoCardRef = useRef(null);

  useGSAP(() => {
    // Hero entrance animation - editorial style, staggered
    gsap.fromTo('.hero-badge',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'var(--ease-out)' }
    );
    gsap.fromTo('.hero-title-line',
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: 'var(--ease-out)', stagger: 0.1, delay: 0.15 }
    );
    gsap.fromTo('.hero-subtitle',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'var(--ease-out)', delay: 0.4 }
    );
    gsap.fromTo('.hero-cta-group',
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'var(--ease-out)', delay: 0.55 }
    );

    // Bento card entrance
    gsap.fromTo('.bento-card',
      { y: 40, opacity: 0, scale: 0.97 },
      { y: 0, opacity: 1, scale: 1, duration: 0.9, ease: 'var(--ease-out)', delay: 0.3 }
    );

    // Stats counter animation
    gsap.fromTo('.stat-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'var(--ease-out)',
        stagger: 0.08,
        delay: 0.7,
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
          once: true,
        }
      }
    );

    // Animate counters when visible
    ScrollTrigger.create({
      trigger: statsRef.current,
      start: 'top 80%',
      onEnter: () => {
        document.querySelectorAll('.stat-value').forEach(el => {
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

    // Features stagger on scroll
    gsap.fromTo('.feature-card',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: 'var(--ease-out)',
        stagger: 0.1,
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 85%',
        },
      }
    );

    // Subtle floating animation for bento card accent elements
    gsap.to('.bento-pulse', {
      scale: 1.05,
      duration: 2,
      ease: 'power2.inOut',
      repeat: -1,
      yoyo: true,
    });
  }, { scope: heroRef });

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--bg-canvas)]">
      {/* Subtle atmospheric elements - editorial personality */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 rounded-full bg-[var(--accent)]/10 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/6 w-72 h-72 rounded-full bg-[var(--accent-lime)]/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[var(--accent)]/5 blur-3xl" />
      </div>

      <div className="section-container relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Main content - editorial layout, asymmetric */}
        <div className="max-w-7xl mx-auto">
          {/* Asymmetric 2-column grid: 7/12 left, 5/12 right */}
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* LEFT COLUMN - 7 cols: Editorial content */}
            <div className="lg:col-span-7">
              {/* Badge - subtle, informative */}
              <div className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] text-sm font-medium mb-10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
                </span>
                <span>Girardot · Sistema Inteligente de Recolección</span>
              </div>

              {/* Title - editorial, large Fraunces, multi-line */}
              <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-[var(--text-primary)] mb-8">
                <span className="hero-title-line block">Gestión Inteligente</span>
                <span className="hero-title-line block bg-gradient-to-r from-[var(--accent)] via-[var(--accent-hover)] to-[var(--accent-sky)] bg-clip-text text-transparent">de Residuos</span>
                <span className="hero-title-line block text-[var(--accent)] text-h1 lg:text-h2 font-normal">para Girardot</span>
              </h1>

              {/* Subtitle - generous, readable */}
              <p className="hero-subtitle text-lg lg:text-xl text-[var(--text-secondary)] max-w-2xl mb-12 leading-relaxed">
                Transforma tu relación con los residuos. Rutas en vivo, clasificación oficial,
                puntos por reciclar y una comunidad que cuida el territorio.
              </p>

              {/* CTAs - primary + secondary */}
              <div className="hero-cta-group flex flex-col sm:flex-row items-center justify-start gap-4 mb-20 lg:mb-24">
                <NavLink to="/app" className="btn-primary btn-lg flex items-center gap-2">
                  <span>Iniciar Mi Ruta</span>
                  <ArrowRight className="w-5 h-5" aria-hidden="true" />
                </NavLink>
                <NavLink to="/waste-guide" className="btn-secondary btn-lg">Guía Oficial 2184</NavLink>
              </div>

              {/* Stats - editorial cards with counter animation */}
              <div ref={statsRef} className="hero-stats grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {stats.map((stat, i) => (
                  <div key={stat.label} className="stat-card card-interactive card-padded text-center group">
                    <stat.icon className="w-7 h-7 lg:w-8 lg:h-8 text-[var(--accent)] mx-auto mb-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                    <div className="stat-value font-display font-bold text-3xl lg:text-4xl text-[var(--text-primary)] mb-1.5"
                         data-target={stat.value}
                         data-suffix={stat.suffix}
                         data-decimals={stat.decimals || false}>
                      0
                    </div>
                    <div className="text-sm text-[var(--text-secondary)] font-medium leading-snug">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Features preview - card grid */}
              <div ref={featuresRef} className="features-preview mt-16">
                <h2 className="font-display font-semibold text-h3 text-[var(--text-primary)] mb-10">Todo lo que necesitas en una app</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                  {features.map((feature, i) => (
                    <div key={feature.title} className="feature-card card-interactive card-padded group">
                      <div className="w-11 h-11 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-center mb-4 group-hover:bg-[var(--bg-surface)] group-hover:border-[var(--border-default)] transition-all duration-200">
                        <feature.icon className="w-5 h-5 text-[var(--accent)]" aria-hidden="true" />
                      </div>
                      <h3 className="font-semibold text-[var(--text-primary)] mb-2 group-hover:text-[var(--accent)] transition-colors">{feature.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{feature.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - 5 cols: Bento/Wallet Interactive Card */}
            <div className="lg:col-span-5">
              <div ref={bentoCardRef} className="bento-card relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#064E3B] via-[#0B132B] to-[#090A0F] border border-white/10 shadow-2xl p-6 lg:p-8">
                {/* Architectural guide lines */}
                <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                  <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                </div>

                {/* Header */}
                <div className="relative z-10 flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[var(--accent-lime)] rounded-full bento-pulse" />
                    <span className="text-white/70 text-sm font-medium">EN VIVO</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/50 text-xs">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full" />
                    <span>Actualizado hace 30s</span>
                  </div>
                </div>

                {/* Main content: Next Truck */}
                <div className="relative z-10 mb-8">
                  <p className="text-white/50 text-xs uppercase tracking-wider font-medium mb-2">Próximo camión en camino</p>
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Truck className="w-7 h-7 text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-xl">ECO-001</p>
                      <p className="text-[var(--accent-lime)] font-medium">En 8 min · Ruta Centro</p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

                {/* EcoPoints & Weekly Progress */}
                <div className="relative z-10 grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/50 text-xs uppercase tracking-wider font-medium mb-1">EcoPuntos acumulados</p>
                    <p className="text-white font-display font-bold text-3xl">1,250</p>
                    <p className="text-[var(--accent-lime)] text-sm mt-1">+150 esta semana</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <p className="text-white/50 text-xs uppercase tracking-wider font-medium mb-3">Progreso semanal</p>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-lime)] rounded-full" style={{ width: '68%' }} />
                    </div>
                    <p className="text-white/60 text-xs mt-2">68% · 17/25 depósitos</p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="relative z-10 grid grid-cols-2 gap-3">
                  <NavLink to="/map" className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl p-4 text-center transition-all duration-200 group">
                    <MapPin className="w-5 h-5 text-white/70 mx-auto mb-2 group-hover:text-[var(--accent-lime)] transition-colors" aria-hidden="true" />
                    <p className="text-white/80 text-sm font-medium">Ver en mapa</p>
                  </NavLink>
                  <NavLink to="/clean-points" className="bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/10 rounded-xl p-4 text-center transition-all duration-200 group">
                    <Leaf className="w-5 h-5 text-white/70 mx-auto mb-2 group-hover:text-[var(--accent-lime)] transition-colors" aria-hidden="true" />
                    <p className="text-white/80 text-sm font-medium">Puntos Limpios</p>
                  </NavLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}