import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, ShieldCheck, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useCart } from '../context/CartContext';
import { MOCK_PRODUCTS } from '../constants';

export default function Home() {
  const { addToCart } = useCart();
  const featuredProducts = MOCK_PRODUCTS.slice(0, 4);

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=2000" 
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.7] contrast-[1.1]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} 
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full text-orange-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Star size={14} className="fill-orange-400" />
              Nueva Colección 2024
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] mb-6">
              Solo lo mejor para <span className="text-orange-500">ellos.</span>
            </h1>
            <p className="text-lg text-gray-200 mb-10 max-w-lg leading-relaxed">
              Explora nuestra colección premium de accesorios, nutrición y juguetes seleccionados específicamente para hacer feliz a tu mascota.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/catalog" className="px-10 py-5 bg-orange-500 text-white rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 active:scale-95 flex items-center gap-2 group">
                Ver Catálogo
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="px-10 py-5 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all">
                Nuestra Historia
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { icon: <Truck size={32} />, title: "Envío Rápido", desc: "Entrega express para todas las necesidades de tu mascota." },
            { icon: <ShieldCheck size={32} />, title: "Calidad Garantizada", desc: "Solo marcas aprobadas por veterinarios y materiales seguros." },
            { icon: <Clock size={32} />, title: "Soporte 24/7", desc: "Asesoramiento experto en cualquier momento para tu familia peluda." }
          ].map((f, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              onClick={() => toast.info(`Más información sobre ${f.title} próximamente`)}
              className="p-8 rounded-3xl bg-gray-50 text-center space-y-4 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center text-orange-500 mx-auto">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-gray-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Populares Ahora</h2>
              <p className="text-gray-500">Lo más amado por nuestra comunidad.</p>
            </div>
            <Link to="/catalog" className="text-orange-500 font-bold hover:underline">Ver Todo</Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {featuredProducts.map((prod) => (
              <div key={prod.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
                <Link to={`/product/${prod.id}`} className="aspect-[4/5] block relative overflow-hidden bg-gray-100">
                  <img src={prod.image_url} alt={prod.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <button onClick={(e) => { e.preventDefault(); toast.info('Añadido a favoritos'); }} className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-md rounded-full text-gray-400 hover:text-red-500 transition-colors">
                    <Heart size={20} />
                  </button>
                </Link>
                <div className="p-6">
                  <div className="text-xs text-gray-400 font-bold uppercase mb-1">{prod.category}</div>
                  <Link to={`/product/${prod.id}`}>
                    <h4 className="font-bold text-gray-900 mb-2 hover:text-orange-500 transition-colors truncate">{prod.name}</h4>
                  </Link>
                  <div className="flex justify-between items-center">
                    <span className="text-orange-600 font-black text-lg">${prod.price.toFixed(2)}</span>
                    <button 
                      onClick={() => addToCart(prod)}
                      className="w-10 h-10 bg-gray-900 text-white rounded-xl flex items-center justify-center hover:bg-orange-500 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
