import React, { useState } from 'react';
import { supabase, isConfigured } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, LogIn, UserPlus, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2, PawPrint, Settings } from 'lucide-react';
import { toast } from 'sonner';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isConfigured) {
        toast.error('Supabase no está configurado. Por favor, añade las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en los ajustes.');
        return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success('¡Bienvenido de nuevo a Jakka!');
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: { emailRedirectTo: window.location.origin }
        });
        if (error) throw error;
        toast.success('¡Revisa tu correo para verificar tu cuenta!');
      }
    } catch (err: any) {
      toast.error(err.message === 'Invalid login credentials' ? 'Credenciales inválidas' : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left side - Visual */}
      <div className="hidden md:flex md:w-1/2 bg-orange-500 relative items-center justify-center p-12 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
           <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
        </div>
        <div className="relative z-10 text-white text-center">
            <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center mx-auto mb-8"
            >
              <PawPrint size={48} className="fill-white" />
            </motion.div>
            <h2 className="text-4xl font-black mb-4">Únete a la Jauría.</h2>
            <p className="text-orange-100 max-w-sm mx-auto leading-relaxed">Accede a ofertas exclusivas, novedades antes que nadie y gestiona los pedidos de tus mejores amigos.</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50/30">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-10 text-center md:text-left">
            <div className="flex items-center gap-2 mb-6 md:hidden justify-center">
                <div className="p-2 bg-orange-500 rounded-xl text-white">
                    <PawPrint size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter">Jakka</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">
              {isLogin ? '¡Hola de nuevo!' : 'Crea tu cuenta'}
            </h1>
            <p className="text-gray-500 font-medium">
              {isLogin ? 'Ingresa tus datos para acceder a tu cuenta' : 'Comienza tu viaje con Jakka hoy mismo'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Correo Electrónico</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@ejemplo.com"
                  className="w-full bg-white border border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 transition-all outline-none shadow-sm font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Contraseña</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input 
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white border border-gray-100 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 rounded-2xl py-4 pl-12 pr-4 text-gray-900 transition-all outline-none shadow-sm font-medium"
                />
              </div>
              {isLogin && (
                <div className="text-right mt-2 text-xs font-bold text-orange-600">
                  <button type="button" className="hover:underline">¿Olvidaste tu contraseña?</button>
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 hover:bg-orange-500 text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50 mt-4 group shadow-xl shadow-gray-900/10"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="pt-8 border-t border-gray-100 mt-10 text-center">
              <button 
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-gray-500 font-bold"
              >
                {isLogin ? "¿No tienes una cuenta? " : "¿Ya tienes una cuenta? "}
                <span className="text-orange-600 hover:underline">{isLogin ? 'Crea una aquí' : 'Inicia sesión'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
