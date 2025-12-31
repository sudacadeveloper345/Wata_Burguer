
import React from 'react';
import { Product } from '../types';

interface BurgerCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
}

const BurgerCard: React.FC<BurgerCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (p: number) => p.toLocaleString('es-PY') + ' ₲';

  return (
    <div className="group relative glass-card rounded-[3.5rem] overflow-hidden transition-all duration-700 hover:shadow-[0_60px_100px_rgba(0,0,0,0.8)] flex flex-col hover:-translate-y-6">
      <div className="relative h-80 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125 group-hover:rotate-2"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-90"></div>
        <div className="absolute top-8 right-8 bg-yellow-400 text-black font-black px-6 py-3 rounded-2xl text-sm shadow-2xl transform group-hover:rotate-12 transition-all">
          {formatPrice(product.price)}
        </div>
        <div className="absolute bottom-10 left-10">
            <span className="text-[9px] uppercase tracking-[0.4em] text-yellow-400 font-black px-4 py-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 backdrop-blur-md">
                {product.category}
            </span>
        </div>
      </div>
      
      <div className="p-12 flex flex-col flex-grow relative -mt-8 bg-transparent">
        <h3 className="text-3xl font-black text-white mb-5 uppercase tracking-tighter group-hover:text-yellow-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-base leading-relaxed mb-12 flex-grow font-light italic opacity-80">
          "{product.description}"
        </p>
        
        <button 
          onClick={() => onAddToCart(product)}
          className="w-full bg-white text-black font-black py-6 rounded-3xl transition-all duration-500 flex items-center justify-center gap-4 group/btn shadow-xl hover:bg-yellow-400 transform active:scale-95"
        >
          <i className="fa-solid fa-fire text-xl transition-transform group-hover/btn:scale-150"></i>
          <span className="uppercase tracking-[0.2em] text-xs font-black">Lo Quiero</span>
        </button>
      </div>
    </div>
  );
};

export default BurgerCard;
