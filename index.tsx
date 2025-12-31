
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Product, CartItem, View } from './types';
import { INITIAL_PRODUCTS } from './constants';
import BurgerCard from './components/BurgerCard';
import AdminPanel from './components/AdminPanel';
import Cart from './components/Cart';

const App = () => {
  const [view, setView] = useState<View>(View.MENU);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem('burger_admin_session') === 'true';
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('burger_master_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('burger_master_products', JSON.stringify(products));
  }, [products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const logoutAdmin = () => {
    localStorage.removeItem('burger_admin_session');
    setIsAdminAuthenticated(false);
    setView(View.MENU);
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalAmount = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('es-PY') + ' ₲';
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-white selection:bg-yellow-400 selection:text-black">
      {/* Video de fondo para el menú (sutil y oscuro) */}
      {view === View.MENU && (
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="menu-bg-video"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-frying-a-hamburger-meat-on-a-grill-23164-large.mp4" type="video/mp4" />
        </video>
      )}

      {/* Header Premium */}
      <header className="fixed top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-center bg-black/20 backdrop-blur-md border-b border-white/5">
        <div 
          className="flex items-center gap-4 cursor-pointer group" 
          onClick={() => setView(View.MENU)}
        >
          <div className="bg-yellow-400 w-11 h-11 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(250,204,21,0.5)] group-hover:rotate-[360deg] transition-all duration-700 overflow-hidden">
            <span className="text-black font-black text-2xl italic">W</span>
          </div>
          <h1 className="font-bungee text-2xl tracking-tighter text-white">
            WATA<span className="text-yellow-400">BURGUER</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setView(view === View.MENU ? View.ADMIN : View.MENU)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all border text-[10px] font-black uppercase tracking-[0.2em] ${
              view === View.ADMIN 
              ? 'bg-yellow-400 border-yellow-400 text-black' 
              : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
            }`}
          >
            <i className={`fa-solid ${isAdminAuthenticated ? 'fa-fingerprint' : 'fa-lock'}`}></i>
            <span className="hidden md:inline">{isAdminAuthenticated ? 'Panel Dueño' : 'Admin'}</span>
          </button>
          
          {view === View.MENU && (
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative w-14 h-14 bg-yellow-400 rounded-2xl flex items-center justify-center text-black hover:scale-110 transition-all active:scale-90 shadow-[0_0_40px_rgba(250,204,21,0.3)]"
            >
              <i className="fa-solid fa-burger text-2xl"></i>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-black text-[10px] font-black w-7 h-7 rounded-full flex items-center justify-center shadow-2xl border-2 border-black">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </header>

      {/* Hero Cinematic Section */}
      {view === View.MENU && (
        <section className="relative h-[95vh] video-bg-container flex items-center justify-center rounded-b-[4rem]">
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="video-bg"
            poster="https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1920"
          >
            <source src="https://assets.mixkit.co/videos/preview/mixkit-tasty-cheeseburger-with-french-fries-and-soda-close-up-34324-large.mp4" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/30 to-black/10"></div>
          
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
            <div className="animate-fadeIn max-w-5xl space-y-10">
              <span className="inline-block glass-card px-6 py-3 rounded-full text-yellow-400 text-[10px] font-black uppercase tracking-[0.5em] animate-pulse border-yellow-400/30">
                La Mejor de Paraguay
              </span>
              
              <h2 className="text-8xl md:text-[12rem] font-bungee text-white uppercase leading-[0.8] tracking-tighter text-glow floating-item">
                WATA<br/><span className="text-yellow-400">GRILL</span>
              </h2>
              
              <p className="text-gray-300 max-w-xl mx-auto text-lg md:text-xl font-light leading-relaxed opacity-90 italic">
                Sabor ahumado, carne premium y el secreto de la casa en cada bocado.
              </p>
              
              <div className="pt-6">
                <button 
                  onClick={() => document.getElementById('menu-grid')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-black font-black px-14 py-6 rounded-3xl text-sm uppercase tracking-[0.3em] hover:bg-yellow-400 transition-all transform hover:scale-105 active:scale-95 shadow-[0_30px_60px_rgba(255,255,255,0.1)]"
                >
                  Ver el Menú <i className="fa-solid fa-arrow-down ml-3"></i>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Menu Content */}
      <main className={`flex-grow container mx-auto px-6 pb-48 ${view === View.ADMIN ? 'pt-32' : 'pt-24'}`}>
        {view === View.MENU ? (
          <div className="space-y-24">
            <div className="flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-1 bg-yellow-400 rounded-full"></div>
              <h3 className="text-5xl font-bungee text-white tracking-tighter">NUESTROS PEDIDOS</h3>
            </div>
            <div id="menu-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12 animate-fadeIn">
              {products.map(product => (
                <BurgerCard 
                  key={product.id} 
                  product={product} 
                  onAddToCart={addToCart} 
                />
              ))}
            </div>
          </div>
        ) : (
          <AdminPanel 
            products={products} 
            setProducts={setProducts} 
            isAuthenticated={isAdminAuthenticated}
            onLogin={() => setIsAdminAuthenticated(true)}
            onLogout={logoutAdmin}
          />
        )}
      </main>

      {/* Mobile Sticky Checkout */}
      {view === View.MENU && totalItems > 0 && !isCartOpen && (
        <div className="fixed bottom-10 left-0 right-0 px-6 z-40 flex justify-center">
           <button 
            onClick={() => setIsCartOpen(true)}
            className="w-full max-w-lg bg-yellow-400 text-black py-6 rounded-3xl font-black text-sm shadow-[0_40px_100px_rgba(250,204,21,0.5)] flex items-center justify-between px-10 transition-all hover:scale-[1.02] active:scale-95 animate-bounce border-t-4 border-yellow-500/30"
          >
            <span className="uppercase tracking-widest">Mi Pedido ({totalItems})</span>
            <span className="text-xl font-black">{formatCurrency(totalAmount)}</span>
          </button>
        </div>
      )}

      <Cart 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
        items={cart} 
        setItems={setCart} 
      />

      <footer className="py-24 text-center border-t border-white/5 bg-black/80 relative">
        <div className="font-bungee text-6xl mb-6 text-white/5 select-none tracking-widest">WATABURGUER</div>
        <p className="text-gray-500 text-[10px] uppercase tracking-[0.8em] font-black">
          Wataburguer &bull; Hecho con fuego &bull; 2024
        </p>
      </footer>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
