import {Router} from "express";
import {pool} from "@/db.js";
import type {
    ErrorResponse,
    PizzaType,
    PizzaTypesResponse,
    PizzaSku,
    PizzaDetailsResponse,
    PizzaTypeApi, PizzaOfDayRow
} from "@shared/index.js";
import {getPaginationParams} from "@/utils/pagination.js";

export const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
    try {
        const {page, limit, offset} = getPaginationParams(req.query, {
            defaultLimit: Number(process.env.DEFAULT_PAGE_LIMIT) || 5,
            maxLimit: Number(process.env.MAX_PAGE_LIMIT) || 50,
        });


        const dataResult = await pool.query<PizzaType>(
            `
                select pizza_type_id, name, category, ingredients
                from pizza_types
                order by pizza_type_id
                    limit $1
                offset $2
            `,
            [limit, offset]
        );

        const countResult = await pool.query<{ count: string }>(
            `select count(*)
             from pizza_types`
        );

        const [row] = countResult.rows;
        const total = Number(row?.count ?? 0);

        const data: PizzaTypeApi[] = dataResult.rows.map(p => ({
            ...p,
            image: `/public/pizzas/${p.pizza_type_id}.webp`,
        }));

        const response: PizzaTypesResponse = {
            data,
            page,
            limit,
            total,
        };

        res.json(response);
    } catch (err) {
        console.error("GET /products error", err);
        const error: ErrorResponse = {error: "Internal server error"};
        res.status(500).json(error);
    }
});

productsRouter.get("/pizza-of-the-day", async (_req, res) => {
    try {
        const result = await pool.query<PizzaOfDayRow>(`
            select pt.pizza_type_id,
                   pt.name,
                   pt.category,
                   pt.ingredients,

                   p.pizza_id,
                   p.size,
                   p.price
            from pizza_types pt
                     join pizzas p on p.pizza_type_id = pt.pizza_type_id
            order by pt.pizza_type_id, p.size
        `);

        if (result.rows.length === 0) {
            return res.status(404).json({error: "NO_PIZZAS"});
        }

        const daysSinceEpoch = Math.floor(Date.now() / 86400000);
        const pizzaTypeIds = [...new Set(result.rows.map(r => r.pizza_type_id))];
        const index = daysSinceEpoch % pizzaTypeIds.length;
        const pizzaTypeId = pizzaTypeIds[index];

        const rows = result.rows.filter(r => r.pizza_type_id === pizzaTypeId);
        const first = rows[0];

        if (!first) {
            return res.status(500).json({error: "PIZZA_SELECTION_FAILED"});
        }

        const response: PizzaDetailsResponse = {
            pizza_type_id: first.pizza_type_id,
            name: first.name,
            category: first.category,
            ingredients: first.ingredients,
            image: `/public/pizzas/${first.pizza_type_id}.webp`,
            items: rows.map(row => ({
                pizza_id: row.pizza_id,
                size: row.size,
                price: row.price,
            })),
        };

        res.json(response);

    } catch (err) {
        console.error("GET /pizza-of-the-day error", err);
        res.status(500).json({
            error: "INTERNAL_SERVER_ERROR",
            message: "Failed to load pizza of the day",
        });
    }
});
productsRouter.get("/:id", async (req, res) => {
    try {
        const pizzaTypeId = req.params.id;

        const typeRes = await pool.query<PizzaType>(
            `
                select pizza_type_id, name, category, ingredients
                from pizza_types
                where pizza_type_id = $1 limit 1
            `,
            [pizzaTypeId]
        );

        if (typeRes.rows.length === 0) {
            return res.status(404).json({error: "Product not found"});
        }

        const pizzasRes = await pool.query<PizzaSku>(
            `
                select pizza_id, size, price
                from pizzas
                where pizza_type_id = $1
                order by size
            `,
            [pizzaTypeId]
        );

        if (pizzasRes.rows.length === 0) {
            return res.status(404).json({error: "No SKUs for product"});
        }

        const pizza = typeRes.rows[0]!;

        const response: PizzaDetailsResponse = {
            ...pizza,
            image: `/public/pizzas/${pizza.pizza_type_id}.webp`,
            items: pizzasRes.rows,
        };

        res.json(response);
    } catch (err) {
        console.error("GET /products/:id error", err);
        res.status(500).json({error: "Internal server error"});
    }
});


