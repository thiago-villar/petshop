import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { CreditCard, Truck, MapPin, CheckCircle, ArrowLeft, Loader2, ShieldCheck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<any>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    direccion: '',
    ciudad: '',
    cp: '',
    tarjeta: '',
    vencimiento: '',
    cvv: ''
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        setFormData(prev => ({ 
          ...prev, 
          email: session.user.email || '',
          nombre: session.user.email?.split('@')[0] || '' 
        }));
      }
    });
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    if (!session) {
      toast.error('Debes iniciar sesión para finalizar la compra');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // 1. Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_amount: Number(total),
          shipping_address: `${formData.direccion}, ${formData.ciudad}, ${formData.cp}`,
          status: 'Enviando'
        })
        .select()
        .single();

      if (orderError) {
        console.error('Error insertando pedido:', orderError);
        throw new Error(orderError.message);
      }

      if (!order) throw new Error('No se pudo generar el ID del pedido');

      // 2. Create order items - ensure numbers are correct types
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_name: String(item.name),
        quantity: Number(item.quantity),
        price: Number(item.price)
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        console.error('Error insertando productos:', itemsError);
        throw new Error(itemsError.message);
      }

      toast.success('¡Pedido realizado con éxito!');
      clearCart();
      setTimeout(() => navigate('/profile'), 1500);
    } catch (error: any) {
      console.error('Error completo:', error);
      toast.error('Hubo un problema: ' + (error.message || 'Error de base de datos'));
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0 && step < 3) {
    return (
        <div className="pt-40 text-center">
            <h2 className="text-2xl font-bold">Tu carrito está vacío</h2>
            <Link to="/catalog" className="text-orange-500 font-bold mt-4 inline-block underline">Ir a la tienda</Link>
        </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
            <div>
                <Link to="/cart" className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-bold mb-2">
                    <ArrowLeft size={16} />
                    Volver al carrito
                </Link>
                <h1 className="text-4xl font-black text-gray-900">Finalizar <span className="text-orange-500">Compra</span></h1>
            </div>
            {/* Steps indicator */}
            <div className="flex items-center gap-4">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${step >= s ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                            {step > s ? <CheckCircle size={16} /> : s}
                        </div>
                        {s < 3 && <div className={`w-8 h-1 rounded-full ${step > s ? 'bg-orange-500' : 'bg-gray-200'}`} />}
                    </div>
                ))}
            </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Form Side */}
            <div className="lg:col-span-2">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm transition-all duration-500">
                    <form onSubmit={handleNext} className="space-y-8">
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <MapPin className="text-orange-500" />
                                    Datos de Entrega
                                </h2>
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Nombre Completo</label>
                                            <input required value={formData.nombre} onChange={(e) => handleInputChange('nombre', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="Juan Pérez" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Email</label>
                                            <input required type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="tu@email.com" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Dirección</label>
                                        <input required value={formData.direccion} onChange={(e) => handleInputChange('direccion', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="Av. Principal 123" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Ciudad</label>
                                            <input required value={formData.ciudad} onChange={(e) => handleInputChange('ciudad', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="Madrid" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Código Postal</label>
                                            <input required value={formData.cp} onChange={(e) => handleInputChange('cp', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="28001" />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                    <CreditCard className="text-orange-500" />
                                    Método de Pago
                                </h2>
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-400 uppercase">Número de Tarjeta</label>
                                        <input required value={formData.tarjeta} onChange={(e) => handleInputChange('tarjeta', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="0000 0000 0000 0000" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">Vencimiento</label>
                                            <input required value={formData.vencimiento} onChange={(e) => handleInputChange('vencimiento', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="MM/YY" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase">CVV</label>
                                            <input required value={formData.cvv} onChange={(e) => handleInputChange('cvv', e.target.value)} className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-orange-500/20 outline-none" placeholder="123" />
                                        </div>
                                    </div>
                                    <div className="p-6 bg-orange-50 rounded-2xl border border-orange-100 flex items-center gap-4 text-orange-800 text-sm">
                                        <ShieldCheck size={24} className="text-orange-500 flex-shrink-0" />
                                        Tus datos están protegidos por encriptación avanzada.
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-center py-12">
                                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                    <CheckCircle size={48} />
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-4">¡Todo listo!</h2>
                                <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                    Haz clic en el botón de abajo para procesar el pago de su compra de ${total.toFixed(2)}.
                                </p>
                            </motion.div>
                        )}

                        <div className="flex gap-4">
                            {step > 1 && (
                                <button type="button" disabled={loading} onClick={() => setStep(step - 1)} className="flex-1 py-5 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all disabled:opacity-50">
                                    Anterior
                                </button>
                            )}
                            <button type="submit" disabled={loading} className="flex-[2] py-5 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2 disabled:opacity-50">
                                {loading && <Loader2 className="animate-spin" size={20} />}
                                {step === 3 ? 'Confirmar Pago' : 'Siguiente Paso'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Summary Side */}
            <div>
                <div className="sticky top-32 bg-gray-900 text-white p-8 rounded-[2.5rem] shadow-2xl">
                    <h3 className="text-xl font-bold mb-8">Resumen de Pago</h3>
                    <div className="space-y-4 mb-8 max-h-64 overflow-y-auto no-scrollbar pr-2">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-400">{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="space-y-4 pt-8 border-t border-white/10">
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Subtotal</span>
                            <span>${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Envío</span>
                            <span className="text-green-400 font-bold tracking-widest">GRATIS</span>
                        </div>
                        <div className="flex justify-between font-black text-3xl pt-4">
                            <span>Total</span>
                            <span className="text-orange-500">${total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
