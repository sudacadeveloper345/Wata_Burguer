
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: 'Classic' | 'Signature' | 'Sides' | 'Drinks';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export enum View {
  MENU = 'MENU',
  ADMIN = 'ADMIN'
}
