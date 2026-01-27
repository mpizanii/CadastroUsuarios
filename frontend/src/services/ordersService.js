import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getPedidos = async () => {
    try {
        const response = await axios.get(`${API_URL}/Pedidos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw new Error('Erro ao carregar pedidos');
    }
};

export const getPedidoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Pedidos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        throw new Error('Erro ao carregar pedido');
    }
};

export const addPedido = async (pedido) => {
    try {
        const response = await axios.post(`${API_URL}/Pedidos`, pedido);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar pedido:', error);
        throw new Error('Erro ao adicionar pedido');
    }
};

export const updatePedidoStatus = async (id, status) => {
    try {
        const response = await axios.patch(`${API_URL}/Pedidos/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Erro ao atualizar status');
    }
};

export const deletePedido = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Pedidos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        throw new Error('Erro ao deletar pedido');
    }
};

export const verificarMapeamentoProdutos = async (produtos) => {
    try {
        const response = await axios.post(`${API_URL}/Pedidos/verificar-mapeamento`, produtos);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar mapeamento:', error);
        throw new Error('Erro ao verificar mapeamento');
    }
};

export const darBaixaEstoque = async (pedidoId) => {
    try {
        const response = await axios.post(`${API_URL}/Pedidos/${pedidoId}/baixa-estoque`);
        return response.data;
    } catch (error) {
        console.error('Erro ao dar baixa no estoque:', error);
        throw new Error('Erro ao dar baixa no estoque');
    }
};

export const verificarEstoquePedido = async (produtos) => {
    try {
        const response = await axios.post(`${API_URL}/Pedidos/verificar-estoque`, produtos);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar estoque:', error);
        throw new Error('Erro ao verificar estoque');
    }
}