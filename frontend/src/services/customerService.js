import api from '../utils/axiosInstance';

export async function getCustomers() {
    try {
        const response = await api.get('/clientes');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar os clientes:", error);
        throw new Error("Erro ao carregar clientes");
    }
}

export const addCustomer = async ({ name, email, phone, address }) => {
    try {
        const response = await api.post('/clientes', {
            nome: name,
            email: email,
            telefone: phone,
            endereco: address,
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao adicionar cliente:", error);
        throw new Error("Erro ao adicionar cliente");
    }
}

export const editCustomer = async ({ nome, email, telefone, endereco, id }) => {
    try {
        const response = await api.patch(`/clientes/${id}`, {
            nome,
            email,
            telefone,
            endereco
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao editar cliente:", error);
        throw new Error("Erro ao editar cliente");
    }
}

export const deleteCustomer = async (id) => {
    try {
        await api.delete(`/clientes/${id}`);
    } catch (error) {
        console.error("Erro ao deletar cliente:", error);
        throw new Error("Erro ao deletar cliente");
    }
}
