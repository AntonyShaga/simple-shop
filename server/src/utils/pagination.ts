export function getPaginationParams(
    query: any,
    options?: {
        defaultLimit?: number;
        maxLimit?: number;
    }
) {
    const DEFAULT_LIMIT = options?.defaultLimit ?? 5;
    const MAX_LIMIT = options?.maxLimit ?? 50;

    const pageRaw = Number(query.page);
    const limitRaw = Number(query.limit);

    const page =
        Number.isInteger(pageRaw) && pageRaw > 0 ? pageRaw : 1;

    const limitRequested =
        Number.isInteger(limitRaw) && limitRaw > 0
            ? limitRaw
            : DEFAULT_LIMIT;

    const limit = Math.min(limitRequested, MAX_LIMIT);
    const offset = (page - 1) * limit;

    return {
        page,
        limit,
        offset,
    };
}
