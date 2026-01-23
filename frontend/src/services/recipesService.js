import axios from "axios";

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

        const productsResponse = await axios.get(`${API_URL}/Produtos`);
        const associatedProduct = productsResponse.data.find(p => p.receita_Id === parseInt(id));

        const ingredientesData = await getIngredientesComMapeamento(id);

        const insumosData = await getInsumos();
        
        return {recipe: response.data, product: associatedProduct, ingredientes: ingredientesData, insumos: insumosData};
    } catch (error) {
        console.error("Erro ao buscar detalhes da receita:", error);
        return null;
    }
}

export async function getIngredientesComMapeamento(receitaId) {
    try {
        console.log(`Buscando ingredientes com mapeamento para receita ${receitaId}`);
        const response = await axios.get(`${API_URL}/Mapeamento/receita/${receitaId}`);
        console.log("Ingredientes com mapeamento:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar ingredientes com mapeamento:", error);
        return [];
    }
}

export async function getInsumos() {
    try {
        console.log("Buscando insumos...");
        const response = await axios.get(`${API_URL}/Insumos`);
        console.log("Insumos encontrados:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar insumos:", error);
        return [];
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
