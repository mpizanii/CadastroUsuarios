import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts() {
    const response = await axios.get(`${API_URL}/Produtos`);
    if (response.status !== 200) {
        console.error("Erro ao buscar os usuários");
        return;
    }

    return response.data;
}

export async function getRecipes() {
    const response = await axios.get(`${API_URL}/Receitas`);
    if (response.status !== 200) {
        console.error("Erro ao buscar os usuários");
        return;
    }

    return response.data;
}

export const addProduct = async ({ name, price, recipeId, cost }) => {
    try {
        const novoProduto = {
            nome: name,
            preco: price,
            receita_id: recipeId,
            custo: cost
        };
        const response = await axios.post(`${API_URL}/Produtos`, novoProduto);

        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    } catch (error) {
        throw error;
    }
}

export const editProduct = async ({ nome, preco, custo, id }) => {
    try {
        const response = await axios.patch(`${API_URL}/Produtos/${id}`, {
            nome,
            preco,
            custo,
        });

        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    }
    catch (error) { 
        throw error;  
    }
}

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${API_URL}/Produtos/${id}`);

        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    }
    catch (error) {
        throw error;
    }
}

export const addRecipe = async ({ name, modo_preparo, ingredientes }) => {
    try {
        const novaReceita = {
            nome: name,
            modo_Preparo: modo_preparo,
            ingredientes: ingredientes
        };
        console.log("Nova receita " + novaReceita);

        const response = await axios.post(`${API_URL}/Receitas`, novaReceita);
        
        if (response.status === 200 || response.status === 201) {
            return response.data; 
        }
    } catch (error) {
        throw error;
    }
}