import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export const getInsumos = async () => {
    try {
        console.log('Buscando insumos...');
        const response = await axios.get(`${API_URL}/Insumos`);
        console.log('Insumos recebidos:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar insumos:', error);
        throw new Error('Erro ao carregar insumos');
    }
};

export const getInsumosComAlertas = async () => {
    try {
        console.log('Buscando insumos com alertas...');
        const response = await axios.get(`${API_URL}/Insumos/alertas`);
        console.log('Insumos com alertas:', response.data);
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
        console.log('Adicionando insumo:', insumo);
        const response = await axios.post(`${API_URL}/Insumos`, insumo);
        console.log('Insumo adicionado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar insumo:', error);
        throw new Error('Erro ao adicionar insumo');
    }
};

export const editInsumo = async (id, insumo) => {
    try {
        console.log('Editando insumo:', id, insumo);
        const response = await axios.patch(`${API_URL}/Insumos/${id}`, insumo);
        console.log('Insumo editado:', response.data);
        return response.data;
    } catch (error) {
        console.error('Erro ao editar insumo:', error);
        throw new Error('Erro ao editar insumo');
    }
};

export const deleteInsumo = async (id) => {
    try {
        console.log('Deletando insumo:', id);
        const response = await axios.delete(`${API_URL}/Insumos/${id}`);
        console.log('Insumo deletado');
        return response.data;
    } catch (error) {
        console.error('Erro ao deletar insumo:', error);
        throw new Error('Erro ao deletar insumo');
    }
};
