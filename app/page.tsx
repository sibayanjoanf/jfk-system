import HomePage from '@/components/pages/Home';
import { Product } from '@/lib/types';

async function getProducts(category?: string): Promise<Product[]> {
  try {
    const url = category
      ? `http://localhost:3000/api/products?category=${category}`
      : 'http://localhost:3000/api/products';

    const response = await fetch(url, { cache: 'no-store' });
    if (!response.ok) throw new Error('Failed to fetch products');
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function Page() {
  const tilesProducts = await getProducts('Tiles');
  const stonesProducts = await getProducts('Stones');
  const fixturesProducts = await getProducts('Fixtures');

  return (
    <HomePage
      tilesProducts={tilesProducts}
      stonesProducts={stonesProducts}
      fixturesProducts={fixturesProducts}
    />
  );
}