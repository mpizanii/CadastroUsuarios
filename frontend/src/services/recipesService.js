import api from '../utils/axiosInstance';

export const addRecipe = async ({ name, modoPreparo, ingredientes }) => {
    try {
        const response = await api.post('/receitas', {
            nome: name,
            modoPreparo,
            ingredientes,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar receita:', error);
        throw new Error('Erro ao adicionar receita');
    }
}

export async function getRecipeDetails(id) {
    try {
        const [recipeRes, productRes] = await Promise.all([
            api.get(`/receitas/${id}`),
            api.get(`/produtos/receita/${id}`),
        ]);
        return { recipe: recipeRes.data, product: productRes.data };
    } catch (error) {
        console.error("Erro ao buscar detalhes da receita:", error);
        return null;
    }
}

// Java usa PUT (upsert idempotente) em /receitas/ingredientes/{id}/mapeamento
export async function mapearIngrediente(ingredienteId, insumoId, fatorConversao) {
    try {
        const response = await api.put(
            `/receitas/ingredientes/${ingredienteId}/mapeamento`,
            { insumoId, fatorConversao }
        );
        return response.data;
    } catch (error) {
        console.error("Erro ao mapear ingrediente:", error);
        throw error;
    }
}

export async function removerMapeamento(ingredienteId) {
    try {
        await api.delete(`/receitas/ingredientes/${ingredienteId}/mapeamento`);
    } catch (error) {
        throw error;
    }
}
