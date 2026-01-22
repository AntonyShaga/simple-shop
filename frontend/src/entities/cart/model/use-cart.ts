import { useContext } from 'react';
import { CartContext } from './cart.context.ts';

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  const [cart, setCart] = context;

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + +item.price * item.quantity, 0);

  return {
    cart,
    setCart,
    totalItems,
    totalPrice,
  };
}
