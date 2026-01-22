export type OrdersResponse = {
    data: OrderRow[];
    page: number;
    limit: number;
    total: number;
};


export type OrderRow = {
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
};

type OrderStatus = 'CREATED' | 'PAID' | 'CANCELLED';

export type OrderDetailRow = {
    id: string;
    order_id: string;
    pizza_id: string;
    quantity: number;
    price: number;
};

export type CreateOrderItem = {
    pizzaId: string;
    quantity: number;
};

export type CreateOrderRequest = {
    items: CreateOrderItem[];
};

export type CreateOrderResponse = {
    ok: true;
    orderId: string;
    total: number;
};

export type OrderJoinRow = {
    order_id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;

    order_detail_id: string;
    quantity: number;
    price: number;

    pizza_name: string;

    pizza_id: string;
    pizza_type_id: string;
    size: 'S' | 'M' | 'L';
};

export type OrderByIdResponse = {
    id: string;
    status: OrderStatus;
    total_amount: number;
    created_at: string;
    items: OrderItemResponse[];
} | null;

export type OrderItemResponse = {
    pizza_id: string;
    image: string;
    size: 'S' | 'M' | 'L';
    quantity: number;
    name: string;
    price: number;
};