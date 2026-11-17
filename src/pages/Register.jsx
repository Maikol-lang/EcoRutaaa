import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Leaf, Eye, EyeOff, Mail, Lock, User, Truck, MapPin, Award, Recycle, ArrowRight, CheckCircle, AlertCircle, Shield } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    neighborhood: '',
    acceptTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const neighborhoods = [
    'Centro Histórico', 'El Carmelo', 'San Antonio', 'La Gaitana', 'María Auxiliadora',
    'Alfonso López', 'Ciudadela La Paz', 'El Porvenir', 'La Tribuna', 'San Pedro',
    'Otro', 'No vivo en Girardot'
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      const registerCard = containerRef.current?.querySelector('.register-card');
      const headerItems = containerRef.current?.querySelectorAll('.register-header > *');
      const formGroups = containerRef.current?.querySelectorAll('.form-group');
      const registerFooter = containerRef.current?.querySelector('.register-footer');

      if (registerCard) {
        gsap.fromTo(registerCard, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' });
      }
      if (headerItems?.length) {
        gsap.fromTo(headerItems, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1, delay: 0.1 });
      }
      if (formGroups?.length) {
        gsap.fromTo(formGroups, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.2 });
      }
      if (registerFooter) {
        gsap.fromTo(registerFooter, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'power3.out', delay: 0.4 });
      }
    }, containerRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    let strength = 0;
    if (formData.password.length >= 8) strength++;
    if (/[A-Z]/.test(formData.password)) strength++;
    if (/[a-z]/.test(formData.password)) strength++;
    if (/[0-9]/.test(formData.password)) strength++;
    if (/[^A-Za-z0-9]/.test(formData.password)) strength++;
    setPasswordStrength(strength);
  }, [formData.password]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    else if (formData.name.trim().length < 2) newErrors.name = 'Mínimo 2 caracteres';
    if (!formData.email) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Correo inválido';
    if (!formData.password) newErrors.password = 'La contraseña es obligatoria';
    else if (formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';
    if (!formData.neighborhood) newErrors.neighborhood = 'Selecciona tu barrio';
    if (!formData.acceptTerms) newErrors.acceptTerms = 'Debes aceptar los términos';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = register(
      formData.name.trim(),
      formData.email,
      formData.password,
      formData.neighborhood
    );
    setIsLoading(false);

    if (success) {
      navigate('/app');
    } else {
      setErrors({ form: 'Este correo ya está registrado' });
    }
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 1) return 'bg-red-500';
    if (passwordStrength <= 2) return 'bg-amber-500';
    if (passwordStrength <= 3) return 'bg-eco-cyan';
    if (passwordStrength <= 4) return 'bg-eco-green';
    return 'bg-eco-neon';
  };

  const getStrengthLabel = () => {
    const labels = ['Muy débil', 'Débil', 'Regular', 'Buena', 'Fuerte', 'Muy fuerte'];
    return labels[passwordStrength] || '';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-eco-bg relative overflow-hidden p-4" ref={containerRef}>
      {/* Background orbs */}
      <div className="absolute inset-0" aria-hidden="true">
        <div className="glow-orb-neon w-96 h-96 top-0 right-0 translate-x-1/2 -translate-y-1/2" />
        <div className="glow-orb-green w-72 h-72 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-6">
          <NavLink to="/" className="inline-flex items-center gap-2 text-eco-neon" aria-label="EcoRuta - Inicio">
            <div className="relative">
              <svg className="w-10 h-10" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-eco-neon rounded-full animate-pulse-slow" />
            </div>
            <span className="font-display font-bold text-2xl">EcoRuta</span>
          </NavLink>
        </div>

        {/* Register Card */}
        <div className="register-card card p-6 lg:p-8">
          <div className="register-header text-center mb-8">
            <h1 className="font-display font-bold text-2xl lg:text-3xl text-white mb-2">Crear Cuenta</h1>
            <p className="text-eco-green/60">Únete a la comunidad EcoRuta y gana por reciclar</p>
          </div>

          {errors.form && (
            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-2" role="alert">
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name" className="block text-sm font-medium text-white mb-2">Nombre Completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`input-field pl-12 pr-4 py-3.5 ${errors.name ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="Juan Pérez"
                  aria-invalid={errors.name ? 'true' : 'false'}
                  aria-describedby={errors.name ? 'name-error' : undefined}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p id="name-error" className="mt-1.5 text-sm text-red-400" role="alert">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`input-field pl-12 pr-4 py-3.5 ${errors.email ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="tu@correo.com"
                  aria-invalid={errors.email ? 'true' : 'false'}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p id="email-error" className="mt-1.5 text-sm text-red-400" role="alert">{errors.email}</p>}
            </div>

            {/* Neighborhood */}
            <div className="form-group">
              <label htmlFor="neighborhood" className="block text-sm font-medium text-white mb-2">Barrio / Sector</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
                <select
                  id="neighborhood"
                  name="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`input-field pl-12 pr-10 py-3.5 appearance-none ${errors.neighborhood ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  aria-invalid={errors.neighborhood ? 'true' : 'false'}
                  aria-describedby={errors.neighborhood ? 'neighborhood-error' : undefined}
                  disabled={isLoading}
                >
                  <option value="">Selecciona tu barrio</option>
                  {neighborhoods.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-eco-green/50 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
              {errors.neighborhood && <p id="neighborhood-error" className="mt-1.5 text-sm text-red-400" role="alert">{errors.neighborhood}</p>}
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`input-field pl-12 pr-12 py-3.5 ${errors.password ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="••••••••"
                  aria-invalid={errors.password ? 'true' : 'false'}
                  aria-describedby={errors.password ? 'password-error' : undefined}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-eco-green/50 hover:text-eco-neon transition-colors"
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p id="password-error" className="mt-1.5 text-sm text-red-400" role="alert">{errors.password}</p>}

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2" role="progressbar" aria-valuenow={passwordStrength} aria-valuemin={0} aria-valuemax={5} aria-label="Fortaleza de contraseña">
                  <div className="flex gap-1 h-1.5">
                    {[1,2,3,4,5].map((level) => (
                      <div
                        key={level}
                        className={`flex-1 rounded transition-colors ${level <= passwordStrength ? getStrengthColor() : 'bg-eco-border/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-eco-green/50 mt-1 text-right">{getStrengthLabel()}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eco-green/50" aria-hidden="true" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  onBlur={() => validateForm()}
                  className={`input-field pl-12 pr-12 py-3.5 ${errors.confirmPassword ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''}`}
                  placeholder="••••••••"
                  aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                  aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-eco-green/50 hover:text-eco-neon transition-colors"
                  aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  aria-pressed={showConfirmPassword}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && <p id="confirmPassword-error" className="mt-1.5 text-sm text-red-400" role="alert">{errors.confirmPassword}</p>}
            </div>

            {/* Terms */}
            <div className="form-group">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.acceptTerms}
                  onChange={(e) => setFormData(prev => ({ ...prev, acceptTerms: e.target.checked }))}
                  className="w-4 h-4 mt-0.5 accent-eco-neon rounded border-eco-border/50 bg-eco-surface flex-shrink-0"
                  aria-invalid={errors.acceptTerms ? 'true' : 'false'}
                  aria-describedby={errors.acceptTerms ? 'terms-error' : undefined}
                  disabled={isLoading}
                />
                <div className="text-sm text-eco-green/70 leading-relaxed">
                  Acepto los <NavLink to="/terms" className="text-eco-neon hover:text-eco-green underline">Términos y Condiciones</NavLink> y la
                  <NavLink to="/privacy" className="text-eco-neon hover:text-eco-green underline">Política de Privacidad</NavLink>.
                  Autorizo el tratamiento de mis datos para la gestión de residuos según la Ley 1581/2012.
                </div>
              </label>
              {errors.acceptTerms && <p id="terms-error" className="mt-1.5 text-sm text-red-400 ml-7" role="alert">{errors.acceptTerms}</p>}
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
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="register-footer text-center mt-6">
            <p className="text-eco-green/60 text-sm">
              ¿Ya tienes cuenta?{' '}
              <NavLink to="/login" className="text-eco-neon hover:text-eco-green font-medium transition-colors">
                Inicia sesión
              </NavLink>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-6 glass-panel rounded-2xl p-6 animate-in">
          <h3 className="font-semibold text-white text-center mb-4 flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-eco-neon" aria-hidden="true" />
            Lo que obtienes al registrarte
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            {[
              { icon: Truck, title: 'Rutas en Vivo', desc: 'Camiones en tiempo real' },
              { icon: MapPin, title: 'Puntos Limpios', desc: 'Cercanos a tu barrio' },
              { icon: Award, title: 'EcoPuntos', desc: 'Canjeables por premios' },
              { icon: Recycle, title: 'Guía Oficial', desc: 'Resolución 2184/2019' },
            ].map((benefit, i) => (
              <div key={i} className="p-3 rounded-lg bg-eco-surface/50 border border-eco-border/30 text-center">
                <benefit.icon className="w-6 h-6 text-eco-neon mx-auto mb-2" aria-hidden="true" />
                <p className="font-medium text-white">{benefit.title}</p>
                <p className="text-xs text-eco-green/60 mt-0.5">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}