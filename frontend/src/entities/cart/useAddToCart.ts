import { useCart } from './model/use-cart.ts';
import type { PizzaDetailsResponse } from '@simple-shop/shared';

export function useAddToCart() {
  const { setCart } = useCart();

  return function addToCart(product: PizzaDetailsResponse, skuId: string, options?: { replaceItemId?: string }) {
    const selectedItem = product?.items.find((i) => i.pizza_id === skuId);
    if (!selectedItem) return;
    if (!product) return;

    setCart((prev) => {
      if (options?.replaceItemId) {
        const itemToEdit = prev.find((i) => i.pizza_id === options.replaceItemId);
        if (!itemToEdit) return prev;

        const existingTarget = prev.find(
          (i) => i.pizza_id === selectedItem.pizza_id && i.pizza_id !== options.replaceItemId,
        );

        if (existingTarget) {
          return prev
            .filter((i) => i.pizza_id !== options.replaceItemId)
            .map((i) =>
              i.pizza_id === existingTarget.pizza_id ? { ...i, quantity: i.quantity + itemToEdit.quantity } : i,
            );
        }

        return prev.map((i) =>
          i.pizza_id === options.replaceItemId
            ? {
                ...i,
                pizza_id: selectedItem.pizza_id,
                size: selectedItem.size,
                price: selectedItem.price,
              }
            : i,
        );
      }

      const existing = prev.find(
        (i) => i.pizza_type_id === product.pizza_type_id && i.pizza_id === selectedItem.pizza_id,
      );

      if (existing) {
        return prev.map((i) => (i.pizza_id === existing.pizza_id ? { ...i, quantity: i.quantity + 1 } : i));
      }

      return [
        ...prev,
        {
          pizza_id: selectedItem.pizza_id,
          pizza_type_id: product.pizza_type_id,
          name: product.name,
          size: selectedItem.size,
          price: selectedItem.price,
          quantity: 1,
          image_url: product.image,
          selected: true,
        },
      ];
    });
  };
}
