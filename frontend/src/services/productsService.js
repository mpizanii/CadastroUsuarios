import api from '../utils/axiosInstance';

export async function getProducts() {
    try {
        const response = await api.get('/produtos');
        return response.data.content;
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        throw new Error('Erro ao carregar produtos');
    }
}

export async function getRecipes() {
    try {
        const response = await api.get('/receitas');
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar receitas:', error);
        throw new Error('Erro ao carregar receitas');
    }
}

export const addProduct = async ({ name, price, cost, ativo = true }) => {
    try {
        const response = await api.post('/produtos', {
            nome: name,
            preco: price !== undefined && price !== '' ? Number(price) : 0,
            custo: cost !== undefined && cost !== '' ? Number(cost) : 0,
            ativo: ativo ?? true,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar produto:', error);
        throw new Error('Erro ao adicionar produto');
    }
}

// Java usa PUT com semântica de full-replace (todos os campos obrigatórios exceto receitaId)
export const editProduct = async ({ nome, preco, custo, receitaId, ativo, id }) => {
    try {
        const response = await api.put(`/produtos/${id}`, {
            nome,
            preco: preco !== undefined && preco !== '' ? Number(preco) : 0,
            custo: custo !== undefined && custo !== '' ? Number(custo) : 0,
            ativo: ativo ?? true,
            receitaId: receitaId ?? null,
        });
        return response.data;
    } catch (error) {
        console.error('Erro ao editar produto:', error);
        throw new Error('Erro ao editar produto');
    }
}

export const deleteProduct = async (id) => {
    try {
        await api.delete(`/produtos/${id}`);
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        throw new Error('Erro ao deletar produto');
    }
}
