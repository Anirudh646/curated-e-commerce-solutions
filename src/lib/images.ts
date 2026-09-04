// Category-aware image fallbacks so a broken/missing URL never shows a blank tile.
const CATEGORY_FALLBACKS: Record<string, string> = {
  Electronics: 'photo-1498049794561-7780e7231661',
  Fashion: 'photo-1445205170230-053b83016050',
  Home: 'photo-1513694203232-719a280e022f',
  Accessories: 'photo-1523170335258-f5ed11844a49',
  Sports: 'photo-1517649763962-0c623066013b',
  Beauty: 'photo-1596462502278-27bfdc403348',
  Kitchen: 'photo-1556911220-bff31c812dba',
  Books: 'photo-1512820790803-83ca734da794',
  Toys: 'photo-1558060370-d644479cb6f7',
  Footwear: 'photo-1549298916-b41d501d3772',
  Groceries: 'photo-1542838132-92c53300491e',
  Automotive: 'photo-1492144534655-ae79c964c9d7',
  'Pet Supplies': 'photo-1450778869180-41d0601e046e',
  'Health & Wellness': 'photo-1505576399279-565b52d4ac71',
  Furniture: 'photo-1555041469-a586c61ea9bc',
  Stationery: 'photo-1531346878377-a5be20888e57',
};

const GENERIC = 'photo-1441986300917-64674bd600d8';

export function fallbackImage(category?: string | null) {
  const id = (category && CATEGORY_FALLBACKS[category]) || GENERIC;
  return `https://images.unsplash.com/${id}?w=600&h=600&fit=crop`;
}

export function productImage(url?: string | null, category?: string | null) {
  if (!url || !url.startsWith('http')) return fallbackImage(category);
  return url;
}
