import axios from "axios";
import { useStock } from "../contexts/StockContext";

const API_URL = import.meta.env.VITE_API_URL;

export const addRecipe = async ({ name, modo_preparo, ingredientes }) => {
    try {
        const novaReceita = {
            nome: name,
            modo_Preparo: modo_preparo,
            ingredientes: ingredientes
        };
        const response = await axios.post(`${API_URL}/Receitas`, novaReceita);
        return response.data; 
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        throw new Error('Erro ao adicionar receita');
    }
}

export async function getRecipeDetails(id) {
    try {
        const response = await axios.get(`${API_URL}/Receitas/${id}`);

        const associatedProduct = await axios.get(`${API_URL}/Produtos/receita/${id}`);
        
        return {recipe: response.data, product: associatedProduct.data };
    } catch (error) {
        console.error("Erro ao buscar detalhes da receita:", error);
        return null;
    }
}

export async function mapearIngrediente(ingredienteId, insumoId, fatorConversao) {
    try {
        console.log("Mapeando ingrediente:", { ingredienteId, insumoId, fatorConversao });
        const response = await axios.post(`${API_URL}/Mapeamento`, {
            ingredienteId,
            insumoId,
            fatorConversao
        });
        console.log("Mapeamento criado:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao mapear ingrediente:", error);
        throw error;
    }
}

export async function removerMapeamento(ingredienteId) {
    try {
        const response = await axios.delete(`${API_URL}/Mapeamento/${ingredienteId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}
