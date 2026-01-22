import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getInsumos = async () => {
    try {
        const response = await axios.get(`${API_URL}/Insumos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar insumos:', error);
        throw new Error('Erro ao carregar insumos');
    }
};

export const getInsumosComAlertas = async () => {
    try {
        const response = await axios.get(`${API_URL}/Insumos/alertas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar alertas:', error);
        throw new Error('Erro ao carregar alertas');
    }
};

export const getInsumoById = async (id) => {
    try {
        const response = await axios.get(`${API_URL}/Insumos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar insumo:', error);
        throw new Error('Erro ao carregar insumo');
    }
};

export const addInsumo = async (insumo) => {
    try {
        const response = await axios.post(`${API_URL}/Insumos`, insumo);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar insumo:', error);
        throw new Error('Erro ao adicionar insumo');
    }
};

export const editInsumo = async (id, insumo) => {
    try {
        const response = await axios.patch(`${API_URL}/Insumos/${id}`, insumo);
        return response.data;
    } catch (error) {
        console.error('Erro ao editar insumo:', error);
        throw new Error('Erro ao editar insumo');
    }
};

export const deleteInsumo = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Insumos/${id}`);
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar insumo:', error);
        throw new Error('Erro ao deletar insumo');
    }
};
