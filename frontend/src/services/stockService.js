import api from '../utils/axiosInstance';

export const getInsumos = async () => {
    try {
        const response = await api.get('/insumos');
        return response.data.content;
    } catch (error) {
        console.error('Erro ao buscar insumos:', error);
        throw new Error('Erro ao carregar insumos');
    }
};

export const getInsumosComAlertas = async () => {
    try {
        const response = await api.get('/insumos/alertas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        throw new Error('Erro ao carregar alertas');
    }
};

export const getInsumoById = async (id) => {
    try {
        const response = await api.get(`/insumos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar insumo:', error);
        throw new Error('Erro ao carregar insumo');
    }
};

export const addInsumo = async (insumo) => {
    try {
        const response = await api.post('/insumos', insumo);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar insumo:', error);
        throw new Error('Erro ao adicionar insumo');
    }
};

export const editInsumo = async (id, insumo) => {
    try {
        const response = await api.patch(`/insumos/${id}`, insumo);
        return response.data;
    } catch (error) {
        console.error('Erro ao editar insumo:', error);
        throw new Error('Erro ao editar insumo');
    }
};

export const deleteInsumo = async (id) => {
    try {
        const response = await api.delete(`/insumos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar insumo:', error);
        throw new Error('Erro ao deletar insumo');
    }
};
