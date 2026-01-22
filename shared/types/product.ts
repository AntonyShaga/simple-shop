export type PizzaTypesResponse = {
    data: PizzaTypeApi[];
    page: number;
    limit: number;
    total: number;
} | null;

export type PizzaType = {
    pizza_type_id: string;
    name: string;
    category: string;
    ingredients: string;
};

export type PizzaSku = {
    pizza_id: string;
    size: 'S' | 'M' | 'L';
    price: number;
};

export type WithImage = {
    image: string;
};

export type PizzaTypeApi = PizzaType & WithImage;

export type PizzaOfDayRow = PizzaType & PizzaSku;

export type PizzaDetailsResponse = PizzaTypeApi & {
    items: PizzaSku[];
} | null;


export type PizzaPriceRow = PizzaSku & {
    pizza_type_id: string;
};

export type ErrorResponse = { error: string };
