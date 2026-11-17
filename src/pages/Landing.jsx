import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { NavLink } from 'react-router-dom';
import Hero from '../components/Hero';
import { Truck, MapPin, Leaf, Recycle, Award, Users, Target, Shield, Smartphone, Globe, Zap } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const howItWorks = [
  { step: '01', icon: Smartphone, title: 'Descarga y Regístrate', desc: 'Crea tu cuenta en segundos y accede a tu panel personalizado' },
  { step: '02', icon: MapPin, title: 'Encuentra tu Ruta', desc: 'Consulta horarios, frecuencia y ubicación del camión en tiempo real' },
  { step: '03', icon: Recycle, title: 'Clasifica Correctamente', desc: 'Usa la guía oficial 2184/2019: blanco, verde, negro' },
  { step: '04', icon: Award, title: 'Gana EcoPuntos', desc: 'Deposita en Puntos Limpios y acumula puntos canjeables' },
];

const benefits = [
  { icon: Target, title: 'Precisión', desc: 'Rutas optimizadas con GPS, horarios exactos y notificaciones push' },
  { icon: Leaf, title: 'Sostenibilidad', desc: 'Reduce tu huella de carbono: 187 kg CO₂ ahorrados por usuario al año' },
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

export default function Landing() {
  const howItWorksRef = useRef(null);
  const benefitsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // How it works animation
      gsap.fromTo('.how-step',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: howItWorksRef.current, start: 'top 80%' }
        }
      );

      // Benefits animation
      gsap.fromTo('.benefit-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.1,
          scrollTrigger: { trigger: benefitsRef.current, start: 'top 80%' }
        }
      );

      // Testimonials animation
      gsap.fromTo('.testimonial-card',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', stagger: 0.15,
          scrollTrigger: { trigger: testimonialsRef.current, start: 'top 80%' }
        }
      );

      // CTA animation
      gsap.fromTo('.cta-content',
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1, ease: 'power3.out',
          scrollTrigger: { trigger: ctaRef.current, start: 'top 85%' }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      <Hero />

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 lg:py-28 bg-eco-bg-light/50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Cómo funciona EcoRuta</h2>
            <p className="section-subtitle">Cuatro pasos simples para transformar tu gestión de residuos y ganar recompensas</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howItWorks.map((step, i) => (
              <div key={step.step} className="how-step card p-6 lg:p-8 relative group">
                <div className="absolute top-6 right-6 font-display font-bold text-4xl lg:text-5xl text-eco-neon/10">{step.step}</div>
                <div className="relative z-10">
                  <div className="w-14 h-14 rounded-xl bg-eco-neon/10 border border-eco-neon/20 flex items-center justify-center mb-6 group-hover:border-eco-neon/50 group-hover:bg-eco-neon/20 transition-colors">
                    <step.icon className="w-7 h-7 text-eco-neon" aria-hidden="true" />
                  </div>
                  <h3 className="font-display font-semibold text-xl text-white mb-3">{step.title}</h3>
                  <p className="text-eco-green/60">{step.desc}</p>
                </div>
                {i < 3 && (
                  <div className="absolute top-14 right-0 w-4 h-4 border-t-2 border-r-2 border-eco-neon/20 hidden lg:block" aria-hidden="true" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="py-20 lg:py-28">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Por qué miles eligen EcoRuta</h2>
            <p className="section-subtitle">Resultados medibles, comunidad real, impacto tangible</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="benefit-card card p-6 lg:p-8 hover:scale-[1.02] transition-transform duration-300">
                <div className="w-12 h-12 rounded-xl bg-eco-green/10 border border-eco-green/20 flex items-center justify-center mb-5">
                  <benefit.icon className="w-6 h-6 text-eco-green" aria-hidden="true" />
                </div>
                <h3 className="font-display font-semibold text-xl text-white mb-3">{benefit.title}</h3>
                <p className="text-eco-green/60">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section ref={testimonialsRef} className="py-20 lg:py-28 bg-eco-bg-light/50">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="section-title">Lo que dice la comunidad</h2>
            <p className="section-subtitle">Historias reales de vecinos que transformaron sus hábitos</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="testimonial-card card-elevated p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-eco-neon to-eco-green flex items-center justify-center font-display font-bold text-eco-bg text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-eco-green/60">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-eco-green/80 mb-6 italic">"{testimonial.text}"</p>
                {testimonial.points > 0 && (
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1 text-eco-neon">
                      <Award className="w-4 h-4" aria-hidden="true" />
                      {testimonial.points.toLocaleString()} pts
                    </span>
                    <span className="badge">{testimonial.level}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section ref={ctaRef} className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="glow-orb-neon w-96 h-96 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" aria-hidden="true" />
        </div>
        <div className="section-container relative z-10">
          <div className="cta-content glass-panel rounded-3xl p-8 lg:p-12 xl:p-16 text-center max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-4">
              ¿Listo para transformar tu barrio?
            </h2>
            <p className="text-lg sm:text-xl text-eco-green/70 mb-8 max-w-2xl mx-auto">
              Únete a 32,000+ ciudadanos de Girardot que ya separan, reciclan y ganan recompensas.
              Tu primer depósito te da 100 EcoPuntos de bienvenida.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <NavLink to="/register" className="btn-primary w-full sm:w-auto text-lg px-8 py-4">
                Crear mi cuenta gratis
              </NavLink>
              <NavLink to="/waste-guide" className="btn-secondary w-full sm:w-auto text-lg px-8 py-4">
                Ver guía de clasificación
              </NavLink>
            </div>
            <p className="mt-6 text-sm text-eco-green/50">Sin compromiso · Datos seguros · Cancela cuando quieras</p>
          </div>
        </div>
      </section>
    </div>
  );
}