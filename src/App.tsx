import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { supabase } from './lib/supabase';
import { Session } from '@supabase/supabase-js';

// Components
import { Navbar, Footer } from './components/Navigation';
import { CartProvider } from './context/CartContext';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import AuthPage from './pages/Auth';
import CartPage from './pages/Cart';
import Profile from './pages/Profile';
import About from './pages/About';
import Contact from './pages/Contact';
import ProductDetail from './pages/ProductDetail';
import Checkout from './pages/Checkout';

/**
 * ARCHIVO PRINCIPAL (App.tsx):
 * Es el punto de entrada de la aplicación. Aquí se define el Enrutamiento (vías) 
 * y se comprueba si el usuario está conectado globalmente.
 */
export default function App() {
  // Estado para guardar la sesión del usuario (se comparte en toda la app)
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // EFECTO DE AUTENTICACIÓN:
  // Se ejecuta una sola vez al cargar la web.
  useEffect(() => {
    // 1. Pregunta a Supabase si hay una sesión guardada en cookies/localstorage
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setSession(session);
      })
      .catch(err => {
        console.error('Error al obtener sesión:', err);
      })
      .finally(() => {
        setLoading(false);
      });

    // 2. Suscripción: Si el usuario inicia o cierra sesión en otra pestaña 
    // o el token expira, este 'listener' actualiza la app automáticamente.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe(); // Limpieza al desmontar
  }, []);

  // Mientras se comprueba la sesión, mostramos una pantalla de carga
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
          <span className="text-gray-400 font-mono text-xs tracking-widest uppercase">Cargando Jakka...</span>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-white scroll-smooth selection:bg-orange-500 selection:text-white">
          <Toaster position="top-center" expand={true} richColors />
          
          {/* Si hay sesión, mostramos la barra de navegación */}
          {session && <Navbar session={session} />}
          
          <main>
            <Routes>
              {/**
               * SISTEMA DE RUTAS PROTEGIDAS:
               * Si no hay sesión, cualquier ruta redirige a /auth (Login).
               * Si hay sesión, habilitamos el acceso al resto de la página.
               */}
              <Route path="/auth" element={!session ? <AuthPage /> : <Navigate to="/" />} />

              {session ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/catalog" element={<Catalog />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/auth" />} />
              )}
            </Routes>
          </main>

          {session && <Footer />}
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}
