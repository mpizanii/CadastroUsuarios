import { createContext, useContext, useState, useCallback } from "react";
import { getProducts } from "../pages/productsPage/ApiCalls";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchProducts = useCallback(async () => {
        console.log("Buscando produtos da API");
        setLoading(true);
        setError(null);

        try {
            const data = await getProducts();
            setProducts(data || []);

            console.log("Produtos atualizados da API");
            return data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            setError(error.message || "Erro ao buscar produtos");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addProduct = useCallback((newProduct) => {
        setProducts((prevProducts) => [...prevProducts, newProduct]);
        console.log("Produto adicionado localmente: ", newProduct);
    }, []);

    const updateProduct = useCallback((updatedProduct) => {
        setProducts(prevProducts => prevProducts.map(product => product.id === updatedProduct.id ? updatedProduct : product));
        console.log("Produto atualizado localmente: ", updatedProduct);
    }, []);

    const removeProduct = useCallback((productId) => {
        setProducts(prev => prev.filter(product => product.id !== productId));
        console.log("Produto removido localmente");
    }, []);

    const value = {
        products,
        loading,
        error,
        fetchProducts,
        setProducts,
        addProduct,
        updateProduct,
        removeProduct
    };

    return (
        <ProductsContext.Provider value={value}>
            {children}
        </ProductsContext.Provider>
    )
}

export function useProducts() {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
}