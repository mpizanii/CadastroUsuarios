import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addProduct, editProduct, deleteProduct } from '../services/productsService';

export function useProductMutations() {
  const qc = useQueryClient();

  const add = useMutation({
    mutationFn: addProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const edit = useMutation({
    mutationFn: editProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  const del = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['products'] }),
  });

  return { add, edit, del };
}