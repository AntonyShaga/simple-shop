import {Router} from "express";
import {pool} from "@/db.js";
import crypto from "crypto";
import type {PizzaPriceRow} from "@shared/types/product.js";
import type {
    CreateOrderRequest,
    CreateOrderResponse, OrderByIdResponse,
    OrderDetailRow, OrderJoinRow,
    OrderRow,
    OrdersResponse
} from "@shared/types/order.js";
import {CreateOrderSchema} from "@shared/schemas/order.js";
import {getPaginationParams} from "@/utils/pagination.js";

export const ordersRouter = Router();

ordersRouter.post("/", async (req, res) => {
    const client = await pool.connect();

    try {

        const parsed = CreateOrderSchema.safeParse(req.body);

        if (!parsed.success) {
            return res.status(400).json({
                error: 'Invalid payload',
                details: parsed.error.issues,
            });
        }

        const {items} = parsed.data as CreateOrderRequest;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({error: "Items are required"});
        }

        for (const item of items) {
            if (!item.pizzaId || item.quantity <= 0) {
                return res.status(400).json({error: "Invalid item"});
            }
        }

        const pizzasResult = await client.query<PizzaPriceRow>(
            `
                select pizza_id, pizza_type_id, size, price
                from pizzas
                where pizza_id = ANY ($1::text[])
            `,
            [items.map(i => i.pizzaId)]
        );

        const pizzas = pizzasResult.rows;

        const pizzaMap = new Map(
            pizzas.map(p => [p.pizza_id, p])
        );

        if (pizzas.length !== items.length) {
            return res.status(400).json({error: "Some pizzas not found"});
        }

        let total = 0;
        for (const item of items) {
            const pizza = pizzaMap.get(item.pizzaId);
            if (!pizza) return res.status(400).json({error: "Pizza not found"});
            total += pizza.price * item.quantity;
        }

        const orderId = crypto.randomUUID();

        await client.query("BEGIN");

        await client.query<OrderRow>(
            `
                insert into orders (id, status, total_amount, created_at)
                values ($1, 'CREATED', $2, NOW())
            `,
            [orderId, total]
        );

        for (const item of items) {
            const pizza = pizzaMap.get(item.pizzaId);
            if (!pizza) return res.status(400).json({error: "Pizza not found"});

            await client.query<OrderDetailRow>(
                `
                    insert into order_details (id, order_id, pizza_id, quantity, price)
                    values ($1, $2, $3, $4, $5)
                `,
                [
                    crypto.randomUUID(),
                    orderId,
                    item.pizzaId,
                    item.quantity,
                    pizza.price
                ]
            );
        }

        await client.query("COMMIT");

        const response: CreateOrderResponse = {
            ok: true,
            orderId,
            total
        }
        res.status(201).json(response);

    } catch (err) {
        await client.query("ROLLBACK");
        console.error(err);
        res.status(500).json({error: "Order creation failed"});

    } finally {
        client.release();
    }
});

ordersRouter.get("/", async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query, {
            defaultLimit: Number(process.env.DEFAULT_PAGE_LIMIT) || 5,
            maxLimit: Number(process.env.MAX_PAGE_LIMIT) || 50,
        });

        const dataResult = await pool.query<OrderRow>(
            `
                select id, status, total_amount, created_at
                from orders
                order by created_at desc
                    limit $1
                offset $2
            `,
            [limit, offset]
        );

        const countResult = await pool.query<{ count: string }>(
            `select count(*)
             from orders`
        );

        const total = Number(countResult.rows[0]?.count ?? 0);

        const response: OrdersResponse = {
            data: dataResult.rows,
            page,
            limit,
            total,
        };

        res.json(response);

    } catch (err) {
        console.error("GET /orders error", err);
        res.status(500).json({error: "Internal server error"});
    }
});

ordersRouter.get("/:id", async (req, res) => {
    try {
        const orderId = req.params.id;

        const result = await pool.query<OrderJoinRow>(
            `
                select o.id    as order_id,
                       o.status,
                       o.total_amount,
                       o.created_at,

                       od.id   as order_detail_id,
                       od.quantity,
                       od.price,

                       pt.name as pizza_name,

                       p.pizza_id,
                       p.pizza_type_id,
                       p.size
                from orders o
                         join order_details od on od.order_id = o.id
                         join pizzas p on p.pizza_id = od.pizza_id
                         join pizza_types pt on pt.pizza_type_id = p.pizza_type_id
                where o.id = $1
                order by od.id
            `,
            [orderId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "ORDER_NOT_FOUND",
                message: "Order with given id does not exist",
            });
        }

        const {rows} = result;
        const [first] = rows;

        if (!first) {
            return res.status(404).json({
                error: "ORDER_NOT_FOUND",
                message: "Order with given id does not exist",
            });
        }

        const response: OrderByIdResponse = {
            id: first.order_id,
            status: first.status,
            total_amount: first.total_amount,
            created_at: first.created_at,
            items: rows.map(row => ({
                pizza_id: row.pizza_id,
                image: `/public/pizzas/${row.pizza_type_id}.webp`,
                size: row.size,
                name: row.pizza_name,
                quantity: row.quantity,
                price: row.price,
            })),
        };

        res.json(response);

    } catch (err) {
        console.error("GET /orders/:id error", err);
        res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Failed to load order",
        });
    }
});