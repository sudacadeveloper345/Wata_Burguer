
import { Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Wata-Beast Special',
    price: 45000,
    description: 'Doble carne madurada, triple cheddar fundido, cebolla crispy y nuestra legendaria salsa secreta Wata.',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
    category: 'Signature'
  },
  {
    id: '2',
    name: 'Classic Wata-Cheese',
    price: 35000,
    description: 'La esencia original: Res seleccionada, queso americano, pepinillos premium y pan brioche artesanal.',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&q=80&w=800',
    category: 'Classic'
  },
  {
    id: '3',
    name: 'Truffle Wata-Fries',
    price: 18000,
    description: 'Papas cortadas a mano con doble cocción, aceite de trufa blanca y lluvia de parmesano.',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
    category: 'Sides'
  },
  {
    id: '4',
    name: 'Wata-Shake Gold',
    price: 22000,
    description: 'Batido de vainilla Bourbon con hilos de caramelo salado y trozos de brownie húmedo.',
    image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
    category: 'Drinks'
  }
];

// Número de WhatsApp configurado según solicitud (+55 11981637762)
export const WHATSAPP_NUMBER = '5511981637762';
