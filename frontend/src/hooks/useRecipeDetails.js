import { useState, useEffect } from 'react';
import { getRecipeDetails, getIngredientesComMapeamento, mapearIngrediente } from '../services/recipesService';

export const useRecipeDetails = (recipeId) => {
    const [recipe, setRecipe] = useState(null);
    const [product, setProduct] = useState(null);
    const [ingredients, setIngredients] = useState([]);
    const [insumos, setInsumos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRecipeDetails = async () => {
        try {
        setLoading(true);
        setError(null);
        const details = await getRecipeDetails(recipeId);

        setRecipe(details.recipe);
        setProduct(details.product);
        setIngredients(details.ingredientes);
        setInsumos(details.insumos);
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
        
        const ingredientesData = await getIngredientesComMapeamento(recipeId);
        setIngredients(ingredientesData);
        return { sucesso: true };
        } catch (err) {
        console.error("Erro ao mapear ingrediente:", err);
        return { sucesso: false, erro: err.message };
        }
    };

    const calcularProgresso = () => {
        if (!ingredients || ingredients.length === 0) return 0;
        const mapeados = ingredients.filter(ing => ing.mapeado).length;
        return Math.round((mapeados / ingredients.length) * 100);
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
        ingredients,
        insumos,
        loading,
        error,
        handleMapearIngrediente,
        calcularProgresso,
        getModoPreparo,
        refetchRecipe: fetchRecipeDetails
    };
};