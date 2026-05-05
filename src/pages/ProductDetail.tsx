import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, ArrowLeft, Star, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { Product } from '../types';
import { MOCK_PRODUCTS } from '../constants';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [qty, setQty] = useState(1);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) setProduct(found);
    else {
        setProduct({
            id: id || '0',
            name: 'Producto Especial Jakka',
            description: 'Un producto premium seleccionado cuidadosamente para tu mascota. Calidad garantizada Jakka.',
            price: 49.99,
            image_url: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=800',
            category: 'Premium',
            stock: 10
        });
    }
  }, [id]);

  if (!product) return null;

  return (
    <div className="pt-32 pb-24 px-6 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-orange-500 transition-colors font-bold mb-12">
            <ArrowLeft size={18} />
            Volver a la tienda
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {/* Image Section */}
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="rounded-[3rem] overflow-hidden bg-gray-50 aspect-square"
            >
                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
            </motion.div>

            {/* Info Section */}
            <div className="space-y-8">
                <div>
                    <div className="flex items-center gap-4 mb-4">
                        <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">{product.category}</span>
                        <button 
                            onClick={() => {
                                toast.info('Mostrando reseñas de clientes verificados');
                                setShowReviews(!showReviews);
                            }}
                            className="flex items-center gap-1 text-yellow-500 hover:scale-105 transition-transform"
                        >
                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} size={14} fill="currentColor" />)}
                            <span className="text-gray-400 text-xs font-bold ml-1">(48 reseñas)</span>
                        </button>
                    </div>
                    {showReviews && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic text-sm text-gray-600">
                            "A mi perro le encanta, la calidad es excelente. ¡Volveré a comprar!" - María G.
                        </motion.div>
                    )}
                    <h1 className="text-5xl font-black text-gray-900 mb-4 tracking-tighter">{product.name}</h1>
                    <p className="text-3xl font-black text-orange-600">${product.price.toFixed(2)}</p>
                </div>

                <p className="text-gray-500 leading-relaxed text-lg">
                    {product.description}
                </p>

                <div className="space-y-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden">
                            <button onClick={() => setQty(Math.max(1, qty - 1))} className="p-4 hover:bg-gray-100 transition-colors"><Minus size={20} /></button>
                            <span className="px-6 font-black text-lg">{qty}</span>
                            <button onClick={() => setQty(qty + 1)} className="p-4 hover:bg-gray-100 transition-colors"><Plus size={20} /></button>
                        </div>
                        <button 
                            onClick={() => {
                                for(let i=0; i<qty; i++) addToCart(product);
                            }}
                            className="flex-1 bg-gray-900 hover:bg-orange-500 text-white py-5 rounded-2xl font-black text-lg transition-all shadow-xl shadow-gray-900/10 flex items-center justify-center gap-3 active:scale-95 group"
                        >
                            <ShoppingCart size={24} className="group-hover:rotate-12 transition-transform" />
                            Añadir al Carrito
                        </button>
                        <button onClick={() => toast.info('Añadido a favoritos')} className="p-5 border border-gray-100 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-all">
                            <Heart size={24} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { icon: <Truck size={20} />, text: 'Envío Gratis' },
                            { icon: <ShieldCheck size={20} />, text: 'Calidad Jakka' },
                            { icon: <RotateCcw size={20} />, text: '30 días retorno' }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-gray-400 bg-gray-50 p-4 rounded-xl">
                                <span className="text-orange-500">{item.icon}</span>
                                {item.text}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
