import { Outlet, NavLink, useLocation } from 'react-router-dom';
import { Menu, X, Leaf, MapPin, Truck, Recycle, Award, Bell, User, LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const headerRef = useRef(null);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  // Body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
    };
  }, [isMobileMenuOpen]);

  // Header hide/show on scroll (disabled when mobile menu is open)
  useEffect(() => {
    const handleScroll = () => {
      if (isMobileMenuOpen) return;

      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight || 0;

      if (currentScrollY > lastScrollY && currentScrollY > headerHeight) {
        // Scrolling down - hide header
        setIsHeaderHidden(true);
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header
        setIsHeaderHidden(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMobileMenuOpen, lastScrollY]);

  const navItems = [
    { id: 'home', path: '/app', label: 'Inicio', icon: Sun },
    { id: 'my-route', path: '/app', label: 'Mi Ruta', icon: Truck },
    { id: 'map', path: '/map', label: 'Mapa', icon: MapPin },
    { id: 'waste-guide', path: '/waste-guide', label: 'Clasificación', icon: Recycle },
    { id: 'clean-points', path: '/clean-points', label: 'Puntos', icon: Leaf },
    { id: 'rewards', path: '/rewards', label: 'Recompensas', icon: Award },
  ];

  const filteredNavItems = navItems.filter(item =>
    !isAuthenticated || (item.path !== '/rewards' || user?.role === 'citizen')
  );

  const headerTransform = isHeaderHidden && !isMobileMenuOpen
    ? 'translateY(calc(-100% - 2rem))'
    : 'translateY(0)';

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-canvas)] w-full max-w-full overflow-x-hidden">
      {/* Header - Floating Pill Style */}
      <header
        ref={headerRef}
        className="fixed top-4 left-4 right-4 z-50 lg:top-6 lg:left-6 lg:right-6 w-full max-w-full transition-transform duration-300 ease-[var(--ease-out)]"
        style={{ transform: headerTransform }}
      >
        <nav className="section-container w-full" aria-label="Navegación principal">
          <div className="h-16 bg-[var(--bg-canvas)]/80 backdrop-blur-md border border-[var(--border-subtle)] rounded-full flex items-center justify-between px-4 lg:px-6">
            {/* Logo - Left */}
            <NavLink to="/" className="flex items-center gap-2 text-[var(--accent)] shrink-0" aria-label="EcoRuta - Inicio">
              <div className="relative">
                <svg className="w-7 h-7" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                  <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></span>
              </div>
              <span className="font-display font-bold text-base sm:text-lg tracking-tight">EcoRuta</span>
            </NavLink>

            {/* Center - Pill Navigation (Desktop only: lg+) */}
            <div className="hidden lg:flex-1 lg:flex lg:justify-center lg:mx-6">
              <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-full p-1 flex items-center gap-0.5 whitespace-nowrap overflow-x-auto">
                {filteredNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    className={({ isActive }) => `
                      flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-[120ms] ease-[var(--ease-out)]
                      whitespace-nowrap
                      ${isActive
                        ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-sm border border-[var(--border-subtle)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface)]/50'
                      }
                    `}
                    aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-4 h-4" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                aria-label={theme === 'light' ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'}
                aria-pressed={theme === 'dark'}
              >
                {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>

              {isAuthenticated ? (
                <>
                  {/* Notifications with Badge */}
                  <NavLink
                    to="/notifications"
                    className="relative p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                    aria-label="Notificaciones"
                  >
                    <Bell className="w-5 h-5" aria-hidden="true" />
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[var(--accent)] text-white text-xs font-bold rounded-full flex items-center justify-center">3</span>
                  </NavLink>

                  {/* User Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-full hover:bg-[var(--bg-elevated)] transition-colors"
                      aria-expanded={isDropdownOpen}
                      aria-haspopup="true"
                      aria-label="Menú de usuario"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--accent)] to-[var(--accent-hover)] flex items-center justify-center">
                        <User className="w-4 h-4 text-white" aria-hidden="true" />
                      </div>
                      <span className="hidden sm:block text-sm font-medium text-[var(--text-primary)]">{user?.name || 'Usuario'}</span>
                    </button>

                    {isDropdownOpen && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} aria-hidden="true" />
                        <div className="absolute right-0 mt-2 w-56 surface-panel py-2 shadow-xl z-20 animate-in rounded-xl border border-[var(--border-subtle)]">
                          <div className="px-4 py-2 border-b border-[var(--border-subtle)]">
                            <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
                            <p className="text-xs text-[var(--text-secondary)] capitalize">{user?.role}</p>
                          </div>
                          <NavLink
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                          >
                            <User className="w-4 h-4" aria-hidden="true" />
                            Perfil
                          </NavLink>
                          <NavLink
                            to="/rewards"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                          >
                            <Award className="w-4 h-4" aria-hidden="true" />
                            Mis Puntos
                          </NavLink>
                          {user?.role === 'admin' && (
                            <NavLink
                              to="/admin"
                              onClick={() => setIsDropdownOpen(false)}
                              className="flex items-center gap-2 px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                            >
                              <Settings className="w-4 h-4" aria-hidden="true" />
                              Panel Admin
                            </NavLink>
                          )}
                          <hr className="my-2 border-[var(--border-subtle)]" />
                          <button
                            onClick={logout}
                            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-[var(--accent-coral)] hover:text-[var(--accent-coral)] hover:bg-[var(--accent-coral)]/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" aria-hidden="true" />
                            Cerrar Sesión
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="hidden lg:flex items-center gap-2">
                  <NavLink to="/login" className="btn-ghost">Entrar</NavLink>
                  <NavLink to="/register" className="btn-primary">Registrarse</NavLink>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-colors"
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-menu"
                aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Backdrop */}
          {isMobileMenuOpen && (
            <div
              className="lg:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Mobile Menu - Full width, aligned with header */}
          <div
            id="mobile-menu"
            className={`lg:hidden fixed left-4 right-4 top-full z-40 transition-all duration-300 ease-[var(--ease-out)] ${
              isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
            }`}
            role="navigation"
            aria-label="Menú móvil"
          >
            <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl shadow-xl max-h-[calc(100dvh-5.5rem)] overflow-y-auto overscroll-contain">
              <div className="p-4 space-y-1">
                {filteredNavItems.map((item) => (
                  <NavLink
                    key={item.id}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium transition-all duration-[120ms] ease-[var(--ease-out)] min-h-[44px]
                      ${isActive
                        ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)]/20'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
                      }
                    `}
                    aria-current={({ isActive }) => isActive ? 'page' : undefined}
                  >
                    <item.icon className="w-5 h-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                ))}
                {!isAuthenticated && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
                    <NavLink to="/login" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full justify-center min-h-[44px]">Iniciar Sesión</NavLink>
                    <NavLink to="/register" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full justify-center min-h-[44px]">Registrarse</NavLink>
                  </div>
                )}
                {isAuthenticated && (
                  <div className="flex flex-col gap-2 pt-3 border-t border-[var(--border-subtle)]">
                    <NavLink to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="btn-secondary w-full justify-center min-h-[44px]">Mi Perfil</NavLink>
                    <NavLink to="/rewards" onClick={() => setIsMobileMenuOpen(false)} className="btn-primary w-full justify-center min-h-[44px]">Mis Puntos</NavLink>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 pt-24 lg:pt-28 min-h-screen">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)]">
        <div className="section-container py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            <div className="lg:col-span-2">
              <NavLink to="/" className="flex items-center gap-2 text-[var(--accent)] mb-6" aria-label="EcoRuta - Inicio">
                <div className="relative">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                    <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="2"/>
                    <path d="M16 6V16L22 20" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M10 18C10 18 14 14 16 10C18 6 22 8 22 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[var(--accent)] rounded-full animate-pulse"></span>
                </div>
                <span className="font-display font-bold text-2xl tracking-tight">EcoRuta</span>
              </NavLink>
              <p className="text-[var(--text-secondary)] max-w-xs text-base leading-relaxed">
                Plataforma inteligente de gestión de residuos para Girardot, Cundinamarca.
                Transformando la recolección de residuos con tecnología, comunidad y sostenibilidad.
              </p>
            </div>

            <div>
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Enlaces Rápidos</h3>
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
                        className="text-[var(--text-secondary)] hover:text-[var(--accent)] transition-colors text-sm"
                      >
                        {link.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>

            <div>
              <h3 className="font-display font-semibold text-[var(--text-primary)] mb-4">Contacto</h3>
              <address className="not-italic text-[var(--text-secondary)] space-y-3 text-sm">
                <p>📍 Girardot, Cundinamarca, Colombia</p>
                <p>📞 +57 (1) 724 0000</p>
                <p>✉️ ecorta@girardot.gov.co</p>
                <p>🌐 www.girardot-cundinamarca.gov.co</p>
              </address>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[var(--text-muted)] text-sm">
              © 2025 EcoRuta - Alcaldía de Girardot. Todos los derechos reservados.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/></svg>
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="#" className="text-[var(--text-muted)] hover:text-[var(--accent)] transition-colors" aria-label="YouTube">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}