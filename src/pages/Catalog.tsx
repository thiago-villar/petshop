import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingCart, Heart, Activity } from 'lucide-react';
import { cn } from '../lib/utils';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { MOCK_PRODUCTS } from '../constants';

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todas');
  const { addToCart } = useCart();

  const categories = ['Todas', 'Alimento', 'Juguetes', 'Camas', 'Accesorios', 'Higiene'];

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setProducts(data && data.length > 0 ? data : MOCK_PRODUCTS);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts(MOCK_PRODUCTS);
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
                         p.description.toLowerCase().includes(search.toLowerCase());
    
    const matchesCategory = category === 'Todas' || p.category === category;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="mb-12">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Nuestra <span className="text-orange-500">Tienda</span></h1>
            <p className="text-gray-500 max-w-2xl">Encuentra todo lo que tu mascota necesita para vivir una vida plena, saludable y llena de aventuras.</p>
        </header>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center">
            <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                <input 
                    type="text" 
                    placeholder="Busca el juguete favorito de tu mejor amigo..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-white border border-gray-100 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all font-medium"
                />
            </div>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar w-full md:w-auto">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={cn(
                            "px-6 py-3 rounded-xl font-bold text-sm transition-all whitespace-nowrap border-2",
                            category === cat 
                                ? "bg-gray-900 border-gray-900 text-white shadow-xl shadow-gray-900/10 scale-105" 
                                : "bg-white border-white text-gray-500 hover:border-gray-200"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
                {filteredProducts.map((product) => (
                    <motion.div 
                        layout
                        key={product.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="group bg-white rounded-[2rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                    >
                        <Link to={`/product/${product.id}`} className="block aspect-[4/5] relative overflow-hidden bg-gray-100">
                            <img 
                                src={product.image_url} 
                                alt={product.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                            />
                            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-900">
                                {product.category}
                            </div>
                            <button 
                                onClick={(e) => { e.preventDefault(); toast.info('Añadido a favoritos'); }}
                                className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full text-gray-400 hover:text-red-500 transition-all shadow-lg active:scale-90"
                            >
                                <Heart size={20} />
                            </button>
                        </Link>
                        <div className="p-6">
                            <Link to={`/product/${product.id}`}>
                                <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-1 hover:text-orange-500 transition-colors uppercase tracking-tight">{product.name}</h3>
                            </Link>
                            <p className="text-gray-400 text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>
                            <div className="flex items-center justify-between">
                                <span className="font-black text-2xl text-gray-900">${product.price.toFixed(2)}</span>
                                <div className="text-[10px] bg-green-50 text-green-600 px-2 py-1 rounded-md font-bold">STOCK: {product.stock}</div>
                            </div>
                            <button 
                                onClick={() => addToCart(product)}
                                className="w-full mt-6 bg-gray-900 hover:bg-orange-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-xl shadow-gray-900/5 group"
                            >
                                <ShoppingCart size={20} className="group-hover:rotate-12 transition-transform" />
                                Añadir al Carrito
                            </button>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        {filteredProducts.length === 0 && (
            <div className="py-32 text-center">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <Activity size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">No encontramos lo que buscas</h3>
                <p className="text-gray-500 mt-2">Prueba con palabras diferentes o cambia la categoría.</p>
                <button onClick={() => { setSearch(''); setCategory('Todas'); }} className="mt-8 text-orange-500 font-bold underline">Limpiar filtros</button>
            </div>
        )}
      </div>
    </div>
  );
}
