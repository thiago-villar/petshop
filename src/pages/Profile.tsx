import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { User, Mail, Shield, ShoppingBag, Clock, ArrowLeft, Settings, MapPin, Bell, LogOut, Loader2, Package } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

/**
 * COMPONENTE PERFIL: Muestra la información del usuario y su historial de pedidos.
 * Recupera datos de Supabase filtrando por el ID del usuario logueado.
 */
export default function Profile() {
  const { items } = useCart();
  const [session, setSession] = useState<any>(null); // Datos de autenticación
  const [orders, setOrders] = useState<any[]>([]);   // Lista de pedidos del usuario
  const [loading, setLoading] = useState(true);      // Estado de carga para el feedback visual

  // Al montar el componente, verificamos si hay una sesión activa
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        // Si hay usuario, traemos sus pedidos de la DB
        fetchOrders(session.user.id);
      } else {
        setLoading(false);
      }
    });
  }, []);

  /**
   * FUNCIÓN PARA TRAER PEDIDOS:
   * Realiza una consulta (query) a Supabase.
   * Trae datos de 'orders' y, mediante una relación, también trae sus 'order_items'.
   */
  const fetchOrders = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders') // Tabla principal
        .select(`
          *,
          order_items (*) 
        `) // El '*' significa todos los campos. 'order_items (*)' es un JOIN automático
        .eq('user_id', userId) // Filtro: Solo los pedidos de ESTE usuario
        .order('created_at', { ascending: false }); // Ordenar por fecha (más reciente primero)

      if (error) throw error;
      setOrders(data || []); // Guardamos los resultados en el estado local
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Error al cargar tus pedidos');
    } finally {
      setLoading(false);
    }
  };

  if (!session && !loading) return (
    <div className="pt-40 text-center">
        <h2 className="text-2xl font-bold">Inicia sesión para ver tu perfil</h2>
        <Link to="/auth" className="text-orange-500 font-bold mt-4 inline-block underline">Ir a identificación</Link>
    </div>
  );

  if (loading) return (
    <div className="pt-40 flex justify-center">
        <Loader2 className="animate-spin text-orange-500" size={40} />
    </div>
  );

  const menuItems = [
    { icon: Settings, label: 'Ajustes de Cuenta', active: true },
    { icon: MapPin, label: 'Direcciones de Envío', active: false },
    { icon: Bell, label: 'Notificaciones', active: false },
  ];

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
            <Link to="/" className="flex items-center gap-2 text-gray-500 hover:text-orange-500 transition-colors text-sm font-bold mb-4">
                <ArrowLeft size={16} />
                Volver a la Tienda
            </Link>
            <h1 className="text-4xl font-black text-gray-900">Tu <span className="text-orange-500">Perfil</span></h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar info */}
            <div className="space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                    <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mx-auto mb-4">
                        <User size={40} />
                    </div>
                    <div className="text-center">
                        <h3 className="font-bold text-gray-900 truncate px-2">{session.user.email.split('@')[0]}</h3>
                        <p className="text-[10px] text-gray-400 truncate px-2">{session.user.email}</p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-gray-100 space-y-2">
                        {menuItems.map((item, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => toast.info(`${item.label} próximamente`)}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                                    item.active ? "bg-orange-50 text-orange-500" : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                                )}
                            >
                                <item.icon size={18} />
                                {item.label}
                            </button>
                        ))}
                    </div>
                    <button 
                        onClick={() => { supabase.auth.signOut(); toast.success('Sesión cerrada'); }}
                        className="w-full flex items-center gap-3 px-4 py-4 mt-4 rounded-xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all"
                    >
                        <LogOut size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-3 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <ShoppingBag size={20} className="text-orange-500" />
                            Actividad Reciente
                        </h3>
                        {orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map((order) => (
                                    <div key={order.id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Pedido #{order.id.slice(0, 8)}</p>
                                                <p className="text-sm font-medium text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
                                            </div>
                                            <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-[10px] font-black uppercase">{order.status}</span>
                                        </div>
                                        <div className="space-y-2 mb-4">
                                            {order.order_items.map((item: any) => (
                                                <div key={item.id} className="flex justify-between text-sm">
                                                    <span className="text-gray-600">{item.quantity}x {item.product_name}</span>
                                                    <span className="font-bold text-gray-900">${item.price}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-gray-50 flex justify-between items-center">
                                            <span className="text-sm text-gray-400">Total pagado</span>
                                            <span className="text-lg font-black text-orange-500">${order.total_amount}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 text-center flex flex-col items-center justify-center min-h-[350px]">
                                <Clock size={48} className="text-gray-100 mb-6" />
                                <h4 className="text-lg font-bold text-gray-900 mb-2">Sin pedidos todavía</h4>
                                <p className="text-gray-400 font-medium max-w-[200px] mx-auto text-sm leading-relaxed">¡Tus mascotas están esperando su próximo regalo!</p>
                                <Link to="/catalog" className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-orange-500 transition-all shadow-lg shadow-gray-900/5">
                                    Ver Catálogo
                                </Link>
                            </div>
                        )}
                    </section>

                    <section>
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <Clock size={20} className="text-orange-500" />
                            Estado del Carrito
                        </h3>
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-10 flex flex-col justify-between min-h-[350px]">
                            <div className="space-y-4">
                                <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Productos actuales</p>
                                <div className="text-6xl font-black text-gray-900">{items.length}</div>
                                {items.length > 0 ? (
                                    <div className="space-y-2 mt-4">
                                        {items.slice(0, 3).map(i => (
                                            <div key={i.id} className="text-sm font-bold text-gray-400 flex justify-between border-b border-gray-50 pb-2">
                                                <span className="truncate mr-4">{i.name}</span>
                                                <span className="text-gray-900">${i.price}</span>
                                            </div>
                                        ))}
                                        {items.length > 3 && <div className="text-xs text-orange-500 font-bold pt-2">+ {items.length - 3} más...</div>}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-sm italic mt-4">Tu carrito está vacío</p>
                                )}
                            </div>
                            <Link to="/cart" className="w-full bg-orange-500 text-white py-5 rounded-xl font-black hover:bg-orange-600 transition-all text-center shadow-lg shadow-orange-500/20 active:scale-95">
                                Ir al Carrito
                            </Link>
                        </div>
                    </section>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
