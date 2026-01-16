import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getPedidos = async () => {
    try {
        console.log('Buscando pedidos...');
        const response = await axios.get(`${API_URL}/Pedidos`);
        console.log('Pedidos recebidos:', response.data);
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
        console.log('Adicionando pedido:', pedido);
        const response = await axios.post(`${API_URL}/Pedidos`, pedido);
        console.log('Pedido adicionado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar pedido:', error);
        throw new Error('Erro ao adicionar pedido');
    }
};

export const updatePedidoStatus = async (id, status) => {
    try {
        console.log('Atualizando status do pedido:', id, status);
        const response = await axios.patch(`${API_URL}/Pedidos/${id}/status`, { status });
        console.log('Status atualizado');
        return response.data;
    } catch (error) {
        console.error('Erro ao atualizar status:', error);
        throw new Error('Erro ao atualizar status');
    }
};

export const deletePedido = async (id) => {
    try {
        console.log('Deletando pedido:', id);
        const response = await axios.delete(`${API_URL}/Pedidos/${id}`);
        console.log('Pedido deletado');
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar pedido:', error);
        throw new Error('Erro ao deletar pedido');
    }
};

export const verificarMapeamentoProdutos = async (produtos) => {
    try {
        console.log('Verificando mapeamento de produtos:', produtos);
        const response = await axios.post(`${API_URL}/Pedidos/verificar-mapeamento`, produtos);
        console.log('Resultado verificação:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao verificar mapeamento:', error);
        throw new Error('Erro ao verificar mapeamento');
    }
};

export const darBaixaEstoque = async (pedidoId) => {
    try {
        console.log('Dando baixa no estoque para pedido:', pedidoId);
        const response = await axios.post(`${API_URL}/Pedidos/${pedidoId}/baixa-estoque`);
        console.log('Baixa realizada');
        return response.data;
    } catch (error) {
        console.error('Erro ao dar baixa no estoque:', error);
        throw new Error('Erro ao dar baixa no estoque');
    }
};