import { createContext, useContext, useState, useCallback } from "react";
import { getInsumos } from "../services/stockService";

const StockContext = createContext();

export function StockProvider({ children }) {
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchInsumos = useCallback(async () => {
        console.log("Buscando insumos da API");
        setLoading(true);
        setError(null);

        try {
            const data = await getInsumos();
            setInsumos(data || []);

            console.log("Insumos atualizados da API");
            return data;
        } catch (error) {
            console.error("Erro ao buscar insumos:", error);
            setError(error.message || "Erro ao buscar insumos");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addInsumo = useCallback((newInsumo) => {
        setInsumos((prevInsumos) => [...prevInsumos, newInsumo]);
        console.log("Insumo adicionado localmente: ", newInsumo);
    }, []);

    const updateInsumo = useCallback((updatedInsumo) => {
        setInsumos(prevInsumos => prevInsumos.map(insumo => insumo.id === updatedInsumo.id ? updatedInsumo : insumo));
        console.log("Insumo atualizado localmente: ", updatedInsumo);
    }, []);

    const removeInsumo = useCallback((insumoId) => {
        setInsumos(prev => prev.filter(insumo => insumo.id !== insumoId));
        console.log("Insumo removido localmente");
    }, []);

    const value = {
        insumos,
        loading,
        error,
        fetchInsumos,
        setInsumos,
        addInsumo,
        updateInsumo,
        removeInsumo
    };

    return (
        <StockContext.Provider value={value}>
            {children}
        </StockContext.Provider>
    )
}

export function useStock() {
    const context = useContext(StockContext);
    if (!context) {
        throw new Error("useStock must be used within a StockProvider");
    }
    return context;
}