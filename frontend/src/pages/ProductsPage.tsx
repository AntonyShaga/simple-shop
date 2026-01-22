import { useQuery } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { fetchProducts } from '../api.ts';
import { ROUTES } from '../shared/routes.ts';
import { API_URL } from '../shared/config.ts';
import Loader from './Loader.tsx';

type Props = {
  page: number;
};

function ProductsPage({ page }: Props) {
  const { data, isFetching, error } = useQuery({
    queryKey: ['products', page],
    queryFn: () => fetchProducts(page),
    placeholderData: (previousData) => previousData,
    staleTime: 30_000,
  });

  if (error) return <div>Error: {error.message}</div>;
  if (!data) {
    return null;
  }

  return (
    <main>
      <section className="container page">
        <h1 id="products-title">Products</h1>
        <div className="page-content">
          <ul className="list-grid list-grid--products" aria-labelledby="products-title">
            {data.data.map((p) => (
              <li key={p.pizza_type_id}>
                <article className="card" aria-label={`Pizza ${p.name}`}>
                  <Link className="card-link" to={ROUTES.product} params={{ id: p.pizza_type_id }}>
                    <h2 className="products-title no-flag">{p.name}</h2>
                    <img className="products-image" src={`${API_URL}${p.image}`} alt={p.name} />
                  </Link>
                </article>
              </li>
            ))}
          </ul>

          <Loader isFetching={isFetching} />
        </div>
        <nav className="pagination" aria-label="Products pagination">
          <Link
            className="pagination-button"
            to={ROUTES.products}
            search={{ page: page - 1 }}
            disabled={page <= 1}
            aria-disabled={page <= 1}
            aria-label="Previous product page"
          >
            Prev
          </Link>
          <span className="pagination-page" aria-current="page">
            Page {page}
          </span>
          <Link
            className="pagination-button"
            to={ROUTES.products}
            search={{ page: page + 1 }}
            disabled={data.data.length < data.limit}
            aria-disabled={data.data.length < data.limit}
            aria-label="Next product page"
          >
            Next
          </Link>
        </nav>
      </section>
    </main>
  );
}

export default ProductsPage;
