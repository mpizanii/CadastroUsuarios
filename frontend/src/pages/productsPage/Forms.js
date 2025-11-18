import { useEffect, useState } from "react";
import { addProduct, editProduct, deleteProduct, getRecipes } from "./ApiCalls.js";

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
    const [messageFormEditProduct, setMessageFormEditProduct] = useState("");
    const [messageTypeFormEditProduct, setMessageTypeFormEditProduct] = useState("success");

    const titleFormEditProduct = "Editar dados do produto";
    const fieldsFormEditProduct = [
        { id: "name", label: "Nome", placeholder: selectedProduct?.nome, value: newName, onChange: setNewName },
        { id: "price", label: "Preço", placeholder: selectedProduct?.preco, value: newPrice, onChange: setNewPrice },
        { id: "cost", label: "Custo Unitário", placeholder: selectedProduct?.custo, value: newCost, onChange: setNewCost },
    ];

    async function handleSubmitFormEditProduct(e) {
        e.preventDefault();

        try{
            await editProduct( { nome: newName || selectedProduct?.nome, preco: newPrice || selectedProduct?.preco, custo: newCost || selectedProduct?.custo, id: selectedProduct?.id } );
            setMessageTypeFormEditProduct("success");
            setMessageFormEditProduct("Dados do produto editados com sucesso.");
            setNewName("");
            setNewPrice("");
            setNewCost("");
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