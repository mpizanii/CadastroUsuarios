import { useEffect, useState } from "react";
import { addProduct, editProduct, deleteProduct } from "../services/productsService";
import { addRecipe } from "../services/recipesService";

export const formAddProduct = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [recipeMethod, setRecipeMethod] = useState("");
    const [ingredients, setIngredients] = useState([{ nome: "", quantidade: 0, unidade: "g" }]);
    const [cost, setCost] = useState("");
    const [messageFormAddProduct, setMessageFormAddProduct] = useState("");
    const [messageTypeFormAddProduct, setMessageTypeFormAddProduct] = useState("success");

    const UNIT_OPTIONS = ["g", "ml", "un", "colher", "xícara"];

    const titleFormAddProduct = "Cadastrar Produto";

    const fieldsFormAddProduct = [
        { 
            id: "name", 
            label: "Nome", 
            placeholder: "Ex: Pão de Forma", 
            value: name, 
            onChange: setName, 
            required: true 
        },
        { 
            id: "price", 
            label: "Preço de Venda (R$)", 
            type:"number", 
            placeholder: "0.00", 
            value: price, 
            onChange: setPrice 
        },
        { 
            id: "cost", 
            label: "Custo de Fabricação (R$)", 
            type: "number", 
            placeholder: "0.00", 
            value: cost, 
            onChange: setCost 
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

    async function handleSubmitFormAddProduct(e) {
        e.preventDefault();

        try{
            if (!recipeMethod || !ingredients || ingredients.length === 0) {
                setMessageTypeFormAddProduct("error");
                setMessageFormAddProduct("Preencha os dados da nova receita.");
                return;
            }

            const created = await addRecipe({ name: name, modo_preparo: recipeMethod, ingredientes: ingredients });
            const recipeId = created?.id;

            await addProduct({ name, price, recipeId: recipeId, cost, ativo });
            setMessageTypeFormAddProduct("success");
            setMessageFormAddProduct("Produto adicionado com sucesso.");
            setName("");
            setPrice("");
            setRecipeMethod("");
            setIngredients([{ nome: "", quantidade: 0, unidade: "g" }]);
            setAtivo(true);
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
};

export const formEditProduct = ({ onSuccess, selectedProduct }) => {
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCost, setNewCost] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [messageFormEditProduct, setMessageFormEditProduct] = useState("");
    const [messageTypeFormEditProduct, setMessageTypeFormEditProduct] = useState("success");

    useEffect(() => {
        setNewName("");
        setNewPrice("");
        setNewCost("");
        setAtivo(selectedProduct?.ativo ?? true);
    }, [selectedProduct]);

    useEffect(() => {
        if (selectedProduct) {
            console.log("Selected Product JSON:", JSON.stringify(selectedProduct, null, 2));
        }
    }, [selectedProduct]);

    const titleFormEditProduct = "Editar dados do produto";
    const fieldsFormEditProduct = [
        { id: "name", label: "Nome", placeholder: selectedProduct?.nome, value: newName, onChange: setNewName },
        { id: "price", label: "Preço", placeholder: selectedProduct?.preco, value: newPrice, onChange: setNewPrice },
        { id: "cost", label: "Custo Unitário", placeholder: selectedProduct?.custo, value: newCost, onChange: setNewCost },
        { id: "ativo", label: "Produto Ativo", type: "checkbox", value: ativo, onChange: setAtivo },
    ];

    async function handleSubmitFormEditProduct(e) {
        e.preventDefault();

        try{
            await editProduct( { nome: newName || selectedProduct?.nome, preco: newPrice || selectedProduct?.preco, custo: newCost || selectedProduct?.custo, ativo: ativo ?? selectedProduct?.ativo, id: selectedProduct?.id } );
            setMessageTypeFormEditProduct("success");
            setMessageFormEditProduct("Dados do produto editados com sucesso.");
            setNewName("");
            setNewPrice("");
            setNewCost("");
            setAtivo(true);
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