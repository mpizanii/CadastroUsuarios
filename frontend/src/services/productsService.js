import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
    try {
        const response = await axios.get(`${API_URL}/Produtos`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw new Error('Erro ao carregar produtos');
    }
}

export async function getRecipes() {
    try {
        const response = await axios.get(`${API_URL}/Receitas`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        throw new Error('Erro ao carregar receitas');
    }
}

export const addProduct = async ({ name, price, cost, ativo = true }) => {
    try {
        const novoProduto = {
            nome: name,
            preco: price,
            custo: cost,
            ativo: ativo
        };
        const response = await axios.post(`${API_URL}/Produtos`, novoProduto);
        return response.data; 
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        throw new Error('Erro ao adicionar produto');
    }
}

export const editProduct = async ({ nome, preco, custo, receita_id, ativo, id }) => {
    try {
        const response = await axios.put(`${API_URL}/Produtos/${id}`, {
            id,
            nome,
            preco,
            custo,
            receita_id,
            ativo
        });

        console.log("Produto editado com sucesso:", response.data);
        return response.data; 
    }
    catch (error) { 
        console.error('Erro ao editar produto:', error);
        throw new Error('Erro ao editar produto');
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Produtos/${id}`);
        return response.data; 
    }
    catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw new Error('Erro ao deletar produto');
    }
}