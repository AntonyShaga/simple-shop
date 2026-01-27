import {z} from 'zod';

export const CreateOrderItemSchema = z.object({
    pizzaId: z.string().min(1),
    quantity: z.number().int().positive(),
});

export const CreateOrderSchema = z.object({
    items: z.array(CreateOrderItemSchema).min(1),
});

export type CreateOrderInput = z.infer<typeof CreateOrderSchema>;
