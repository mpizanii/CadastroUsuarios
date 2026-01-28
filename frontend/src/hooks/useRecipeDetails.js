import { useState, useEffect } from 'react';
import { getRecipeDetails, mapearIngrediente } from '../services/recipesService';
import { useStock } from '../contexts/StockContext';

export const useRecipeDetails = (recipeId) => {
    const [recipe, setRecipe] = useState(null);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { insumos, fetchInsumos } = useStock();

    const fetchRecipeDetails = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const [details] = await Promise.all([
                getRecipeDetails(recipeId),
                fetchInsumos()
            ]);

            setRecipe(details.recipe);
            setProduct(details.product);
        } catch (err) {
            console.error("Erro ao buscar receita:", err);
            setError(err.message || "Erro ao carregar receita");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (recipeId) {
            fetchRecipeDetails();
        }
    }, [recipeId]);

    const handleMapearIngrediente = async (ingredienteId, insumoId, fatorConversao) => {
        try {
            await mapearIngrediente(ingredienteId, insumoId, fatorConversao);
        
            return { sucesso: true };
        } catch (err) {
            console.error("Erro ao mapear ingrediente:", err);
            return { sucesso: false, erro: err.message };
        }
    };

    const calcularProgresso = () => {
        if (!recipe?.ingredientes || recipe.ingredientes.length === 0) return 0;
            const mapeados = recipe.ingredientes.filter(ing => ing.mapeado).length;
        return Math.round((mapeados / recipe.ingredientes.length) * 100);
    };

    const getModoPreparo = () => {
        if (!recipe?.modo_Preparo) return [];
        return recipe.modo_Preparo
            .split(";")
            .map(s => s.trim())
            .filter(s => s);
    };

    return {
        recipe,
        product,
        insumos,
        loading,
        error,
        handleMapearIngrediente,
        calcularProgresso,
        getModoPreparo,
        refetchRecipe: fetchRecipeDetails
    };
};