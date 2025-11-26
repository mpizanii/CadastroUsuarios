import { useState } from "react";
import { addInsumo, editInsumo, deleteInsumo } from "./ApiCalls.js";

const UNIT_OPTIONS = ["g", "kg", "ml", "l", "un", "colher", "xícara"];

export const formAddInsumo = ({ onSuccess }) => {
    const [nome, setNome] = useState("");
    const [quantidade, setQuantidade] = useState("");
    const [unidade, setUnidade] = useState("g");
    const [validade, setValidade] = useState("");
    const [estoqueMinimo, setEstoqueMinimo] = useState("");
    const [messageFormAddInsumo, setMessageFormAddInsumo] = useState("");
    const [messageTypeFormAddInsumo, setMessageTypeFormAddInsumo] = useState("success");

    const titleFormAddInsumo = "Novo Insumo";

    const fieldsFormAddInsumo = [
        { 
            id: "nome", 
            label: "Nome do Insumo", 
            placeholder: "Ex: Farinha de Trigo", 
            value: nome, 
            onChange: setNome, 
            required: true 
        },
        { 
            id: "quantidade", 
            label: "Quantidade Atual", 
            type: "number", 
            placeholder: "0", 
            value: quantidade, 
            onChange: setQuantidade, 
            required: true,
            step: "0.01"
        },
        { 
            id: "unidade", 
            label: "Unidade", 
            type: "select", 
            value: unidade, 
            onChange: setUnidade, 
            options: UNIT_OPTIONS,
            required: true 
        },
        { 
            id: "validade", 
            label: "Data de Validade", 
            type: "date", 
            value: validade, 
            onChange: setValidade 
        },
        { 
            id: "estoqueMinimo", 
            label: "Estoque Mínimo", 
            type: "number", 
            placeholder: "0", 
            value: estoqueMinimo, 
            onChange: setEstoqueMinimo, 
            required: true,
            step: "0.01"
        }
    ];

    const handleSubmitFormAddInsumo = async (event) => {
        event.preventDefault();
        setMessageFormAddInsumo("");

        if (!nome || !quantidade || !unidade || !estoqueMinimo) {
            setMessageTypeFormAddInsumo("error");
            setMessageFormAddInsumo("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            await addInsumo({
                nome,
                quantidade: parseFloat(quantidade),
                unidade,
                validade: validade ? new Date(validade).toISOString() : null,
                estoqueMinimo: parseFloat(estoqueMinimo)
            });

            setMessageTypeFormAddInsumo("success");
            setMessageFormAddInsumo("Insumo cadastrado com sucesso!");

            // Limpar form
            setNome("");
            setQuantidade("");
            setUnidade("g");
            setValidade("");
            setEstoqueMinimo("");

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAddInsumo("error");
            setMessageFormAddInsumo(error.message || "Erro ao cadastrar insumo.");
        }
    };

    return {
        titleFormAddInsumo,
        fieldsFormAddInsumo,
        handleSubmitFormAddInsumo,
        messageFormAddInsumo,
        messageTypeFormAddInsumo
    };
};

export const formEditInsumo = ({ insumo, onSuccess }) => {
    const [nome, setNome] = useState(insumo?.nome || "");
    const [quantidade, setQuantidade] = useState(insumo?.quantidade || "");
    const [unidade, setUnidade] = useState(insumo?.unidade || "g");
    const [validade, setValidade] = useState(
        insumo?.validade ? new Date(insumo.validade).toISOString().split('T')[0] : ""
    );
    const [estoqueMinimo, setEstoqueMinimo] = useState(insumo?.estoqueMinimo || "");
    const [messageFormEditInsumo, setMessageFormEditInsumo] = useState("");
    const [messageTypeFormEditInsumo, setMessageTypeFormEditInsumo] = useState("success");

    const titleFormEditInsumo = "Editar Insumo";

    const fieldsFormEditInsumo = [
        { 
            id: "nome", 
            label: "Nome do Insumo", 
            placeholder: "Ex: Farinha de Trigo", 
            value: nome, 
            onChange: setNome, 
            required: true 
        },
        { 
            id: "quantidade", 
            label: "Quantidade Atual", 
            type: "number", 
            placeholder: "0", 
            value: quantidade, 
            onChange: setQuantidade, 
            required: true,
            step: "0.01"
        },
        { 
            id: "unidade", 
            label: "Unidade", 
            type: "select", 
            value: unidade, 
            onChange: setUnidade, 
            options: UNIT_OPTIONS,
            required: true 
        },
        { 
            id: "validade", 
            label: "Data de Validade", 
            type: "date", 
            value: validade, 
            onChange: setValidade 
        },
        { 
            id: "estoqueMinimo", 
            label: "Estoque Mínimo", 
            type: "number", 
            placeholder: "0", 
            value: estoqueMinimo, 
            onChange: setEstoqueMinimo, 
            required: true,
            step: "0.01"
        }
    ];

    const handleSubmitFormEditInsumo = async (event) => {
        event.preventDefault();
        setMessageFormEditInsumo("");

        if (!nome || !quantidade || !unidade || !estoqueMinimo) {
            setMessageTypeFormEditInsumo("error");
            setMessageFormEditInsumo("Por favor, preencha todos os campos obrigatórios.");
            return;
        }

        try {
            await editInsumo(insumo.id, {
                nome,
                quantidade: parseFloat(quantidade),
                unidade,
                validade: validade ? new Date(validade).toISOString() : null,
                estoqueMinimo: parseFloat(estoqueMinimo)
            });

            setMessageTypeFormEditInsumo("success");
            setMessageFormEditInsumo("Insumo atualizado com sucesso!");

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormEditInsumo("error");
            setMessageFormEditInsumo(error.message || "Erro ao atualizar insumo.");
        }
    };

    return {
        titleFormEditInsumo,
        fieldsFormEditInsumo,
        handleSubmitFormEditInsumo,
        messageFormEditInsumo,
        messageTypeFormEditInsumo
    };
};

export const formDeleteInsumo = ({ insumo, onSuccess }) => {
    const [messageFormDeleteInsumo, setMessageFormDeleteInsumo] = useState("");
    const [messageTypeFormDeleteInsumo, setMessageTypeFormDeleteInsumo] = useState("success");

    const titleFormDeleteInsumo = "Deletar Insumo";
    const textFormDeleteInsumo = `Tem certeza que deseja deletar o insumo "${insumo?.nome}"?`;

    const handleSubmitFormDeleteInsumo = async (event) => {
        event.preventDefault();
        setMessageFormDeleteInsumo("");

        try {
            await deleteInsumo(insumo.id);
            setMessageTypeFormDeleteInsumo("success");
            setMessageFormDeleteInsumo("Insumo deletado com sucesso!");

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormDeleteInsumo("error");
            setMessageFormDeleteInsumo(error.message || "Erro ao deletar insumo.");
        }
    };

    return {
        titleFormDeleteInsumo,
        textFormDeleteInsumo,
        handleSubmitFormDeleteInsumo,
        messageFormDeleteInsumo,
        messageTypeFormDeleteInsumo
    };
};

export const formAdicionar = ({ insumo, onSuccess }) => {
    const [quantidade, setQuantidade] = useState("");
    const [messageFormAdicionar, setMessageFormAdicionar] = useState("");
    const [messageTypeFormAdicionar, setMessageTypeFormAdicionar] = useState("success");

    const titleFormAdicionar = "Adicionar ao Estoque";

    const fieldsFormAdicionar = [
        { 
            id: "insumo", 
            label: "Insumo", 
            value: insumo?.nome || "", 
            disabled: true 
        },
        { 
            id: "quantidade", 
            label: `Quantidade a Adicionar (${insumo?.unidade || ''})`, 
            type: "number", 
            placeholder: "0", 
            value: quantidade, 
            onChange: setQuantidade, 
            required: true,
            step: "0.01"
        }
    ];

    const handleSubmitFormAdicionar = async (event) => {
        event.preventDefault();
        setMessageFormAdicionar("");

        if (!quantidade || parseFloat(quantidade) <= 0) {
            setMessageTypeFormAdicionar("error");
            setMessageFormAdicionar("Por favor, informe uma quantidade válida.");
            return;
        }

        try {
            const novaQuantidade = parseFloat(insumo.quantidade) + parseFloat(quantidade);
            
            await editInsumo(insumo.id, {
                nome: insumo.nome,
                quantidade: novaQuantidade,
                unidade: insumo.unidade,
                validade: insumo.validade,
                estoqueMinimo: insumo.estoqueMinimo
            });

            setMessageTypeFormAdicionar("success");
            setMessageFormAdicionar("Estoque atualizado com sucesso!");
            setQuantidade("");

            if (onSuccess) onSuccess();
        } catch (error) {
            setMessageTypeFormAdicionar("error");
            setMessageFormAdicionar(error.message || "Erro ao adicionar ao estoque.");
        }
    };

    return {
        titleFormAdicionar,
        fieldsFormAdicionar,
        handleSubmitFormAdicionar,
        messageFormAdicionar,
        messageTypeFormAdicionar
    };
};
