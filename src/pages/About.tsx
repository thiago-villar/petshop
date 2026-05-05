import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Shield, Users, PawPrint, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="pt-32 pb-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Hero */}
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-2 bg-orange-100 text-orange-600 rounded-full text-xs font-black uppercase tracking-widest mb-6"
          >
            Nuestra Historia
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 tracking-tighter">
            Amamos a las mascotas <br /> tanto como <span className="text-orange-500">tú.</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto leading-relaxed">
            Jakka nació de una idea simple: todas las mascotas merecen productos de la más alta calidad, diseñados con amor y respeto por su bienestar.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-32">
            {[
                { label: 'Clientes Felices', val: '10k+' },
                { label: 'Productos Premium', val: '500+' },
                { label: 'Años de Experiencia', val: '8+' },
                { label: 'Donaciones Realizadas', val: '$50k' }
            ].map((s, i) => (
                <div key={i} className="text-center p-8 bg-gray-50 rounded-[2.5rem]">
                    <div className="text-4xl font-black text-gray-900 mb-2">{s.val}</div>
                    <div className="text-sm text-gray-400 font-bold uppercase">{s.label}</div>
                </div>
            ))}
        </div>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
            <div className="space-y-8">
                <h2 className="text-4xl font-black text-gray-900 tracking-tight">Valores que nos <span className="text-orange-500">mueven</span></h2>
                <div className="space-y-6">
                    {[
                        { icon: <Heart className="text-red-500" />, title: 'Pasión por los animales', desc: 'Cada producto en nuestro catálogo ha sido probado y amado por nuestro propio equipo de mascotas.' },
                        { icon: <Shield className="text-blue-500" />, title: 'Seguridad Ante Todo', desc: 'No vendemos nada que no pondríamos en las patas o garras de nuestros mejores amigos.' },
                        { icon: <Users className="text-green-500" />, title: 'Comunidad Jakka', desc: 'Apoyamos a refugios locales y promovemos la adopción responsable en cada paso.' }
                    ].map((v, i) => (
                        <div key={i} className="flex gap-6">
                            <div className="shrink-0 w-12 h-12 bg-white shadow-lg rounded-xl flex items-center justify-center">
                                {v.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-900 mb-1">{v.title}</h4>
                                <p className="text-gray-500 text-sm leading-relaxed">{v.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative">
                <div className="aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1516733725897-1aa73b87c8e8?q=80&w=800" 
                        alt="Nuestro equipo" 
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="absolute -bottom-6 -left-6 bg-orange-500 p-8 rounded-3xl text-white shadow-xl max-w-xs">
                    <PawPrint size={32} className="mb-4" />
                    <p className="font-bold">"Nuestra misión es fortalecer el vínculo entre humanos y mascotas."</p>
                </div>
            </div>
        </div>

        {/* Vision Area */}
        <div className="bg-gray-900 rounded-[3rem] p-16 text-center text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 text-white/5 pointer-events-none">
                <Award size={200} />
            </div>
            <h2 className="text-4xl font-black mb-6">¿Quieres saber más?</h2>
            <p className="text-gray-400 mb-10 max-w-xl mx-auto">Nuestro equipo de expertos está siempre dispuesto a ayudarte a elegir lo mejor para tu compañero.</p>
            <Link to="/contact" className="inline-block px-10 py-5 bg-orange-500 rounded-2xl font-black hover:bg-orange-600 transition-all active:scale-95">
                Contáctanos Hoy
            </Link>
        </div>
      </div>
    </div>
  );
}
