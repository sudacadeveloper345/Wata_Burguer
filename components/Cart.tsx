
import React from 'react';
import { CartItem } from '../types';
import { WHATSAPP_NUMBER } from '../constants';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, setItems }) => {
  const total = items.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  const formatPrice = (p: number) => p.toLocaleString('es-PY') + ' ₲';

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.product.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const finalizeOrder = () => {
    if (items.length === 0) return;
    
    const orderID = `WATA-${Math.floor(1000 + Math.random() * 9000)}`;
    const date = new Date().toLocaleDateString('es-PY');
    
    let message = `*🔥 NUEVA ORDEN WATABURGUER 🔥*%0A`;
    message += `*Orden:* #${orderID}%0A`;
    message += `*Fecha:* ${date}%0A`;
    message += `------------------------------------------%0A%0A`;
    
    items.forEach(item => {
      message += `🛒 *${item.quantity}x ${item.product.name}*%0A`;
      message += `   _Precio: ${formatPrice(item.product.price * item.quantity)}_%0A%0A`;
    });
    
    message += `------------------------------------------%0A`;
    message += `💰 *TOTAL A PAGAR: ${formatPrice(total)}*%0A%0A`;
    message += `✅ _Confirmar pedido para Wataburguer. ¿Tiempo de entrega estimado?_`;
    
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className={`fixed inset-0 z-[100] flex justify-end transition-all ${isOpen ? 'visible' : 'invisible'}`}>
      <div 
        className={`absolute inset-0 bg-black/90 backdrop-blur-2xl transition-opacity duration-700 ${isOpen ? 'opacity-100' : 'opacity-0'}`} 
        onClick={onClose} 
      />
      <div 
        className={`relative w-full max-w-xl bg-[#050505] h-full shadow-[0_0_150px_rgba(0,0,0,1)] flex flex-col transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform ${isOpen ? 'translate-x-0' : 'translate-x-full'} border-l border-white/10`}
      >
        {/* Header Carrito */}
        <div className="p-12 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-bungee text-white tracking-tighter">MI BOLSA</h2>
            <p className="text-[10px] text-yellow-400 font-black uppercase tracking-[0.4em] mt-2">Sabores Listos para el Fuego</p>
          </div>
          <button onClick={onClose} className="w-14 h-14 bg-white/5 hover:bg-yellow-400 hover:text-black rounded-3xl flex items-center justify-center transition-all group">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        {/* Lista Productos */}
        <div className="flex-grow overflow-y-auto p-12 space-y-12">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-10">
              <i className="fa-solid fa-drumstick-bite text-9xl mb-6"></i>
              <p className="font-bungee text-2xl tracking-widest">PEDIDO VACÍO</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-10 group animate-fadeIn">
                <div className="relative shrink-0 w-32 h-32 rounded-[2rem] overflow-hidden border border-white/10">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-grow flex flex-col justify-center">
                  <h3 className="font-black text-white text-2xl uppercase tracking-tighter mb-1">{item.product.name}</h3>
                  <p className="text-yellow-400 font-black text-xl mb-6">{formatPrice(item.product.price * item.quantity)}</p>
                  
                  <div className="flex items-center gap-8">
                    <div className="flex items-center bg-white/5 rounded-2xl p-1 border border-white/10">
                        <button onClick={() => updateQuantity(item.product.id, -1)} className="w-10 h-10 rounded-xl hover:bg-yellow-400 hover:text-black flex items-center justify-center transition-all"><i className="fa-solid fa-minus text-xs"></i></button>
                        <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, 1)} className="w-10 h-10 rounded-xl hover:bg-yellow-400 hover:text-black flex items-center justify-center transition-all"><i className="fa-solid fa-plus text-xs"></i></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout */}
        {items.length > 0 && (
          <div className="p-12 bg-black border-t border-white/10 space-y-10">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-gray-500 text-[10px] font-black uppercase tracking-[0.4em]">
                <span>SUBTOTAL</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between items-center text-white text-5xl font-black uppercase tracking-tighter">
                <span>TOTAL</span>
                <span className="text-yellow-400">{formatPrice(total)}</span>
              </div>
            </div>
            
            <button 
              onClick={finalizeOrder}
              className="w-full bg-[#25D366] hover:bg-white hover:text-black text-white font-black py-7 rounded-[2.5rem] flex items-center justify-center gap-6 transition-all transform active:scale-95 shadow-[0_30px_70px_rgba(37,211,102,0.3)]"
            >
              <i className="fa-brands fa-whatsapp text-3xl"></i>
              <span className="uppercase tracking-[0.3em] text-sm font-black">Pedir por WhatsApp</span>
            </button>
            
            <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.5em] font-bold">
               WATABURGUER &bull; ASUNCIÓN &bull; PARAGUAY
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
