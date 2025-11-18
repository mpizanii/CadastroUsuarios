import { useEffect, useState } from "react";
import { addProduct, editProduct, deleteProduct, getRecipes, addRecipe } from "./ApiCalls.js";

export const formAddProduct = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState("");
    const [cost, setCost] = useState("");
    const [messageFormAddProduct, setMessageFormAddProduct] = useState("");
    const [messageTypeFormAddProduct, setMessageTypeFormAddProduct] = useState("success");

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                setMessageTypeFormAddProduct("error");
                setMessageFormAddProduct("Erro ao carregar receitas.");
            }
        };
        loadRecipes();
    }, []);

    const titleFormAddProduct = "Cadastrar Produto";
    const fieldsFormAddProduct = [
        { id: "name", label: "Nome", placeholder: "Obrigatório", value: name, onChange: setName, required: true },
        { id: "price", label: "Preço", placeholder: "Obrigatório", value: price, onChange: setPrice },
        { id: "recipeId", label: "Receita", type: "select", options: recipes.map(r => ({ value: r.id, label: r.nome })), value: recipeId, onChange: setRecipeId, required: true, placeholder: "Selecione uma receita" },
        { id: "cost", label: "Custo Unitário", placeholder: "Obrigatório", value: cost, onChange: setCost },
    ];

    async function handleSubmitFormAddProduct(e) {
        e.preventDefault();

        try{
            await addProduct({ name, price, recipeId, cost });
            setMessageTypeFormAddProduct("success");
            setMessageFormAddProduct("Produto adicionado com sucesso.");
            setName("");
            setPrice("");
            setRecipeId("");
            setCost("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddProduct("error");
            setMessageFormAddProduct("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormAddProduct,
        fieldsFormAddProduct,
        handleSubmitFormAddProduct,
        messageFormAddProduct,
        setMessageFormAddProduct,
        messageTypeFormAddProduct
    }
}

export const formEditProduct = ({ onSuccess, selectedProduct }) => {
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCost, setNewCost] = useState("");
    const [recipes, setRecipes] = useState([]);
    const [newRecipeId, setNewRecipeId] = useState("");
    const [messageFormEditProduct, setMessageFormEditProduct] = useState("");
    const [messageTypeFormEditProduct, setMessageTypeFormEditProduct] = useState("success");

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                setMessageTypeFormAddProduct("error");
                setMessageFormAddProduct("Erro ao carregar receitas.");
            }
        };
        loadRecipes();
    }, []);

    const titleFormEditProduct = "Editar dados do produto";
    const fieldsFormEditProduct = [
        { id: "name", label: "Nome", placeholder: selectedProduct?.nome, value: newName, onChange: setNewName },
        { id: "price", label: "Preço", placeholder: selectedProduct?.preco, value: newPrice, onChange: setNewPrice },
        { id: "cost", label: "Custo Unitário", placeholder: selectedProduct?.custo, value: newCost, onChange: setNewCost },
        { id: "recipeId", label: "Receita", type: "select", options: recipes.map(r => ({ value: r.id, label: r.nome })), value: newRecipeId, onChange: setNewRecipeId, placeholder: "Selecione uma receita" },
    ];

    async function handleSubmitFormEditProduct(e) {
        e.preventDefault();

        try{
            await editProduct( { nome: newName || selectedProduct?.nome, preco: newPrice || selectedProduct?.preco, custo: newCost || selectedProduct?.custo, receita_id: newRecipeId || selectedProduct?.receita_id, id: selectedProduct?.id } );
            setMessageTypeFormEditProduct("success");
            setMessageFormEditProduct("Dados do produto editados com sucesso.");
            setNewName("");
            setNewPrice("");
            setNewCost("");
            setNewRecipeId("");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormEditProduct("error");
            setMessageFormEditProduct("Erro: " + (error.response?.data?.message || error.message));
        }   
    }

    return {
        titleFormEditProduct,
        fieldsFormEditProduct,
        handleSubmitFormEditProduct,
        messageFormEditProduct,
        setMessageFormEditProduct,
        messageTypeFormEditProduct
    }
}

export const formDeleteProduct = ({ onSuccess, selectedProduct }) => {
    const [messageFormDeleteProduct, setMessageFormDeleteProduct] = useState("");
    const [messageTypeFormDeleteProduct, setMessageTypeFormDeleteProduct] = useState("success");

    const titleFormDeleteProduct = "Deletar Produto";

    async function handleSubmitFormDeleteProduct(e) {
        e.preventDefault();
        try{
            await deleteProduct(selectedProduct?.id);
            setMessageTypeFormDeleteProduct("success");
            setMessageFormDeleteProduct("Produto deletado com sucesso.");
            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormDeleteProduct("error");
            setMessageFormDeleteProduct("Erro: " + (error.response?.data?.message || error.message));
        }
    }
    return {
        titleFormDeleteProduct,
        handleSubmitFormDeleteProduct,
        messageFormDeleteProduct,
        setMessageFormDeleteProduct,
        messageTypeFormDeleteProduct
    }
}

export const formAddRecipe = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [method, setMethod] = useState("");
    const [ingredients, setIngredients] = useState([ { nome: "", quantidade: "", unidade: "" } ]);
    const [messageFormAddRecipe, setMessageFormAddRecipe] = useState("");
    const [messageTypeFormAddRecipe, setMessageTypeFormAddRecipe] = useState("success");

    const addIngredient = () => {
        console.log("addIngredient chamado");
        console.log("Ingredients antes:", ingredients);
        setIngredients(prev => {
            const newIngredients = [...prev, { nome: "", quantidade: 0, unidade: "" }];
            console.log("Ingredients depois:", newIngredients);
            return newIngredients;
        });
    };

    const removeIngredient = (index) => {
        const newIngredients = ingredients.filter((_, i) => i !== index);
        setIngredients(newIngredients);
    };

    const updateIngredient = (index, field, value) => {
        const newIngredients = [...ingredients];
        newIngredients[index][field] = value;
        setIngredients(newIngredients);
    };

    const titleFormAddRecipe = "Cadastrar Receita";
    const fieldsFormAddRecipe = [
        { id: "name", label: "Nome", placeholder: "Obrigatório", value: name, onChange: setName, required: true },
        { id: "method", label: "Modo de Preparo", type: "textarea", rows: 5, placeholder: 'Adicione o modo de preparo separado por ";". Exemplo: passo1; passo2; passo3; ...', value: method, onChange: setMethod, required: true },
        { id: "ingredients", label: "Ingredientes", type: "ingredients-list", value: ingredients, onAdd: addIngredient, onRemove: removeIngredient, onUpdate: updateIngredient, required: true },
    ];

    async function handleSubmitFormAddRecipe(e) {
        e.preventDefault();

        try {
            const hasEmptyIngredient = ingredients.some(
                ing => !ing.nome || !ing.quantidade || !ing.unidade
            );

            // if (hasEmptyIngredient) {
            //     setMessageTypeFormAddRecipe("error");
            //     setMessageFormAddRecipe("Preencha todos os campos dos ingredientes.");
            //     return;
            // }

            await addRecipe({ name, modo_preparo: method, ingredientes: ingredients });
            setMessageTypeFormAddRecipe("success");
            setMessageFormAddRecipe("Receita adicionada com sucesso.");
            setName("");
            setMethod("");
            setIngredients([{ nome: "", quantidade: 0, unidade: "" }]);
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
}