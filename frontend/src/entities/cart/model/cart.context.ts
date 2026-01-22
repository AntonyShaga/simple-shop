import { createContext, type Dispatch, type SetStateAction } from 'react';
import type { CartItem } from './types.ts';

export type CartContextType = [CartItem[], Dispatch<SetStateAction<CartItem[]>>];

export const CartContext = createContext<CartContextType | null>(null);
