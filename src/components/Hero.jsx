import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useEffect, useRef } from 'react';
import { ArrowDown, Leaf, Truck, MapPin, Award, Users, Target } from 'lucide-react';
import { NavLink } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

const stats = [
  { value: '32K+', label: 'Ciudadanos registrados', icon: Users },
  { value: '57.5', label: 'Toneladas/día recolectadas', icon: Truck },
  { value: '94%', label: 'Tasa de cumplimiento rutas', icon: Target },
  { value: '1,240', label: 'Toneladas CO₂ evitadas/año', icon: Leaf },
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
  const scrollIndicatorRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      gsap.fromTo('.hero-title',
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out' }
      );
      gsap.fromTo('.hero-subtitle',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
      gsap.fromTo('.hero-cta-group',
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', delay: 0.4 }
      );
      gsap.fromTo('.hero-stats',
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.6, stagger: 0.1 }
      );

      // Floating orbs animation
      gsap.to('.orb-1', { x: 30, y: -20, rotation: 120, duration: 20, ease: 'none', repeat: -1, yoyo: true });
      gsap.to('.orb-2', { x: -40, y: 30, rotation: -90, duration: 25, ease: 'none', repeat: -1, yoyo: true });
      gsap.to('.orb-3', { x: 20, y: 40, rotation: 180, duration: 30, ease: 'none', repeat: -1, yoyo: true });

      // Scroll indicator bounce
      gsap.to(scrollIndicatorRef.current, {
        y: 10,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      });

      // Stats counter animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          document.querySelectorAll('.stat-value').forEach(el => {
            const target = parseFloat(el.dataset.target);
            const suffix = el.dataset.suffix || '';
            gsap.to(el, {
              innerText: target,
              duration: 2,
              ease: 'power2.out',
              snap: { innerText: 0.1 },
              onUpdate: function() {
                el.innerText = Math.round(this.targets()[0].innerText) + suffix;
              },
            });
          });
        },
        once: true,
      });

      // Features stagger
      gsap.fromTo('.feature-card',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.15,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: 'top 85%',
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb-1 glow-orb-neon w-96 h-96 top-1/4 left-1/4" aria-hidden="true" />
        <div className="orb-2 glow-orb-cyan w-72 h-72 top-1/2 right-1/4" aria-hidden="true" />
        <div className="orb-3 glow-orb-green w-64 h-64 bottom-1/4 left-1/3" aria-hidden="true" />
      </div>

      {/* Hero gradient overlay */}
      <div className="hero-gradient" aria-hidden="true" />

      <div className="section-container relative z-10 pt-20 pb-16 lg:pt-32 lg:pb-24">
        {/* Main content */}
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="hero-badge animate-in stagger-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-eco-neon/10 border border-eco-neon/30 text-eco-neon text-sm font-medium mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-eco-neon opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-eco-neon"></span>
            </span>
            <span>Resolución 2184/2019 · Girardot, Cundinamarca</span>
          </div>

          {/* Title */}
          <h1 className="hero-title font-display font-bold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl leading-[1.05] tracking-tight text-white mb-6">
            Gestión Inteligente
            <br />
            <span className="gradient-text">de Residuos</span>
            <br />
            <span className="text-eco-green/80 text-3xl sm:text-4xl lg:text-5xl font-normal">para Girardot</span>
          </h1>

          {/* Subtitle */}
          <p className="hero-subtitle text-lg sm:text-xl lg:text-2xl text-eco-green/70 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transforma tu relación con los residuos. Rutas en vivo, clasificación oficial,
            puntos por reciclar y una comunidad que cuida el territorio.
          </p>

          {/* CTAs */}
          <div className="hero-cta-group flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <NavLink to="/app" className="btn-primary w-full sm:w-auto">
              <span>Iniciar Mi Ruta</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </NavLink>
            <NavLink to="/waste-guide" className="btn-secondary w-full sm:w-auto">
              <span>Guía Clasificación</span>
            </NavLink>
            <NavLink to="/clean-points" className="btn-ghost w-full sm:w-auto">
              <MapPin className="w-5 h-5" aria-hidden="true" />
              <span>Puntos Limpios</span>
            </NavLink>
          </div>

          {/* Stats */}
          <div ref={statsRef} className="hero-stats grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-16">
            {stats.map((stat, i) => (
              <div key={stat.label} className="stat-card text-center p-6 lg:p-8 glass-panel rounded-2xl group">
                <stat.icon className="w-8 h-8 lg:w-10 lg:h-10 text-eco-neon mx-auto mb-4 transition-transform group-hover:scale-110" aria-hidden="true" />
                <div className="stat-value font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-eco-neon mb-1"
                     data-target={parseFloat(stat.value)}
                     data-suffix={stat.value.includes('K') ? 'K+' : stat.value.includes('%') ? '%' : stat.value.includes(',') ? '' : ''}>
                  0
                </div>
                <div className="text-sm sm:text-base text-eco-green/60 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features preview */}
          <div ref={featuresRef} className="features-preview">
            <h2 className="font-display font-semibold text-xl text-white mb-8">Todo lo que necesitas en una app</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {features.map((feature, i) => (
                <div key={feature.title} className="feature-card card p-6 text-left group">
                  <div className="w-12 h-12 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center mb-4 group-hover:border-eco-neon/50 group-hover:bg-eco-neon/20 transition-colors">
                    <feature.icon className="w-6 h-6 text-eco-neon" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-white mb-2 group-hover:text-eco-neon transition-colors">{feature.title}</h3>
                  <p className="text-sm text-eco-green/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div ref={scrollIndicatorRef} className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-in stagger-6 flex flex-col items-center gap-2 text-eco-green/50" aria-hidden="true">
          <span className="text-xs uppercase tracking-widest font-medium">Descubre más</span>
          <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
        </div>
      </div>
    </section>
  );
}