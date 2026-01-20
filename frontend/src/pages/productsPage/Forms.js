import { useEffect, useState } from "react";
import { addProduct, editProduct, deleteProduct, getRecipes, addRecipe } from "../../services/productsService";

export const formAddProduct = ({ onSuccess }) => {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [recipeId, setRecipeId] = useState("");
    const [recipeMode, setRecipeMode] = useState("existing");
    const [newRecipeName, setNewRecipeName] = useState("");
    const [newRecipeMethod, setNewRecipeMethod] = useState("");
    const [newIngredients, setNewIngredients] = useState([{ nome: "", quantidade: 0, unidade: "" }]);
    const [cost, setCost] = useState("");
    const [messageFormAddProduct, setMessageFormAddProduct] = useState("");
    const [messageTypeFormAddProduct, setMessageTypeFormAddProduct] = useState("success");

    const UNIT_OPTIONS = ["g", "ml", "un", "colher", "xícara"];

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

    const baseFields = [
        { id: "name", label: "Nome", placeholder: "Ex: Pão de Forma", value: name, onChange: setName, required: true },
        { id: "price", label: "Preço de Venda (R$)", type:"number", placeholder: "0.00", value: price, onChange: setPrice },
        { id: "cost", label: "Custo de Fabricação (R$)", type:"number", placeholder: "0.00", value: cost, onChange: setCost },
    ];

    const recipeModeField = {
        id: "recipeMode",
        label: "Receita",
        type: "radio",
        options: [
            { value: "existing", label: "Associar a uma receita existente" },
            { value: "new", label: "Criar nova receita" }
        ],
        value: recipeMode,
        onChange: setRecipeMode
    };

    const existingRecipeField = {
        id: "recipeId",
        label: "Selecione a Receita",
        type: "select",
        options: recipes.map(r => ({ value: r.id, label: r.nome })),
        value: recipeId,
        onChange: setRecipeId,
        placeholder: "Escolha uma receita",
        required: recipeMode === "existing"
    };

    const newRecipeNameField = { id: "newRecipeName", label: "Nome da Receita", placeholder: "Ex: Bolo de Chocolate Tradicional", value: newRecipeName, onChange: setNewRecipeName, required: recipeMode === "new" };
    const newRecipeMethodField = { id: "newRecipeMethod", label: "Modo de Preparo", type: "textarea", rows: 4, placeholder: 'Descreva o modo de preparo separado por ";". \nEx: passo1; passo2; passo3; ...', value: newRecipeMethod, onChange: setNewRecipeMethod, required: recipeMode === "new" };
    const newRecipeIngredientsField = { 
        id: "newIngredients", 
        label: "Ingredientes", 
        type: "ingredients-list", 
        value: newIngredients,
        unitOptions: UNIT_OPTIONS,
        onAdd: () => setNewIngredients(prev => [...prev, { nome: "", quantidade: 0, unidade: "" }]), 
        onRemove: (i) => setNewIngredients(prev => prev.filter((_, idx) => idx !== i)), 
        onUpdate: (i, field, val) => { const copy = [...newIngredients]; copy[i][field] = val; setNewIngredients(copy); }, 
        required: recipeMode === "new" };


    let fieldsFormAddProduct = [...baseFields, recipeModeField];
    if (recipeMode === "existing") {
        fieldsFormAddProduct.push(existingRecipeField);
    } else {
        fieldsFormAddProduct.push(newRecipeNameField, newRecipeMethodField, newRecipeIngredientsField);
    }
    const ativoField = { id: "ativo", label: "Produto Ativo", type: "checkbox", value: ativo, onChange: setAtivo };
    fieldsFormAddProduct.push(ativoField);

    async function handleSubmitFormAddProduct(e) {
        e.preventDefault();

        try{
            let usedRecipeId = recipeId;

            if (recipeMode === "new") {
                if (!newRecipeName || !newRecipeMethod || !newIngredients || newIngredients.length === 0) {
                    setMessageTypeFormAddProduct("error");
                    setMessageFormAddProduct("Preencha os dados da nova receita.");
                    return;
                }

                const created = await addRecipe({ name: newRecipeName, modo_preparo: newRecipeMethod, ingredientes: newIngredients });
                usedRecipeId = created?.id;
            }

            if (recipeMode === "existing" && !usedRecipeId) {
                setMessageTypeFormAddProduct("error");
                setMessageFormAddProduct("Selecione uma receita existente ou crie uma nova.");
                return;
            }

            await addProduct({ name, price, recipeId: usedRecipeId, cost, ativo });
            setMessageTypeFormAddProduct("success");
            setMessageFormAddProduct("Produto adicionado com sucesso.");
            setName("");
            setPrice("");
            setRecipeId("");
            setRecipeMode("existing");
            setNewRecipeName("");
            setNewRecipeMethod("");
            setNewIngredients([{ nome: "", quantidade: 0, unidade: "" }]);
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
}

export const formEditProduct = ({ onSuccess, selectedProduct }) => {
    const [newName, setNewName] = useState("");
    const [newPrice, setNewPrice] = useState("");
    const [newCost, setNewCost] = useState("");
    const [ativo, setAtivo] = useState(true);
    const [recipes, setRecipes] = useState([]);
    const [newRecipeId, setNewRecipeId] = useState(0);
    const [messageFormEditProduct, setMessageFormEditProduct] = useState("");
    const [messageTypeFormEditProduct, setMessageTypeFormEditProduct] = useState("success");

    useEffect(() => {
        const loadRecipes = async () => {
            try {
                const data = await getRecipes();
                setRecipes(data);
            } catch (error) {
                setMessageTypeFormEditProduct("error");
                setMessageFormEditProduct("Erro ao carregar receitas.");
            }
        };
        loadRecipes();
    }, []);

    useEffect(() => {
        setNewName("");
        setNewPrice("");
        setNewCost("");
        setNewRecipeId(0);
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
        { id: "recipeId", label: "Receita", type: "select", options: recipes.map(r => ({ value: r.id, label: r.nome })), value: newRecipeId, onChange: setNewRecipeId, placeholder: "Selecione uma receita" },
        { id: "ativo", label: "Produto Ativo", type: "checkbox", value: ativo, onChange: setAtivo },
    ];

    async function handleSubmitFormEditProduct(e) {
        e.preventDefault();

        try{
            const recipeChanged = newRecipeId == 0 ? selectedProduct?.receita_Id : newRecipeId;
            await editProduct( { nome: newName || selectedProduct?.nome, preco: newPrice || selectedProduct?.preco, custo: newCost || selectedProduct?.custo, receita_id: recipeChanged, ativo: ativo ?? selectedProduct?.ativo, id: selectedProduct?.id } );
            setMessageTypeFormEditProduct("success");
            setMessageFormEditProduct("Dados do produto editados com sucesso.");
            setNewName("");
            setNewPrice("");
            setNewCost("");
            setNewRecipeId(0);
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