import "dotenv/config";
import express from "express";
import cors from "cors";
import {productsRouter} from "./routes/products/ products.routes.js";
import path from 'path';
import {ordersRouter} from "@/routes/orders/orders.routes.js";


const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
    res.json({status: "ok"});
});

app.use('/public', express.static(path.join(process.cwd(), 'public')));

app.use("/products", productsRouter);
app.use("/orders", ordersRouter);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

