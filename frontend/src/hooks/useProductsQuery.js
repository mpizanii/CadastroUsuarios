import { useQuery } from '@tanstack/react-query';
import { getProducts } from '../services/productsService';

export function useProductsQuery() {
  return useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
    staleTime: 60_000,          
    refetchOnWindowFocus: true, 
  });
}