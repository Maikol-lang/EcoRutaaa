import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, MapPin, Truck, Recycle, Award, Bell, User, LogOut, Settings, Home, BarChart3, Users, Route as RouteIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAuth } from '../context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

export default function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navItems = [
    { path: '/app', label: 'Mi Ruta', icon: RouteIcon, roles: ['citizen', 'admin'] },
    { path: '/map', label: 'Mapa', icon: MapPin, roles: ['citizen', 'admin'] },
    { path: '/waste-guide', label: 'Clasificación', icon: Recycle, roles: ['citizen', 'admin'] },
    { path: '/clean-points', label: 'Puntos Limpios', icon: Leaf, roles: ['citizen', 'admin'] },
    { path: '/rewards', label: 'Recompensas', icon: Award, roles: ['citizen'] },
    { path: '/notifications', label: 'Alertas', icon: Bell, roles: ['citizen'] },
    { path: '/profile', label: 'Perfil', icon: User, roles: ['citizen', 'admin'] },
    { path: '/admin', label: 'Admin', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item =>
    !isAuthenticated || item.roles.includes(user?.role || 'citizen')
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-eco-bg/95 backdrop-blur-md border-b border-eco-border/50 shadow-xl shadow-eco-bg/50' : 'bg-transparent'
      }`}>
        <nav className="section-container" aria-label="Navegación principal">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <NavLink to="/" className="flex items-center gap-2 text-eco-neon" aria-label="EcoRuta - Inicio">
              <div className="relative">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-eco-neon rounded-full animate-pulse-slow"></span>
              </div>
              <span className="font-display font-bold text-xl lg:text-2xl tracking-tight hidden sm:block">EcoRuta</span>
            </NavLink>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-eco-neon/10 text-eco-neon border border-eco-neon/30'
                      : 'text-eco-green/70 hover:text-white hover:bg-eco-green/5'
                    }
                  `}
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  <item.icon className="w-4 h-4" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {isAuthenticated && (
                <>
                  <NavLink
                    to="/notifications"
                    className="relative p-2 rounded-lg text-eco-green/70 hover:text-eco-neon hover:bg-eco-green/10 transition-colors"
                    aria-label="Notificaciones"
                  >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-eco-neon text-eco-bg text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  </NavLink>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-eco-green/10 transition-colors"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      aria-label="Menú de usuario"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-eco-neon to-eco-green flex items-center justify-center">
                        <User className="w-4 h-4 text-eco-bg" aria-hidden="true" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-white">{user?.name || 'Usuario'}</span>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} aria-hidden="true" />
                        <div className="absolute right-0 mt-2 w-48 glass-panel py-2 shadow-2xl z-20 animate-in">
                          <div className="px-4 py-2 border-b border-eco-border/30">
                            <p className="text-sm font-medium text-white">{user?.name}</p>
                            <p className="text-xs text-eco-green/60 capitalize">{user?.role}</p>
                          </div>
                          <NavLink
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-eco-green/80 hover:text-eco-neon hover:bg-eco-green/10 transition-colors"
                          >
                            <User className="w-4 h-4" aria-hidden="true" />
                            Perfil
                          </NavLink>
                          <NavLink
                            to="/rewards"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-eco-green/80 hover:text-eco-neon hover:bg-eco-green/10 transition-colors"
                          >
                            <Award className="w-4 h-4" aria-hidden="true" />
                            Mis Puntos
                          </NavLink>
                          {user?.role === 'admin' && (
                            <NavLink
                              to="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-eco-green/80 hover:text-eco-neon hover:bg-eco-green/10 transition-colors"
                            >
                              <Settings className="w-4 h-4" aria-hidden="true" />
                              Panel Admin
                            </NavLink>
                          )}
                          <hr className="my-2 border-eco-border/30" />
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {!isAuthenticated && (
                <div className="hidden sm:flex items-center gap-2">
                  <NavLink to="/login" className="btn-ghost">Iniciar Sesión</NavLink>
                  <NavLink to="/register" className="btn-primary">Registrarse</NavLink>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-eco-green/70 hover:text-eco-neon hover:bg-eco-green/10 transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          <div
            id="mobile-menu"
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-out ${isMobileMenuOpen ? 'max-h-96 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}
            role="navigation"
            aria-label="Menú móvil"
          >
            <div className="flex flex-col gap-1 pt-2">
              {filteredNavItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-eco-neon/10 text-eco-neon border border-eco-neon/30'
                      : 'text-eco-green/70 hover:text-white hover:bg-eco-green/5'
                    }
                  `}
                  aria-current={({ isActive }) => isActive ? 'page' : undefined}
                >
                  <item.icon className="w-5 h-5" aria-hidden="true" />
                  {item.label}
                </NavLink>
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 px-4 pt-4 border-t border-eco-border/30">
                  <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full justify-center">Iniciar Sesión</NavLink>
                  <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full justify-center">Registrarse</NavLink>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-16 lg:pt-20 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-eco-border/30 bg-eco-bg-light">
        <div className="section-container py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <NavLink to="/" className="flex items-center gap-2 text-eco-neon mb-6" aria-label="EcoRuta - Inicio">
                <div className="relative">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-eco-neon rounded-full animate-pulse-slow"></span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">EcoRuta</span>
              </NavLink>
              <p className="text-eco-green/60 max-w-xs text-base leading-relaxed">
                Plataforma inteligente de gestión de residuos para Girardot, Cundinamarca.
                Transformando la recolección de residuos con tecnología, comunidad y sostenibilidad.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white mb-4">Enlaces Rápidos</h3>
              <nav aria-label="Enlaces rápidos">
                <ul className="space-y-3">
                  {[
                    { path: '/app', label: 'Mi Ruta de Recolección' },
                    { path: '/map', label: 'Mapa Interactivo' },
                    { path: '/waste-guide', label: 'Guía de Clasificación' },
                    { path: '/clean-points', label: 'Puntos Limpios' },
                    { path: '/rewards', label: 'Programa de Recompensas' },
                  ].map((link) => (
                    <li key={link.path}>
                      <NavLink
                        to={link.path}
                        className="text-eco-green/70 hover:text-eco-neon transition-colors text-sm"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div>
              <h3 className="font-display font-semibold text-white mb-4">Contacto</h3>
              <address className="not-italic text-eco-green/60 space-y-3 text-sm">
                <p>📍 Girardot, Cundinamarca, Colombia</p>
                <p>📞 +57 (1) 724 0000</p>
                <p>✉️ ecorta@girardot.gov.co</p>
                <p>🌐 www.girardot-cundinamarca.gov.co</p>
              </address>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-eco-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-eco-green/40 text-sm">
              © 2025 EcoRuta - Alcaldía de Girardot. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-eco-green/60 hover:text-eco-neon transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-eco-green/60 hover:text-eco-neon transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="text-eco-green/60 hover:text-eco-neon transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-eco-green/60 hover:text-eco-neon transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}