export type CartItem = {
  pizza_id: string;
  pizza_type_id: string;
  name: string;
  size: 'S' | 'M' | 'L';
  price: number;
  quantity: number;
  image_url: string;
  selected: boolean;
};
