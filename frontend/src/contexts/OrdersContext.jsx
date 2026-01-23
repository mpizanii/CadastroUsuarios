import { createContext, useContext, useState, useCallback } from "react";
import { getPedidos } from "../services/ordersService";
import { getProducts } from "../services/productsService";
import { getCustomers } from "../services/customerService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
    const [produtosDisponiveis, setProdutosDisponiveis] = useState([]);
    const [clientesDisponiveis, setClientesDisponiveis] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await getPedidos();
            setOrders(data || []);

            return data;
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            setError(error.message || "Erro ao buscar pedidos");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchCustomersAndProducts = useCallback(async () => {
        try {
            const [produtosData, clientesData] = await Promise.all([
                getProducts(),
                getCustomers()
            ]);
            setProdutosDisponiveis(produtosData || []);
            setClientesDisponiveis(clientesData || []);
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
        }
    }, []);

    const addOrder = useCallback((newOrder) => {
        setOrders((prevOrders) => [...prevOrders, newOrder]);
        console.log("Pedido adicionado localmente: ", newOrder);
    }, []);

    const updateOrder = useCallback((updatedOrder) => {
        setOrders(prevOrders => prevOrders.map(order => order.id === updatedOrder.id ? updatedOrder : order));
        console.log("Pedido atualizado localmente: ", updatedOrder);
    }, []);

    const removeOrder = useCallback((orderId) => {
        setOrders(prev => prev.filter(order => order.id !== orderId));
        console.log("Pedido removido localmente");
    }, []);

    const value = {
        orders,
        loading,
        error,
        produtosDisponiveis,
        clientesDisponiveis,
        fetchOrders,
        fetchCustomersAndProducts,
        setOrders,
        addOrder,
        updateOrder,
        removeOrder
    };

    return (
        <OrdersContext.Provider value={value}>
            {children}
        </OrdersContext.Provider>
    )
}

export function useOrders() {
    const context = useContext(OrdersContext);
    if (!context) {
        throw new Error("useOrders must be used within a OrdersProvider");
    }
    return context;
}