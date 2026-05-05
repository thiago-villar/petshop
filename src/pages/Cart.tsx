import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total, clearCart } = useCart();

  const handleClearCart = () => {
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        clearCart();
        toast.info('Carrito vaciado');
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-40 pb-24 px-6 min-h-screen flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-300 mb-6">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p className="text-gray-500 mb-8 max-w-xs">Parece que aún no has añadido nada a tu carrito.</p>
        <Link to="/catalog" className="px-8 py-4 bg-orange-500 text-white rounded-2xl font-bold hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95">
            Empezar a Comprar
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <h1 className="text-4xl font-black text-gray-900">Tu <span className="text-orange-500">Carrito</span></h1>
            <button 
                onClick={handleClearCart}
                className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2"
            >
                <Trash2 size={16} />
                Vaciar Carrito
            </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
                <AnimatePresence>
                    {items.map((item) => (
                        <motion.div 
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white p-4 rounded-3xl border border-gray-100 flex items-center gap-6"
                        >
                            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900">{item.name}</h3>
                                <p className="text-xs text-gray-400 mb-2">{item.category}</p>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                                        <button onClick={() => updateQuantity(item.id, -1)} className="p-2 hover:bg-gray-100"><Minus size={14} /></button>
                                        <span className="px-4 font-bold text-sm">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(item.id, 1)} className="p-2 hover:bg-gray-100"><Plus size={14} /></button>
                                    </div>
                                    <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-600">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-black text-lg text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                                <p className="text-[10px] text-gray-400 font-mono">${item.price.toFixed(2)} / c/u</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Summary */}
            <div className="relative">
                <div className="sticky top-32 bg-gray-900 text-white rounded-3xl p-8 shadow-2xl shadow-gray-900/20">
                    <h3 className="text-xl font-bold mb-6">Resumen del Pedido</h3>
                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Subtotal</span>
                            <span className="text-white">${total.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-400 text-sm">
                            <span>Envío</span>
                            <span className="text-green-400 font-bold tracking-widest text-xs">GRATIS</span>
                        </div>
                        <div className="h-px bg-white/10 my-4" />
                        <div className="flex justify-between font-black text-2xl">
                            <span>Total</span>
                            <span className="text-orange-500">${total.toFixed(2)}</span>
                        </div>
                    </div>
                    <Link 
                        to="/checkout"
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/20 group"
                    >
                        Finalizar Compra
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
