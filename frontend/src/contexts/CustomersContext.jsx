import { createContext, useContext, useState, useCallback } from "react";
import { getCustomers } from "../pages/usersPage/ApiCalls";

const CustomersContext = createContext();

export function CustomersProvider({ children }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchCustomers = useCallback(async () => {
        console.log("Buscando clientes da API");
        setLoading(true);
        setError(null);

        try {
            const data = await getCustomers();
            setCustomers(data || []);

            console.log("Clientes atualizados da API");
            return data;
        } catch (error) {
            console.error("Erro ao buscar clientes:", error);
            setError(error.message || "Erro ao buscar clientes");
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const addCustomer = useCallback((newCustomer) => {
        setCustomers((prevCustomers) => [...prevCustomers, newCustomer]);
        console.log("Cliente adicionado localmente: ", newCustomer);
    }, []);

    const updateCustomer = useCallback((updatedCustomer) => {
        setCustomers(prevCustomers => prevCustomers.map(customer => customer.id === updatedCustomer.id ? updatedCustomer : customer));
        console.log("Cliente atualizado localmente: ", updatedCustomer);
    }, []);

    const removeCustomer = useCallback((customerId) => {
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
        console.log("Cliente removido localmente");
    }, []);

    const value = {
        customers,
        loading,
        error,
        fetchCustomers,
        setCustomers,
        addCustomer,
        updateCustomer,
        removeCustomer
    };

    return (
        <CustomersContext.Provider value={value}>
            {children}
        </CustomersContext.Provider>
    )
}

export function useCustomers() {
    const context = useContext(CustomersContext);
    if (!context) {
        throw new Error("useCustomers must be used within a CustomersProvider");
    }
    return context;
}