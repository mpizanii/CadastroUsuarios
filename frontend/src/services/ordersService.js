import api from '../utils/axiosInstance';

export const getPedidos = async () => {
    try {
        const response = await api.get('/pedidos');
        return response.data.content;
    } catch (error) {
        console.error('Erro ao buscar pedidos:', error);
        throw new Error('Erro ao carregar pedidos');
    }
};

export const getPedidoById = async (id) => {
    try {
        const response = await api.get(`/pedidos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar pedido:', error);
        throw new Error('Erro ao carregar pedido');
    }
};

export const addPedido = async (pedido) => {
    try {
        const response = await api.post('/pedidos', pedido);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar pedido:', error);
        throw new Error('Erro ao adicionar pedido');
    }
};

export const updatePedidoStatus = async (id, status) => {
    try {
        const response = await api.patch(`/pedidos/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Erro ao atualizar status');
    }
};

export const deletePedido = async (id) => {
    try {
        const response = await api.delete(`/pedidos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        throw new Error('Erro ao deletar pedido');
    }
};

export const verificarMapeamentoProdutos = async (produtos) => {
    try {
        const response = await api.post('/pedidos/verificar-mapeamento', produtos);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar mapeamento:', error);
        throw new Error('Erro ao verificar mapeamento');
    }
};

export const darBaixaEstoque = async (pedidoId) => {
    try {
        const response = await api.post(`/pedidos/${pedidoId}/baixa-estoque`);
        return response.data;
    } catch (error) {
        console.error('Erro ao dar baixa no estoque:', error);
        throw new Error('Erro ao dar baixa no estoque');
    }
};

export const verificarEstoquePedido = async (produtos) => {
    try {
        const response = await api.post('/pedidos/verificar-estoque', produtos);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar estoque:', error);
        throw new Error('Erro ao verificar estoque');
    }
};
