
import React, { useState, useRef } from 'react';
import { Product } from '../types';
import { generateDescription } from '../services/geminiService';

interface AdminPanelProps {
  products: Product[];
  setProducts: (products: Product[]) => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

type AdminTab = 'ADD' | 'MANAGE';

const AdminPanel: React.FC<AdminPanelProps> = ({ products, setProducts, isAuthenticated, onLogin, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('ADD');
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: 'Signature',
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800'
  });
  const [loadingAI, setLoadingAI] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const ADMIN_PIN = "1234"; 

  const formatPrice = (p: number) => p.toLocaleString('es-PY') + ' ₲';

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      localStorage.setItem('burger_admin_session', 'true');
      onLogin();
      setError('');
    } else {
      setError('PIN Incorrecto.');
      setPin('');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewProduct(prev => ({ ...prev, image: reader.result as string }));
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price) return;

    const productToAdd: Product = {
      id: Date.now().toString(),
      name: newProduct.name,
      price: Number(newProduct.price),
      description: newProduct.description || 'Deliciosa hamburguesa artesanal.',
      image: newProduct.image || 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800',
      category: (newProduct.category as any) || 'Classic'
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ 
      category: 'Signature', 
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=800' 
    });
    alert('¡Wata-Producto publicado con éxito!');
    setActiveTab('MANAGE'); // Salta a la gestión para ver el resultado
  };

  const handleDelete = (id: string) => {
    if (confirm('¿Estás seguro de eliminar este producto del menú?')) {
      setProducts(products.filter(p => p.id !== id));
    }
  };

  const handleAIDescription = async () => {
    if (!newProduct.name) return alert('Ingresa el nombre primero.');
    setLoadingAI(true);
    const desc = await generateDescription(newProduct.name);
    setNewProduct(prev => ({ ...prev, description: desc }));
    setLoadingAI(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-12 glass-card rounded-[3rem] animate-fadeIn border border-white/10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-yellow-400 text-black rounded-full flex items-center justify-center mx-auto mb-6 text-3xl shadow-[0_0_40px_rgba(250,204,21,0.4)]">
            <i className="fa-solid fa-lock"></i>
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter">Acceso Wata</h2>
          <p className="text-gray-500 text-[10px] mt-3 font-bold uppercase tracking-[0.3em]">Cámara Secreta del Chef</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
          <input 
            type="password"
            maxLength={4}
            placeholder="****"
            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-center text-4xl tracking-[0.8em] focus:border-yellow-400 outline-none transition-all text-white font-black"
            value={pin}
            onChange={e => setPin(e.target.value.replace(/\D/g, ''))}
          />
          {error && <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest">{error}</p>}
          <button className="w-full bg-yellow-400 text-black font-black py-5 rounded-2xl hover:bg-white transition-all transform active:scale-95 shadow-xl uppercase text-xs tracking-widest">
            AUTORIZAR ACCESO
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto animate-fadeIn pb-32">
      <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-5xl md:text-6xl font-bungee text-yellow-400 tracking-tighter">CONTROL WATA</h2>
          <p className="text-gray-500 font-bold uppercase tracking-[0.5em] text-[10px] mt-2">Personaliza tu Imperio Gastronómico</p>
        </div>
        <button 
          onClick={onLogout}
          className="bg-white/5 text-gray-500 px-8 py-3 rounded-2xl font-black text-[10px] hover:bg-red-500 hover:text-white transition-all border border-white/5 uppercase tracking-[0.3em]"
        >
          Cerrar Sesión
        </button>
      </div>

      {/* Tabs Switcher Premium */}
      <div className="flex justify-center mb-16">
        <div className="bg-white/5 p-2 rounded-[2rem] border border-white/10 flex gap-2">
            <button 
                onClick={() => setActiveTab('ADD')}
                className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'ADD' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-400 hover:text-white'}`}
            >
                <i className="fa-solid fa-plus-circle"></i>
                Nuevo Producto
            </button>
            <button 
                onClick={() => setActiveTab('MANAGE')}
                className={`px-10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeTab === 'MANAGE' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/20' : 'text-gray-400 hover:text-white'}`}
            >
                <i className="fa-solid fa-layer-group"></i>
                Gestionar Menú
                <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] ${activeTab === 'MANAGE' ? 'bg-black/20 text-black' : 'bg-white/10 text-gray-400'}`}>
                    {products.length}
                </span>
            </button>
        </div>
      </div>

      <div className="w-full">
        {activeTab === 'ADD' ? (
          /* Formulario de Alta - Separado y Enfocado */
          <section className="max-w-2xl mx-auto glass-card p-10 md:p-16 rounded-[4rem] border-white/10 shadow-2xl animate-fadeIn">
            <h3 className="text-3xl font-black mb-12 flex items-center gap-5 uppercase tracking-tighter">
              AÑADIR A LA CARTA
            </h3>
            
            <form onSubmit={handleAdd} className="space-y-8">
              {/* Image Upload Area */}
              <div className="space-y-4">
                 <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Fotografía del Plato</label>
                 <div className="relative group overflow-hidden rounded-[2.5rem] border-2 border-dashed border-white/10 h-64 bg-black/40 flex flex-col items-center justify-center transition-all hover:border-yellow-400/50 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {newProduct.image && (
                      <img src={newProduct.image} className="absolute inset-0 w-full h-full object-cover opacity-50 group-hover:opacity-70 transition-opacity" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleImageUpload} 
                    />
                    
                    <div className="relative z-10 flex flex-col items-center text-center px-6">
                      <div className="w-16 h-16 bg-white text-black rounded-full mb-4 flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                         <i className={`fa-solid ${isUploading ? 'fa-spinner fa-spin' : 'fa-camera'} text-xl`}></i>
                      </div>
                      <p className="text-white font-black text-xs uppercase tracking-widest">
                          {isUploading ? 'Subiendo...' : 'Subir desde Dispositivo'}
                      </p>
                      <p className="text-gray-500 text-[9px] mt-2 font-bold uppercase tracking-tighter">PNG, JPG o Cámara en vivo</p>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Nombre del Producto</label>
                      <input 
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-yellow-400 outline-none transition-all text-white font-bold"
                          placeholder="Ej: Wata-Double Cheese"
                          value={newProduct.name || ''}
                          onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                      />
                  </div>
                  <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Precio (Guaraníes)</label>
                      <input 
                          required
                          type="number"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 focus:border-yellow-400 outline-none transition-all text-yellow-400 font-black text-xl"
                          placeholder="45000"
                          value={newProduct.price || ''}
                          onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      />
                  </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Descripción</label>
                  <button 
                    type="button"
                    onClick={handleAIDescription}
                    disabled={loadingAI}
                    className="bg-yellow-400 text-black px-4 py-1.5 rounded-full hover:bg-white transition-all font-black flex items-center gap-2 uppercase text-[9px] tracking-tighter"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    {loadingAI ? 'Generando...' : 'Asistente IA'}
                  </button>
                </div>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 focus:border-yellow-400 outline-none transition-all h-32 resize-none text-gray-300 font-light italic"
                  placeholder="Explica qué lo hace especial..."
                  value={newProduct.description || ''}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>

              <div className="space-y-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Categoría</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {['Classic', 'Signature', 'Sides', 'Drinks'].map(cat => (
                          <button
                              key={cat}
                              type="button"
                              onClick={() => setNewProduct({...newProduct, category: cat as any})}
                              className={`py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                                  newProduct.category === cat 
                                  ? 'bg-yellow-400 border-yellow-400 text-black' 
                                  : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/20'
                              }`}
                          >
                              {cat}
                          </button>
                      ))}
                  </div>
              </div>

              <button className="w-full bg-yellow-400 text-black font-black py-7 rounded-[2.5rem] hover:bg-white transition-all transform active:scale-95 shadow-[0_20px_50px_rgba(250,204,21,0.2)] text-xs uppercase tracking-[0.3em] mt-10">
                PUBLICAR EN MENÚ DIGITAL
              </button>
            </form>
          </section>
        ) : (
          /* Listado de Gestión - Separado y Enfocado */
          <section className="max-w-4xl mx-auto space-y-10 animate-fadeIn">
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-8">
                <h3 className="text-3xl font-black uppercase tracking-tighter">LISTADO DE PRODUCTOS</h3>
                <div className="flex gap-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Menú Actual:</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-yellow-400">{products.length} platos</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {products.map(product => (
                <div key={product.id} className="glass-card p-6 md:p-10 rounded-[3rem] flex items-center justify-between group hover:border-yellow-400/50 transition-all border-white/5 relative overflow-hidden">
                  <div className="flex items-center gap-6 md:gap-10">
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl shrink-0">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <span className="text-[8px] bg-white/10 text-yellow-400 uppercase font-black tracking-widest px-3 py-1 rounded-full border border-yellow-400/10 mb-2 inline-block">
                          {product.category}
                      </span>
                      <h4 className="font-black text-white text-xl md:text-2xl uppercase tracking-tighter group-hover:text-yellow-400 transition-colors leading-tight">{product.name}</h4>
                      <p className="text-yellow-400 font-black text-lg md:text-xl mt-1">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className="w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-gray-600 hover:bg-red-500 hover:text-white rounded-2xl transition-all border border-white/5 hover:border-red-500 group-hover:scale-110 shrink-0"
                    title="Eliminar del menú"
                  >
                    <i className="fa-solid fa-trash-can text-lg"></i>
                  </button>
                  
                  {/* Subtle Background Accent */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[80px] -mr-10 -mt-10"></div>
                </div>
              ))}
            </div>
            
            {products.length === 0 && (
                <div className="text-center py-40 opacity-20">
                    <i className="fa-solid fa-store-slash text-9xl mb-6"></i>
                    <p className="font-bungee text-2xl uppercase">No hay productos publicados</p>
                    <button onClick={() => setActiveTab('ADD')} className="mt-8 text-yellow-400 font-black uppercase tracking-widest border-b border-yellow-400 pb-1 hover:text-white hover:border-white transition-all">Empezar a añadir</button>
                </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
