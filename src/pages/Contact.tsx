import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Instagram, Twitter, Facebook } from 'lucide-react';
import { toast } from 'sonner';

export default function Contact() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.');
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="pt-32 pb-24 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        <header className="text-center mb-16">
            <h1 className="text-5xl font-black text-gray-900 mb-4">Ponte en <span className="text-orange-500">Contacto</span></h1>
            <p className="text-gray-500 max-w-lg mx-auto">¿Tienes dudas sobre un producto o un envío? Estamos aquí para ayudarte a ti y a tu mascota.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Info */}
            <div className="space-y-8">
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
                    <h2 className="text-2xl font-bold mb-8">Información de contacto</h2>
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600">
                                <Mail size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Email</p>
                                <p className="font-bold">hola@jakka.com</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <Phone size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Teléfono</p>
                                <p className="font-bold">+34 900 123 456</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 text-gray-600">
                            <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-400 uppercase">Dirección</p>
                                <p className="font-bold">Calle de la Huella 42, Madrid</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 pt-12 border-t border-gray-100">
                        <p className="text-sm font-bold text-gray-400 mb-6 uppercase">Redes Sociales</p>
                        <div className="flex gap-4">
                            {[Instagram, Twitter, Facebook].map((Icon, i) => (
                                <button key={i} className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all">
                                    <Icon size={20} />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Map placeholder */}
                <div className="h-64 bg-gray-200 rounded-[3rem] overflow-hidden grayscale relative">
                    <img src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?q=80&w=800" className="w-full h-full object-cover opacity-50" alt="map" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white px-6 py-3 rounded-full font-bold shadow-xl">Ver Mapa Interactivo</div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-xl">
                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Nombre</label>
                            <input 
                                required
                                type="text" 
                                placeholder="Tu nombre" 
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-600">Email</label>
                            <input 
                                required
                                type="email" 
                                placeholder="tu@email.com" 
                                className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600">Asunto</label>
                        <select className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all appearance-none cursor-pointer">
                            <option>Duda sobre un producto</option>
                            <option>Estado de mi pedido</option>
                            <option>Reportar un problema</option>
                            <option>Sugerencias</option>
                            <option>Otros</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-600">Mensaje</label>
                        <textarea 
                            required
                            rows={5}
                            placeholder="¿Cómo podemos ayudarte?" 
                            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all resize-none"
                        ></textarea>
                    </div>
                    <button className="w-full py-5 bg-orange-500 text-white rounded-2xl font-black text-lg hover:bg-orange-600 transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3">
                        Enviar Mensaje
                        <Send size={20} />
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
}
