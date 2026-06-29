export function getProductsArray<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }

  if (
    data &&
    typeof data === "object" &&
    "products" in data &&
    Array.isArray((data as { products?: unknown }).products)
  ) {
    return (data as { products: T[] }).products;
  }

  return [];
}
