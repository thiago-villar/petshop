import React from 'react';
import { Toaster } from 'sonner';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, PawPrint, LogOut, Instagram, Twitter, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

export function Navbar({ session }: { session: any }) {
  const location = useLocation();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const { itemCount } = useCart();

  React.useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  React.useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
      scrolled || mobileMenuOpen ? "bg-white border-b border-gray-100 py-3" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="p-2 bg-orange-500 rounded-xl text-white group-hover:rotate-12 transition-transform">
            <PawPrint size={24} />
          </div>
          <span className={cn(
            "text-2xl font-bold tracking-tight transition-colors",
            scrolled || mobileMenuOpen ? "text-gray-900" : "text-gray-900 md:text-white"
          )}>Jakka</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 font-medium">
          <Link to="/" className={cn("transition-colors", scrolled ? "text-gray-600 hover:text-orange-500" : "text-white/80 hover:text-white")}>Inicio</Link>
          <Link to="/catalog" className={cn("transition-colors", scrolled ? "text-gray-600 hover:text-orange-500" : "text-white/80 hover:text-white")}>Tienda</Link>
          <Link to="/about" className={cn("transition-colors", scrolled ? "text-gray-600 hover:text-orange-500" : "text-white/80 hover:text-white")}>Nosotros</Link>
          <Link to="/contact" className={cn("transition-colors", scrolled ? "text-gray-600 hover:text-orange-500" : "text-white/80 hover:text-white")}>Contacto</Link>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            className={cn("p-2 transition-colors", scrolled ? "text-gray-500 hover:text-orange-500" : "text-white/70 hover:text-white")} 
            onClick={() => {
                const query = prompt('¿Qué buscas para tu mascota?');
                if (query) {
                    toast.info(`Buscando "${query}"...`);
                    // Here you could navigate to /catalog with a search param
                }
            }}
          >
            <Search size={22} />
          </button>
          <Link to="/cart" className={cn("p-2 hove relative transition-colors", scrolled ? "text-gray-500 hover:text-orange-500" : "text-white/70 hover:text-white")}>
            <ShoppingCart size={22} />
            {itemCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-orange-500 text-white text-[10px] flex items-center justify-center rounded-full animate-bounce">
                {itemCount}
              </span>
            )}
          </Link>
          <div className="hidden md:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-gray-200">
                 <Link to="/profile" className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-orange-600">
                   <User size={18} />
                 </Link>
                 <button onClick={() => { supabase.auth.signOut(); toast.success('Sesión cerrada'); }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                   <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <Link to="/auth" className="ml-4 px-6 py-2 bg-gray-900 text-white rounded-full font-medium hover:bg-orange-500 transition-all active:scale-95 shadow-lg shadow-gray-900/10">
                Ingresar
              </Link>
            )}
          </div>
          <button className={cn("md:hidden p-2 transition-colors", scrolled || mobileMenuOpen ? "text-gray-900" : "text-white")} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden mt-4 rounded-b-3xl shadow-2xl"
          >
            <div className="flex flex-col p-6 space-y-4 font-bold text-lg">
              <Link to="/" className="text-gray-900 hover:text-orange-500 py-2 border-b border-gray-50">Inicio</Link>
              <Link to="/catalog" className="text-gray-900 hover:text-orange-500 py-2 border-b border-gray-50">Tienda</Link>
              <Link to="/about" className="text-gray-900 hover:text-orange-500 py-2 border-b border-gray-50">Nosotros</Link>
              <Link to="/contact" className="text-gray-900 hover:text-orange-500 py-2 border-b border-gray-50">Contacto</Link>
              {session ? (
                <>
                  <Link to="/profile" className="text-gray-900 hover:text-orange-500 py-2">Mi Perfil</Link>
                  <button onClick={() => { supabase.auth.signOut(); toast.success('Sesión cerrada'); }} className="text-left text-red-500 py-2">Cerrar Sesión</button>
                </>
              ) : (
                <Link to="/auth" className="text-orange-500 py-2">Ingresar / Registro</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-orange-500 rounded-lg text-white">
              <PawPrint size={20} />
            </div>
            <span className="text-xl font-bold text-gray-900">Jakka</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed">
            Productos premium para tus mejores amigos. Nos importa la calidad y el estilo porque amamos a las mascotas tanto como tú.
          </p>
          <div className="flex gap-4 pt-2">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <button 
                  key={i} 
                  onClick={() => toast.info('Redes sociales próximamente')}
                  className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-orange-500 hover:border-orange-500 transition-all"
                >
                    <Icon size={18} />
                </button>
            ))}
          </div>
        </div>
        
        <div>
          <h4 className="font-bold mb-6">Enlaces Rápidos</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/catalog" className="hover:text-orange-500 transition-colors">Todos los Productos</Link></li>
            <li><button onClick={() => toast.info('Categorías próximamente')} className="hover:text-orange-500 transition-colors">Categorías</button></li>
            <li><button onClick={() => toast.info('Ofertas próximamente')} className="hover:text-orange-500 transition-colors">Ofertas Especiales</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Soporte</h4>
          <ul className="space-y-3 text-sm text-gray-500">
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Envío</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Devoluciones</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500 transition-colors">Preguntas Frecuentes</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6">Boletín</h4>
          <p className="text-sm text-gray-500 mb-4">Suscríbete para ofertas exclusivas.</p>
          <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); toast.success('¡Gracias por suscribirte!'); }}>
            <input 
              type="email" 
              placeholder="Tu email" 
              required
              className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            />
            <button className="bg-orange-500 text-white px-4 py-2 rounded-lg text-sm font-medium">Unirse</button>
          </form>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-gray-200 text-center text-gray-400 text-xs">
        © 2024 Jakka Pet Shop. Todos los derechos reservados. Creado con ❤️ para tus mascotas.
      </div>
    </footer>
  );
}
