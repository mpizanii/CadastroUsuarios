import { createContext, useContext, useState, useCallback, useMemo } from "react";
import { getPedidos } from "../services/ordersService";
import { getCustomers } from "../services/customerService";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
    const [orders, setOrders] = useState([]);
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

    const fetchCustomers = useCallback(async () => {
        try {
            const clientesData = await getCustomers();
            setClientesDisponiveis(clientesData || []);
        } catch (error) {
            console.error("Erro ao carregar clientes:", error);
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

    const value = useMemo(() => ({
        orders,
        loading,
        error,
        clientesDisponiveis,
        fetchOrders,
        fetchCustomers,
        setOrders,
        addOrder,
        updateOrder,
        removeOrder
    }), [orders, loading, error, clientesDisponiveis, fetchOrders, fetchCustomers, setOrders, addOrder, updateOrder, removeOrder]);

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