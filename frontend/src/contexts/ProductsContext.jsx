import { createContext, useContext, useState, useCallback } from "react";
import { getProducts } from "../pages/productsPage/ApiCalls";

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchProducts = useCallback(async () => {
        console.log("Buscando produtos da API");
        setLoading(true);

        try {
            const data = await getProducts();
            setProducts(data || []);

            console.log("Produtos atualizados da API");
            return data;
        } catch (error) {
            console.error("Erro ao buscar produtos:", error);
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const invalidateCache = useCallback(() => {
        setLastFetch(null);
    }, []);

    const value = {
        products,
        loading,
        fetchProducts,
        setProducts
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