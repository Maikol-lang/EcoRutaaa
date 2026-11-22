import { useState, useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Truck, MapPin, Award, Recycle, ArrowRight, CheckCircle } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

gsap.registerPlugin(ScrollTrigger);

export default function Login() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const { login } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // GSAP Animations with useGSAP
  useGSAP(() => {
    const loginCard = containerRef.current?.querySelector('.login-card');
    const headerItems = containerRef.current?.querySelectorAll('.login-header > *');
    const formGroups = containerRef.current?.querySelectorAll('.form-group');
    const loginFooter = containerRef.current?.querySelector('.login-footer');
    const benefitItems = containerRef.current?.querySelectorAll('.benefits-list li');

    if (loginCard) {
      gsap.fromTo(loginCard, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'var(--ease-out)' });
    }
    if (headerItems?.length) {
      gsap.fromTo(headerItems, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.1, delay: 0.1 });
    }
    if (formGroups?.length) {
      gsap.fromTo(formGroups, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', stagger: 0.08, delay: 0.2 });
    }
    if (loginFooter) {
      gsap.fromTo(loginFooter, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'var(--ease-out)', delay: 0.4 });
    }
    if (benefitItems?.length) {
      gsap.fromTo(benefitItems, { x: -20, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'var(--ease-out)', stagger: 0.06, delay: 0.5 });
    }
  }, { scope: containerRef });

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = login(formData.email, formData.password);
    setIsLoading(false);

    if (success) {
      navigate('/app');
    } else {
      setErrors({ form: 'Credenciales incorrectas. Usa demo@ecoruta.co / demo123' });
    }
  };

  const handleDemoLogin = () => {
    setFormData({ email: 'demo@ecoruta.co', password: 'demo123' });
    handleSubmit(new Event('submit'));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-canvas)] relative overflow-hidden p-4" ref={containerRef}>
      {/* Background orbs - editorial personality */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-3xl" style={{ background: 'var(--accent)/0.1' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <NavLink to="/" className="inline-flex items-center gap-2" style={{ color: 'var(--accent)' }} aria-label="EcoRuta - Inicio">
            <div className="relative">
              <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute -bottom-1 -right-1 w-2 h-2 rounded-full animate-pulse-slow" style={{ background: 'var(--accent)' }} />
            </div>
            <span className="font-display font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>EcoRuta</span>
          </NavLink>
        </div>

        {/* Login Card */}
        <div className="login-card surface-panel rounded-2xl p-6 lg:p-8">
          <div className="login-header text-center mb-8">
            <h1 className="font-display font-bold text-2xl lg:text-3xl mb-2" style={{ color: 'var(--text-primary)' }}>Iniciar Sesión</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Accede a tu cuenta para gestionar tus residuos</p>
          </div>

          {errors.form && (
            <div className="mb-6 p-3 rounded-lg text-sm" role="alert" style={{ background: 'var(--accent-coral)/10', borderColor: 'var(--accent-coral)/20', borderWidth: '1px', borderStyle: 'solid', color: 'var(--accent-coral)' }}>
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium mb-2" style={{ color: 'var(--text-primary)' }}>Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onBlur={validateForm}
                  className={`input-field pl-12 pr-4 py-3.5 ${errors.email ? 'border-[var(--accent-coral)]/50 focus:border-[var(--accent-coral)] focus:ring-[var(--accent-coral)]/20' : ''}`}
                  placeholder="tu@correo.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p id="email-error" className="mt-1.5 text-sm" role="alert" style={{ color: 'var(--accent-coral)' }}>{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Contraseña</label>
                <NavLink to="/forgot-password" className="text-xs transition-colors" style={{ color: 'var(--accent)' }}>
                  ¿Olvidaste?
                </NavLink>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--text-muted)' }} aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  onBlur={validateForm}
                  className={`input-field pl-12 pr-12 py-3.5 ${errors.password ? 'border-[var(--accent-coral)]/50 focus:border-[var(--accent-coral)] focus:ring-[var(--accent-coral)]/20' : ''}`}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-1.5 text-sm" role="alert" style={{ color: 'var(--accent-coral)' }}>{errors.password}</p>}
            </div>

            {/* Remember me */}
            <div className="form-group flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border"
                  style={{ accentColor: 'var(--accent)', borderColor: 'var(--border-default)', backgroundColor: 'var(--bg-surface)' }}
                  aria-label="Recordarme"
                />
                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Recordarme</span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-base justify-center group"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-current" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Demo Login */}
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={isLoading}
            className="btn-secondary w-full py-3 justify-center mt-4"
          >
            <CheckCircle className="w-5 h-5 mr-2" aria-hidden="true" />
            Entrar como Demo (demo@ecoruta.co)
          </button>

          {/* Footer */}
          <div className="login-footer text-center mt-6">
            <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              ¿No tienes cuenta?{' '}
              <NavLink to="/register" className="font-medium transition-colors" style={{ color: 'var(--accent)' }}>
                Regístrate gratis
              </NavLink>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 surface-panel rounded-2xl p-6 animate-in">
          <h3 className="font-semibold text-center mb-4 flex items-center justify-center gap-2" style={{ color: 'var(--text-primary)' }}>
            <Leaf className="w-5 h-5" style={{ color: 'var(--accent)' }} aria-hidden="true" />
            ¿Por qué EcoRuta?
          </h3>
          <ul className="benefits-list space-y-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            {[
              { icon: Truck, text: 'Rutas de recolección en tiempo real' },
              { icon: MapPin, text: 'Puntos Limpios cercanos con recompensas' },
              { icon: Award, text: 'Gana EcoPuntos por separar correctamente' },
              { icon: Recycle, text: 'Guía oficial Resolución 2184/2019' },
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-3">
                <benefit.icon className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent)' }} aria-hidden="true" />
                <span>{benefit.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}