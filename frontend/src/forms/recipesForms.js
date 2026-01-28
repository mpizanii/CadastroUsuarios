import { useState } from "react";
import { addRecipe } from "../services/recipesService";
import { editProduct } from "../services/productsService";

export const formAddRecipe = ({ onSuccess, selectedProduct }) => {
    const [name, setName] = useState("");
    const [recipeMethod, setRecipeMethod] = useState("");
    const [ingredients, setIngredients] = useState([{ nome: "", quantidade: 0, unidade: "g" }]);
    const [messageFormAddRecipe, setMessageFormAddRecipe] = useState("");
    const [messageTypeFormAddRecipe, setMessageTypeFormAddRecipe] = useState("success");

    const UNIT_OPTIONS = ["g", "ml", "un", "colher", "xícara"];

    const titleFormAddRecipe = `Criar Receita para ${selectedProduct?.nome}`;

    const fieldsFormAddRecipe = [
        { 
            id: "name", 
            label: "Nome", 
            placeholder: selectedProduct?.nome,
            value: name, 
            onChange: setName, 
            required: true 
        },
        { 
            id: "recipeMethod", 
            label: "Modo de Preparo da Receita", 
            type: "textarea", 
            rows: 4, 
            placeholder: 'Descreva o modo de preparo separado por ";". \nEx: passo1; passo2; passo3; ...', 
            value: recipeMethod, 
            onChange: setRecipeMethod 
        },
        { 
            id: "ingredients", 
            label: "Ingredientes da Receita", 
            type: "ingredients-list", 
            value: ingredients,
            unitOptions: UNIT_OPTIONS,
            onAdd: () => setIngredients(prev => [...prev, { nome: "", quantidade: 0, unidade: "g" }]), 
            onRemove: (i) => setIngredients(prev => prev.filter((_, idx) => idx !== i)), 
            onUpdate: (i, field, val) => { const copy = [...ingredients]; copy[i][field] = val; setIngredients(copy); }, 
        }
    ];

    async function handleSubmitFormAddRecipe(e) {
        e.preventDefault();

        try{
            const receita = await addRecipe({ name, modo_preparo: recipeMethod, ingredientes: ingredients });

            await editProduct({ nome: selectedProduct.nome, preco: selectedProduct.preco, custo: selectedProduct.custo, receita_id: receita.id, ativo: selectedProduct.ativo, id: selectedProduct.id });
            setMessageTypeFormAddRecipe("success");
            setMessageFormAddRecipe("Receita adicionada com sucesso.");
            setName("");
            setRecipeMethod("");
            setIngredients([{ nome: "", quantidade: 0, unidade: "g" }]);
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddRecipe("error");
            setMessageFormAddRecipe("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormAddRecipe,
        fieldsFormAddRecipe,
        handleSubmitFormAddRecipe,
        messageFormAddRecipe,
        setMessageFormAddRecipe,
        messageTypeFormAddRecipe
    }
};